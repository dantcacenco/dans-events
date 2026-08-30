import { isAdmin, unauthorized } from "@/lib/teo/auth";
import { storeError } from "@/lib/teo/api";
import { deleteDrop, getDrops, getPublishedDrops, saveDrop } from "@/lib/teo/store";
import type { Drop } from "@/lib/teo/types";

export const dynamic = "force-dynamic";

/** Admins get drafts too; everyone else sees published drops only. */
export async function GET(request: Request) {
  const drops = isAdmin(request) ? await getDrops() : await getPublishedDrops();
  return Response.json({ drops });
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return unauthorized();

  const body = (await request.json()) as Partial<Drop>;
  if (!Array.isArray(body.blocks)) {
    return Response.json({ error: "blocks must be an array" }, { status: 400 });
  }

  const now = Date.now();
  const existing = body.id
    ? (await getDrops()).find((d) => d.id === body.id)
    : undefined;

  const drop: Drop = {
    id: body.id ?? crypto.randomUUID(),
    tag: body.tag?.trim() || "NEW",
    blocks: body.blocks,
    published: body.published ?? false,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  try {
    await saveDrop(drop);
  } catch (error) {
    return storeError(error);
  }
  return Response.json({ drop });
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) return unauthorized();

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });

  try {
    await deleteDrop(id);
  } catch (error) {
    return storeError(error);
  }
  return Response.json({ ok: true });
}
