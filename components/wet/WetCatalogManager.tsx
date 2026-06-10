"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deleteCatalogItemAction,
  seedDefaultCatalogAction,
  upsertCatalogItemAction,
} from "@/app/actions/vetCatalog";
import {
  VET_CATALOG_CATEGORIES,
  formatCatalogPrice,
  isLowStock,
  type VetCatalogItemDto,
} from "@/lib/vet/catalog";
import { VET_VISIT_TYPES } from "@/lib/vet/visitTypes";
import { WetUrplImportPanel } from "@/components/wet/WetUrplImportPanel";

type FormState = {
  id: string;
  category: string;
  name: string;
  manufacturer: string;
  defaultPrice: string;
  defaultIntervalDays: string;
  defaultVisitType: string;
  trackStock: boolean;
  stockDoses: string;
  active: boolean;
};

const emptyForm = (): FormState => ({
  id: "",
  category: "szczepienie",
  name: "",
  manufacturer: "",
  defaultPrice: "",
  defaultIntervalDays: "365",
  defaultVisitType: "",
  trackStock: false,
  stockDoses: "",
  active: true,
});

export function WetCatalogManager({ initialItems }: { initialItems: VetCatalogItemDto[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  function startEdit(item: VetCatalogItemDto) {
    setForm({
      id: item.id,
      category: item.category,
      name: item.name,
      manufacturer: item.manufacturer ?? "",
      defaultPrice: item.defaultPrice != null ? String(item.defaultPrice / 100).replace(".", ",") : "",
      defaultIntervalDays: String(item.defaultIntervalDays),
      defaultVisitType: item.defaultVisitType ?? "",
      trackStock: item.trackStock,
      stockDoses: item.stockDoses != null ? String(item.stockDoses) : "",
      active: item.active,
    });
    setEditing(true);
    setMessage("");
  }

  function cancelEdit() {
    setForm(emptyForm());
    setEditing(false);
    setMessage("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const fd = new FormData();
    if (form.id) fd.set("id", form.id);
    fd.set("category", form.category);
    fd.set("name", form.name);
    fd.set("manufacturer", form.manufacturer);
    fd.set("defaultPrice", form.defaultPrice);
    fd.set("defaultIntervalDays", form.defaultIntervalDays);
    if (form.defaultVisitType) fd.set("defaultVisitType", form.defaultVisitType);
    fd.set("trackStock", form.trackStock ? "true" : "false");
    fd.set("stockDoses", form.stockDoses);
    fd.set("active", form.active ? "true" : "false");
    const result = await upsertCatalogItemAction(fd);
    setLoading(false);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    setMessage(form.id ? "Zapisano zmiany." : "Dodano pozycję do katalogu.");
    cancelEdit();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Usunąć pozycję z katalogu? (jeśli była użyta w szczepieniach — zostanie dezaktywowana)")) return;
    setLoading(true);
    const result = await deleteCatalogItemAction(id);
    setLoading(false);
    setMessage(result.ok ? "Usunięto / dezaktywowano." : result.error);
    router.refresh();
  }

  async function handleSeed() {
    setLoading(true);
    const result = await seedDefaultCatalogAction();
    setLoading(false);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    setMessage(`Dodano ${result.added} szablonów (szczepienia + zabiegi).`);
    router.refresh();
  }

  const grouped = VET_CATALOG_CATEGORIES.map((cat) => ({
    ...cat,
    rows: items.filter((i) => i.category === cat.value && i.active),
  }));

  const lowStockItems = items.filter((i) => i.active && isLowStock(i));

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 px-4 py-3 text-[13px] text-wet-navy-muted">
        <strong className="text-wet-navy">ETAP 1–3</strong> — katalog bez ERP. Serie partii przy szczepieniu (ETAP 2).
        Opcjonalny licznik dawek „pozostało X” (ETAP 3) — bez dostaw, FIFO ani magazynu.
      </div>

      {lowStockItems.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
          <strong>Niski stan:</strong>{" "}
          {lowStockItems.map((i) => `${i.name} (${i.stockDoses} dawek)`).join(" · ")}
        </div>
      )}

      <WetUrplImportPanel onImported={() => router.refresh()} />

      {message && (
        <p className="rounded-lg bg-wet-teal-50 px-3 py-2 text-[14px] text-wet-teal-900">{message}</p>
      )}

      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-wet-teal-200 p-6 text-center">
          <p className="text-[15px] text-wet-navy">Katalog jest pusty.</p>
          <button
            type="button"
            disabled={loading}
            onClick={handleSeed}
            className="mt-4 wet-btn-primary disabled:opacity-60"
          >
            Dodaj gotowe szablony (Nobivac, kastracja…)
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-wet-teal-200 bg-white p-4 space-y-3">
        <h2 className="font-semibold text-wet-navy">{editing ? "Edytuj pozycję" : "Nowa pozycja"}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-[13px] font-medium">
            Kategoria
            <select className="mt-1 wet-input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {VET_CATALOG_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </label>
          <label className="block text-[13px] font-medium">
            Nazwa *
            <input className="mt-1 wet-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="np. Nobivac DHPPi" />
          </label>
          <label className="block text-[13px] font-medium">
            Producent
            <input className="mt-1 wet-input" value={form.manufacturer} onChange={(e) => setForm((f) => ({ ...f, manufacturer: e.target.value }))} placeholder="np. MSD" />
          </label>
          <label className="block text-[13px] font-medium">
            Cena orientacyjna (PLN)
            <input className="mt-1 wet-input" value={form.defaultPrice} onChange={(e) => setForm((f) => ({ ...f, defaultPrice: e.target.value }))} placeholder="np. 150,00" />
          </label>
          <label className="block text-[13px] font-medium">
            Przypomnienie co (dni) — szczepienia
            <input type="number" min={1} className="mt-1 wet-input" value={form.defaultIntervalDays} onChange={(e) => setForm((f) => ({ ...f, defaultIntervalDays: e.target.value }))} />
          </label>
          <label className="block text-[13px] font-medium">
            Typ wizyty (auto)
            <select className="mt-1 wet-input" value={form.defaultVisitType} onChange={(e) => setForm((f) => ({ ...f, defaultVisitType: e.target.value }))}>
              <option value="">— z kategorii —</option>
              {VET_VISIT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-[13px] sm:col-span-2">
            <input
              type="checkbox"
              checked={form.trackStock}
              onChange={(e) => setForm((f) => ({ ...f, trackStock: e.target.checked }))}
            />
            Śledź liczbę dawek (ETAP 3 — minimalny stock)
          </label>
          {form.trackStock && (
            <label className="block text-[13px] font-medium">
              Pozostało dawek
              <input
                type="number"
                min={0}
                className="mt-1 wet-input"
                value={form.stockDoses}
                onChange={(e) => setForm((f) => ({ ...f, stockDoses: e.target.value }))}
                placeholder="np. 10"
              />
            </label>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={loading} className="wet-btn-primary disabled:opacity-60">
            {loading ? "Zapisuję…" : editing ? "Zapisz" : "Dodaj do katalogu"}
          </button>
          {editing && (
            <button type="button" onClick={cancelEdit} className="rounded-lg border px-4 py-2 text-[14px]">
              Anuluj
            </button>
          )}
        </div>
      </form>

      {grouped.map((group) =>
        group.rows.length > 0 ? (
          <section key={group.value}>
            <h2 className="text-lg font-semibold text-wet-navy">{group.label}</h2>
            <ul className="mt-3 space-y-2">
              {group.rows.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-wet-navy">{item.name}</p>
                    <p className="text-[13px] text-wet-navy-muted">
                      {item.manufacturer ? `${item.manufacturer} · ` : ""}
                      {formatCatalogPrice(item.defaultPrice)}
                      {item.category === "szczepienie" ? ` · przypomnienie co ${item.defaultIntervalDays} dni` : ""}
                      {item.permitNumber ? ` · URPL ${item.permitNumber}` : ""}
                      {item.trackStock && item.stockDoses != null ? ` · ${item.stockDoses} dawek` : ""}
                    </p>
                    {isLowStock(item) && (
                      <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                        Niski stan
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => startEdit(item)} className="text-[13px] text-wet-teal hover:underline">
                      Edytuj
                    </button>
                    <button type="button" onClick={() => handleDelete(item.id)} className="text-[13px] text-red-600 hover:underline">
                      Usuń
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null
      )}

      <p className="text-[13px] text-wet-navy-muted">
        Pełny magazyn ERP (stany, dostawy, FIFO) — świadomie <strong>nie</strong> w tym produkcie.{" "}
        <Link href="/wet/panel/szczepienia" className="text-wet-teal hover:underline">
          Przejdź do szczepień →
        </Link>
      </p>
    </div>
  );
}
