"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { updateVetClinicProfileAction } from "@/app/actions/vet";
import { WetProductRoadmap } from "@/components/wet/WetProductRoadmap";

export default function WetPanelClinicEditPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const slug = (session?.user as { vetClinicSlug?: string })?.vetClinicSlug;
    if (!slug) return;
    fetch(`/api/wet/clinic?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.clinic) {
          setName(data.clinic.name ?? "");
          setDescription(data.clinic.description ?? "");
          setAddress(data.clinic.address ?? "");
          setPhone(data.clinic.phone ?? "");
          setEmail(data.clinic.email ?? "");
          setIsPublished(!!data.clinic.isPublished);
        }
      })
      .catch(() => {});
  }, [session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const fd = new FormData();
    fd.set("name", name);
    fd.set("description", description);
    fd.set("address", address);
    fd.set("phone", phone);
    fd.set("email", email);
    fd.set("isPublished", isPublished ? "true" : "false");
    const result = await updateVetClinicProfileAction(fd);
    setLoading(false);
    setMessage(result.ok ? "Zapisano." : result.error);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/wet/panel/ustawienia" className="text-[14px] font-medium text-wet-teal hover:underline">
        ← Ustawienia
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-wet-navy">Branding przychodni</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {message && <p className="rounded-lg bg-wet-teal-50 px-3 py-2 text-[14px]">{message}</p>}
        <div>
          <label className="block text-[14px] font-medium">Nazwa</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="wet-input" required />
        </div>
        <div>
          <label className="block text-[14px] font-medium">Opis</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="wet-input"
          />
        </div>
        <div>
          <label className="block text-[14px] font-medium">Adres</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="wet-input" />
        </div>
        <div>
          <label className="block text-[14px] font-medium">Telefon</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="wet-input" />
        </div>
        <div>
          <label className="block text-[14px] font-medium">E-mail kontaktowy</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="wet-input" />
        </div>
        <label className="flex items-center gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-wet-teal"
          />
          Profil widoczny publicznie (lista przychodni)
        </label>
        <button type="submit" disabled={loading} className="wet-btn-primary disabled:opacity-60">
          {loading ? "Zapisuję…" : "Zapisz"}
        </button>
      </form>
      <WetProductRoadmap />
    </main>
  );
}
