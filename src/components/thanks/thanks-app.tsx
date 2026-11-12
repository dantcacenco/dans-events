"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  coupleLabel,
  DEFAULT_TEMPLATES,
  messageForCouple,
  messageForVendor,
  messageForVenue,
  prettyPhone,
  shortDate,
  yearsOf,
  type Couple,
  type Person,
  type TemplateKind,
  type Templates,
  type ThanksData,
  type ThanksState,
  type Vendor,
  type Venue,
} from "@/lib/thanks/messages";

type Status = "todo" | "done" | "all";
type SectionKey = "couples" | "vendors" | "venues";
const SECTION_TITLES: Record<SectionKey, string> = { couples: "Couples", vendors: "Planners & vendors", venues: "Venues" };
const KIND_LABEL: Record<TemplateKind, string> = { couple: "Couples", reviewed: "Couples who already reviewed", planner: "Planners & coordinators", vendor: "Vendors", venue: "Venues" };

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

const smsHref = (phone: string, body: string) => `sms:${phone}${/iPhone|iPad|Mac/.test(navigator.userAgent) ? "&" : "?"}body=${encodeURIComponent(body)}`;

function norm(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
}

export function ThanksApp() {
  const [data, setData] = useState<ThanksData | null>(null);
  const [state, setState] = useState<ThanksState>({});
  const [templates, setTpl] = useState<Templates>(DEFAULT_TEMPLATES);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [saved] = useState(() => {
    try {
      return typeof window === "undefined" ? {} : (JSON.parse(localStorage.getItem("thanks:ui") ?? "{}") as { open?: Record<SectionKey, boolean>; status?: Status; year?: string });
    } catch {
      return {};
    }
  });
  const [yearSel, setYear] = useState<string>(saved.year ?? "");
  const [status, setStatus] = useState<Status>(saved.status ?? "todo");
  const [open, setOpen] = useState<Record<SectionKey, boolean>>(saved.open ?? { couples: true, vendors: false, venues: false });
  const [toast, setToast] = useState("");
  const [flash, setFlash] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/admin/thanks", { cache: "no-store" })
      .then(async (r) => {
        if (r.status === 401) return location.reload();
        const j = await r.json();
        if (!j.ok) throw new Error(j.error);
        setData(j.data);
        setState(j.state ?? {});
        setTpl(j.templates ?? DEFAULT_TEMPLATES);
      })
      .catch(() => setErr("Could not load the list. Pull to refresh."));
  }, []);

  const years = useMemo(() => (data ? yearsOf(data) : []), [data]);
  const year = yearSel && (yearSel === "all" || years.includes(Number(yearSel))) ? yearSel : years.length ? String(years[0]) : "all";

  useEffect(() => {
    try {
      localStorage.setItem("thanks:ui", JSON.stringify({ open, status, year: yearSel }));
    } catch {}
  }, [open, status, yearSel]);

  const say = useCallback((t: string) => {
    setToast(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1600);
  }, []);

  const toggle = useCallback(
    async (id: string, on: boolean) => {
      setState((s) => {
        const n = { ...s };
        if (on) n[id] = Date.now();
        else delete n[id];
        return n;
      });
      const r = await fetch("/api/admin/thanks", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "contacted", id, on }) }).catch(() => null);
      if (!r || !r.ok) {
        setState((s) => {
          const n = { ...s };
          if (on) delete n[id];
          else n[id] = Date.now();
          return n;
        });
        say("Not saved. Check the connection.");
      }
    },
    [say],
  );

  const venueOf = useMemo(() => {
    const m = new Map((data?.couples ?? []).map((c) => [c.date, c.venue]));
    return (d: string) => m.get(d) ?? null;
  }, [data]);

  const review = data?.reviewLinks.google ?? "";
  const yr = (d: string) => !year || year === "all" || d.startsWith(year);
  const st = (id: string) => status === "all" || (status === "done" ? !!state[id] : !state[id]);
  const match = (...parts: (string | null | undefined)[]) => !q || norm(parts.filter(Boolean).join(" ")).includes(norm(q));

  const inYear = useMemo(() => {
    if (!data) return { couples: [] as Couple[], vendors: [] as Vendor[], venues: [] as Venue[] };
    return {
      couples: data.couples.filter((c) => yr(c.date)).sort((a, b) => b.date.localeCompare(a.date)),
      vendors: data.vendors.filter((v) => v.weddings.some((w) => yr(w.date))).sort((a, b) => (b.weddings.at(-1)?.date ?? "").localeCompare(a.weddings.at(-1)?.date ?? "")),
      venues: data.venues.filter((v) => v.weddings.some((w) => yr(w.date))).sort((a, b) => b.weddings.length - a.weddings.length || a.name.localeCompare(b.name)),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, year]);

  const shown = {
    couples: inYear.couples.filter((c) => st(c.id) && match(c.couple, c.venue, c.town, c.bride?.name, c.groom?.name, c.date, shortDate(c.date))),
    vendors: inYear.vendors.filter((v) => st(v.id) && match(v.name, v.company, v.role, v.kind, ...v.weddings.map((w) => w.couple))),
    venues: inYear.venues.filter((v) => st(v.id) && match(v.name, v.town, ...v.weddings.map((w) => w.couple))),
  };
  const done = (rows: { id: string }[]) => rows.filter((r) => state[r.id]).length;
  const total = inYear.couples.length + inYear.vendors.length + inYear.venues.length;
  const totalDone = done(inYear.couples) + done(inYear.vendors) + done(inYear.venues);

  function nextUp() {
    for (const key of ["couples", "vendors", "venues"] as SectionKey[]) {
      const row = (inYear[key] as { id: string }[]).find((r) => !state[r.id] && (key !== "vendors" || match()));
      if (row) {
        setOpen((o) => ({ ...o, [key]: true }));
        if (status === "done") setStatus("todo");
        setQ("");
        setTimeout(() => {
          const el = document.getElementById(row.id);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
          setFlash(row.id);
          setTimeout(() => setFlash(""), 1800);
        }, 60);
        return;
      }
    }
    say("Everyone in this year is checked off.");
  }

  async function copyIt(text: string, what: string) {
    if (await copy(text)) say(`${what} copied`);
  }

  if (err) return <Shell><p className="ad-error">{err}</p></Shell>;
  if (!data) return <Shell><p className="ad-empty">Loading…</p></Shell>;

  const left = total - totalDone;

  return (
    <Shell>
      <header className="ad-hero">
        <p className="ad-hero-n">{left}</p>
        <p className="ad-hero-l">left to thank{year && year !== "all" ? ` · ${year}` : ""}</p>
        <div className="ad-hero-actions">
          <button type="button" className="ad-btn ad-btn--primary" onClick={nextUp}>
            Next not contacted
          </button>
          <span className="th-tiny">
            {totalDone} of {total} contacted
          </span>
        </div>
      </header>

      <div className="th-controls">
        <label className="ad-label--hidden" htmlFor="th-q">Search</label>
        <input id="th-q" className="ad-input" type="search" placeholder="Search names, venues, dates" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="th-filters">
          <select className="ad-input ad-select th-year" aria-label="Year" value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
            <option value="all">All years</option>
          </select>
          <div className="th-seg" role="group" aria-label="Show">
            {(["todo", "done", "all"] as Status[]).map((s) => (
              <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)}>
                {s === "todo" ? "Not yet" : s === "done" ? "Contacted" : "All"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {(["couples", "vendors", "venues"] as SectionKey[]).map((key) => (
        <details key={key} className="th-sec" open={open[key]} onToggle={(e) => setOpen((o) => ({ ...o, [key]: (e.target as HTMLDetailsElement).open }))}>
          <summary>
            <span className="th-sec-t">{SECTION_TITLES[key]}</span>
            <span className="th-sec-n">
              {done(inYear[key] as { id: string }[])} of {(inYear[key] as unknown[]).length}
            </span>
          </summary>
          {shown[key].length === 0 && <p className="ad-none">Nothing here{status === "todo" ? " left" : ""}.</p>}
          <ul className="th-list">
            {key === "couples" &&
              shown.couples.map((c) => (
                <Row key={c.id} id={c.id} checked={!!state[c.id]} flash={flash === c.id} onToggle={toggle} title={coupleLabel(c.couple)} sub={[shortDate(c.date), c.venue, c.town].filter(Boolean).join(" · ")}>
                  {c.reviewed && <p className="th-badge">★ {c.reviewed}</p>}
                  <PersonLine label="Bride" p={c.bride} msg={() => messageForCouple(c, templates, review)} onCopy={copyIt} />
                  <PersonLine label="Groom" p={c.groom} msg={() => messageForCouple(c, templates, review)} onCopy={copyIt} />
                  {c.reviewed ? (
                    <Actions onMessage={() => copyIt(messageForCouple(c, templates, review, undefined, "reviewed"), "Message")} alt={{ label: "With review ask", run: () => copyIt(messageForCouple(c, templates, review), "Message") }} />
                  ) : (
                    <Actions onMessage={() => copyIt(messageForCouple(c, templates, review), "Message")} />
                  )}
                  <More notes={c.notes} />
                </Row>
              ))}
            {key === "vendors" &&
              shown.vendors.map((v) => (
                <Row key={v.id} id={v.id} checked={!!state[v.id]} flash={flash === v.id} onToggle={toggle} title={v.name ?? v.company ?? "Unknown"} sub={[v.kind, v.company && v.company !== v.name ? v.company : null].filter(Boolean).join(" · ")}>
                  <p className="th-tiny">{v.weddings.map((w) => `${coupleLabel(w.couple)}, ${shortDate(w.date)}`).join(" · ")}</p>
                  <Contact phone={v.phone} email={v.email} instagram={v.instagram} website={v.website} msg={() => messageForVendor(v, templates, review, venueOf)} onCopy={copyIt} />
                  <Actions onMessage={() => copyIt(messageForVendor(v, templates, review, venueOf), "Message")} />
                  <More notes={[...(v.role ? [v.role] : []), ...(v.notes ?? []), ...(v.src?.length ? [`Found in: ${v.src.join(", ")}`] : [])]} />
                </Row>
              ))}
            {key === "venues" &&
              shown.venues.map((v) => (
                <Row key={v.id} id={v.id} checked={!!state[v.id]} flash={flash === v.id} onToggle={toggle} title={v.name} sub={[v.town, `${v.weddings.length} wedding${v.weddings.length > 1 ? "s" : ""}`].filter(Boolean).join(" · ")}>
                  <p className="th-tiny">{v.weddings.map((w) => `${coupleLabel(w.couple)}, ${shortDate(w.date)}`).join(" · ")}</p>
                  <Contact phone={v.phone} email={v.email} instagram={v.instagram} website={v.website} facebook={v.facebook} unverified={v.unverified} msg={() => messageForVenue(v, templates, review)} onCopy={copyIt} />
                  <Actions onMessage={() => copyIt(messageForVenue(v, templates, review), "Message")} />
                  <More notes={[...(v.address ? [v.address] : []), ...(v.notes ? [v.notes] : []), ...Object.entries(v.sources ?? {}).map(([k, u]) => `${k}: ${u}`)]} />
                </Row>
              ))}
          </ul>
        </details>
      ))}

      <TemplateEditor key={JSON.stringify(templates)} templates={templates} review={review} onSaved={(t) => { setTpl(t); say("Messages saved"); }} />

      <p className="th-foot">Private. Only you can see this page.</p>
      <div className={`th-toast${toast ? " is-on" : ""}`} role="status" aria-live="polite">{toast}</div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="sl ad th">
      <main className="ad-main th-main">
        <p className="th-kicker">Thank-you list</p>
        {children}
      </main>
    </div>
  );
}

function Row({ id, checked, flash, onToggle, title, sub, children }: { id: string; checked: boolean; flash: boolean; onToggle: (id: string, on: boolean) => void; title: string; sub: string; children: React.ReactNode }) {
  return (
    <li id={id} className={`th-row${checked ? " is-done" : ""}${flash ? " is-flash" : ""}`}>
      <label className="th-check">
        <input type="checkbox" checked={checked} onChange={(e) => onToggle(id, e.target.checked)} />
        <span className="th-box" aria-hidden="true" />
        <span className="ad-label--hidden">Contacted</span>
      </label>
      <div className="th-body">
        <p className="th-title">{title}</p>
        {sub && <p className="th-sub">{sub}</p>}
        {children}
      </div>
    </li>
  );
}

function PersonLine({ label, p, msg, onCopy }: { label: string; p: Person; msg: () => string; onCopy: (t: string, what: string) => void }) {
  if (!p?.name && !p?.phone) return null;
  return (
    <div className="th-person">
      <p className="th-pname">
        <span className="th-role">{label}</span> {p.name ?? "—"}
        {p.confirmed === false && p.phone && <span className="th-unv" title={(p.src ?? []).join(" · ")}> unconfirmed</span>}
      </p>
      <Contact phone={p.phone} email={p.email ?? null} instagram={p.instagram ?? null} msg={msg} onCopy={onCopy} />
      {p.alt && <p className="th-tiny">Also seen: {prettyPhone(p.alt)}</p>}
    </div>
  );
}

function Contact(props: { phone?: string | null; email?: string | null; instagram?: string | null; website?: string | null; facebook?: string | null; unverified?: string[]; msg: () => string; onCopy: (t: string, what: string) => void }) {
  const { phone, email, instagram, website, facebook, unverified = [], msg, onCopy } = props;
  const u = (k: string) => (unverified.includes(k) ? " ?" : "");
  const ig = instagram ? (instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram.replace(/^@/, "")}`) : null;
  if (!phone && !email && !ig && !website && !facebook) return <p className="th-tiny th-missing">No contact found</p>;
  return (
    <div className="th-chips">
      {phone && (
        <>
          <button type="button" className="th-chip" onClick={() => onCopy(phone, "Phone")}>{prettyPhone(phone)}{u("phone")}</button>
          <a className="th-chip th-chip--go" href={smsHref(phone, msg())}>Text</a>
        </>
      )}
      {email && (
        <>
          <button type="button" className="th-chip" onClick={() => onCopy(email, "Email")}>{email}{u("email")}</button>
          <a className="th-chip th-chip--go" href={`mailto:${email}?subject=${encodeURIComponent("Thank you!")}&body=${encodeURIComponent(msg())}`}>Email</a>
        </>
      )}
      {ig && <a className="th-chip" href={ig} target="_blank" rel="noreferrer noopener">Instagram{u("instagram")}</a>}
      {facebook && <a className="th-chip" href={facebook} target="_blank" rel="noreferrer noopener">Facebook{u("facebook")}</a>}
      {website && <a className="th-chip" href={website} target="_blank" rel="noreferrer noopener">Website{u("website")}</a>}
    </div>
  );
}

function Actions({ onMessage, alt }: { onMessage: () => void; alt?: { label: string; run: () => void } }) {
  return (
    <div className="th-actions">
      <button type="button" className="ad-btn th-copy" onClick={onMessage}>Copy message</button>
      {alt && <button type="button" className="ad-link" onClick={alt.run}>{alt.label}</button>}
    </div>
  );
}

function More({ notes }: { notes?: string[] }) {
  const list = (notes ?? []).filter(Boolean);
  if (!list.length) return null;
  return (
    <details className="th-more">
      <summary>Details</summary>
      <ul>{list.map((n, i) => <li key={i}>{n}</li>)}</ul>
    </details>
  );
}

function TemplateEditor({ templates, review, onSaved }: { templates: Templates; review: string; onSaved: (t: Templates) => void }) {
  const [draft, setDraft] = useState<Templates>(templates);
  const [busy, setBusy] = useState(false);
  const kinds: TemplateKind[] = ["couple", "reviewed", "planner", "vendor", "venue"];

  async function save() {
    setBusy(true);
    const clean = Object.fromEntries(kinds.map((k) => [k, (draft[k] ?? []).map((s) => s.trim()).filter(Boolean)])) as Templates;
    const r = await fetch("/api/admin/thanks", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "templates", templates: clean }) }).catch(() => null);
    setBusy(false);
    if (r?.ok) onSaved(clean);
  }

  return (
    <details className="th-sec th-tpl">
      <summary>
        <span className="th-sec-t">Messages</span>
        <span className="th-sec-n">edit</span>
      </summary>
      <p className="th-tiny">
        Fills in {"{first}"} {"{couple}"} {"{date}"} {"{venue}"} {"{weddings}"} {"{review}"}. Each row gets one version, so neighbours read differently. Review link: {review}
      </p>
      {kinds.map((k) => (
        <div key={k} className="th-tpl-kind">
          <p className="ad-h4">{KIND_LABEL[k]}</p>
          {(draft[k] ?? []).map((t, i) => (
            <textarea key={i} className="ad-input ad-textarea" aria-label={`${KIND_LABEL[k]} version ${i + 1}`} value={t} onChange={(e) => setDraft((d) => ({ ...d, [k]: d[k].map((x, j) => (j === i ? e.target.value : x)) }))} />
          ))}
          {(draft[k] ?? []).length < 6 && (
            <button type="button" className="ad-link" onClick={() => setDraft((d) => ({ ...d, [k]: [...(d[k] ?? []), ""] }))}>Add a version</button>
          )}
        </div>
      ))}
      <div className="th-actions">
        <button type="button" className="ad-btn ad-btn--primary" disabled={busy} onClick={save}>{busy ? "…" : "Save messages"}</button>
        <button type="button" className="ad-link" onClick={() => setDraft(DEFAULT_TEMPLATES)}>Reset to default</button>
      </div>
    </details>
  );
}
