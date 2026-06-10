"use client";

import { useEffect, useState } from "react";
import { deleteGabCatalogItemAction, saveGabCatalogItemAction } from "@/app/actions/gabinetSettings";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";

type Item = { id: string; name: string; category: string; pricePln: number; durationMinutes: number; active: boolean };

const emptyForm = { name: "", category: "general", pricePln: "0", durationMinutes: "30", active: true };

export default function GabKatalogPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  function loadItems() {
    fetch("/api/gabinet/panel/catalog")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []));
  }

  useEffect(() => {
    loadItems();
  }, []);

  function startEdit(item: Item) {
    setEditId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      pricePln: String(item.pricePln),
      durationMinutes: String(item.durationMinutes),
      active: item.active,
    });
    setMsg("");
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
  }

  async function saveItem(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const fd = new FormData();
    if (editId) fd.set("id", editId);
    Object.entries(form).forEach(([k, v]) => fd.set(k, typeof v === "boolean" ? (v ? "true" : "false") : String(v)));
    fd.set("active", form.active ? "true" : "false");
    const res = await saveGabCatalogItemAction(fd);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    cancelEdit();
    loadItems();
  }

  async function toggleActive(item: Item) {
    const fd = new FormData();
    fd.set("id", item.id);
    fd.set("name", item.name);
    fd.set("category", item.category);
    fd.set("pricePln", String(item.pricePln));
    fd.set("durationMinutes", String(item.durationMinutes));
    fd.set("active", item.active ? "false" : "true");
    await saveGabCatalogItemAction(fd);
    loadItems();
  }

  async function remove(id: string) {
    if (!confirm("Usunąć pozycję?")) return;
    await deleteGabCatalogItemAction(id);
    if (editId === id) cancelEdit();
    loadItems();
  }

  return (
    <>
      <GabPanelPageHeader title="Katalog zabiegów" description="Cennik i czasy trwania — do rezerwacji i planów." />
      <div className="px-4 py-6 lg:px-8">
        <GabLink href="/panel/ustawienia" className="text-[14px] text-gab-sky hover:underline">
          ← Ustawienia
        </GabLink>
        <ul className="mt-6 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gab-sky/15 bg-white px-4 py-3">
              <div>
                <p className="font-medium text-gab-navy">{item.name}</p>
                <p className="text-[13px] text-slate-500">
                  {item.pricePln.toFixed(2)} PLN · {item.durationMinutes} min · {item.category}
                  {!item.active && " · nieaktywny"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[12px]">
                <button type="button" onClick={() => toggleActive(item)} className="text-gab-sky hover:underline">
                  {item.active ? "Dezaktywuj" : "Aktywuj"}
                </button>
                <button type="button" onClick={() => startEdit(item)} className="text-gab-sky hover:underline">
                  Edytuj
                </button>
                <button type="button" onClick={() => remove(item.id)} className="text-red-600 hover:underline">
                  Usuń
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 && <li className="text-[14px] text-slate-500">Brak pozycji w katalogu.</li>}
        </ul>
        <form onSubmit={saveItem} className="mt-8 max-w-md space-y-3 rounded-xl border border-gab-sky/20 bg-white p-4">
          <h2 className="font-semibold text-gab-navy">{editId ? "Edycja pozycji" : "Nowa pozycja"}</h2>
          {msg && <p className="text-[14px] text-red-700">{msg}</p>}
          <input className="gab-input" required placeholder="Nazwa zabiegu" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <input className="gab-input" placeholder="Kategoria" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" min={0} step={0.01} className="gab-input" placeholder="Cena PLN" value={form.pricePln} onChange={(e) => setForm((f) => ({ ...f, pricePln: e.target.value }))} />
            <input type="number" min={5} className="gab-input" placeholder="Minuty" value={form.durationMinutes} onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))} />
          </div>
          <label className="flex items-center gap-2 text-[14px]">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
            Aktywna w katalogu
          </label>
          <div className="flex gap-2">
            <button type="submit" className="gab-btn-primary flex-1">
              {editId ? "Zapisz zmiany" : "Dodaj"}
            </button>
            {editId && (
              <button type="button" onClick={cancelEdit} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px]">
                Anuluj
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
