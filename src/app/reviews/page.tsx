import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { BreadcrumbBar } from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { ReviewCard, RatingLine } from "@/components/seo/reviews-block";
import Link from "next/link";
import { FIVE_STAR_COUNT, GOOGLE_REVIEWS, GOOGLE_PROFILE_URL, REVIEW_COUNT, REVIEW_RATING, REVIEWS_AS_OF } from "@/lib/reviews";
import { pageMeta, webPageLd } from "@/lib/seo";

const TITLE = `Reviews: Rated ${REVIEW_RATING} from ${REVIEW_COUNT} on Google | Dan's Events`;
const DESCRIPTION = `Every Google review of Dan's Events, word for word: rated ${REVIEW_RATING} from ${REVIEW_COUNT} reviews as of ${REVIEWS_AS_OF}, from couples and guests at weddings we hosted.`;

export const metadata = pageMeta({ path: "/reviews", title: TITLE, description: DESCRIPTION });

export default function ReviewsPage() {
  const written = GOOGLE_REVIEWS.filter((r) => r.text);
  const starOnly = GOOGLE_REVIEWS.filter((r) => !r.text);
  return (
    <>
      <SiteNav current="/reviews" />
      <JsonLd data={webPageLd({ path: "/reviews", name: TITLE, description: DESCRIPTION, about: { "@id": "https://dans-events.com/#business" } })} />
      <BreadcrumbBar items={[{ name: "Reviews", href: "/reviews" }]} underNav />

      <header className="bg-black px-6 pt-[clamp(40px,6vw,80px)] pb-[clamp(48px,7vw,96px)] text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[5px] text-red mb-6">Google reviews</p>
        <h1 className="text-[clamp(64px,16vw,200px)] font-black leading-[0.85] tracking-[-4px] text-white">{REVIEW_RATING}</h1>
        <p className="mt-6 text-[clamp(16px,1.8vw,21px)] font-light text-white/75 max-w-[640px] mx-auto leading-[1.7]">
          {REVIEW_COUNT} Google reviews, {FIVE_STAR_COUNT} of them five stars, as of {REVIEWS_AS_OF}. Every review is copied
          here word for word, newest first, including the ones that are not five stars.
        </p>
        <p className="mt-8">
          <a
            href={GOOGLE_PROFILE_URL}
            target="_blank"
            rel="noopener"
            className="inline-block text-[12px] font-bold uppercase tracking-[3px] text-white bg-red px-8 py-4 hover:bg-white hover:text-black transition-colors"
          >
            Read them on Google
          </a>
        </p>
      </header>

      <section className="bg-[#f4f1ee] px-6 py-[clamp(56px,8vw,104px)]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[clamp(26px,4vw,44px)] font-black uppercase text-black leading-[1.1] mb-4">Written reviews</h2>
            <RatingLine />
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
            {written.map((r) => (
              <ReviewCard key={`${r.name}-${r.when}`} r={r} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-[clamp(48px,7vw,88px)]">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-[clamp(22px,3vw,32px)] font-black uppercase text-black mb-4">Star ratings without text</h2>
          <p className="text-[15px] font-light text-black/60 leading-[1.8] mb-8">
            {starOnly.length} more people left a star rating on Google without writing a review:
          </p>
          <ul className="list-none flex flex-wrap justify-center gap-2">
            {starOnly.map((r) => (
              <li key={`${r.name}-${r.when}`} className="text-[12px] font-medium text-black/60 border border-black/10 px-3 py-2">
                {r.name} <span className="text-red">{"★".repeat(r.stars)}</span> <span className="text-black/35">{r.when}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-black px-6 py-[clamp(56px,8vw,104px)]">
        <div className="max-w-[760px] mx-auto text-white/70 text-[15px] font-light leading-[1.85]">
          <h2 className="text-[clamp(22px,3vw,32px)] font-black uppercase text-white mb-6">How these reviews are shown</h2>
          <p className="mb-5">
            These are the public reviews on the Dan&apos;s Events Google Business Profile, copied without edits. Names are
            shortened to a first name and last initial, the dates are Google&apos;s own (&ldquo;a year ago&rdquo;) as of {REVIEWS_AS_OF},
            and reviewer photos are not copied. The count and rating are updated when we refresh this page.
          </p>
          <p>
            Planning your own wedding? See <Link href="/mc" className="underline decoration-red underline-offset-[4px] hover:text-white">hosting</Link>,{" "}
            <Link href="/dj" className="underline decoration-red underline-offset-[4px] hover:text-white">the DJ</Link>,{" "}
            <Link href="/special-effects" className="underline decoration-red underline-offset-[4px] hover:text-white">effects</Link> and{" "}
            <Link href="/pricing" className="underline decoration-red underline-offset-[4px] hover:text-white">pricing</Link>, or{" "}
            <Link href="/#check-date" className="underline decoration-red underline-offset-[4px] hover:text-white">check your date</Link>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
