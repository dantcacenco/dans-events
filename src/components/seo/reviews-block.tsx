import Link from "next/link";
import {
  FEATURED_REVIEWS,
  GOOGLE_PROFILE_URL,
  REVIEW_COUNT,
  REVIEW_RATING,
  REVIEWS_AS_OF,
  type GoogleReview,
} from "@/lib/reviews";

// Real Google reviews as plain on-page text (no Google widget, no review schema, no reviewer photos).

export function Stars({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span className={`text-red tracking-[3px] ${className}`} aria-label={`${n} out of 5 stars`} role="img">
      {"★★★★★".slice(0, n)}
      <span className="text-current opacity-25">{"★★★★★".slice(n)}</span>
    </span>
  );
}

export function RatingLine({ dark = false }: { dark?: boolean }) {
  return (
    <p className={`text-[13px] font-medium uppercase tracking-[2px] ${dark ? "text-white/60" : "text-black/55"}`}>
      Rated {REVIEW_RATING} from {REVIEW_COUNT} Google reviews, as of {REVIEWS_AS_OF}.{" "}
      <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener" className="underline underline-offset-[3px] decoration-red hover:text-red">
        See them on Google
      </a>
    </p>
  );
}

export function ReviewCard({ r, dark = false }: { r: GoogleReview; dark?: boolean }) {
  const text = dark ? "text-white/80" : "text-black/75";
  const meta = dark ? "text-white/40" : "text-black/40";
  return (
    <figure className={`p-8 border ${dark ? "border-white/[0.08] bg-white/[0.03]" : "border-black/[0.07] bg-white"} flex flex-col`}>
      <Stars n={r.stars} className="text-[22px] mb-5 block" />
      {r.text ? (
        <blockquote className={`text-[15px] font-light leading-[1.8] whitespace-pre-line ${text} flex-1`}>{r.text}</blockquote>
      ) : (
        <p className={`text-[13px] italic ${meta} flex-1`}>Star rating only, no written review.</p>
      )}
      {r.ownerReply && (
        <div className={`mt-5 pl-4 border-l-2 border-red text-[13px] font-light leading-[1.7] whitespace-pre-line ${meta}`}>
          <span className="block font-semibold uppercase tracking-[2px] text-[10px] mb-1">Dan&apos;s reply on Google</span>
          {r.ownerReply}
        </div>
      )}
      <figcaption className={`mt-6 text-[11px] font-semibold uppercase tracking-[2px] ${meta}`}>
        {r.name} <span className="text-red">/</span> Google, {r.when}
      </figcaption>
    </figure>
  );
}

// Featured reviews for the home page and key pages.
export default function ReviewsBlock({ limit = 6, dark = false, title = "What couples wrote on Google" }: { limit?: number; dark?: boolean; title?: string }) {
  const list = FEATURED_REVIEWS.slice(0, limit);
  return (
    <section className={`${dark ? "bg-black" : "bg-[#f4f1ee]"} py-[clamp(64px,9vw,120px)] px-6`} id="reviews">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-[clamp(28px,5vw,56px)] font-black uppercase leading-[1.1] mb-5 ${dark ? "text-white" : "text-black"}`}>
            {title}
          </h2>
          <RatingLine dark={dark} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((r) => (
            <ReviewCard key={r.name} r={r} dark={dark} />
          ))}
        </div>
        <p className="text-center mt-10">
          <Link
            href="/reviews"
            className="inline-block text-[12px] font-bold uppercase tracking-[3px] text-white bg-red px-8 py-4 hover:bg-black transition-colors"
          >
            Read all {REVIEW_COUNT} reviews
          </Link>
        </p>
      </div>
    </section>
  );
}
