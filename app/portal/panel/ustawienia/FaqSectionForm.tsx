"use client";

import { useState, useTransition } from "react";
import type { ClinicFaqSectionConfig } from "@/lib/skinmatch/schema";
import { updateClinicFaqSectionAction } from "@/app/actions/clinic";

type FaqItem = { question: string; answer: string };

const DEFAULT_ITEMS: FaqItem[] = [
  {
    question: "Czy zabieg boli?",
    answer:
      "Większość zabiegów pielęgnacyjnych jest bezbolesna lub wiąże się z lekkim dyskomfortem. Zabiegi inwazyjne (np. mezoterapia igłowa) wykonujemy po wcześniejszym znieczuleniu. Na konsultacji omówimy, czego możesz się spodziewać.",
  },
  {
    question: "Ile trwa regeneracja?",
    answer:
      "Zależy od zabiegu. Łagodne peelingi — 1–2 dni. Zabiegi igłowe — 2–5 dni zaczerwienienia. Konkretne zalecenia dostaniesz po zabiegu.",
  },
  {
    question: "Czy efekty są trwałe?",
    answer:
      "Efekty utrzymują się miesiącami do roku w zależności od procedury i pielęgnacji. Regularna pielęgnacja i zabiegi podtrzymujące przedłużają rezultaty.",
  },
  {
    question: "Czy konsultacja jest obowiązkowa?",
    answer:
      "Tak. Pierwsza wizyta to konsultacja — bez obowiązku wykupu zabiegu. Dzięki temu dobierzemy bezpieczną i skuteczną terapię.",
  },
];

function normalizeItems(items?: FaqItem[]): FaqItem[] {
  const out = Array.isArray(items) ? items.slice(0, 4) : [];
  while (out.length < 4) out.push({ ...DEFAULT_ITEMS[out.length] });
  return out;
}

export function FaqSectionForm({ initial }: { initial?: ClinicFaqSectionConfig }) {
  const [saving, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [form, setForm] = useState({
    enabled: initial?.enabled !== false,
    title: initial?.title ?? "Najczęściej zadawane pytania",
    items: normalizeItems(initial?.items as FaqItem[] | undefined),
  });

  const setItem = (idx: number, field: keyof FaqItem, value: string) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[idx] = { ...items[idx], [field]: value };
      return { ...prev, items };
    });
    setMessage(null);
  };

  const save = () => {
    startTransition(async () => {
      const result = await updateClinicFaqSectionAction({
        enabled: form.enabled,
        title: form.title.trim(),
        items: form.items.map((i) => ({ question: i.question.trim(), answer: i.answer.trim() })),
      });
      if (result.ok) {
        setMessage({ type: "ok", text: "Zapisano sekcję FAQ." });
      } else {
        setMessage({ type: "err", text: result.error });
      }
    });
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
      <h2 className="font-[var(--font-serif)] text-lg font-normal text-[#1F1A1C]">Sekcja FAQ</h2>
      <p className="mt-1 text-[14px] text-[#6F5E64]">
        Edycja pytań i odpowiedzi „Najczęściej zadawane pytania” na profilu gabinetu.
      </p>

      <label className="mt-4 flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(e) => setForm((p) => ({ ...p, enabled: e.target.checked }))}
          className="rounded border-neutral-300 text-pink-500 focus:ring-pink-500"
        />
        <span className="text-[14px] text-[#1F1A1C]">Pokaż sekcję FAQ na stronie gabinetu</span>
      </label>

      <div className="mt-4">
        <label className="block text-[13px] font-medium text-[#1F1A1C]">Nagłówek sekcji</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
        />
      </div>

      <div className="mt-5 space-y-4">
        {form.items.map((item, idx) => (
          <div key={idx} className="rounded-lg border border-neutral-200 p-3">
            <p className="text-[13px] font-medium text-[#6F5E64]">Pytanie {idx + 1}</p>
            <input
              type="text"
              value={item.question}
              onChange={(e) => setItem(idx, "question", e.target.value)}
              className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              placeholder="Treść pytania"
            />
            <textarea
              rows={4}
              value={item.answer}
              onChange={(e) => setItem(idx, "answer", e.target.value)}
              className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              placeholder="Treść odpowiedzi"
            />
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
        {saving ? "Zapisywanie…" : "Zapisz FAQ"}
      </button>
    </div>
  );
}
