"use client";

import { useCallback, useEffect, useState } from "react";
import { DropsPanel } from "@/components/teo/drops-panel";
import { useStoredValue } from "@/lib/teo/use-stored-value";
import {
  BLOCK_LABELS,
  DEFAULT_GIVE,
  emptyBlock,
  type Block,
  type BlockType,
  type Drop,
  type GiveConfig,
} from "@/lib/teo/types";

const KEY_STORAGE = "teo:adminKey";
const BLOCK_TYPES = Object.keys(BLOCK_LABELS) as BlockType[];

/* --------------------------------- styles -------------------------------- */

const input =
  "w-full border border-white/20 bg-black/40 px-3 py-2 text-[14px] text-white outline-none focus:border-[var(--orange)]";
const btn =
  "border border-white/25 px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-white/80 hover:bg-white/10 disabled:opacity-40";
const btnPrimary =
  "border border-[var(--orange)] bg-[var(--orange)] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white disabled:opacity-40";

function newDraft(): Drop {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    tag: "NEW",
    blocks: [],
    createdAt: now,
    updatedAt: now,
    published: false,
  };
}

/* ------------------------------ media upload ----------------------------- */

function UploadField({
  adminKey,
  value,
  onChange,
  accept,
  label,
}: {
  adminKey: string;
  value: string;
  onChange: (url: string) => void;
  accept: string;
  label: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    const form = new FormData();
    form.append("file", file);

    try {
      const response = await fetch("/api/teo/upload", {
        method: "POST",
        headers: { "x-admin-key": adminKey },
        body: form,
      });
      const data = await response.json();
      if (!response.ok) setError(data.error ?? "Upload failed");
      else onChange(data.url);
    } catch {
      setError("Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-2">
      <label className="text-[10px] uppercase tracking-[0.16em] text-white/40">
        {label}
      </label>
      <input
        className={input}
        value={value}
        placeholder="Paste a URL, or upload below"
        onChange={(event) => onChange(event.target.value)}
      />
      <input
        type="file"
        accept={accept}
        disabled={busy}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
        }}
        className="text-[12px] text-white/60 file:mr-3 file:border file:border-white/25 file:bg-transparent file:px-3 file:py-1.5 file:text-[11px] file:uppercase file:tracking-[0.14em] file:text-white/80"
      />
      {busy && <p className="text-[12px] text-white/50">Uploading…</p>}
      {error && <p className="text-[12px] text-[var(--orange)]">{error}</p>}
    </div>
  );
}

/* ------------------------------ block editor ----------------------------- */

