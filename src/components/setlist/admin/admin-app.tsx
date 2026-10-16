"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api, Unauthorized, type Library } from "./api";
import { CoupleDetailView } from "./couple-detail";
import { CouplesList } from "./couples-list";
import { LibraryView } from "./library";
import { ClipProvider, go, useSelectedToken } from "./shared";
import type { CoupleRow } from "@/lib/setlist/admin/data";

type Tab = "couples" | "library";

export function AdminApp() {
  const router = useRouter();
  const token = useSelectedToken();
  const [tab, setTab] = useState<Tab>("couples");
  const [couples, setCouples] = useState<CoupleRow[] | null>(null);
  const [library, setLibrary] = useState<Library | null>(null);
  const [error, setError] = useState("");

  const fail = useCallback(
    (e: unknown) => {
      if (e instanceof Unauthorized) router.refresh();
      else setError("Something went wrong. Pull to refresh.");
    },
    [router],
  );

  const reload = useCallback(() => api.couples().then((c) => (setCouples(c), setError("")), fail), [fail]);
  useEffect(() => {
    reload();
    api.library().then(setLibrary, fail);
  }, [reload, fail]);

  async function signOut() {
    await api.signOut();
    router.refresh();
  }

  const detail = token !== "";
  return (
    <ClipProvider>
      <div className="sl ad">
        <header className="ad-bar">
          <nav className="ad-tabs" aria-label="Sections">
            <button type="button" aria-pressed={detail || tab === "couples"} onClick={() => { setTab("couples"); if (detail) go(null); }}>
              Couples
            </button>
            <button type="button" aria-pressed={!detail && tab === "library"} onClick={() => { setTab("library"); if (detail) go(null); }}>
              Library
            </button>
          </nav>
          <button type="button" className="ad-link" onClick={signOut}>
            Sign out
          </button>
        </header>
        <main className="ad-main">
          {error && (
            <p className="ad-error" role="alert">
              {error}
            </p>
          )}
          {detail ? (
            <CoupleDetailView key={token} token={token} onChanged={reload} onUnauthorized={fail} />
          ) : tab === "couples" ? (
            <CouplesList couples={couples} onChanged={reload} />
          ) : (
            <LibraryView library={library} onChange={setLibrary} onError={fail} />
          )}
        </main>
      </div>
    </ClipProvider>
  );
}
