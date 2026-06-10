"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateClinicByAdminAction } from "@/app/actions/clinic";
import { PROBLEM_LABELS } from "@/content/clinicDemo";
import { TREATMENTS_CATALOG } from "@/lib/skinmatch/catalog";
import type { ClinicRecord, ProblemId, Treatment } from "@/lib/skinmatch/schema";

const PROBLEM_IDS: ProblemId[] = ["tradzik", "przebarwienia", "anti_aging", "naczynka", "sucha_skora", "zmarszczki", "jedrnost", "owal", "brwi_rzesy", "makijaz", "wlosy", "stopy", "masaze", "terapia_manualna", "dzwiekoterapia"];
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80";

type CategoryOption = { slug: string; name: string };

interface AdminClinicEditFormProps {
  clinic: ClinicRecord;
  clinicId: string;
  treatments?: Treatment[];
  initialTreatmentPrices?: Record<string, number>;
  initialTreatmentDurations?: Record<string, number>;
  categories?: CategoryOption[];
  treatmentCategoryMap?: Record<string, string | null>;
}

export function AdminClinicEditForm({ clinic, clinicId, treatments: treatmentsProp, initialTreatmentPrices = {}, initialTreatmentDurations = {}, categories = [], treatmentCategoryMap = {} }: AdminClinicEditFormProps) {
  const treatments = treatmentsProp ?? TREATMENTS_CATALOG;
  const router = useRouter();
  const [treatmentSearch, setTreatmentSearch] = useState("");
  const [treatmentCategoryFilter, setTreatmentCategoryFilter] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [form, setForm] = useState({
    slug: clinic.slug,
    name: clinic.name,
    city: clinic.city,
    description: clinic.description,
    specializations: clinic.specializations,
    treatmentIds: clinic.treatmentIds,
    treatmentPrices: Object.fromEntries(
      clinic.treatmentIds.map((id) => [id, initialTreatmentPrices[id] ? String(initialTreatmentPrices[id]) : ""])
    ) as Record<string, string>,
    treatmentDurations: Object.fromEntries(
      clinic.treatmentIds.map((id) => [id, initialTreatmentDurations[id] ? String(initialTreatmentDurations[id]) : ""])
    ) as Record<string, string>,
    kontakt: {
      phone: clinic.kontakt?.phone ?? "",
      email: clinic.kontakt?.email ?? "",
      address: clinic.kontakt?.address ?? "",
      bookingUrl: clinic.kontakt?.bookingUrl ?? "",
      instagram: clinic.kontakt?.instagram ?? "",
      facebook: clinic.kontakt?.facebook ?? "",
    },
    isPublished: true,
    cosmoStaffId: clinic.cosmoStaffId != null ? String(clinic.cosmoStaffId) : "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    const fd = new FormData();
    fd.set("slug", form.slug);
    fd.set("name", form.name);
    fd.set("city", form.city);
    fd.set("description", form.description);
    fd.set("specializations", JSON.stringify(form.specializations));
    fd.set("treatmentIds", JSON.stringify(form.treatmentIds));
    const pricesPayload: Record<string, number> = {};
    const durationsPayload: Record<string, number> = {};
    for (const id of form.treatmentIds) {
      const pv = form.treatmentPrices[id]?.trim();
      const pnum = pv ? parseInt(pv, 10) : 0;
      if (pnum > 0) pricesPayload[id] = pnum;
      const dv = form.treatmentDurations[id]?.trim();
      const dnum = dv ? parseInt(dv, 10) : 0;
      if (dnum > 0) durationsPayload[id] = dnum;
    }
    fd.set("treatmentPrices", JSON.stringify(pricesPayload));
    fd.set("treatmentDurations", JSON.stringify(durationsPayload));
    fd.set("isPublished", String(form.isPublished));
    fd.set("kontakt.phone", form.kontakt.phone);
    fd.set("kontakt.email", form.kontakt.email);
    fd.set("kontakt.address", form.kontakt.address);
    fd.set("kontakt.bookingUrl", form.kontakt.bookingUrl);
    fd.set("kontakt.instagram", form.kontakt.instagram);
    fd.set("kontakt.facebook", form.kontakt.facebook);
    fd.set("cosmoStaffId", form.cosmoStaffId);
    const result = await updateClinicByAdminAction(clinicId, fd);
    setSaving(false);
    if (result.ok) {
      setMessage({ type: "ok", text: "Zapisano." });
      router.refresh();
    } else {
      setMessage({ type: "err", text: result.error });
    }
  }

  function toggleSpec(id: ProblemId) {
    setForm((p) => ({
      ...p,
      specializations: p.specializations.includes(id) ? p.specializations.filter((x) => x !== id) : [...p.specializations, id],
    }));
  }

  function toggleTreatment(id: string) {
    setForm((p) => {
      const nextIds = p.treatmentIds.includes(id) ? p.treatmentIds.filter((x) => x !== id) : [...p.treatmentIds, id];
      const nextPrices = { ...p.treatmentPrices };
      const nextDurations = { ...p.treatmentDurations };
      if (!nextIds.includes(id)) {
        delete nextPrices[id];
        delete nextDurations[id];
      } else {
        if (!(id in nextPrices)) nextPrices[id] = "";
        if (!(id in nextDurations)) nextDurations[id] = "";
      }
      return { ...p, treatmentIds: nextIds, treatmentPrices: nextPrices, treatmentDurations: nextDurations };
    });
  }

  function setTreatmentPrice(treatmentId: string, value: string) {
    setForm((p) => ({ ...p, treatmentPrices: { ...p.treatmentPrices, [treatmentId]: value } }));
  }

  function setTreatmentDuration(treatmentId: string, value: string) {
    setForm((p) => ({ ...p, treatmentDurations: { ...p.treatmentDurations, [treatmentId]: value } }));
  }

  const noTreatments = form.treatmentIds.length === 0;

  const filteredTreatments = useMemo(() => {
    let list = treatments;
    const q = treatmentSearch.trim().toLowerCase();
    if (q.length >= 3) {
      list = list.filter((t) => t.nazwa.toLowerCase().includes(q));
    }
    if (treatmentCategoryFilter) {
      list = list.filter((t) => (treatmentCategoryMap[t.id] ?? null) === treatmentCategoryFilter);
    }
    return list;
  }, [treatments, treatmentSearch, treatmentCategoryFilter, treatmentCategoryMap]);

  const avatarSrc = clinic.avatarUrl
    ? (clinic.avatarUrl.startsWith("http") ? clinic.avatarUrl : `${BASE_PATH}${clinic.avatarUrl}`)
    : DEFAULT_AVATAR;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-[15px] font-medium text-[#1F1A1C]">Zdjęcie profilowe (avatar)</h3>
        <p className="mt-0.5 text-[13px] text-[#6F5E64]">Aktualne zdjęcie gabinetu. Aby zmienić, gabinet musi zalogować się do swojego panelu.</p>
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
            <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {message && (
          <p className={`rounded-lg px-4 py-2 text-[14px] ${message.type === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`} role="alert">
            {message.text}
            {message.type === "ok" && (
              <Link href={`/portal/gabinet/${clinic.slug}`} className="ml-2 font-medium underline">Zobacz publiczny profil</Link>
            )}
          </p>
        )}
        {noTreatments && (
          <p className="rounded-lg bg-amber-50 px-4 py-2 text-[14px] text-amber-800">Brak wybranych zabiegów — dopasowanie w quizie będzie słabe. Dodaj oferowane zabiegi.</p>
        )}
        <div>
          <label className="block text-[14px] font-medium text-[#1F1A1C]">Adres profilu (slug)</label>
          <p className="mt-0.5 text-[13px] text-[#6F5E64]">Adres w portalu: /portal/gabinet/<strong>{form.slug || "…"}</strong> — małe litery, cyfry, myślniki (min. 3 znaki). Nie używaj „moj-gabinet”.</p>
          <input type="text" required value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value.replace(/[^a-z0-9-]/gi, "").toLowerCase() }))} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500" />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#1F1A1C]">Nazwa</label>
          <input type="text" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500" />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#1F1A1C]">Miasto</label>
          <input type="text" required value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500" />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#1F1A1C]">Opis</label>
          <textarea rows={4} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500" />
        </div>
        <div>
          <h3 className="text-[15px] font-medium text-[#1F1A1C]">Kalendarz</h3>
          <p className="mt-0.5 text-[13px] text-[#6F5E64]">Wizyty rezerwowane przez portal są zapisywane w kalendarzu w panelu. Pracowników dodajesz w sekcji Pracownicy.</p>
        </div>
        <div>
          <h3 className="text-[15px] font-medium text-[#1F1A1C]">Kontakt</h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <input type="text" placeholder="Telefon" value={form.kontakt.phone} onChange={(e) => setForm((p) => ({ ...p, kontakt: { ...p.kontakt, phone: e.target.value } }))} className="rounded-lg border border-neutral-300 px-4 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500" />
            <input type="email" placeholder="Email" value={form.kontakt.email} onChange={(e) => setForm((p) => ({ ...p, kontakt: { ...p.kontakt, email: e.target.value } }))} className="rounded-lg border border-neutral-300 px-4 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500" />
            <input type="text" placeholder="Adres" value={form.kontakt.address} onChange={(e) => setForm((p) => ({ ...p, kontakt: { ...p.kontakt, address: e.target.value } }))} className="rounded-lg border border-neutral-300 px-4 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 sm:col-span-2" />
            <input type="url" placeholder="URL rezerwacji" value={form.kontakt.bookingUrl} onChange={(e) => setForm((p) => ({ ...p, kontakt: { ...p.kontakt, bookingUrl: e.target.value } }))} className="rounded-lg border border-neutral-300 px-4 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500" />
            <input type="text" placeholder="Instagram" value={form.kontakt.instagram} onChange={(e) => setForm((p) => ({ ...p, kontakt: { ...p.kontakt, instagram: e.target.value } }))} className="rounded-lg border border-neutral-300 px-4 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500" />
            <input type="text" placeholder="Facebook" value={form.kontakt.facebook} onChange={(e) => setForm((p) => ({ ...p, kontakt: { ...p.kontakt, facebook: e.target.value } }))} className="rounded-lg border border-neutral-300 px-4 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500" />
          </div>
        </div>
        <div>
          <h3 className="text-[15px] font-medium text-[#1F1A1C]">Specjalizacje</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {PROBLEM_IDS.map((id) => (
              <label key={id} className="flex cursor-pointer items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-[14px] hover:bg-neutral-50">
                <input type="checkbox" checked={form.specializations.includes(id)} onChange={() => toggleSpec(id)} className="rounded border-neutral-300 text-pink-500 focus:ring-pink-500" />
                {PROBLEM_LABELS[id]}
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-[15px] font-medium text-[#1F1A1C]">Oferowane zabiegi</h3>
          <p className="mt-0.5 text-[13px] text-[#6F5E64]">Wybierz zabiegi z katalogu. Ustaw cenę i czas trwania — puste = wartość z katalogu. Czas zabiegu blokuje odpowiednią liczbę minut w kalendarzu przy rezerwacji.</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="search"
              placeholder="Szukaj zabiegu (min. 3 litery)"
              value={treatmentSearch}
              onChange={(e) => setTreatmentSearch(e.target.value)}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 min-w-[200px]"
              aria-label="Szukaj zabiegu"
            />
            {categories.length > 0 && (
              <select
                value={treatmentCategoryFilter}
                onChange={(e) => setTreatmentCategoryFilter(e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                aria-label="Filtr kategorii"
              >
                <option value="">Wszystkie kategorie</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <ul className="mt-2 max-h-96 space-y-2 overflow-y-auto rounded-lg border border-neutral-200 p-3">
            {filteredTreatments.map((t) => (
              <li key={t.id} className="flex flex-wrap items-start gap-3">
                <input type="checkbox" id={"t-" + t.id} checked={form.treatmentIds.includes(t.id)} onChange={() => toggleTreatment(t.id)} className="mt-1 rounded border-neutral-300 text-pink-500 focus:ring-pink-500" />
                <label htmlFor={"t-" + t.id} className="min-w-0 flex-1 cursor-pointer text-[14px]">
                  <span className="font-medium text-[#1F1A1C]">{t.nazwa}</span>
                  <span className="ml-1 text-[13px] text-[#6F5E64]">— {t.opis}</span>
                </label>
                {form.treatmentIds.includes(t.id) && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label htmlFor={"price-" + t.id} className="text-[13px] text-[#6F5E64]">Cena (zł)</label>
                      <input
                        type="number"
                        id={"price-" + t.id}
                        min={0}
                        placeholder={String(t.cena_od)}
                        value={form.treatmentPrices[t.id] ?? ""}
                        onChange={(e) => setTreatmentPrice(t.id, e.target.value)}
                        className="w-20 rounded-lg border border-neutral-300 px-2 py-1.5 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label htmlFor={"duration-" + t.id} className="text-[13px] text-[#6F5E64]">Czas (min)</label>
                      <input
                        type="number"
                        id={"duration-" + t.id}
                        min={1}
                        placeholder={String(t.czas)}
                        value={form.treatmentDurations[t.id] ?? ""}
                        onChange={(e) => setTreatmentDuration(t.id, e.target.value)}
                        className="w-20 rounded-lg border border-neutral-300 px-2 py-1.5 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <input type="hidden" name="isPublished" value={String(form.isPublished)} />
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} className="rounded border-neutral-300 text-pink-500 focus:ring-pink-500" />
            <span className="text-[14px] text-[#1F1A1C]">Profil widoczny publicznie</span>
          </label>
        </div>
        <button type="submit" disabled={saving} className="rounded-full bg-pink-500 px-8 py-3 text-[15px] font-medium text-white hover:bg-pink-600 disabled:opacity-60">
          {saving ? "Zapisywanie…" : "Zapisz"}
        </button>
      </form>
    </div>
  );
}
