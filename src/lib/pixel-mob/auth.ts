export function isAdmin(request: Request): boolean {
  const adminKey = process.env.PIXEL_MOB_ADMIN_KEY;
  if (!adminKey) return false;
  return request.headers.get("x-admin-key") === adminKey;
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
