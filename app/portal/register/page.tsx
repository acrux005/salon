"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { registerClinic } from "@/app/actions/clinic";
import { VOIVODESHIP_NAMES, VOIVODESHIPS_WITH_CITIES } from "@/lib/voivodeships";

const VOIVODESHIP_PLACEHOLDER = "— wybierz województwo —";
const CITY_PLACEHOLDER = "— wybierz miasto —";

export default function PortalRegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "", slug: "", name: "", voivodeship: "", city: "" });

  const citiesForVoivodeship = useMemo(() => {
    if (!form.voivodeship) return [];
    return VOIVODESHIPS_WITH_CITIES[form.voivodeship] ?? [];
  }, [form.voivodeship]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.voivodeship || !form.city) {
      setError("Wybierz województwo i miasto.");
      return;
    }
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.set("email", form.email.trim().toLowerCase());
    fd.set("password", form.password);
    fd.set("slug", form.slug.trim().toLowerCase().replace(/\s+/g, "-"));
    fd.set("name", form.name.trim());
    fd.set("city", form.city.trim());
    fd.set("description", "");
    const result = await registerClinic(fd);
    setLoading(false);
    if (result.ok) {
      setSuccessMessage(
        "Konto gabinetu utworzone. Wysłaliśmy link potwierdzający na podany adres e-mail. Potwierdź adres, aby móc się zalogować."
      );
      return;
    }
    setError(result.error);
  }

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white py-16">
        <div className="mx-auto max-w-md px-4">
          <h1 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">Rejestracja gabinetu</h1>
          <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">Utwórz konto i dodaj swój gabinet.</p>
          <p className="mt-3 rounded-lg bg-amber-50 px-4 py-2 text-[13px] text-amber-800">
            Rejestracja gabinetu przez Google nie jest dostępna. Dla gabinetu użyj formularza poniżej (e-mail + hasło).
          </p>
          {successMessage ? (
            <div className="mt-8 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-[15px] text-green-800">
              <p className="font-medium">Rejestracja zakończona</p>
              <p className="mt-1">{successMessage}</p>
              <Link href="/portal/login" className="mt-4 inline-block font-medium text-green-700 hover:underline">
                Przejdź do logowania →
              </Link>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-[14px] text-red-700" role="alert">{error}</p>}
            <div>
              <label htmlFor="reg-email" className="block text-[14px] font-medium text-[#1F1A1C]">Email</label>
              <input id="reg-email" type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500" />
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-[14px] font-medium text-[#1F1A1C]">Hasło (min. 10 znaków)</label>
              <input id="reg-password" type="password" required minLength={10} value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500" />
            </div>
            <div>
              <label htmlFor="reg-slug" className="block text-[14px] font-medium text-[#1F1A1C]">Adres profilu (slug)</label>
              <p className="mt-0.5 text-[13px] text-[#6F5E64]">Wybierz unikalny adres: małe litery, cyfry, myślniki (np. czar-centrum-mocy). Będzie w adresie: /portal/gabinet/<strong>twój-slug</strong></p>
              <input id="reg-slug" type="text" required value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value.replace(/[^a-z0-9-]/gi, "").toLowerCase() }))} placeholder="np. czar-centrum-mocy" className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500" />
            </div>
            <div>
              <label htmlFor="reg-name" className="block text-[14px] font-medium text-[#1F1A1C]">Nazwa gabinetu</label>
              <input id="reg-name" type="text" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500" />
            </div>
            <div>
              <label htmlFor="reg-voivodeship" className="block text-[14px] font-medium text-[#1F1A1C]">Województwo</label>
              <select
                id="reg-voivodeship"
                required
                value={form.voivodeship}
                onChange={(e) => setForm((p) => ({ ...p, voivodeship: e.target.value, city: "" }))}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
              >
                <option value="">{VOIVODESHIP_PLACEHOLDER}</option>
                {VOIVODESHIP_NAMES.map((v) => (
                  <option key={v} value={v}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="reg-city" className="block text-[14px] font-medium text-[#1F1A1C]">Miasto</label>
              <select
                id="reg-city"
                required
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                disabled={!form.voivodeship}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white disabled:bg-neutral-100 disabled:text-neutral-500"
              >
                <option value="">{form.voivodeship ? CITY_PLACEHOLDER : "— najpierw wybierz województwo —"}</option>
                {citiesForVoivodeship.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[13px] text-[#6F5E64]">Opis gabinetu („O mnie”) uzupełnisz po zalogowaniu w panelu.</p>
            <button type="submit" disabled={loading} className="w-full rounded-full bg-pink-500 py-3 text-[15px] font-medium text-white hover:bg-pink-600 disabled:opacity-60">{loading ? "Rejestracja…" : "Zarejestruj gabinet"}</button>
          </form>
          )}
          <p className="mt-6 text-center text-[14px] text-[#6F5E64]">Masz już konto? <Link href="/portal/login" className="font-medium text-pink-600 hover:underline">Zaloguj się</Link></p>
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
