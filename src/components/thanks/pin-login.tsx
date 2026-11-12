"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const LEN = 6;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

const wait = (s: number) => (s >= 3600 ? `${Math.ceil(s / 3600)} h` : `${Math.max(1, Math.ceil(s / 60))} min`);

// Number keypad, no text field: nothing for a password manager to offer, and big targets for a thumb.
export function PinLogin() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const busyRef = useRef(false);

  const locked = lockedUntil > now;
  useEffect(() => {
    if (!locked) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [locked]);

  const submit = useCallback(
    async (value: string) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      setMsg("");
      try {
        const res = await fetch("/api/admin/thanks/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ pin: value }), cache: "no-store" });
        if (res.ok) {
          router.refresh();
          return;
        }
        const body = (await res.json().catch(() => ({}))) as { error?: string; retryAfter?: number; left?: number };
        if (res.status === 429 || body.error === "locked") {
          const secs = body.retryAfter ?? 900;
          setNow(Date.now());
          setLockedUntil(Date.now() + secs * 1000);
          setMsg("");
        } else if (body.error === "wrong") {
          setMsg(body.left === 1 ? "Wrong PIN. 1 try left." : `Wrong PIN. ${body.left} tries left.`);
        } else if (body.error === "not-configured") setMsg("PIN is not set.");
        else setMsg("Could not check the PIN. Try again.");
        setShake(true);
        setTimeout(() => setShake(false), 400);
      } catch {
        setMsg("Could not reach the server.");
      }
      setPin("");
      busyRef.current = false;
      setBusy(false);
    },
    [router],
  );

  const press = useCallback(
    (k: string) => {
      if (busyRef.current || Date.now() < lockedUntil) return;
      if (k === "⌫") {
        setPin((p) => p.slice(0, -1));
        setMsg("");
        return;
      }
      if (!/^\d$/.test(k)) return;
      setPin((p) => {
        if (p.length >= LEN) return p;
        const next = p + k;
        if (next.length === LEN) setTimeout(() => submit(next), 120);
        return next;
      });
    },
    [lockedUntil, submit],
  );

  // A physical keyboard works too.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") press("⌫");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  const left = Math.max(0, Math.ceil((lockedUntil - now) / 1000));

  return (
    <div className="sl ad">
      <main className="pin">
        <h1 className="pin-h">Thank-you list</h1>
        <div className={`pin-dots${shake ? " pin-shake" : ""}`} role="img" aria-label={`${pin.length} of ${LEN} digits entered`}>
          {Array.from({ length: LEN }, (_, i) => (
            <span key={i} className={`pin-dot${i < pin.length ? " pin-dot--on" : ""}`} />
          ))}
        </div>
        <p className="pin-msg" role="status" aria-live="polite">
          {locked ? `Too many tries. Wait ${wait(left)}.` : msg || "Enter your PIN"}
        </p>
        <div className="pin-pad" role="group" aria-label="PIN keypad">
          {KEYS.map((k, i) =>
            k === "" ? (
              <span key={i} />
            ) : (
              <button key={i} type="button" className="pin-key" disabled={busy || locked} onClick={() => press(k)} aria-label={k === "⌫" ? "Delete" : k}>
                {k}
              </button>
            ),
          )}
        </div>
      </main>
    </div>
  );
}
