"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { changeVetOwnerClinicAction } from "@/app/actions/vetOwnerAuth";

type ClinicOption = { slug: string; name: string; city: string };

export default function WetOwnerSettingsPage() {
  const router = useRouter();
  const [clinics, setClinics] = useState<ClinicOption[]>([]);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/wet/clinic?list=published")
      .then((r) => r.json())
      .then((d) => setClinics(d.clinics ?? []));
  }, []);

  async function handleChangeClinic(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const result = await changeVetOwnerClinicAction(slug);
    setLoading(false);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    setMessage("Przychodnia została zmieniona. Historia zwierząt pozostaje na koncie.");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <Link href="/wet/klient/panel" className="text-[14px] font-medium text-wet-teal hover:underline">
        ← Panel
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-wet-navy">Ustawienia konta</h1>

      <form onSubmit={handleChangeClinic} className="mt-8 space-y-4 rounded-xl border border-wet-teal-200 bg-white p-4">
        <h2 className="text-[15px] font-semibold text-wet-navy">Aktywna przychodnia</h2>
        <p className="text-[13px] text-wet-navy-muted">
          Możesz zmienić przychodnię w dowolnym momencie. Wizyty i szczepienia pozostają przy zwierzęciu.
        </p>
        <select className="wet-input" value={slug} onChange={(e) => setSlug(e.target.value)} required>
          <option value="">Wybierz…</option>
          {clinics.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name} ({c.city})
            </option>
          ))}
        </select>
        {message && <p className="text-[14px] text-wet-teal-800">{message}</p>}
        <button type="submit" disabled={loading} className="wet-btn-primary disabled:opacity-60">
          {loading ? "Zapisuję…" : "Zmień przychodnię"}
        </button>
      </form>
    </main>
  );
}
