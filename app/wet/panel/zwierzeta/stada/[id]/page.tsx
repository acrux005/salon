"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { updateVetHerdAction } from "@/app/actions/vetAnimals";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";
import { speciesLabel } from "@/lib/vet/species";
import { WetHerdSpeciesSelect } from "@/components/wet/WetHerdSpeciesSelect";
import { petStatusBadgeClass, petStatusLabel } from "@/lib/vet/petStatus";

type HerdDetail = {
  id: string;
  name: string;
  species: string;
  location: string | null;
  headCount: number | null;
  notes: string | null;
  owner: { id: string; name: string; phone: string; email: string | null } | null;
  pets: {
    id: string;
    name: string;
    species: string;
    breed: string | null;
    chipNumber: string | null;
    status: string;
    ownerName: string;
  }[];
};

type OwnerOption = { id: string; name: string; phone: string };

export default function WetHerdDetailPage() {
  const router = useRouter();
  const params = useParams();
  const herdId = params.id as string;
  const [herd, setHerd] = useState<HerdDetail | null>(null);
  const [owners, setOwners] = useState<OwnerOption[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    species: "owca",
    ownerId: "",
    location: "",
    headCount: "",
    notes: "",
  });

  useEffect(() => {
    fetch(`/api/wet/panel/herds/${herdId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.herd) return;
        setHerd(d.herd);
        setForm({
          name: d.herd.name,
          species: d.herd.species,
          ownerId: d.herd.owner?.id ?? "",
          location: d.herd.location ?? "",
          headCount: d.herd.headCount?.toString() ?? "",
          notes: d.herd.notes ?? "",
        });
      });
    fetch("/api/wet/panel/patients")
      .then((r) => r.json())
      .then((d) =>
        setOwners(
          (d.owners ?? []).map((o: { id: string; name: string; phone: string }) => ({
            id: o.id,
            name: o.name,
            phone: o.phone,
          }))
        )
      );
  }, [herdId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!herd) return;
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.set("id", herd.id);
    fd.set("name", form.name);
    fd.set("species", form.species);
    if (form.ownerId) fd.set("ownerId", form.ownerId);
    fd.set("location", form.location);
    fd.set("headCount", form.headCount);
    fd.set("notes", form.notes);
    const result = await updateVetHerdAction(fd);
    setLoading(false);
    if (result.ok) {
      setEditing(false);
      router.refresh();
      const res = await fetch(`/api/wet/panel/herds/${herdId}`);
      const data = await res.json();
      if (data?.herd) setHerd(data.herd);
      return;
    }
    setError(result.error);
  }

  if (!herd) {
    return (
      <>
        <WetPanelPageHeader title="Stado" description="Ładowanie…" />
        <div className="px-4 py-10 text-center text-wet-navy-muted lg:px-8">Ładowanie danych stada…</div>
      </>
    );
  }

  return (
    <>
      <WetPanelPageHeader
        title={herd.name}
        description={`${speciesLabel(herd.species, "herd")} · ${herd.pets.length} zwierząt w kartotece`}
      />
      <div className="px-4 py-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/wet/panel/zwierzeta/stada/lista"
            className="text-[13px] font-medium text-wet-teal hover:underline"
          >
            ← Lista stad
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href={`/wet/panel/zwierzeta/nowe?herdId=${herdId}`}
            className="text-[13px] font-medium text-wet-teal hover:underline"
          >
            + Dodaj zwierzę do stada
          </Link>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="ml-auto rounded-lg border border-wet-teal-200 px-4 py-2 text-[13px] font-medium text-wet-teal-800 hover:bg-wet-teal-50"
          >
            {editing ? "Anuluj edycję" : "Edytuj stado"}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="mb-8 max-w-xl space-y-4 rounded-xl border border-wet-teal-200 bg-white p-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700" role="alert">
                {error}
              </p>
            )}
            <div>
              <label className="block text-[14px] font-medium">Nazwa stada</label>
              <input
                className="wet-input mt-1"
                required
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
                  value={form.headCount}
                  onChange={(e) => setForm((p) => ({ ...p, headCount: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-[14px] font-medium">Właściciel</label>
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
            </div>
            <div>
              <label className="block text-[14px] font-medium">Lokalizacja</label>
              <input
                className="wet-input mt-1"
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
            <button type="submit" disabled={loading} className="wet-btn-primary disabled:opacity-60">
              {loading ? "Zapisuję…" : "Zapisz stado"}
            </button>
          </form>
        ) : (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-wet-teal-100 bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase text-wet-navy-muted">Właściciel</p>
              <p className="mt-1 text-[14px]">{herd.owner?.name ?? "—"}</p>
              {herd.owner?.phone && (
                <p className="text-[12px] text-wet-navy-muted">{herd.owner.phone}</p>
              )}
            </div>
            <div className="rounded-xl border border-wet-teal-100 bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase text-wet-navy-muted">Lokalizacja</p>
              <p className="mt-1 text-[14px]">{herd.location || "—"}</p>
            </div>
            <div className="rounded-xl border border-wet-teal-100 bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase text-wet-navy-muted">Sztuk (deklarowane)</p>
              <p className="mt-1 text-[14px]">{herd.headCount ?? "—"}</p>
            </div>
            <div className="rounded-xl border border-wet-teal-100 bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase text-wet-navy-muted">W kartotece</p>
              <p className="mt-1 text-[14px]">{herd.pets.length}</p>
            </div>
          </div>
        )}

        {herd.notes && !editing && (
          <div className="mb-8 rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 px-4 py-3 text-[14px]">
            <p className="font-medium text-wet-teal-800">Uwagi</p>
            <p className="mt-1 whitespace-pre-wrap">{herd.notes}</p>
          </div>
        )}

        <h3 className="mb-3 text-lg font-semibold text-wet-navy">Zwierzęta w stadzie</h3>
        <div className="overflow-hidden rounded-xl border border-wet-teal-200 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-wet-teal-100 bg-wet-teal-50/80 text-[12px] font-semibold uppercase tracking-wide text-wet-navy-muted">
              <tr>
                <th className="px-4 py-3">Zwierzę</th>
                <th className="hidden px-4 py-3 sm:table-cell">Gatunek</th>
                <th className="hidden px-4 py-3 md:table-cell">Chip</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {herd.pets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-wet-navy-muted">
                    Brak zwierząt przypisanych do stada.{" "}
                    <Link
                      href={`/wet/panel/zwierzeta/nowe?herdId=${herdId}`}
                      className="font-medium text-wet-teal hover:underline"
                    >
                      Dodaj pierwsze
                    </Link>
                  </td>
                </tr>
              ) : (
                herd.pets.map((p) => (
                  <tr key={p.id} className="border-b border-wet-teal-50 last:border-0 hover:bg-wet-mint/40">
                    <td className="px-4 py-3">
                      <Link href={`/wet/panel/zwierzeta/${p.id}`} className="font-medium text-wet-teal hover:underline">
                        {p.name}
                      </Link>
                      <p className="text-[12px] text-wet-navy-muted">{p.ownerName}</p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">{speciesLabel(p.species)}</td>
                    <td className="hidden px-4 py-3 font-mono text-[13px] md:table-cell">{p.chipNumber || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${petStatusBadgeClass(p.status)}`}
                      >
                        {petStatusLabel(p.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