function BlockEditor({
  block,
  adminKey,
  onChange,
  onMove,
  onRemove,
  isFirst,
  isLast,
}: {
  block: Block;
  adminKey: string;
  onChange: (block: Block) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const patch = (fields: Partial<Block>) =>
    onChange({ ...block, ...fields } as Block);

  return (
    <div className="border border-white/15 bg-white/[0.03] p-3">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--orange)]">
          {BLOCK_LABELS[block.type]}
        </span>
        <div className="flex gap-1">
          <button
            className={btn}
            onClick={() => onMove(-1)}
            disabled={isFirst}
            aria-label="Move up"
          >
            ↑
          </button>
          <button
            className={btn}
            onClick={() => onMove(1)}
            disabled={isLast}
            aria-label="Move down"
          >
            ↓
          </button>
          <button className={btn} onClick={onRemove} aria-label="Remove block">
            ✕
          </button>
        </div>
      </div>

      {(block.type === "title" || block.type === "subtitle") && (
        <input
          className={input}
          value={block.text}
          placeholder={BLOCK_LABELS[block.type]}
          onChange={(event) => patch({ text: event.target.value } as Partial<Block>)}
        />
      )}

      {block.type === "text" && (
        <textarea
          className={`${input} min-h-24 resize-y`}
          value={block.text}
          placeholder="Body text"
          onChange={(event) => patch({ text: event.target.value } as Partial<Block>)}
        />
      )}

      {block.type === "reveal" && (
        <div className="grid gap-2">
          <textarea
            className={`${input} min-h-20 resize-y`}
            value={block.text}
            placeholder="The secret — blurred until they hold it"
            onChange={(event) => patch({ text: event.target.value } as Partial<Block>)}
          />
          <input
            className={input}
            value={block.hint ?? ""}
            placeholder="Hint above the smudge"
            onChange={(event) => patch({ hint: event.target.value } as Partial<Block>)}
          />
        </div>
      )}

      {block.type === "image" && (
        <div className="grid gap-2">
          <UploadField
            adminKey={adminKey}
            value={block.url}
            accept="image/*"
            label="Image"
            onChange={(url) => patch({ url } as Partial<Block>)}
          />
          <input
            className={input}
            value={block.alt ?? ""}
            placeholder="Alt text (describe the image)"
            onChange={(event) => patch({ alt: event.target.value } as Partial<Block>)}
          />
          <input
            className={input}
            value={block.caption ?? ""}
            placeholder="Caption (optional)"
            onChange={(event) => patch({ caption: event.target.value } as Partial<Block>)}
          />
        </div>
      )}

      {block.type === "video" && (
        <div className="grid gap-2">
          <UploadField
            adminKey={adminKey}
            value={block.url}
            accept="video/*"
            label="Video"
            onChange={(url) => patch({ url } as Partial<Block>)}
          />
          <input
            className={input}
            value={block.caption ?? ""}
            placeholder="Caption (optional)"
            onChange={(event) => patch({ caption: event.target.value } as Partial<Block>)}
          />
        </div>
      )}

      {block.type === "link" && (
        <div className="grid gap-2">
          <input
            className={input}
            value={block.label}
            placeholder="Button label"
            onChange={(event) => patch({ label: event.target.value } as Partial<Block>)}
          />
          <input
            className={input}
            value={block.url}
            placeholder="https://…"
            onChange={(event) => patch({ url: event.target.value } as Partial<Block>)}
          />
        </div>
      )}

      {block.type === "divider" && (
        <p className="text-[12px] text-white/40">Three-stripe rule.</p>
      )}
    </div>
  );
}

/* ---------------------------------- page --------------------------------- */

