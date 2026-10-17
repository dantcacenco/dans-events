# Couple music picker

Private per-couple page: `/songs/<token>` (token = 20 random a-z0-9 characters). Couples are created on Dan's admin page `/admin/songs`, which
makes both links at once: the couple link and the guest link `/songs/g/<guestToken>`. Unknown or switched-off links are a 404.
Not linked from the site, `noindex` meta + `X-Robots-Tag` header + `Disallow: /songs` and `/admin` in robots.

- Two flows under one link: Ceremony and Reception. Each has: who is picking -> style cards -> one song at a time -> results.
- Partners pick separately (or "just one of us"), on one phone or two; results show the songs both loved.
- EN/RU toggle (the couple's language is set when Dan creates them), clean-only switch (reception), flag = always play, X = never play, notes, copy / CSV / text export.
- The couple's progress is saved on the phone (`localStorage`) AND on the server (`/api/songs/state`): each phone pulls on open and pushes every change.
  Merging is per person (newer walk wins) plus the shared marks/notes (newer copy wins), see `src/lib/setlist/sync.ts`.
- "Send to Dan" (`POST /api/songs/submit`) marks the flow as submitted; it shows as "Needs review" on the admin page. Nothing is texted or emailed yet.

## Admin page (`/admin/songs`)
Password = Vercel env var `SETLIST_ADMIN_PASSWORD` (production). Signed HttpOnly cookie (14 days), 8 wrong tries per device per 15 min.
Rotate with `scripts/setlist/rotate-admin-password.sh` (new random password, saved in Vercel, redeploys, signs everyone out).
Couples list (status, partners finished, guest answers, last activity, search, filters), couple detail (links with copy, each partner's picks,
must/never, notes, guests' answers, ranked master list, reviewed, private notes, edit, switch off, delete, CSV/text/M3U export), export all,
and a Library tab (browse, play, hide a song everywhere, flag it). Hidden songs are left out of every deck.

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

### Data model (Vercel KV / Upstash Redis in production; `.data/teo.json` locally; code in `src/lib/setlist/couple-store.ts`)
| key | value |
| --- | --- |
| `setlist:couples` | list of couple tokens (admin index) |
| `setlist:couple:<ct>:info` | names, wedding date, language, active, reviewed, private notes, submitted times, guest token |
| `setlist:couple:<ct>:state` | both flows (each person's walk, marks, notes), merged from every phone |
| `setlist:couple:<ct>:guest-link` / `setlist:guest-link:<gt>` | guest token / couple token |
| `setlist:couple:<ct>:sessions`, `setlist:couple:<ct>:vote:<sid>` | guest session ids; one guest's `{name, likes, skips, extras}` |
| `setlist:couple:<ct>:limit:<iphash>` | guest rate limit per device per day |
| `setlist:library` | `{hidden, flagged}` song ids from the admin Library tab |
| `setlist:admin:login:<iphash>` | failed admin logins |

Writes are serialized per server instance; two writes landing on two different instances at the same moment can still race (low risk at this scale).

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
The clips are served from `public/` (about 100 MB, fine for Vercel and GitHub; no paid storage). To move them to Cloudflare R2: `CLOUDFLARE_API_TOKEN=… npm run songs:upload-r2` (uploads, sets `SETLIST_CLIP_BASE` on Vercel, redeploys; remove that env var to switch back). Library clips (`lib-*`) are YouTube-sourced
proof-of-concept clips (`source: "youtube-proof-of-concept"` on each song): replace them with Dan-owned MP3s over time (same id, run `loudnorm.py cut`).
`scripts/setlist/import-library.py <library dir>` copies finished clips in and rewrites the `lib-*` songs. Explicit flags come from Apple only
(iTunes Search API `trackExplicitness`: explicit or cleaned = explicit; `explicitSource` says which, or `apple:no-match`).
Every song in the library was re-checked (first the disputed ones: Apple no-match, cleaned, or conflicting; then the rest, because Apple's notExplicit rating proved unreliable) from the lyrics with a free local ASR (whisper.cpp, EN/RU/ES wordlist): `explicitSource: "local-asr+apple"`, `explicitStatus` explicit/clean/unverified, `explicitWords` (matched words only, no lyrics), `explicitConfidence`. `unverified` counts as not clean in clean-only mode.

### Loudness rule (always, for every upload)
Every clip must play at the same level. All clips go through `scripts/setlist/loudnorm.py`: two-pass EBU R128
(ffmpeg `loudnorm`, linear gain) to **-16 LUFS integrated, -1.5 dBTP true peak, LRA 11**. Fades and start times are
untouched; only the level changes. `assemble.py` already calls it, so rebuilt clips are normalized automatically.

- New clip from a full song: `python3 scripts/setlist/loudnorm.py cut <full.mp3> <start_sec> public/setlist/clips/<id>.mp3`
- A clip made some other way (dropped in by hand): `python3 scripts/setlist/loudnorm.py fix public/setlist/clips/<id>.mp3`
- Before committing clips: `npm run audio:check` (fails if any clip is more than 1 LU off -16 LUFS or peaks above -1 dBTP).

Never commit or upload a clip that has not been through `cut` or `fix`.

Tests: `npm test` (unit), then `SETLIST_ADMIN_PASSWORD=local-test-password-123 npx next dev -p 3055` and (same env var set) `node tests/setlist-e2e.mjs [chromium|webkit]` (couple flows, layout on four phone sizes, back gesture, AA contrast, EN + RU screenshots in `$SHOTS`) and `node tests/setlist-guests.mjs [chromium|webkit]` (a couple + three guests, second phone, admin view, master list, abuse limits, screenshots) and `node tests/setlist-admin.mjs [chromium|webkit]` (admin page).
