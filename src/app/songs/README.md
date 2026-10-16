# Couple music picker (prototype)

Private per-couple page: `/songs/<token>` (token = 12–40 chars of a-z0-9). `/songs/new` mints a fresh token.
Not linked from the site, `noindex` meta + `X-Robots-Tag` header + `Disallow: /songs` in robots.

- Two flows under one link: Ceremony and Reception. Each has: who is picking -> style cards -> one song at a time -> results.
- Partners pick separately (or "just one of us"); results show the songs both loved.
- EN/RU toggle, clean-only switch (reception), flag = always play, X = never play, notes box, copy / CSV / text export.
- Progress lives in `localStorage` (`setlist:<token>`). **There is no server storage yet.**
- `POST /api/songs/submit` is a stub that only logs. TODO: save the submission and text Dan (Quo/OpenPhone, needs his OK).
- `getCouple()` in `src/lib/setlist/couples.ts` returns sample names. TODO: look the couple up by token.

## Designs (pick one)
Five looks share one markup and all the logic: `/songs/<token>?design=1..5` (default 1).
1 Tiles (giant emoji tiles) · 2 Vinyl (records) · 3 Poster (oversized type, flat red/black panels) · 4 Paper (white list, one red accent) · 5 Cinema (dark glass, album-art carousel).
Each look is only a CSS block in `setlist.css` (`.d1` … `.d5`). Brand only: Montserrat, #BC3021 / #9A2419 / #0C0B0D / #3B3536 / #CCCAC9 / #C4B6AD.
Screenshots + contact sheets: `node tests/setlist-design-shots.mjs <outDir>` (dev server on 3055).
Once Dan picks one, delete the other four blocks and `src/lib/setlist/designs.ts`.

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

Test: `npx next dev -p 3055` then `DESIGN=1 node tests/setlist-e2e.mjs [chromium|webkit]` (any design 1..5).
