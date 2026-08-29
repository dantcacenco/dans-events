import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Media storage for /teo uploads.
 *
 * Cloudflare R2 when the four R2_* vars are set; otherwise public/uploads/ so
 * local dev works with zero setup. The local path is dev-only — Vercel's
 * filesystem is read-only, so production requires R2.
 */

const R2_BUCKET = process.env.R2_BUCKET;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
/** Public bucket URL or custom domain, e.g. https://media.example.com */
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

export const usingR2 = Boolean(
  R2_BUCKET && R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_PUBLIC_URL
);

export class StorageError extends Error {}

/** Strips anything that could escape the upload prefix. */
function safeName(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "-");
  return base.slice(-80) || "file";
}

export async function putMedia(
  file: File,
  keyPrefix = "drops"
): Promise<{ url: string }> {
  const key = `${keyPrefix}/${Date.now()}-${safeName(file.name)}`;
  const body = Buffer.from(await file.arrayBuffer());

  if (usingR2) {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const client = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID!,
        secretAccessKey: R2_SECRET_ACCESS_KEY!,
      },
    });
    await client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: body,
        ContentType: file.type || "application/octet-stream",
      })
    );
    return { url: `${R2_PUBLIC_URL!.replace(/\/$/, "")}/${key}` };
  }

  if (process.env.VERCEL) {
    throw new StorageError(
      "No R2 credentials configured. Set R2_BUCKET, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_PUBLIC_URL in Vercel to upload media in production."
    );
  }

  const dest = path.join(process.cwd(), "public", "uploads", key);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, body);
  return { url: `/uploads/${key}` };
}
