export const dynamic = "force-dynamic";

import { kv } from "@vercel/kv";

const DIAG_KEY = "pixelmob:diagnostics:latest";
const DIAG_HISTORY_KEY = "pixelmob:diagnostics:history";
const MAX_HISTORY = 10;

export async function POST(request: Request) {
  const body = await request.json();

  await kv.set(DIAG_KEY, body, { ex: 3600 });

  await kv.lpush(DIAG_HISTORY_KEY, body);
  await kv.ltrim(DIAG_HISTORY_KEY, 0, MAX_HISTORY - 1);

  console.log(
    `[pixel-mob/diagnostics] Received: ${body.decodedCount} decoded, ` +
    `${body.spotTraces?.length ?? 0} traces, threshold=${body.thresholdUsed}`
  );

  return Response.json({ ok: true });
}

export async function GET() {
  const latest = await kv.get(DIAG_KEY);
  const history = await kv.lrange(DIAG_HISTORY_KEY, 0, MAX_HISTORY - 1);

  return Response.json({ latest, history }, {
    headers: { "Cache-Control": "no-store" },
  });
}
