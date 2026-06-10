"use client";

const CASES = [
  { problem: "Trądzik dorosłych", therapy: "oczyszczanie + regulacja", time: "ok. 6 tygodni", effect: "mniej zmian, rzadsze nawroty" },
  { problem: "Przebarwienia", therapy: "peelingi + pielęgnacja", time: "ok. 8 tygodni", effect: "wyrównanie kolorytu" },
  { problem: "Anti-aging 35+", therapy: "mezoterapia + pielęgnacja", time: "seria 4 wizyt", effect: "nawilżenie, lepsza jędrność" },
];

export function CaseStudies() {
  return (
    <section className="border-b border-neutral-200/40 py-20 lg:py-28" style={{ background: "#F9F9FB" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
          Efekt ma znaczenie.
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Bez obietnic. Z planem.
        </p>
        <div className="grid gap-10 sm:grid-cols-3">
          {CASES.map((c) => (
            <div
              key={c.problem}
              className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6"
            >
              <div className="mb-4 flex h-24 items-center justify-center rounded-xl bg-neutral-100 text-[12px] text-neutral-400">
                Zdjęcia tylko za zgodą
              </div>
              <p className="font-[var(--font-sans)] text-[14px] font-semibold text-[#1F1A1C]">
                {c.problem}
              </p>
              <p className="mt-1 font-[var(--font-sans)] text-[13px] text-[#6F5E64]">
                <span className="font-medium text-[#1F1A1C]">Plan:</span> {c.therapy} · {c.time}
              </p>
              <p className="mt-2 font-[var(--font-sans)] text-[13px] font-medium" style={{ color: "#DE1F40" }}>
                <span className="font-normal text-[#6F5E64]">Cel:</span> {c.effect}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
