"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { saveGabClinicExtendedProfileAction, uploadGabClinicLogoAction } from "@/app/actions/gabinetSettings";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

export default function GabPanelBrandingPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nip, setNip] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const slug = (session?.user as { gabClinicSlug?: string })?.gabClinicSlug;
    if (!slug) return;
    fetch(`/api/gabinet/clinic?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.clinic) {
          setName(data.clinic.name ?? "");
          setDescription(data.clinic.description ?? "");
          setAddress(data.clinic.address ?? "");
          setCity(data.clinic.city ?? "");
          setPhone(data.clinic.phone ?? "");
          setEmail(data.clinic.email ?? "");
          setNip(data.clinic.nip ?? "");
          setLogoUrl(data.clinic.logoUrl ?? "");
          setIsPublished(!!data.clinic.isPublished);
        }
      })
      .catch(() => {});
  }, [session]);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setMessage("");
    const fd = new FormData();
    fd.set("logo", file);
    const result = await uploadGabClinicLogoAction(fd);
    setLogoUploading(false);
    if (result.ok && result.logoUrl) {
      setLogoUrl(result.logoUrl);
      setMessage("Logo przesłane.");
    } else {
      setMessage(result.ok ? "Logo przesłane." : result.error);
    }
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const fd = new FormData();
    fd.set("name", name);
    fd.set("description", description);
    fd.set("address", address);
    fd.set("city", city);
    fd.set("phone", phone);
    fd.set("email", email);
    fd.set("nip", nip);
    fd.set("logoUrl", logoUrl);
    fd.set("isPublished", isPublished ? "true" : "false");
    const result = await saveGabClinicExtendedProfileAction(fd);
    setLoading(false);
    setMessage(result.ok ? "Zapisano." : result.error);
  }

  const slug = (session?.user as { gabClinicSlug?: string })?.gabClinicSlug;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <GabLink href="/panel/ustawienia" className="text-[14px] font-medium text-gab-sky hover:underline">
        ← Ustawienia
      </GabLink>
      <h1 className="mt-4 text-2xl font-bold text-gab-navy">Branding gabinetu</h1>
      {slug && (
        <p className="mt-2 text-[14px] text-slate-600">
          Profil publiczny:{" "}
          <GabLink href={`/gabinet/${slug}`} className="font-medium text-gab-sky hover:underline">
            /gabinet/{slug}
          </GabLink>
        </p>
      )}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {message && <p className="rounded-lg bg-sky-50 px-3 py-2 text-[14px]">{message}</p>}
        <div>
          <label className="block text-[14px] font-medium">Nazwa</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="gab-input" required />
        </div>
        <div>
          <label className="block text-[14px] font-medium">Opis</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="gab-input"
          />
        </div>
        <div>
          <label className="block text-[14px] font-medium">Miasto</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} className="gab-input" required />
        </div>
        <div>
          <label className="block text-[14px] font-medium">Adres</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="gab-input" />
        </div>
        <div>
          <label className="block text-[14px] font-medium">Telefon</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="gab-input" />
        </div>
        <div>
          <label className="block text-[14px] font-medium">NIP</label>
          <input value={nip} onChange={(e) => setNip(e.target.value)} className="gab-input" placeholder="Opcjonalnie" />
        </div>
        <div>
          <label className="block text-[14px] font-medium">Logo</label>
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo gabinetu" className="mb-2 h-16 w-auto rounded border border-slate-100 object-contain" />
          )}
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogoUpload} disabled={logoUploading} className="text-[14px]" />
          <p className="mt-1 text-[12px] text-slate-500">PNG, JPG lub WebP. Możesz też podać URL poniżej.</p>
        </div>
        <div>
          <label className="block text-[14px] font-medium">URL logo</label>
          <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="gab-input" placeholder="https://…" />
        </div>
        <div>
          <label className="block text-[14px] font-medium">E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="gab-input" />
        </div>
        <label className="flex items-center gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-gab-sky"
          />
          Opublikuj profil (widoczny w katalogu)
        </label>
        <button type="submit" disabled={loading} className="gab-btn-primary disabled:opacity-60">
          {loading ? "Zapisuję…" : "Zapisz"}
        </button>
      </form>
    </main>
  );
}
