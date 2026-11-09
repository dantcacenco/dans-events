import AdminApp from "@/components/christmas/admin";
import { adminConfigured, isAdmin } from "@/lib/christmas/auth";

export const dynamic = "force-dynamic";

export default async function ChristmasAdminPage() {
  return <AdminApp authed={await isAdmin()} configured={adminConfigured()} />;
}
