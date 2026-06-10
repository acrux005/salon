"use client";

const IMG_ABOUT =
  "https://salon.odart.pl/wp-content/uploads/2026/02/womanbeautyy.jpg";

export function OMnie() {
  const aboutText = [
    "Od lat zajmuję się skórą — bo to największy narząd ciała i zasługuje na profesjonalną opiekę.",
    "W gabinecie nie sprzedaję zabiegów. Najpierw słucham, diagnozuję, potem dopasowuję terapię.",
    "Pracuję na certyfikowanych preparatach i sprawdzonych protokołach.",
    "Efekty? Widoczne po pierwszej serii — ale bez obietnic cudów. Realnie i bezpiecznie.",
    "Jeśli szukasz miejsca, gdzie ktoś naprawdę zajmie się Twoją skórą — zapraszam na konsultację.",
  ];

  return (
    <section id="o-mnie" className="border-t border-neutral-200/60 bg-gradient-to-b from-neutral-50/50 to-white py-16 lg:py-24 scroll-mt-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h2 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl lg:text-4xl">
            Dlaczego zajmuję się skórą i jak pracuję z pacjentem
          </h2>
        </header>

        <div className="grid gap-12 lg:grid-cols-[280px_1fr] lg:items-start">
          <div className="mx-auto w-56 overflow-hidden rounded-2xl border border-pink-100 shadow-lg lg:w-full">
            <img
              src={IMG_ABOUT}
              alt="Specjalista kosmetologii estetycznej"
              className="aspect-[3/4] w-full object-cover object-center"
            />
          </div>
          <div className="space-y-5">
            {aboutText.map((p, i) => (
              <p
                key={i}
                className="font-[var(--font-sans)] text-[15px] leading-[1.8] text-[#4a3f42]"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
