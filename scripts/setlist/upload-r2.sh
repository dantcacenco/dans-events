#!/bin/zsh
# Move the preview clips to Cloudflare R2 (free tier, no egress fees) and point the site at them.
#   CLOUDFLARE_API_TOKEN=<token with Account > Workers R2 Storage > Edit> npm run songs:upload-r2
# Creates the bucket if needed, turns on its public r2.dev URL, uploads every clip that is not there yet
# (audio/mpeg, cached a week; R2 serves byte ranges), then sets SETLIST_CLIP_BASE on Vercel (production + preview) and redeploys.
# Clip paths in src/data/setlist-songs.json stay relative, so switching back is just removing SETLIST_CLIP_BASE.
set -euo pipefail
cd "$(dirname "$0")/../.."
: "${CLOUDFLARE_API_TOKEN:?set CLOUDFLARE_API_TOKEN}"
BUCKET=${R2_SONGS_BUCKET:-dans-events-songs}
W="npx -y wrangler@4"
$W r2 bucket list 2>/dev/null | grep -q "name:\s*$BUCKET$" || $W r2 bucket create "$BUCKET"
$W r2 bucket dev-url enable "$BUCKET" -y >/dev/null 2>&1 || true
BASE=$($W r2 bucket dev-url get "$BUCKET" 2>/dev/null | grep -oE 'https://pub-[a-z0-9]+\.r2\.dev' | head -1)
[ -n "$BASE" ] || { echo "Could not read the bucket's public URL"; exit 1; }
n=0
for f in public/setlist/clips/*.mp3; do
  key="setlist/clips/${f:t}"
  code=$(curl -s -o /dev/null -w '%{http_code}' -I "$BASE/$key")
  [ "$code" = 200 ] && continue
  $W r2 object put "$BUCKET/$key" --file "$f" --content-type audio/mpeg --cache-control "public, max-age=604800" --remote >/dev/null
  n=$((n+1))
done
echo "uploaded $n clips to $BASE"
curl -s -o /dev/null -w "check: %{http_code} %{content_type}\n" -H "Range: bytes=0-99" "$BASE/setlist/clips/pop-1.mp3"
for envname in production preview; do
  vercel env rm SETLIST_CLIP_BASE $envname -y >/dev/null 2>&1 || true
  printf %s "$BASE" | vercel env add SETLIST_CLIP_BASE $envname >/dev/null
done
URL=$(vercel ls dans-events --prod 2>/dev/null | grep -m1 -oE 'https://[^ ]*vercel.app')
vercel redeploy "$URL" --target production >/dev/null
echo "SETLIST_CLIP_BASE=$BASE set; production redeploying"
