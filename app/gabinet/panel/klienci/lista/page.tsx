"use client";

import { useEffect, useMemo, useState } from "react";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

type ClientRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  smsConsent?: boolean;
};

export default function GabKlienciListaPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/gabinet/panel/clients")
      .then((r) => r.json())
      .then((d) => setClients(d.clients ?? []));
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.phone.includes(needle) ||
        (c.email?.toLowerCase().includes(needle) ?? false)
    );
  }, [clients, q]);

  return (
    <>
      <GabPanelPageHeader
        title="Lista klientów"
        description={`${clients.length} klientów w CRM gabinetu.`}
      />
      <div className="px-4 py-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            placeholder="Szukaj po imieniu lub telefonie…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="gab-input max-w-md"
          />
          <GabLink href="/panel/klienci/nowy" className="gab-btn-primary shrink-0 text-center">
            + Nowy klient
          </GabLink>
        </div>
        <div className="overflow-hidden rounded-xl border border-gab-sky/20 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-gab-sky/10 bg-sky-50/80 text-[12px] font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Klient</th>
                <th className="hidden px-4 py-3 sm:table-cell">Kontakt</th>
                <th className="hidden px-4 py-3 md:table-cell">SMS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                    Brak klientów.{" "}
                    <GabLink href="/panel/klienci/nowy" className="font-medium text-gab-sky hover:underline">
                      Dodaj pierwszego
                    </GabLink>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-sky-50/40">
                    <td className="px-4 py-3 font-medium text-gab-navy">
                      <GabLink href={`/panel/klienci/${c.id}`} className="hover:text-gab-sky hover:underline">
                        {c.name}
                      </GabLink>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <p>{c.phone}</p>
                      {c.email && <p className="text-[12px] text-slate-500">{c.email}</p>}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      {c.smsConsent ? (
                        <span className="text-green-700">Tak</span>
                      ) : (
                        <span className="text-slate-400">Nie</span>
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
