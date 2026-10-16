# Couple music picker (prototype)

Private per-couple page: `/songs/<token>` (token = 12–40 chars of a-z0-9). `/songs/new` mints a fresh token.
Not linked from the site, `noindex` meta + `X-Robots-Tag` header + `Disallow: /songs` in robots.

- Two flows under one link: Ceremony and Reception. Each has: who is picking -> style cards -> one song at a time -> results.
- Partners pick separately (or "just one of us"); results show the songs both loved.
- EN/RU toggle, clean-only switch (reception), flag = always play, X = never play, notes box, copy / CSV / text export.
- Progress lives in `localStorage` (`setlist:<token>`). **There is no server storage yet.**
- `POST /api/songs/submit` is a stub that only logs. TODO: save the submission and text Dan (Quo/OpenPhone, needs his OK).
- `getCouple()` in `src/lib/setlist/couples.ts` returns sample names. TODO: look the couple up by token.

## Design (Cinema)
Dark, album-cover cards: swipe sideways through genre covers, the song card glows in the genre's colour.
One CSS file, `src/app/songs/setlist.css`. Rules for every screen: one huge hero (emoji / name / number), a much smaller
title, tiny descriptions, one primary action, 48px+ tap targets, text at WCAG AA contrast and never under 12px.
Brand only: Montserrat, #BC3021 / #0C0B0D / #3B3536 / #CCCAC9 / #C4B6AD.
Phone details: `viewport-fit=cover` + safe-area insets, `100dvh` (with `100vh` fallback), `touch-action: none` on the swipe
area, `overscroll-behavior` off, the phone's back gesture steps up one screen (one spare history entry, see `setlist-app.tsx`),
iOS silent-mode override (`navigator.audioSession.type = "playback"`), upcoming clips preloaded into memory (`use-player.ts`).

## Audio
`public/setlist/clips/*.mp3` are 30 s, 96 kbps stereo previews cut around each song's hook.
`src/data/setlist-songs.json` is the manifest (title, artist, style, explicit, source URL, hook start, method, confidence).
`scripts/setlist/` rebuilds them: `fetch.sh` (yt-dlp), `analyze.py` (librosa: repeated high-energy section + YouTube replay
heatmap), `assemble.py` (cut + manifest). The full MP3s are NOT in git.
For the real library (~100+ songs) put clips in Cloudflare R2 (already used for /teo) and point `clip` at the R2 URL.

### Loudness rule (always, for every upload)
Every clip must play at the same level. All clips go through `scripts/setlist/loudnorm.py`: two-pass EBU R128
(ffmpeg `loudnorm`, linear gain) to **-16 LUFS integrated, -1.5 dBTP true peak, LRA 11**. Fades and start times are
untouched; only the level changes. `assemble.py` already calls it, so rebuilt clips are normalized automatically.

- New clip from a full song: `python3 scripts/setlist/loudnorm.py cut <full.mp3> <start_sec> public/setlist/clips/<id>.mp3`
- A clip made some other way (dropped in by hand): `python3 scripts/setlist/loudnorm.py fix public/setlist/clips/<id>.mp3`
- Before committing clips: `npm run audio:check` (fails if any clip is more than 1 LU off -16 LUFS or peaks above -1 dBTP).

Never commit or upload a clip that has not been through `cut` or `fix`.

Test: `npx next dev -p 3055` then `node tests/setlist-e2e.mjs [chromium|webkit]` (flows, layout and contrast checks, phone screenshots in `$SHOTS`).
