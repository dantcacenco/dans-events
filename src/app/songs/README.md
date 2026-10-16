# Couple music picker (prototype)

Private per-couple page: `/songs/<token>` (token = 12–40 chars of a-z0-9). `/songs/new` mints a fresh token.
Not linked from the site, `noindex` meta + `X-Robots-Tag` header + `Disallow: /songs` in robots.

- Two flows under one link: Ceremony and Reception. Each has: who is picking -> style cards -> one song at a time -> results.
- Partners pick separately (or "just one of us"); results show the songs both loved.
- EN/RU toggle, clean-only switch (reception), flag = always play, X = never play, notes box, copy / CSV / text export.
- The couple's progress lives in `localStorage` (`setlist:<token>`); guest links store votes on the server (below).
- `POST /api/songs/submit` is a stub that only logs. TODO: save the submission and text Dan (Quo/OpenPhone, needs his OK).
- `getCouple()` in `src/lib/setlist/couples.ts` returns sample names. TODO: look the couple up by token.

## Guest link and master list
The couple taps **Invite your guests** (reception results) and gets a second, separate link: `/songs/g/<guestToken>`, plus a ready message in
EN or RU (share sheet on phones, copy message / copy link). The guest token only opens the guest flow; it never reads the couple's picks, notes or lists.

- Guests walk the same flow as the couple, alone: optional first name -> genre cards -> swipe cards (Like / Skip, scrub bar, undo, clean-only ON by
  default, at most 30 cards, **Finish** after 8) -> thank-you screen. Reception only; the ceremony stays the couple's.
- **Add a song I want** (title + optional artist, up to 5) is on the genre screen, the swipe screen (+) and the thank-you screen. A suggestion that is really a
  catalog song counts as a like on it; otherwise suggestions are merged by normalized title + artist and listed at the bottom.
- **Master list** (couple: results -> Master list tab; guests: their thank-you screen, read-only, counts only): section 1 = catalog songs liked by the couple
  and/or guests, section 2 = "Songs chosen by guests". Each song has a counter = people who chose it (each partner and each guest once), ranked by count, ties:
  couple-liked first, then A-Z. The couple's Never play removes a song everywhere; Must play pins it on top of section 1 (couple view only). The couple can remove a
  guest-added song (and show removed). Export: copy / CSV / text with rank, category and count columns.
- Abuse protection: one record per guest session id (resending replaces it), unknown/duplicate song ids ignored, names and titles cleaned and length-capped, max 5
  suggestions, a device (IP + user agent hash) can open 10 sessions and send 60 updates per day, 400 sessions per couple, request size cap. CSV cells that start with
  `= + - @` are defused.

### Data model (prototype storage = `src/lib/teo/kv.ts`: Vercel KV when KV_* env vars exist, else `.data/teo.json`; code in `src/lib/setlist/guest-store.ts`)
| key | value | real table |
| --- | --- | --- |
| `setlist:couple:<ct>:guest-link` / `setlist:guest-link:<gt>` | guest token / couple token | `guest_links(guest_token pk, couple_token)` |
| `setlist:couple:<ct>:picks` | `{partners:{a:[ids],b:[ids]}, must, never}` pushed by the couple's phone | `couple_picks`, `couple_marks` |
| `setlist:couple:<ct>:sessions` | list of session ids | `guest_sessions(couple_token, session_id pk, name, created_at, ip_hash)` |
| `setlist:couple:<ct>:vote:<sid>` | `{name, likes[], skips[], extras[{title,artist}]}` | `guest_votes(session_id, song_id, vote)`, `guest_extras(session_id, title, artist, key)` |
| `setlist:couple:<ct>:limit:<ip>` | `{day, sessions[], posts}` | `rate_limits(ip_hash, day, count)` |

API (`src/app/api/songs/`): `POST guest-link` (couple token -> guest token, idempotent), `PUT couple-picks`, `POST guest` (a guest's answers), `GET master?token=|guestToken=`
(counts only: guests answered, per-song partner and guest like counts, merged extras; never-play already removed). A real backend needs: couples table (names, tokens),
the tables above in a database (KV read-modify-write can lose a simultaneous write; a database should use rows and a unique index on session id), a real rate limiter
(per IP and per link), a way for Dan to open any couple's master list (no admin view yet), and a decision about retention.
On a Vercel preview the guest flow needs the same KV env vars as /teo.

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

Tests: `npx next dev -p 3055` then `node tests/setlist-e2e.mjs [chromium|webkit]` (couple flows, layout on four phone sizes, back gesture, AA contrast, EN + RU screenshots in `$SHOTS`) and `node tests/setlist-guests.mjs [chromium|webkit]` (a couple + three guests, master list, abuse limits, screenshots).
