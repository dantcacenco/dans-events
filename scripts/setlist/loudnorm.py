#!/usr/bin/env python3
"""Loudness normalization for set-list clips. Every clip MUST go through this (Dan's rule).

Two-pass EBU R128 (ffmpeg loudnorm): pass 1 measures the clip, pass 2 applies one linear gain
so every clip lands at -16 LUFS integrated, -1.5 dBTP true peak, LRA 11 (+/- 1 LU). Linear gain keeps the
fades and the dynamics of the cut exactly as they were; only the level changes.

  loudnorm.py cut <src> <start_sec> <out.mp3>   cut a 30 s clip (fades) from a full song, normalized
  loudnorm.py fix <clip.mp3> [...]              re-normalize existing clips in place
  loudnorm.py check <dir|clip.mp3> [...]        table of loudness; exit 1 if any clip is off by > 1 LU
"""
import json, os, subprocess, sys, tempfile

TARGET_I, TARGET_TP, TARGET_LRA = -16.0, -1.5, 11.0
# MP3 encoding overshoots true peak by ~0.5 dB, so the filter aims 0.5 dB lower to land at -1.5 dBTP after encoding.
ENCODE_HEADROOM_DB = 0.5
TOLERANCE_LU = 1.0
CLIP_SEC, FADE_IN, FADE_OUT = 30, 0.3, 1.5
ENCODE = ["-ac", "2", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "96k", "-map_metadata", "-1"]


def _ln(extra=""):
    return f"loudnorm=I={TARGET_I}:TP={TARGET_TP - ENCODE_HEADROOM_DB}:LRA={TARGET_LRA}{extra}:print_format=json"


def measure(inputs, pre=""):
    """Run loudnorm in analysis mode; returns ffmpeg's JSON (input_i, input_tp, input_lra, input_thresh, target_offset)."""
    af = f"{pre},{_ln()}" if pre else _ln()
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", *inputs, "-af", af, "-f", "null", "-"], capture_output=True, text=True)
    err = r.stderr
    return json.loads(err[err.rindex("{"): err.rindex("}") + 1])


def _apply(inputs, out, pre=""):
    m = measure(inputs, pre)
    ln = _ln(
        f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
        f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
    )
    af = f"{pre},{ln}" if pre else ln
    subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-af", af, *ENCODE, out], check=True)
    return m


def cut(src, start, out):
    """Cut CLIP_SEC from start with fades, then normalize (fades first, so measurement sees the real clip)."""
    pre = f"afade=t=in:st=0:d={FADE_IN},afade=t=out:st={CLIP_SEC - FADE_OUT}:d={FADE_OUT}"
    return _apply(["-ss", str(start), "-t", str(CLIP_SEC), "-i", src], out, pre)


def fix(clip):
    """Re-normalize an existing clip in place (for clips that were made some other way)."""
    fd, tmp = tempfile.mkstemp(suffix=".mp3", dir=os.path.dirname(os.path.abspath(clip)))
    os.close(fd)
    try:
        _apply(["-i", clip], tmp)
        os.replace(tmp, clip)
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


def _clips(paths):
    for p in paths:
        if os.path.isdir(p):
            yield from sorted(os.path.join(p, f) for f in os.listdir(p) if f.endswith(".mp3"))
        else:
            yield p


def check(paths):
    bad = 0
    print(f"{'clip':<16}{'LUFS':>8}{'dBTP':>8}{'LRA':>6}")
    for c in _clips(paths):
        m = measure(["-i", c])
        i, tp = float(m["input_i"]), float(m["input_tp"])
        ok = abs(i - TARGET_I) <= TOLERANCE_LU and tp <= TARGET_TP + 0.5
        bad += not ok
        print(f"{os.path.basename(c)[:-4]:<16}{i:>8.2f}{tp:>8.2f}{float(m['input_lra']):>6.1f}{'' if ok else '  <-- OFF'}")
    return bad


if __name__ == "__main__":
    cmd, args = (sys.argv[1], sys.argv[2:]) if len(sys.argv) > 1 else ("", [])
    if cmd == "cut" and len(args) == 3:
        cut(args[0], float(args[1]), args[2])
    elif cmd == "fix" and args:
        for c in _clips(args):
            fix(c)
            print("normalized", c)
    elif cmd == "check" and args:
        sys.exit(1 if check(args) else 0)
    else:
        sys.exit(__doc__)
