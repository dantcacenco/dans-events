import { isAdmin, unauthorized } from "@/lib/teo/auth";
import { StorageError, putMedia } from "@/lib/teo/storage";

export const dynamic = "force-dynamic";

const MAX_BYTES = 100 * 1024 * 1024; // 100MB — comfortably covers a phone video

export async function POST(request: Request) {
  if (!isAdmin(request)) return unauthorized();

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File is larger than 100MB" }, { status: 413 });
  }
  if (!/^(image|video)\//.test(file.type)) {
    return Response.json({ error: "Only images and videos" }, { status: 415 });
  }

  try {
    const { url } = await putMedia(file);
    return Response.json({ url });
  } catch (error) {
    if (error instanceof StorageError) {
      return Response.json({ error: error.message }, { status: 501 });
    }
    console.error("[teo/upload]", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
