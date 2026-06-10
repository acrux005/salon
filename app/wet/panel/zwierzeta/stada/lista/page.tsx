"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";
import { speciesLabel } from "@/lib/vet/species";

type HerdRow = {
  id: string;
  name: string;
  species: string;
  location: string | null;
  headCount: number | null;
  registeredPets: number;
  owner: { id: string; name: string; phone: string } | null;
};

export default function WetStadaListaPage() {
  const [herds, setHerds] = useState<HerdRow[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/wet/panel/herds")
      .then((r) => r.json())
      .then((d) => setHerds(d.herds ?? []));
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return herds;
    return herds.filter(
      (h) =>
        h.name.toLowerCase().includes(needle) ||
        (h.location?.toLowerCase().includes(needle) ?? false) ||
        (h.owner?.name.toLowerCase().includes(needle) ?? false) ||
        speciesLabel(h.species, "herd").toLowerCase().includes(needle)
    );
  }, [herds, q]);

  return (
    <>
      <WetPanelPageHeader
        title="Lista stad"
        description={`${herds.length} stad zarejestrowanych — owce, kozy, bydło i inne hodowle stadne.`}
      />
      <div className="px-4 py-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            placeholder="Szukaj po nazwie, lokalizacji, właścicielu…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="wet-input max-w-md"
          />
          <Link href="/wet/panel/zwierzeta/stada/nowe" className="wet-btn-primary shrink-0 text-center">
            + Nowe stado
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-wet-teal-200 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-wet-teal-100 bg-wet-teal-50/80 text-[12px] font-semibold uppercase tracking-wide text-wet-navy-muted">
              <tr>
                <th className="px-4 py-3">Stado</th>
                <th className="hidden px-4 py-3 sm:table-cell">Gatunek</th>
                <th className="px-4 py-3">Właściciel</th>
                <th className="hidden px-4 py-3 md:table-cell">Lokalizacja</th>
                <th className="hidden px-4 py-3 lg:table-cell">Sztuk</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-wet-navy-muted">
                    Brak stad.{" "}
                    <Link
                      href="/wet/panel/zwierzeta/stada/nowe"
                      className="font-medium text-wet-teal hover:underline"
                    >
                      Dodaj pierwsze
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((h) => (
                  <tr key={h.id} className="border-b border-wet-teal-50 last:border-0 hover:bg-wet-mint/40">
                    <td className="px-4 py-3 font-medium text-wet-navy">
                      <Link href={`/wet/panel/zwierzeta/stada/${h.id}`} className="text-wet-teal hover:underline">
                        {h.name}
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">{speciesLabel(h.species, "herd")}</td>
                    <td className="px-4 py-3">
                      {h.owner ? (
                        <>
                          <p>{h.owner.name}</p>
                          <p className="text-[12px] text-wet-navy-muted">{h.owner.phone}</p>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">{h.location || "—"}</td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      {h.headCount ?? h.registeredPets > 0 ? (
                        <>
                          {h.headCount ?? "?"}
                          {h.registeredPets > 0 && (
                            <span className="text-[12px] text-wet-navy-muted">
                              {" "}
                              ({h.registeredPets} w kartotece)
                            </span>
                          )}
                        </>
                      ) : (
                        "—"
                      )}
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
