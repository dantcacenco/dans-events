# Christmas check-in

Registration for the youth Christmas event, built from the Youth Camp check-in (`/checkin`, `src/lib/checkin`) but with its own dataset, its own admin and a Christmas look.

- Guests: `/christmas-checkin` (add `?lang=ru`, `?lang=uk` or `?lang=en` to a shared link). Name, phone, how many people, optional Secret Santa opt-in. One record per phone; a second try offers "change my details". Works offline (outbox in localStorage).
- Admin: `/christmas-checkin/admin`. Password = env var `CHRISTMAS_ADMIN_PASSWORD` (Vercel Production + local `.env.local`; 4+ characters; never in source). Separate from the Youth Camp PIN and the set-list admin. Login is rate limited per IP and globally (KV buckets). Counts, filters (All / Secret Santa / Arrived / Not yet), search, mark arrived with undo, edit, delete with undo, copy phones, copy Santa names, CSV (all or Santa only), event details editor (title per language, date, time, place), wipe all.
- Data: Vercel KV keys `xmas:<EVENT_ID>:...` (`src/lib/christmas/config.ts`); event details live in `xmas:<EVENT_ID>:details`, so the admin edits them with no deploy. Change `EVENT_ID` for a new event.
- Code: `src/lib/christmas` (config, logic, store, auth, queue, i18n EN/RU/UK), `src/components/christmas`, `src/app/api/christmas-checkin`. Phone rules and rate-limit helpers are reused from `src/lib/checkin`; that feature is untouched.
- Tests: `tests/unit/christmas.test.ts`. Not indexed (meta robots + `X-Robots-Tag` in `next.config.ts`).
- The Secret Santa draw itself is not built: the admin collects opt-ins (names + phones) and exports them.
