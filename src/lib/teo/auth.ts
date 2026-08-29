/**
 * Admin gate for /teo, mirroring the pixel-mob pattern: the browser holds the
 * key in localStorage and sends it as x-admin-key on every write request.
 * The admin page renders for anyone, but does nothing without a valid key.
 */
export function isAdmin(request: Request): boolean {
  const adminKey = process.env.TEO_ADMIN_KEY;
  if (!adminKey) return false;
  return request.headers.get("x-admin-key") === adminKey;
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
