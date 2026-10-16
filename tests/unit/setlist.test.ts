import { describe, expect, it, vi } from "vitest";
import { SONGS } from "@/lib/setlist/catalog";
import { masterFromData } from "@/lib/setlist/guest-store";
import { buildMaster, couplePicks } from "@/lib/setlist/master";
import { masterToCsv, masterToM3u } from "@/lib/setlist/export";
import { applyAnswer, emptyFlow, emptyPerson, startDeck } from "@/lib/setlist/store";
import { cleanFlows, mergeFlows, stampFlow } from "@/lib/setlist/sync";
import type { FlowState, StoredGuestVote } from "@/lib/setlist/types";

vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }) }));

const rec = SONGS.filter((s) => s.flow === "reception");
const flowWith = (pid: string, likes: string[], at: number): FlowState => {
  const f = emptyFlow();
  const p = { ...emptyPerson(), deck: likes, index: likes.length, step: "done" as const, answers: Object.fromEntries(likes.map((id) => [id, "like" as const])), at };
  return { ...f, people: { [pid]: p } };
};
const vote = (sid: string, likes: string[], extras: { title: string; artist: string }[] = []): StoredGuestVote => ({ sessionId: sid, name: "", likes, skips: [], extras, at: 1 });

describe("two phones merge", () => {
  it("keeps each partner's newer walk and both partners", () => {
    const a = flowWith("a", [rec[0].id], 10);
    const b = flowWith("b", [rec[1].id], 20);
    const m = mergeFlows({ reception: a }, { reception: b }).reception;
    expect(Object.keys(m.people).sort()).toEqual(["a", "b"]);
    const older = flowWith("a", [], 5);
    expect(mergeFlows({ reception: a }, { reception: older }).reception.people.a.answers[rec[0].id]).toBe("like");
  });
  it("shared marks and notes: newer copy wins", () => {
    const x = { ...emptyFlow(), notes: "old", metaAt: 1 };
    const y = { ...emptyFlow(), notes: "new", metaAt: 2 };
    expect(mergeFlows({ reception: x }, { reception: y }).reception.notes).toBe("new");
    expect(mergeFlows({ reception: y }, { reception: x }).reception.notes).toBe("new");
  });
  it("stamps only what changed", () => {
    const f = { ...emptyFlow(), people: { a: { ...emptyPerson(), styles: ["pop"] }, b: emptyPerson() } };
    const started = startDeck(f.people.a, "reception");
    const next = stampFlow(f, { ...f, people: { ...f.people, a: started } }, 99);
    expect(next.people.a.at).toBe(99);
    expect(next.people.b.at).toBeUndefined();
    expect(next.metaAt).toBeUndefined();
    const answered = stampFlow(next, applyAnswer(next, "a", "love"), 100);
    expect(answered.metaAt).toBe(100); // a "love" also sets a must-play mark
  });
  it("cleanFlows drops junk from the browser", () => {
    const out = cleanFlows({ reception: { people: { a: { answers: { "pop-1": "like", "x<y": "like", "pop-2": "hack" }, deck: ["pop-1"], index: 9 }, evil: {} }, marks: { "pop-3": "never", "pop-4": "drop" }, notes: 5 } });
    expect(Object.keys(out.reception.people)).toEqual(["a"]);
    expect(out.reception.people.a.answers).toEqual({ "pop-1": "like" });
    expect(out.reception.people.a.index).toBe(1);
    expect(out.reception.marks).toEqual({ "pop-3": "never" });
    expect(out.reception.notes).toBe("");
    expect(out.ceremony.people).toEqual({});
  });
});

describe("master list", () => {
  it("counts each person once, never-play removes everywhere, guest songs merge", () => {
    const f = flowWith("a", [rec[0].id, rec[1].id], 1);
    f.marks = { [rec[1].id]: "never" };
    const votes = [
      vote("g1", [rec[0].id, rec[1].id, rec[2].id], [{ title: "Some Song", artist: "Band" }]),
      vote("g2", [rec[0].id], [{ title: "some song!", artist: "band" }, { title: "Some Song", artist: "Band" }]),
      vote("g3", []),
    ];
    const data = masterFromData(couplePicks(f), votes);
    expect(data.guests).toBe(2);
    const m = buildMaster(data, f);
    expect(m.songs[0]).toMatchObject({ id: rec[0].id, count: 3, coupleLiked: true });
    expect(m.songs.find((s) => s.id === rec[1].id)).toBeUndefined();
    expect(m.extras).toHaveLength(1);
    expect(m.extras[0].count).toBe(2);
    expect(masterToCsv(m, "")).toContain("Songs chosen by guests");
    expect(masterToM3u(m)).toMatch(/^#EXTM3U/);
  });
  it("CSV defuses formulas", () => {
    const m = { songs: [], extras: [{ id: "k", extra: true, title: "=HYPERLINK(1)", artist: "", count: 1, coupleLiked: false, must: false }] };
    expect(masterToCsv(m, "")).toContain("'=HYPERLINK(1)");
  });
});

describe("catalog", () => {
  it("every song has a clip path, a known style and an explicit flag", () => {
    for (const s of SONGS) {
      expect(s.clip).toMatch(/^\/setlist\/clips\/[a-z0-9-]+\.mp3$/);
      expect(typeof s.explicit).toBe("boolean");
    }
    expect(new Set(SONGS.map((s) => s.id)).size).toBe(SONGS.length);
  });
});

describe("admin auth", () => {
  it("signs sessions with the password and rejects tampering", async () => {
    process.env.SETLIST_ADMIN_PASSWORD = "unit-test-password-1";
    const { sessionValue, validSession, passwordMatches } = await import("@/lib/setlist/admin/auth");
    const { value } = sessionValue(1000);
    expect(validSession(value, 2000)).toBe(true);
    expect(validSession(value.replace(/.$/, "x"), 2000)).toBe(false);
    expect(validSession(value, 1000 + 15 * 24 * 3600 * 1000)).toBe(false);
    expect(passwordMatches("unit-test-password-1")).toBe(true);
    expect(passwordMatches("nope")).toBe(false);
    process.env.SETLIST_ADMIN_PASSWORD = "rotated-password-22";
    expect(validSession(value, 2000)).toBe(false); // rotating signs everyone out
  });
});
