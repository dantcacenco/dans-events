import { StoreUnavailableError } from "./kv";

/**
 * Turns a failed write into a 503 carrying the real reason, so the builder
 * shows "the store is unreachable" instead of a bare "Save failed". Anything
 * else rethrows and is handled as a genuine 500.
 */
export function storeError(error: unknown): Response {
  if (error instanceof StoreUnavailableError) {
    console.error("[teo] store write failed:", error.cause);
    return Response.json({ error: error.message }, { status: 503 });
  }
  throw error;
}
