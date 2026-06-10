"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";

type PetRow = { id: string; name: string; species: string };
type OwnerRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  smsConsent: boolean;
  pets: PetRow[];
};

export default function WetKlienciListaPage() {
  const [owners, setOwners] = useState<OwnerRow[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/wet/panel/patients")
      .then((r) => r.json())
      .then((d) => setOwners(d.owners ?? []));
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return owners;
    return owners.filter(
      (o) =>
        o.name.toLowerCase().includes(needle) ||
        o.phone.includes(needle) ||
        (o.email?.toLowerCase().includes(needle) ?? false) ||
        o.pets.some((p) => p.name.toLowerCase().includes(needle))
    );
  }, [owners, q]);

  return (
    <>
      <WetPanelPageHeader
        title="Lista klientów"
        description={`${owners.length} klientów w bazie przychodni.`}
      />
      <div className="px-4 py-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            placeholder="Szukaj po imieniu, telefonie, zwierzęciu…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="wet-input max-w-md"
          />
          <Link href="/wet/panel/klienci/nowy" className="wet-btn-primary shrink-0 text-center">
            + Nowy klient
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-wet-teal-200 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-wet-teal-100 bg-wet-teal-50/80 text-[12px] font-semibold uppercase tracking-wide text-wet-navy-muted">
              <tr>
                <th className="px-4 py-3">Klient</th>
                <th className="hidden px-4 py-3 sm:table-cell">Kontakt</th>
                <th className="px-4 py-3">Zwierzęta</th>
                <th className="hidden px-4 py-3 md:table-cell">SMS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-wet-navy-muted">
                    Brak klientów.{" "}
                    <Link href="/wet/panel/klienci/nowy" className="font-medium text-wet-teal hover:underline">
                      Dodaj pierwszego
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-b border-wet-teal-50 last:border-0 hover:bg-wet-mint/40">
                    <td className="px-4 py-3 font-medium text-wet-navy">
                      <Link href={`/wet/panel/klienci/${o.id}`} className="hover:text-wet-teal hover:underline">
                        {o.name}
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <p>{o.phone}</p>
                      {o.email && <p className="text-[12px] text-wet-navy-muted">{o.email}</p>}
                    </td>
                    <td className="px-4 py-3 text-wet-teal-800">
                      {o.pets.length === 0
                        ? "—"
                        : o.pets.map((p) => `${p.name} (${p.species})`).join(", ")}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      {o.smsConsent ? (
                        <span className="text-green-700">Tak</span>
                      ) : (
                        <span className="text-wet-navy-muted">Nie</span>
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
