import Link from "next/link";
import { venueForName } from "@/lib/venues";

// A venue name from a city list, linked to its venue guide when one exists.
export default function VenueName({ name }: { name: string }) {
  const v = venueForName(name);
  if (!v) return <>{name}</>;
  return (
    <Link href={`/venues/${v.slug}`} className="underline underline-offset-[4px] decoration-red/60 hover:decoration-red">
      {name}
    </Link>
  );
}
