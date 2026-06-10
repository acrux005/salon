"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import Link from "next/link";
import { submitClinicReviewAction } from "@/app/actions/clinicReviews";
import type { ClinicReviewItem } from "@/lib/clinicReviews";

type Props = {
  reviews: ClinicReviewItem[];
  clinicId: string;
  clinicSlug: string;
  isClient: boolean;
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ClinicReviews({ reviews, clinicId, clinicSlug, isClient }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const result = await submitClinicReviewAction(clinicId, clinicSlug, rating, content);
      if (result.ok) {
        setMessage({ type: "ok", text: "Dziękujemy! Twoja opinia została zapisana." });
        setContent("");
        router.refresh();
      } else {
        setMessage({ type: "err", text: result.error });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="opinie" className="border-b border-neutral-200/60 bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
          Opinie
        </h2>

        {isClient && (
          <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50/50 p-6">
            <h3 className="font-[var(--font-sans)] text-[15px] font-semibold text-[#1F1A1C]">
              Dodaj opinię
            </h3>
            <p className="mt-1 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
              Twoja opinia pomoże innym w wyborze gabinetu.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <span className="font-[var(--font-sans)] text-[14px] text-[#4a3f42]">Ocena</span>
                <div className="mt-1 flex gap-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setRating(v)}
                      className="focus:outline-none"
                      aria-label={`${v} gwiazdek`}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          v <= rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="review-content" className="font-[var(--font-sans)] text-[14px] text-[#4a3f42]">
                  Treść opinii (min. 10 znaków)
                </label>
                <textarea
                  id="review-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 font-[var(--font-sans)] text-[15px] text-[#1F1A1C] focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
                  placeholder="Opowiedz o swoich doświadczeniach..."
                />
                <p className="mt-1 font-[var(--font-sans)] text-[13px] text-neutral-400">
                  {content.length} / 2000
                </p>
              </div>
              {message && (
                <p
                  className={
                    message.type === "ok"
                      ? "font-[var(--font-sans)] text-[14px] text-green-600"
                      : "font-[var(--font-sans)] text-[14px] text-red-600"
                  }
                >
                  {message.text}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || content.trim().length < 10}
                className="rounded-full bg-pink-500 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600 disabled:opacity-50 disabled:hover:bg-pink-500"
              >
                {loading ? "Zapisywanie…" : "Opublikuj opinię"}
              </button>
            </form>
          </div>
        )}

        {!isClient && (
          <p className="mt-4 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
            <Link href={`/portal/login?callbackUrl=${encodeURIComponent(`/portal/gabinet/${clinicSlug}`)}`} className="text-pink-600 hover:underline">
              Zaloguj się
            </Link>
            , aby dodać opinię.
          </p>
        )}

        <div className="mt-10 space-y-6">
          {reviews.length === 0 ? (
            <p className="font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
              Brak opinii. Bądź pierwszą osobą, która doda opinię o tym gabinecie.
            </p>
          ) : (
            reviews.map((r) => (
              <article
                key={r.id}
                className="rounded-xl border border-neutral-100 bg-neutral-50/40 p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-[var(--font-sans)] font-medium text-[#1F1A1C]">
                    {r.authorName}
                  </span>
                  <span className="font-[var(--font-sans)] text-[13px] text-neutral-400">
                    {formatDate(r.createdAt)}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <Star
                        key={v}
                        className={`h-4 w-4 ${
                          v <= r.rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#4a3f42] whitespace-pre-wrap">
                  {r.content}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
