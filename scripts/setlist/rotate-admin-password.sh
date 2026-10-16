#!/bin/zsh
# Rotate the /admin/songs password: makes a new random one, saves it in Vercel (production) and redeploys.
# Everyone gets signed out (the session cookie is signed with the password). Prints the new password once.
set -euo pipefail
cd "$(dirname "$0")/../.."
NEW=$(python3 -I -c "import secrets;a='abcdefghjkmnpqrstuvwxyz23456789';print('-'.join(''.join(secrets.choice(a) for _ in range(5)) for _ in range(4)))")
vercel env rm SETLIST_ADMIN_PASSWORD production -y >/dev/null
printf %s "$NEW" | vercel env add SETLIST_ADMIN_PASSWORD production >/dev/null
URL=$(vercel ls dans-events --prod 2>/dev/null | grep -m1 -o 'https://[^ ]*vercel.app')
vercel redeploy "$URL" --target production >/dev/null
echo "New admin password (shown once): $NEW"
