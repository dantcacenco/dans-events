# /teo — the QR card

A physical card carries one QR code pointing at `/teo`. The page behind it
changes over time, so the same card keeps delivering new things: a behind-the-
scenes video, an announcement, an early-access ticket window.

## Routes

| Route | What it is |
| --- | --- |
| `/teo` | The card. Public, `noindex`. Two panels: **The Drop** and **Give**. |
| `/teo/admin` | The builder. Gated by `TEO_ADMIN_KEY`. |

## The experience

- **Mobile first.** On a phone the screen fills the viewport. On desktop the
  same screen renders inside a portable-cassette-player shell — the content
  renders once, the shell is CSS-only decoration above the `md` breakpoint.
- **Two panels, swipe or tap.** Horizontal CSS scroll-snap; the tab bar and the
  scroll position stay in sync, so tapping and swiping do the same thing.
- **The Drop is a feed**, newest first — readers can scroll back through past
  drops, which makes the card feel collectible.
- **Hidden text** blocks are blurred behind a drifting particle haze and resolve
  while held (iOS invisible-ink style). Keyboard users toggle with Enter/Space.
- **Soft email gate.** Content is never blocked; a capture card sits after the
  first drop and collapses permanently once someone joins.

## Blocks

A drop is an ordered list of blocks: Title, Subtitle, Text, Hidden text, Image,
Video, Button, Divider. The builder is a block-list editor — add, reorder with
the arrows, delete — with a live phone preview beside it.

## Storage

- **Content + emails**: Vercel KV in production. With no KV credentials it falls
  back to a JSON file at `.data/teo.json`, so `npm run dev` works with no setup.
- **Media**: Cloudflare R2 when configured; otherwise `public/uploads/` for local
  dev. Vercel's filesystem is read-only, so **production uploads require R2** —
  the API returns a clear 501 explaining that if the vars are missing.

## Environment

```bash
TEO_ADMIN_KEY=          # required — unlocks /teo/admin

# Cloudflare R2 — required for media uploads in production
R2_BUCKET=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_URL=          # public bucket URL or custom domain
```

KV vars (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) come from the Vercel
integration already used by pixel-mob.

## Admin auth

Same pattern as pixel-mob: the browser keeps the key in `localStorage` and sends
it as an `x-admin-key` header. The page renders for anyone but does nothing
without a valid key. Writes and the email export are all key-checked server
side. This is deliberately lightweight — it guards a content editor, not money
or PII beyond the email list.

## Sending a new drop

There are no push notifications on the web, so announcing a drop rides on email
(Resend is already a dependency) or a social post telling people to rescan —
the card itself is passive.
