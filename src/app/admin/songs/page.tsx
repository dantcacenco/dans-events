import { AdminApp } from "@/components/setlist/admin/admin-app";
import { AdminLogin } from "@/components/setlist/admin/login";
import { adminConfigured, isAdmin } from "@/lib/setlist/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminSongsPage() {
  if (!adminConfigured())
    return (
      <div className="sl ad">
        <main className="ad-login">
          <p className="ad-hint">Admin password is not set.</p>
        </main>
      </div>
    );
  return (await isAdmin()) ? <AdminApp /> : <AdminLogin />;
}
