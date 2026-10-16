"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const MESSAGES: Record<string, string> = {
  wrong: "Wrong password.",
  "too-many": "Too many tries. Wait 15 minutes.",
  "not-configured": "Admin password is not set.",
  network: "Could not reach the server.",
};

export function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pw || busy) return;
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/songs/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pw }) });
      if (res.ok) {
        router.refresh();
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(MESSAGES[body.error ?? (res.status === 429 ? "too-many" : "wrong")] ?? MESSAGES.wrong);
      setPw("");
    } catch {
      setErr(MESSAGES.network);
    }
    setBusy(false);
  }

  return (
    <div className="sl ad">
      <main className="ad-login">
        <h1 className="ad-login-h">Set lists</h1>
        <form onSubmit={submit} className="ad-login-form">
          <label className="ad-label" htmlFor="ad-pw">
            Password
          </label>
          <input id="ad-pw" className="ad-input" type="password" autoComplete="current-password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} aria-invalid={!!err} aria-describedby={err ? "ad-pw-err" : undefined} />
          {err && (
            <p id="ad-pw-err" className="ad-error" role="alert">
              {err}
            </p>
          )}
          <button type="submit" className="ad-btn ad-btn--primary ad-btn--wide" disabled={busy || !pw}>
            {busy ? "…" : "Sign in"}
          </button>
        </form>
      </main>
    </div>
  );
}
