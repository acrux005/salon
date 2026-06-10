"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";
import { WetPetAvatar } from "@/components/wet/WetPetAvatar";
import { speciesLabel } from "@/lib/vet/species";
import { petStatusBadgeClass, petStatusLabel } from "@/lib/vet/petStatus";

type PetRow = {
  id: string;
  name: string;
  species: string;
  photoUrl: string | null;
  breed: string | null;
  birthDate: string | null;
  chipNumber: string | null;
  status: string;
  owner: { id: string; name: string; phone: string };
  herd: { id: string; name: string } | null;
};

export default function WetZwierzetaListaPage() {
  const [pets, setPets] = useState<PetRow[]>([]);
  const [q, setQ] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  useEffect(() => {
    fetch("/api/wet/panel/animals")
      .then((r) => r.json())
      .then((d) => setPets(d.pets ?? []));
  }, []);

  const speciesOptions = useMemo(() => {
    const values = new Set(pets.map((p) => p.species));
    return Array.from(values).sort();
  }, [pets]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return pets.filter((p) => {
      if (speciesFilter && p.species !== speciesFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        p.name.toLowerCase().includes(needle) ||
        (p.chipNumber?.includes(needle) ?? false) ||
        (p.breed?.toLowerCase().includes(needle) ?? false) ||
        p.owner.name.toLowerCase().includes(needle) ||
        p.owner.phone.includes(needle) ||
        (p.herd?.name.toLowerCase().includes(needle) ?? false)
      );
    });
  }, [pets, q, speciesFilter, statusFilter]);

  return (
    <>
      <WetPanelPageHeader
        title="Lista zwierząt"
        description={`${pets.length} zwierząt zarejestrowanych w przychodni.`}
      />
      <div className="px-4 py-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              placeholder="Szukaj po imieniu, chipie, właścicielu…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="wet-input max-w-md"
            />
            <select
              className="wet-input max-w-[11rem]"
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
            >
              <option value="">Wszystkie gatunki</option>
              {speciesOptions.map((s) => (
                <option key={s} value={s}>
                  {speciesLabel(s)}
                </option>
              ))}
            </select>
            <select
              className="wet-input max-w-[11rem]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Wszystkie statusy</option>
              <option value="active">Aktywne</option>
              <option value="deceased">Zmarłe</option>
              <option value="transferred">Przeniesione</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
          <Link href="/wet/panel/zwierzeta/import" className="rounded-lg border border-slate-200 px-4 py-2.5 text-[14px] font-medium hover:bg-slate-50">
            Import CSV
          </Link>
          <Link href="/wet/panel/zwierzeta/nowe" className="wet-btn-primary shrink-0 text-center">
            + Nowe zwierzę
          </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-wet-teal-200 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-wet-teal-100 bg-wet-teal-50/80 text-[12px] font-semibold uppercase tracking-wide text-wet-navy-muted">
              <tr>
                <th className="px-4 py-3">Zwierzę</th>
                <th className="hidden px-4 py-3 sm:table-cell">Gatunek / rasa</th>
                <th className="px-4 py-3">Właściciel</th>
                <th className="hidden px-4 py-3 md:table-cell">Chip</th>
                <th className="hidden px-4 py-3 lg:table-cell">Stado</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-wet-navy-muted">
                    Brak zwierząt.{" "}
                    <Link href="/wet/panel/zwierzeta/nowe" className="font-medium text-wet-teal hover:underline">
                      Dodaj pierwsze
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-wet-teal-50 last:border-0 hover:bg-wet-mint/40">
                    <td className="px-4 py-3">
                      <Link
                        href={`/wet/panel/zwierzeta/${p.id}`}
                        className="flex items-center gap-3 text-wet-teal hover:underline"
                      >
                        <WetPetAvatar species={p.species} name={p.name} photoUrl={p.photoUrl} size="sm" />
                        <span className="font-medium text-wet-navy">{p.name}</span>
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <p>{speciesLabel(p.species)}</p>
                      {p.breed && <p className="text-[12px] text-wet-navy-muted">{p.breed}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p>{p.owner.name}</p>
                      <p className="text-[12px] text-wet-navy-muted">{p.owner.phone}</p>
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-[13px] md:table-cell">
                      {p.chipNumber || "—"}
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      {p.herd ? (
                        <Link href={`/wet/panel/zwierzeta/stada/${p.herd.id}`} className="text-wet-teal hover:underline">
                          {p.herd.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${petStatusBadgeClass(p.status)}`}>
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
