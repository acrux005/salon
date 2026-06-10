"use client";

import { PORTAL_LOCALE } from "@/content/portalLocale";

const STEPS = [
  {
    step: "1",
    title: "Wybierasz problem lub usługę",
    desc: "Krótki quiz albo szybki wybór kategorii: paznokcie, masaż, twarz i więcej.",
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="#DE1F40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
        <path d="M10 18h16M10 12h16M10 24h10" />
        <rect x="6" y="6" width="6" height="6" rx="1" />
        <rect x="6" y="14" width="6" height="6" rx="1" />
        <rect x="6" y="22" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    step: "2",
    title: "Dostajesz dopasowanie",
    desc: `Rekomendowaną terapię albo listę sprawdzonych gabinetów w ${PORTAL_LOCALE.regionLong}.`,
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="#DE1F40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
        <path d="M18 4l3 8 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1 3-8z" />
      </svg>
    ),
  },
  {
    step: "3",
    title: "Rezerwujesz wizytę",
    desc: "Wybierasz 1–3 najlepsze opcje i umawiasz termin bez zgadywania.",
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="#DE1F40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
        <rect x="5" y="8" width="26" height="22" rx="2" />
        <path d="M5 14h26M12 4v8M24 4v8" />
        <path d="M12 20h4v4h-4zM18 20h4v4h-4z" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section
      id="jak-to-dziala"
      className="border-b border-neutral-200/40 py-20 lg:py-28"
      style={{ background: "#FFF6FA" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center font-[var(--font-serif)] text-2xl font-normal text-[#1F1F1F] sm:text-3xl">
          Jak to działa
        </h2>
        <p className="mx-auto max-w-xl text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Dobór problemu lub usługi → Dopasowanie → Rezerwacja w {PORTAL_LOCALE.regionIn}.
        </p>
        <p className="mx-auto mb-14 mt-2 max-w-lg text-center font-[var(--font-sans)] text-[13px] text-[#8A7E82]">
          Nie katalog bez końca. Tylko miejsca, które robią to dobrze.
        </p>
        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map(({ step, title, desc, icon }) => (
            <div
              key={step}
              className="relative -translate-y-2.5 overflow-hidden rounded-[18px] border-0 bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
            >
              <span
                className="absolute right-4 top-4 font-[var(--font-sans)] text-6xl font-semibold text-pink-200 opacity-[0.1]"
                aria-hidden
              >
                {step}
              </span>
              <div className="relative flex h-[34px] w-[34px] items-center justify-center [&>svg]:h-[34px] [&>svg]:w-[34px]" aria-hidden>
                {icon}
              </div>
              <h3 className="mt-5 font-[var(--font-sans)] text-[17px] font-semibold text-[#1F1A1C]">
                {title}
              </h3>
              <p className="mt-2 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#6F5E64]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
