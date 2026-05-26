"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      date: (form.elements.namedItem("date") as HTMLInputElement).value,
      venue: (form.elements.namedItem("venue") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-white p-[clamp(32px,5vw,60px)] w-full max-w-[520px] text-center reveal visible">
        <div className="text-[40px] mb-4">&#10003;</div>
        <h3 className="text-black text-xl font-bold uppercase tracking-[2px] mb-3">You&apos;re on my radar</h3>
        <p className="text-black/60 text-sm leading-relaxed">
          Check your email for a confirmation. I&apos;ll respond personally within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-[clamp(32px,5vw,60px)] w-full max-w-[520px] reveal visible"
    >
      <div>
        <label htmlFor="cd-name" className="block text-[10px] font-bold uppercase tracking-[3px] text-black/35 pt-5">
          Your Name
        </label>
        <input
          type="text"
          id="cd-name"
          name="name"
          placeholder="First & Last"
          required
          className="w-full border-none outline-none text-base font-medium text-black py-2 pb-5 bg-transparent placeholder:text-black/20"
        />
      </div>
      <div className="border-t border-black/[0.08]">
        <label htmlFor="cd-email" className="block text-[10px] font-bold uppercase tracking-[3px] text-black/35 pt-5">
          Email
        </label>
        <input
          type="email"
          id="cd-email"
          name="email"
          placeholder="you@email.com"
          required
          className="w-full border-none outline-none text-base font-medium text-black py-2 pb-5 bg-transparent placeholder:text-black/20"
        />
      </div>
      <div className="border-t border-black/[0.08]">
        <label htmlFor="cd-date" className="block text-[10px] font-bold uppercase tracking-[3px] text-black/35 pt-5">
          Event Date
        </label>
        <input
          type="date"
          id="cd-date"
          name="date"
          required
          className="w-full border-none outline-none text-base font-medium text-black py-2 pb-5 bg-transparent"
        />
      </div>
      <div className="border-t border-black/[0.08]">
        <label htmlFor="cd-venue" className="block text-[10px] font-bold uppercase tracking-[3px] text-black/35 pt-5">
          Venue
        </label>
        <input
          type="text"
          id="cd-venue"
          name="venue"
          placeholder="Venue name or 'still deciding'"
          className="w-full border-none outline-none text-base font-medium text-black py-2 pb-5 bg-transparent placeholder:text-black/20"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-black text-white border-none text-[13px] font-bold uppercase tracking-[4px] py-6 cursor-pointer w-full hover:bg-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending..." : status === "error" ? "Try Again" : "Check Availability"}
      </button>
    </form>
  );
}
