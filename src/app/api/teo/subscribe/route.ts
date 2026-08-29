import { isAdmin, unauthorized } from "@/lib/teo/auth";
import { addSubscriber, getSubscribers } from "@/lib/teo/store";

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; source?: string };
  const email = (body.email ?? "").trim();

  if (!EMAIL.test(email)) {
    return Response.json({ error: "Enter a valid email" }, { status: 400 });
  }

  const added = await addSubscriber(email, body.source ?? "card");
  // Re-submitting an existing email is a success from the reader's side.
  return Response.json({ ok: true, added });
}

/** Admin-only list, so the email export can be pulled from the builder. */
export async function GET(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  return Response.json({ subscribers: await getSubscribers() });
}
