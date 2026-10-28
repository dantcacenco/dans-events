import StaffApp from "@/components/checkin/staff";
import { isStaff } from "@/lib/checkin/auth";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  return <StaffApp authed={await isStaff()} />;
}
