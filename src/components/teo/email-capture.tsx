"use client";

import { useState } from "react";
import { useStoredValue } from "@/lib/teo/use-stored-value";

const STORAGE_KEY = "teo:subscribed";

/**
 * Soft gate: content is never blocked, but this sits in the feed until the
 * reader joins. Once they do, it collapses to a quiet confirmation for good.
 */
export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  // Someone who joined on a previous visit should never see the form again.
  const alreadyJoined = useStoredValue(STORAGE_KEY) !== null;
  const joined = alreadyJoined || status === "done";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/teo/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "card" }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "Something went wrong");
        setStatus("error");
        return;
      }

      localStorage.setItem(STORAGE_KEY, "1");
      setStatus("done");
    } catch {
      setMessage("Network error — try again");
      setStatus("error");
    }
  }

  if (joined) {
    return (
      <div className="teo-lcd mx-4 my-6 border-2 border-[var(--ink)] px-4 py-3">
        <p
          className="text-[11px] uppercase tracking-[0.18em]"
          style={{ fontFamily: "var(--font-teo-mono)" }}
        >
          ● ON THE LIST — you get first access
        </p>
      </div>
    );
  }

  return (
    <section className="mx-4 my-6 border-2 border-[var(--ink)] bg-[var(--paper-dim)] p-4">
      <h3
        className="text-[20px] leading-none uppercase"
        style={{ fontFamily: "var(--font-teo-display)" }}
      >
        First in line
      </h3>
      <p className="mt-2 text-[14px] leading-snug text-[var(--ink-soft)]">
        Drop your email and you hear it here 24 hours before anyone else — new
        music, new dates, tickets.
      </p>

      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          aria-label="Email address"
          className="min-w-0 flex-1 border-2 border-[var(--ink)] bg-[var(--paper)] px-3 py-2.5 text-[16px] outline-none placeholder:text-[var(--ink-soft)]/60 focus:bg-white"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="border-2 border-[var(--ink)] bg-[var(--ink)] px-4 text-[12px] uppercase tracking-[0.14em] text-[var(--paper)] disabled:opacity-60"
          style={{ fontFamily: "var(--font-teo-mono)", fontWeight: 700 }}
        >
          {status === "sending" ? "…" : "Join"}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-2 text-[12px] text-[var(--orange)]">{message}</p>
      )}
    </section>
  );
}
