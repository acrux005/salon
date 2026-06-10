"use client";

import Image from "next/image";

const cases = [
  {
    before: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
    after: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    afterLabel: "Po 4 wizytach",
    desc: "Terapia trądziku — 6 tygodni",
  },
  {
    before: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80",
    after: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
    afterLabel: "Po 3 zabiegach",
    desc: "Mezoterapia — anti-aging",
  },
  {
    before: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
    after: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80",
    afterLabel: "Po serii",
    desc: "Przebarwienia — 8 tygodni",
  },
];

export function Metamorfozy() {
  return (
    <section className="border-t border-neutral-200/60 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h2 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl lg:text-4xl">
            Realne efekty terapii
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-[15px] text-[#6F5E64] leading-relaxed">
            Zdjęcia przed i po — z podpisem ilości wizyt i czasu terapii
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-3">
          {cases.map(({ before, after, afterLabel, desc }, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm"
            >
              <div className="grid grid-cols-2 gap-px bg-neutral-200">
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                  <Image
                    src={before}
                    alt="Przed zabiegiem"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 200px"
                  />
                  <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                    Przed
                  </span>
                </div>
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
                  <Image
                    src={after}
                    alt="Po zabiegu"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 200px"
                  />
                  <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                    {afterLabel}
                  </span>
                </div>
              </div>
              <div className="border-t border-neutral-200 bg-white px-4 py-3 text-center">
                <p className="text-[13px] text-[#6F5E64]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
