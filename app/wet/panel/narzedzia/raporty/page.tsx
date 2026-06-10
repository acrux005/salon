"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";

type PetOption = { id: string; name: string; ownerName: string };
type HerdOption = { id: string; name: string; species: string };

export default function WetNarzedziaRaportyPage() {
  const [pets, setPets] = useState<PetOption[]>([]);
  const [herds, setHerds] = useState<HerdOption[]>([]);
  const [petId, setPetId] = useState("");
  const [herdId, setHerdId] = useState("");

  useEffect(() => {
    fetch("/api/wet/panel/animals")
      .then((r) => r.json())
      .then((d) =>
        setPets(
          (d.pets ?? []).map((p: { id: string; name: string; owner: { name: string } }) => ({
            id: p.id,
            name: p.name,
            ownerName: p.owner.name,
          }))
        )
      );
    fetch("/api/wet/panel/herds")
      .then((r) => r.json())
      .then((d) => setHerds(d.herds ?? []));
  }, []);

  return (
    <>
      <WetPanelPageHeader
        title="Raporty medyczne"
        description="Historia szczepień, raport stada i wizyty — do druku lub kontroli weterynaryjnej."
      />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <Link href="/wet/panel/narzedzia" className="text-[14px] font-medium text-wet-teal hover:underline">
            ← Narzędzia
          </Link>

          <section className="rounded-xl border border-wet-teal-200 bg-white p-5">
            <h2 className="font-semibold text-wet-navy">Historia szczepień zwierzęcia</h2>
            <p className="mt-1 text-[13px] text-wet-navy-muted">
              Data, preparat, seria, lekarz — PDF przez druk przeglądarki.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <select className="wet-input max-w-xs flex-1" value={petId} onChange={(e) => setPetId(e.target.value)}>
                <option value="">Wybierz zwierzę…</option>
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.ownerName}
                  </option>
                ))}
              </select>
              {petId && (
                <Link
                  href={`/wet/panel/narzedzia/raporty/szczepienia-zwierze/${petId}`}
                  target="_blank"
                  className="wet-btn-primary text-[13px]"
                >
                  Otwórz raport / druk
                </Link>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-wet-teal-200 bg-white p-5">
            <h2 className="font-semibold text-wet-navy">Raport szczepień stada</h2>
            <p className="mt-1 text-[13px] text-wet-navy-muted">
              Ile zaszczepionych, zaległe terminy, brak szczepień.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <select className="wet-input max-w-xs flex-1" value={herdId} onChange={(e) => setHerdId(e.target.value)}>
                <option value="">Wybierz stado…</option>
                {herds.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.species})
                  </option>
                ))}
              </select>
              {herdId && (
                <Link
                  href={`/wet/panel/narzedzia/raporty/stado/${herdId}`}
                  target="_blank"
                  className="wet-btn-primary text-[13px]"
                >
                  Otwórz raport / druk
                </Link>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-wet-teal-200 bg-white p-5">
            <h2 className="font-semibold text-wet-navy">Historia wizyt</h2>
            <p className="mt-1 text-[13px] text-wet-navy-muted">
              Lista wizyt w wybranym okresie — dla kontroli lub właściciela.
            </p>
            <Link href="/wet/panel/narzedzia/raporty/wizyty" className="mt-4 inline-block wet-btn-primary text-[13px]">
              Generuj raport wizyt →
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
