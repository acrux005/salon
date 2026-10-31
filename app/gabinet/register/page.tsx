"use client";

import { useState, useMemo, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { registerGabClinic } from "@/app/actions/gabinet";
import { VOIVODESHIP_NAMES, VOIVODESHIPS_WITH_CITIES } from "@/lib/voivodeships";
import { slugifyVetClinicName } from "@/lib/wetSlug";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { useGabinetBrand } from "@/components/gabinetPlatform/useGabinetBrand";

export default function GabinetRegisterPage() {
  const brand = useGabinetBrand();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [success, setSuccess] = useState<{ message: string } | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    slug: "",
    name: "",
    voivodeship: "",
    city: "",
  });

  const cities = useMemo(() => {
    if (!form.voivodeship) return [];
    return VOIVODESHIPS_WITH_CITIES[form.voivodeship] ?? [];
  }, [form.voivodeship]);

  const previewSlug = form.slug || slugifyVetClinicName(form.name) || "twoj-gabinet";

  const updateName = useCallback(
    (name: string) => {
      setForm((p) => {
        const next = { ...p, name };
        if (!slugTouched) {
          const auto = slugifyVetClinicName(name);
          if (auto) next.slug = auto;
        }
        return next;
      });
    },
    [slugTouched]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.city) {
      setError("Wybierz miasto.");
      return;
    }
    const slug = (form.slug || slugifyVetClinicName(form.name)).toLowerCase().replace(/\s+/g, "-");
    if (!slug || slug.length < 3) {
      setError("Podaj nazwę gabinetu (min. 3 znaki w adresie profilu).");
      return;
    }
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.set("email", form.email);
    fd.set("password", form.password);
    fd.set("slug", slug);
    fd.set("name", form.name);
    fd.set("city", form.city);
    const result = await registerGabClinic(fd);
    setLoading(false);
    if (result.ok) {
      const autoVerify = process.env.NEXT_PUBLIC_GAB_AUTO_VERIFY === "true";
      setSuccess({
        message: autoVerify
          ? "Konto utworzone. Możesz się zalogować i skonfigurować gabinet."
          : "Konto utworzone. Po weryfikacji e-mail (jeśli włączona) zaloguj się do panelu.",
      });
      return;
    }
    setError(result.error);
  }

  return (
    <main className="mx-auto min-w-0 max-w-lg px-4 py-12">
      <GabLink href="/" className="text-[14px] font-medium text-sky-700 hover:underline">
        ← {brand.brandName}
      </GabLink>
      <h1 className="mt-4 text-2xl font-bold text-gab-navy">Załóż konto gabinetu</h1>
      <p className="mt-1 text-[14px] text-slate-600">
        Darmowy start — kalendarz, pacjenci i portal pacjenta dla {brand.clinicLabel.toLowerCase()}.
      </p>

      {success ? (
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-[15px] text-green-800">
          <p className="font-semibold">Gotowe</p>
          <p className="mt-1">{success.message}</p>
          <GabLink href="/login?callbackUrl=/panel" className="mt-4 inline-block font-medium text-green-700 hover:underline">
            Zaloguj się do panelu →
          </GabLink>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700" role="alert">
              {error}
            </p>
          )}
          <div>
            <label className="block text-[14px] font-medium">Nazwa gabinetu</label>
            <input
              type="text"
              className="gab-input"
              required
              value={form.name}
              onChange={(e) => updateName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium">E-mail administratora</label>
            <input
              type="email"
              className="gab-input"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium">Hasło (min. 10 znaków)</label>
            <input
              type="password"
              className="gab-input"
              required
              minLength={10}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium">Województwo</label>
            <select
              className="gab-input"
              required
              value={form.voivodeship}
              onChange={(e) => setForm((p) => ({ ...p, voivodeship: e.target.value, city: "" }))}
            >
              <option value="">Wybierz…</option>
              {VOIVODESHIP_NAMES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[14px] font-medium">Miasto</label>
            <select
              className="gab-input"
              required
              disabled={!form.voivodeship}
              value={form.city}
              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
            >
              <option value="">Wybierz…</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-between text-[13px] font-medium text-slate-600"
            onClick={() => setShowAdvanced((v) => !v)}
          >
            Adres profilu publicznego
            <ChevronDown className={`h-4 w-4 transition ${showAdvanced ? "rotate-180" : ""}`} />
          </button>
          {showAdvanced && (
            <div>
              <label className="block text-[14px] font-medium">Slug (URL profilu)</label>
              <input
                type="text"
                className="gab-input font-mono text-[13px]"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }));
                }}
              />
              <p className="mt-1 text-[12px] text-slate-500">
                Podgląd: /gabinet/{previewSlug}
              </p>
            </div>
          )}
          <button type="submit" disabled={loading} className="gab-btn-primary w-full disabled:opacity-60">
            {loading ? "Tworzenie konta…" : "Utwórz konto gabinetu"}
          </button>
          <p className="text-center text-[14px] text-slate-600">
            Masz już konto?{" "}
            <GabLink href="/login" className="font-medium text-sky-700 hover:underline">
              Zaloguj się
            </GabLink>
          </p>
        </form>
      )}
    </main>
  );
}
