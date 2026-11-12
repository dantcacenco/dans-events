import { AdminLogin } from "@/components/setlist/admin/login";
import { ThanksApp } from "@/components/thanks/thanks-app";
import { adminConfigured, isAdmin } from "@/lib/setlist/admin/auth";

export const dynamic = "force-dynamic";

// Data is fetched by the client from /api/admin/thanks after login; nothing private is rendered for a visitor.
export default async function ThanksPage() {
  if (!adminConfigured())
    return (
      <div className="sl ad">
        <main className="ad-login">
          <p className="ad-hint">Admin password is not set.</p>
        </main>
      </div>
    );
  return (await isAdmin()) ? <ThanksApp /> : <AdminLogin title="Thank-you list" />;
}
