import JsonLd from "./json-ld";

export type QA = { q: string; a: string };

// Visible FAQ plus FAQPage structured data built from the same text.
export default function FaqSection({ items, title = "Questions", light = true, id = "faq" }: { items: QA[]; title?: string; light?: boolean; id?: string }) {
  if (!items.length) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
  const bg = light ? "bg-white" : "bg-black";
  const h = light ? "text-black" : "text-white";
  const p = light ? "text-black/65" : "text-white/65";
  const line = light ? "divide-black/[0.08]" : "divide-white/[0.08]";
  return (
    <section className={`${bg} py-[clamp(64px,9vw,120px)] px-6`} id={id}>
      <JsonLd data={data} />
      <div className="max-w-[800px] mx-auto">
        <h2 className={`text-[clamp(24px,4vw,44px)] font-extrabold uppercase ${h} leading-[1.15] mb-10 text-center`}>
          {title}
          <span className="inline-block w-3 h-3 bg-red ml-2 translate-y-0.5" />
        </h2>
        <div className={`divide-y ${line}`}>
          {items.map((x) => (
            <div key={x.q} className="py-7">
              <h3 className={`text-base font-bold ${h} mb-3`}>{x.q}</h3>
              <p className={`text-[15px] font-light ${p} leading-[1.8]`}>{x.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
