"use client";

import { useState, useTransition } from "react";
import type { ClinicEffectsSectionConfig } from "@/lib/skinmatch/schema";
import { updateClinicEffectsSectionAction } from "@/app/actions/clinic";

type EffectCard = {
  problem: string;
  terapia: string;
  wizyty: string;
  efekt: string;
};

const DEFAULT_CARDS: EffectCard[] = [
  { problem: "Trądzik", terapia: "Terapia regulująca sebum", wizyty: "4 wizyty", efekt: "Widoczna redukcja zmian i sebum" },
  { problem: "Anti-aging", terapia: "Mezoterapia igłowa / mikroigłowa", wizyty: "3 zabiegi", efekt: "Nawilżenie, jędrność" },
  { problem: "Przebarwienia", terapia: "Peelingi + pielęgnacja", wizyty: "seria", efekt: "Wyrównanie kolorytu" },
];

function normalizeCards(cards?: EffectCard[]): EffectCard[] {
  const out = Array.isArray(cards) ? cards.slice(0, 3) : [];
  while (out.length < 3) {
    out.push({ ...DEFAULT_CARDS[out.length] });
  }
  return out.map((c, i) => ({
    problem: c.problem ?? DEFAULT_CARDS[i].problem,
    terapia: c.terapia ?? DEFAULT_CARDS[i].terapia,
    wizyty: c.wizyty ?? DEFAULT_CARDS[i].wizyty,
    efekt: c.efekt ?? DEFAULT_CARDS[i].efekt,
  }));
}

export function EffectsSectionForm({
  initial,
}: {
  initial?: ClinicEffectsSectionConfig;
}) {
  const [saving, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [form, setForm] = useState({
    enabled: initial?.enabled !== false,
    title: initial?.title ?? "Realne efekty terapii",
    subtitle: initial?.subtitle ?? "Problem → Terapia → Liczba wizyt → Efekt",
    cards: normalizeCards(initial?.cards as EffectCard[] | undefined),
  });

  const setCard = (idx: number, field: keyof EffectCard, value: string) => {
    setForm((prev) => {
      const cards = [...prev.cards];
      cards[idx] = { ...cards[idx], [field]: value };
      return { ...prev, cards };
    });
    setMessage(null);
  };

  const save = () => {
    startTransition(async () => {
      const result = await updateClinicEffectsSectionAction({
        enabled: form.enabled,
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        cards: form.cards.map((c) => ({
          problem: c.problem.trim(),
          terapia: c.terapia.trim(),
          wizyty: c.wizyty.trim(),
          efekt: c.efekt.trim(),
        })),
      });
      if (result.ok) {
        setMessage({ type: "ok", text: "Zapisano sekcję „Realne efekty terapii”." });
      } else {
        setMessage({ type: "err", text: result.error });
      }
    });
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
      <h2 className="font-[var(--font-serif)] text-lg font-normal text-[#1F1A1C]">
        Sekcja „Realne efekty terapii”
      </h2>
      <p className="mt-1 text-[14px] text-[#6F5E64]">
        Możesz edytować treść albo całkiem wyłączyć wyświetlanie tej sekcji na stronie gabinetu.
      </p>

      <label className="mt-4 flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(e) => setForm((p) => ({ ...p, enabled: e.target.checked }))}
          className="rounded border-neutral-300 text-pink-500 focus:ring-pink-500"
        />
        <span className="text-[14px] text-[#1F1A1C]">Pokaż sekcję na stronie gabinetu</span>
      </label>

      <div className="mt-4 grid gap-3">
        <div>
          <label className="block text-[13px] font-medium text-[#1F1A1C]">Nagłówek</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#1F1A1C]">Podtytuł</label>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {form.cards.map((card, idx) => (
          <div key={idx} className="rounded-lg border border-neutral-200 p-3">
            <p className="text-[13px] font-medium text-[#6F5E64]">Karta {idx + 1}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Problem"
                value={card.problem}
                onChange={(e) => setCard(idx, "problem", e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <input
                type="text"
                placeholder="Terapia"
                value={card.terapia}
                onChange={(e) => setCard(idx, "terapia", e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <input
                type="text"
                placeholder="Liczba wizyt"
                value={card.wizyty}
                onChange={(e) => setCard(idx, "wizyty", e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <input
                type="text"
                placeholder="Efekt"
                value={card.efekt}
                onChange={(e) => setCard(idx, "efekt", e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
          </div>
        ))}
      </div>

      {message && (
        <p className={`mt-4 text-[14px] ${message.type === "ok" ? "text-green-700" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-4 rounded-lg bg-[#1F1A1C] px-4 py-2 text-[14px] font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {saving ? "Zapisywanie…" : "Zapisz sekcję efektów"}
      </button>
    </div>
  );
}