export default function TeoAdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [drops, setDrops] = useState<Drop[]>([]);
  const [draft, setDraft] = useState<Drop | null>(null);
  const [give, setGive] = useState<GiveConfig>(DEFAULT_GIVE);
  const [tab, setTab] = useState<"drops" | "give" | "list">("drops");
  const [status, setStatus] = useState("");
  const [authed, setAuthed] = useState(false);

  // A key saved on a previous visit; null on the server, so hydration matches.
  const storedKey = useStoredValue(KEY_STORAGE);

  /**
   * Validates the key against an admin-only endpoint and returns everything
   * the builder needs. Writes no state, so it is safe to call from an effect.
   * Returns null when the key is rejected.
   */
  const fetchAll = useCallback(async (key: string) => {
    const auth = { "x-admin-key": key };
    // /api/teo/drops answers non-admins too, so probe an admin-only route.
    const probe = await fetch("/api/teo/subscribe", { headers: auth });
    if (!probe.ok) return null;

    const [dropsRes, giveRes] = await Promise.all([
      fetch("/api/teo/drops", { headers: auth }),
      fetch("/api/teo/give"),
    ]);
    const dropsData = await dropsRes.json();
    const giveData = await giveRes.json();
    return {
      drops: (dropsData.drops ?? []) as Drop[],
      give: (giveData.give ?? DEFAULT_GIVE) as GiveConfig,
    };
  }, []);

  const applyData = useCallback(
    (data: { drops: Drop[]; give: GiveConfig }) => {
      setDrops(data.drops);
      setGive(data.give);
    },
    []
  );

  const load = useCallback(
    async (key: string) => {
      const data = await fetchAll(key);
      if (data) applyData(data);
    },
    [fetchAll, applyData]
  );

  // Auto-unlock from a key saved on a previous visit.
  useEffect(() => {
    if (!storedKey || authed) return;
    let cancelled = false;

    fetchAll(storedKey).then((data) => {
      if (cancelled || !data) return;
      setAdminKey(storedKey);
      setAuthed(true);
      applyData(data);
    });

    return () => {
      cancelled = true;
    };
  }, [storedKey, authed, fetchAll, applyData]);

  /** Unlock from the key form. */
  async function unlock(key: string) {
    const data = await fetchAll(key);
    if (!data) {
      setStatus("Wrong key");
      return;
    }
    localStorage.setItem(KEY_STORAGE, key);
    setAdminKey(key);
    setAuthed(true);
    setStatus("");
    applyData(data);
  }

  async function saveDraft(publish?: boolean) {
    if (!draft) return;
    const payload = { ...draft, published: publish ?? draft.published };

    const response = await fetch("/api/teo/drops", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus("Save failed");
      return;
    }
    setStatus(payload.published ? "Published" : "Saved as draft");
    setDraft(null);
    await load(adminKey);
  }

  async function removeDrop(id: string) {
    await fetch(`/api/teo/drops?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    await load(adminKey);
  }

  async function saveGive() {
    const response = await fetch("/api/teo/give", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(give),
    });
    setStatus(response.ok ? "Give updated" : "Save failed");
  }

  async function exportEmails() {
    const response = await fetch("/api/teo/subscribe", {
      headers: { "x-admin-key": adminKey },
    });
    const data = await response.json();
    const rows = ["email,signed_up,source"].concat(
      (data.subscribers ?? []).map(
        (s: { email: string; createdAt: number; source: string }) =>
          `${s.email},${new Date(s.createdAt).toISOString()},${s.source}`
      )
    );
    await navigator.clipboard.writeText(rows.join("\n"));
    setStatus(`Copied ${rows.length - 1} emails as CSV`);
  }

  /* ------------------------------ key gate ------------------------------ */

  if (!authed) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-[var(--ink)] p-6">
        <div className="w-full max-w-sm">
          <h1
            className="text-[32px] leading-none uppercase text-[var(--paper)]"
            style={{ fontFamily: "var(--font-teo-display)" }}
          >
            Backstage
          </h1>
          <p className="mt-2 mb-4 text-[13px] text-white/50">
            Enter the admin key to edit the card.
          </p>
          <input
            className={input}
            type="password"
            value={keyInput}
            placeholder="Admin key"
            onChange={(event) => setKeyInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && unlock(keyInput)}
          />
          <button className={`${btnPrimary} mt-3 w-full`} onClick={() => unlock(keyInput)}>
            Unlock
          </button>
          {status && <p className="mt-3 text-[13px] text-[var(--orange)]">{status}</p>}
        </div>
      </main>
    );
  }

  /* ------------------------------- builder ------------------------------ */

  return (
    <main className="min-h-[100dvh] bg-[var(--ink)] text-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 px-5 py-3">
        <h1
          className="text-[20px] leading-none uppercase"
          style={{ fontFamily: "var(--font-teo-display)" }}
        >
          Backstage
        </h1>
        <div className="flex flex-wrap gap-1.5">
          {(["drops", "give", "list"] as const).map((value) => (
            <button
              key={value}
              className={`${btn} ${tab === value ? "bg-white/15 text-white" : ""}`}
              onClick={() => setTab(value)}
            >
              {value === "drops" ? "Editor" : value === "give" ? "Give" : "All drops"}
            </button>
          ))}
          <button className={btn} onClick={exportEmails}>
            Export emails
          </button>
          <a className={btn} href="/teo" target="_blank" rel="noreferrer">
            View card
          </a>
        </div>
      </header>

      {status && (
        <p className="border-b border-white/10 px-5 py-2 text-[12px] text-[var(--orange)]">
          {status}
        </p>
      )}

      <div className="mx-auto grid max-w-6xl gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_390px]">
        <section>
          {tab === "list" && (
            <div className="grid gap-2">
              <button
                className={btnPrimary}
                onClick={() => {
                  setDraft(newDraft());
                  setTab("drops");
                }}
              >
                + New drop
              </button>
              {drops.length === 0 && (
                <p className="py-6 text-[13px] text-white/45">No drops yet.</p>
              )}
              {drops.map((drop) => (
                <div
                  key={drop.id}
                  className="flex items-center justify-between border border-white/15 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[14px]">
                      <span className="text-[var(--orange)]">{drop.tag}</span>{" "}
                      <span className="text-white/45">
                        {drop.blocks.length} blocks ·{" "}
                        {drop.published ? "Published" : "Draft"}
                      </span>
                    </p>
                    <p className="text-[11px] text-white/35">
                      {new Date(drop.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      className={btn}
                      onClick={() => {
                        setDraft(drop);
                        setTab("drops");
                      }}
                    >
                      Edit
                    </button>
                    <button className={btn} onClick={() => removeDrop(drop.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "give" && (
            <div className="grid max-w-lg gap-3">
              <label className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                Mission blurb
              </label>
              <textarea
                className={`${input} min-h-28 resize-y`}
                value={give.blurb}
                onChange={(event) => setGive({ ...give, blurb: event.target.value })}
              />
              {(
                [
                  ["venmo", "Venmo handle", "@teo"],
                  ["cashApp", "Cash App cashtag", "$teo"],
                  ["zelle", "Zelle email or phone", "teo@email.com"],
                ] as const
              ).map(([field, label, placeholder]) => (
                <div key={field} className="grid gap-1.5">
                  <label className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                    {label}
                  </label>
                  <input
                    className={input}
                    value={give[field]}
                    placeholder={placeholder}
                    onChange={(event) =>
                      setGive({ ...give, [field]: event.target.value })
                    }
                  />
                </div>
              ))}
              <button className={btnPrimary} onClick={saveGive}>
                Save give settings
              </button>
            </div>
          )}

          {tab === "drops" && !draft && (
            <div className="grid max-w-sm gap-3 py-10">
              <p className="text-[14px] text-white/50">
                Pick a drop to edit, or start a new one.
              </p>
              <button className={btnPrimary} onClick={() => setDraft(newDraft())}>
                + New drop
              </button>
              <button className={btn} onClick={() => setTab("list")}>
                See all drops
              </button>
            </div>
          )}

          {tab === "drops" && draft && (
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <label className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                  Tag (shown in the feed, e.g. TRACK 04)
                </label>
                <input
                  className={input}
                  value={draft.tag}
                  onChange={(event) => setDraft({ ...draft, tag: event.target.value })}
                />
              </div>

              {draft.blocks.map((block, index) => (
                <BlockEditor
                  key={block.id}
                  block={block}
                  adminKey={adminKey}
                  isFirst={index === 0}
                  isLast={index === draft.blocks.length - 1}
                  onChange={(next) => {
                    const blocks = [...draft.blocks];
                    blocks[index] = next;
                    setDraft({ ...draft, blocks });
                  }}
                  onMove={(direction) => {
                    const target = index + direction;
                    if (target < 0 || target >= draft.blocks.length) return;
                    const blocks = [...draft.blocks];
                    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
                    setDraft({ ...draft, blocks });
                  }}
                  onRemove={() =>
                    setDraft({
                      ...draft,
                      blocks: draft.blocks.filter((_, i) => i !== index),
                    })
                  }
                />
              ))}

              <div className="flex flex-wrap gap-1.5 border-t border-white/15 pt-3">
                {BLOCK_TYPES.map((type) => (
                  <button
                    key={type}
                    className={btn}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        blocks: [...draft.blocks, emptyBlock(type, crypto.randomUUID())],
                      })
                    }
                  >
                    + {BLOCK_LABELS[type]}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-white/15 pt-3">
                <button className={btnPrimary} onClick={() => saveDraft(true)}>
                  Publish
                </button>
                <button className={btn} onClick={() => saveDraft(false)}>
                  Save draft
                </button>
                <button className={btn} onClick={() => setDraft(null)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Live phone preview of the drop being edited. */}
        <aside className="hidden lg:block">
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/35">
            Preview
          </p>
          <div className="h-[720px] w-[390px] overflow-hidden rounded-[10px] border-[3px] border-black/60">
            <DropsPanel drops={draft ? [draft] : drops} />
          </div>
        </aside>
      </div>
    </main>
  );
}
