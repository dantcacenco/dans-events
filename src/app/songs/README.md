# Couple music picker (prototype)

Private per-couple page: `/songs/<token>` (token = 12–40 chars of a-z0-9). `/songs/new` mints a fresh token.
Not linked from the site, `noindex` meta + `X-Robots-Tag` header + `Disallow: /songs` in robots.

- Two flows under one link: Ceremony and Reception. Each has: who is picking -> style cards -> one song at a time -> results.
- Partners pick separately (or "just one of us"); results show the songs both loved.
- EN/RU toggle, clean-only switch (reception), flag = always play, X = never play, notes box, copy / CSV / text export.
- Progress lives in `localStorage` (`setlist:<token>`). **There is no server storage yet.**
- `POST /api/songs/submit` is a stub that only logs. TODO: save the submission and text Dan (Quo/OpenPhone, needs his OK).
- `getCouple()` in `src/lib/setlist/couples.ts` returns sample names. TODO: look the couple up by token.

## Audio
`public/setlist/clips/*.mp3` are 30 s, 96 kbps, loudness-normalized previews cut around each song's hook.
`src/data/setlist-songs.json` is the manifest (title, artist, style, explicit, source URL, hook start, method, confidence).
`scripts/setlist/` rebuilds them: `fetch.sh` (yt-dlp), `analyze.py` (librosa: repeated high-energy section + YouTube replay
heatmap), `assemble.py` (ffmpeg cut + manifest). The full MP3s are NOT in git.
For the real library (~100+ songs) put clips in Cloudflare R2 (already used for /teo) and point `clip` at the R2 URL.

Test: `npx next dev -p 3055` then `node tests/setlist-e2e.mjs [chromium|webkit]`.
