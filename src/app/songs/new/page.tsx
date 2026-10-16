"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Prototype helper: makes a fresh unguessable token (20 chars of base-36, ~100 bits) and opens it.
// The real version creates the token from the admin form together with the couple's names.
export default function NewSongsLink() {
  const router = useRouter();
  useEffect(() => {
    const bytes = crypto.getRandomValues(new Uint8Array(20));
    const token = Array.from(bytes, (b) => (b % 36).toString(36)).join("");
    router.replace(`/songs/${token}`);
  }, [router]);
  return null;
}
