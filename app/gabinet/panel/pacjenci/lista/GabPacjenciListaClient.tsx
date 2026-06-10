"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { restoreGabPatientAction } from "@/app/actions/gabinet";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import type { GabPatientRow } from "@/lib/gabinet/prismaGab";

export function GabPacjenciListaClient({
  patients,
  view,
}: {
  patients: GabPatientRow[];
  view: "active" | "archived";
}) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.phone.includes(needle) ||
        (p.email?.toLowerCase().includes(needle) ?? false)
    );
  }, [patients, q]);

  async function restore(id: string) {
    if (!confirm("Przywrócić pacjenta do kartoteki aktywnej?")) return;
    const res = await restoreGabPatientAction(id);
    if (res.ok) router.refresh();
    else alert(res.error);
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <GabLink
            href="/panel/pacjenci/lista"
            className={`rounded-lg px-4 py-2 text-[14px] font-medium ${view === "active" ? "bg-gab-sky text-white" : "border border-slate-200"}`}
          >
            Aktywni
          </GabLink>
          <GabLink
            href="/panel/pacjenci/lista?view=archived"
            className={`rounded-lg px-4 py-2 text-[14px] font-medium ${view === "archived" ? "bg-gab-sky text-white" : "border border-slate-200"}`}
          >
            Archiwum
          </GabLink>
        </div>
        <input
          type="search"
          placeholder="Szukaj po imieniu, telefonie…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="gab-input max-w-xs"
        />
        {view === "active" && (
          <GabLink href="/panel/pacjenci/nowy" className="gab-btn-primary">
            + Nowy pacjent
          </GabLink>
        )}
      </div>
      <div className="overflow-hidden rounded-xl border border-gab-sky/20 bg-white">
        <table className="w-full text-left text-[14px]">
          <thead className="border-b border-gab-sky/10 bg-sky-50/80 text-[12px] font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Pacjent</th>
              <th className="hidden px-4 py-3 sm:table-cell">Kontakt</th>
              <th className="hidden px-4 py-3 md:table-cell">SMS</th>
              {view === "archived" && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={view === "archived" ? 4 : 3} className="px-4 py-10 text-center text-slate-500">
                  {view === "archived" ? "Brak pacjentów w archiwum." : (
                    <>
                      Brak pacjentów.{" "}
                      <GabLink href="/panel/pacjenci/nowy" className="font-medium text-gab-sky hover:underline">
                        Dodaj pierwszego
                      </GabLink>
                    </>
                  )}
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-sky-50/40">
                  <td className="px-4 py-3 font-medium text-gab-navy">
                    <GabLink href={`/panel/pacjenci/${p.id}`} className="hover:text-gab-sky hover:underline">
                      {p.name}
                    </GabLink>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <p>{p.phone}</p>
                    {p.email && <p className="text-[12px] text-slate-500">{p.email}</p>}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {p.smsConsent ? (
                      <span className="text-green-700">Tak</span>
                    ) : (
                      <span className="text-slate-400">Nie</span>
                    )}
                  </td>
                  {view === "archived" && (
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => restore(p.id)} className="text-[13px] text-gab-sky hover:underline">
                        Przywróć
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
