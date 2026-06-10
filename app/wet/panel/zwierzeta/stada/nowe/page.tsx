"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addVetHerdAction } from "@/app/actions/vetAnimals";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";
import { WetHerdSpeciesSelect } from "@/components/wet/WetHerdSpeciesSelect";

type OwnerOption = { id: string; name: string; phone: string };

export default function WetStadaNowePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [owners, setOwners] = useState<OwnerOption[]>([]);
  const [form, setForm] = useState({
    name: "",
    species: "owca",
    ownerId: "",
    location: "",
    headCount: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/wet/panel/patients")
      .then((r) => r.json())
      .then((d) => {
        setOwners(
          (d.owners ?? []).map((o: { id: string; name: string; phone: string }) => ({
            id: o.id,
            name: o.name,
            phone: o.phone,
          }))
        );
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.set("name", form.name);
    fd.set("species", form.species);
    if (form.ownerId) fd.set("ownerId", form.ownerId);
    fd.set("location", form.location);
    fd.set("headCount", form.headCount);
    fd.set("notes", form.notes);
    const result = await addVetHerdAction(fd);
    setLoading(false);
    if (result.ok) {
      router.push("/wet/panel/zwierzeta/stada/lista");
      router.refresh();
      return;
    }
    setError(result.error);
  }

  return (
    <>
      <WetPanelPageHeader
        title="Nowe stado"
        description="Grupuj zwierzęta stadne (owce, kozy, bydło) — do wizyt terenowych i szczepień masowych."
      />
      <div className="px-4 py-6 lg:px-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700" role="alert">
              {error}
            </p>
          )}

          <div>
            <label className="block text-[14px] font-medium">Nazwa stada *</label>
            <input
              className="wet-input mt-1"
              required
              placeholder="np. Stado owiec — Pastwisko Północ"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[14px] font-medium">Gatunek</label>
              <WetHerdSpeciesSelect
                value={form.species}
                onChange={(species) => setForm((p) => ({ ...p, species }))}
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium">Liczba sztuk</label>
              <input
                type="number"
                min={1}
                className="wet-input mt-1"
                placeholder="np. 120"
                value={form.headCount}
                onChange={(e) => setForm((p) => ({ ...p, headCount: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-medium">Właściciel (opcjonalnie)</label>
            <select
              className="wet-input mt-1"
              value={form.ownerId}
              onChange={(e) => setForm((p) => ({ ...p, ownerId: e.target.value }))}
            >
              <option value="">Bez przypisania</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.phone})
                </option>
              ))}
            </select>
            {owners.length === 0 && (
              <p className="mt-1 text-[12px] text-wet-navy-muted">
                <Link href="/wet/panel/klienci/nowy" className="text-wet-teal hover:underline">
                  Dodaj klienta
                </Link>{" "}
                aby przypisać właściciela.
              </p>
            )}
          </div>

          <div>
            <label className="block text-[14px] font-medium">Lokalizacja / pastwisko</label>
            <input
              className="wet-input mt-1"
              placeholder="np. wieś, numer działki, opis dojazdu"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium">Uwagi</label>
            <textarea
              className="wet-input mt-1"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" disabled={loading} className="wet-btn-primary disabled:opacity-60">
              {loading ? "Zapisuję…" : "Zapisz stado"}
            </button>
            <Link
              href="/wet/panel/zwierzeta/stada/lista"
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-[14px] font-medium hover:bg-slate-50"
            >
              Anuluj
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
