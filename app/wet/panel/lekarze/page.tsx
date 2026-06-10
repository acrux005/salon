"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { addVetDoctorAction } from "@/app/actions/vet";

type Doctor = { id: string; name: string; phone: string | null };

export default function WetPanelDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/wet/panel/doctors")
      .then((r) => r.json())
      .then((d) => setDoctors(d.doctors ?? []))
      .catch(() => {});
  }, []);

  async function addDoctor(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await addVetDoctorAction(name);
    setLoading(false);
    if (result.ok) {
      setName("");
      setMsg("Dodano lekarza.");
      const r = await fetch("/api/wet/panel/doctors");
      const d = await r.json();
      setDoctors(d.doctors ?? []);
    } else setMsg(result.error);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/wet/panel" className="text-[14px] font-medium text-wet-teal hover:underline">
        ← Panel
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-wet-navy">Lekarze</h1>
      <ul className="mt-6 space-y-2">
        {doctors.map((d) => (
          <li key={d.id} className="rounded-lg border border-wet-teal-100 bg-white px-4 py-3">
            {d.name}
            {d.phone && <span className="ml-2 text-[14px] text-wet-navy-muted">{d.phone}</span>}
          </li>
        ))}
      </ul>
      <form onSubmit={addDoctor} className="mt-8 space-y-3">
        {msg && <p className="text-[14px] text-wet-teal-800">{msg}</p>}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Imię i nazwisko lekarza"
          className="wet-input"
          required
        />
        <button type="submit" disabled={loading} className="wet-btn-primary disabled:opacity-60">
          Dodaj lekarza
        </button>
      </form>
    </main>
  );
}
