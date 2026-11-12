import { PinLogin } from "@/components/thanks/pin-login";
import { ThanksApp } from "@/components/thanks/thanks-app";
import { isThanksAdmin, pinConfigured } from "@/lib/thanks/auth";

export const dynamic = "force-dynamic";

// Data is fetched by the client from /api/admin/thanks after login; nothing private is rendered for a visitor.
export default async function ThanksPage() {
  if (!pinConfigured())
    return (
      <div className="sl ad">
        <main className="ad-login">
          <p className="ad-hint">PIN is not set.</p>
        </main>
      </div>
    );
  return (await isThanksAdmin()) ? <ThanksApp /> : <PinLogin />;
}
