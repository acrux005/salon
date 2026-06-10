"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { registerVetClinic } from "@/app/actions/vet";
import { VOIVODESHIP_NAMES, VOIVODESHIPS_WITH_CITIES } from "@/lib/voivodeships";
import { slugifyVetClinicName } from "@/lib/wetSlug";
import { WetRegisterBenefits } from "@/components/wet/WetRegisterBenefits";
import { WetTrustBadges } from "@/components/wet/WetTrustBadges";

export default function WetRegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [success, setSuccess] = useState<{
    message: string;
    needsEmailVerification: boolean;
    emailSent: boolean;
  } | null>(null);
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

  const previewSlug = form.slug || slugifyVetClinicName(form.name) || "twoja-przychodnia";

  const updateName = useCallback((name: string) => {
    setForm((p) => {
      const next = { ...p, name };
      if (!slugTouched) {
        const auto = slugifyVetClinicName(name);
        if (auto) next.slug = auto;
      }
      return next;
    });
  }, [slugTouched]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.city) {
      setError("Wybierz miasto.");
      return;
    }
    const slug = (form.slug || slugifyVetClinicName(form.name)).toLowerCase().replace(/\s+/g, "-");
    if (!slug || slug.length < 3) {
      setError("Podaj nazwę przychodni (min. 3 znaki w adresie profilu).");
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
    const result = await registerVetClinic(fd);
    setLoading(false);
    if (result.ok) {
      if (result.needsEmailVerification) {
        setSuccess({
          needsEmailVerification: true,
          emailSent: result.emailSent,
          message: result.emailSent
            ? "Konto utworzone. Sprawdź skrzynkę e-mail (także folder spam) i kliknij link potwierdzający — dopiero potem możesz się zalogować."
            : "Konto utworzone, ale nie udało się wysłać maila z linkiem. Napisz na biuro@odart.pl — podamy link aktywacyjny.",
        });
      } else {
        setSuccess({
          needsEmailVerification: false,
          emailSent: true,
          message: "Konto utworzone i aktywowane. Możesz się zalogować.",
        });
      }
      return;
    }
    setError(result.error);
  }

  return (
    <>
      <section className="wet-register-hero flex-1 px-4 pb-20 pt-10 sm:pt-14 lg:pb-28 lg:pt-16">
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[1fr_minmax(0,34rem)] lg:gap-16 xl:grid-cols-[1fr_36rem]">
          <WetRegisterBenefits />

          <div className="w-full lg:sticky lg:top-24">
            <div className="rounded-2xl border border-wet-teal-100 bg-white p-6 shadow-lg shadow-wet-teal-900/5 sm:p-8">
              <h2 className="text-xl font-bold text-wet-navy lg:hidden">Załóż konto przychodni</h2>
              <p className="mt-1 text-[15px] text-wet-navy-muted lg:hidden">
                Wypełnij formularz — wyślemy link aktywacyjny na e-mail.
              </p>

              {success ? (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-[15px] text-green-800 lg:mt-0">
                  <p className="font-semibold">Gotowe</p>
                  <p className="mt-1">{success.message}</p>
                  {!success.needsEmailVerification && (
                    <Link
                      href="/wet/login?callbackUrl=/wet/panel/kreator"
                      className="mt-4 inline-block font-medium text-green-700 hover:underline"
                    >
                      Zaloguj się i uruchom kreator →
                    </Link>
                  )}
                  {success.needsEmailVerification && (
                    <p className="mt-3 text-[13px] text-green-900/80">
                      Po potwierdzeniu e-mail wróć na{" "}
                      <Link href="/wet/login" className="font-medium underline">
                        stronę logowania
                      </Link>
                      .
                    </p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4 lg:mt-0">
                  <p className="hidden text-[15px] font-medium text-wet-navy lg:block">
                    Dane konta administratora
                  </p>
                  {error && (
                    <p className="rounded-xl bg-red-50 px-4 py-2.5 text-[14px] text-red-700" role="alert">
                      {error}
                    </p>
                  )}
                  <div>
                    <label htmlFor="reg-name" className="block text-[14px] font-medium text-wet-navy">
                      Nazwa przychodni
                    </label>
                    <input
                      id="reg-name"
                      required
                      value={form.name}
                      onChange={(e) => updateName(e.target.value)}
                      className="wet-input"
                      placeholder="np. Przychodnia VetCare Kołobrzeg"
                      autoComplete="organization"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-email" className="block text-[14px] font-medium text-wet-navy">
                      E-mail do logowania
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="wet-input"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-pass" className="block text-[14px] font-medium text-wet-navy">
                      Hasło (min. 10 znaków)
                    </label>
                    <input
                      id="reg-pass"
                      type="password"
                      required
                      minLength={10}
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      className="wet-input"
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-voiv" className="block text-[14px] font-medium text-wet-navy">
                      Województwo
                    </label>
                    <select
                      id="reg-voiv"
                      required
                      value={form.voivodeship}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, voivodeship: e.target.value, city: "" }))
                      }
                      className="wet-select"
                    >
                      <option value="">Wybierz województwo</option>
                      {VOIVODESHIP_NAMES.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="reg-city" className="block text-[14px] font-medium text-wet-navy">
                      Miasto
                    </label>
                    <select
                      id="reg-city"
                      required
                      value={form.city}
                      onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                      className="wet-select"
                      disabled={!form.voivodeship}
                    >
                      <option value="">Wybierz miasto</option>
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setShowAdvanced((v) => !v)}
                      className="flex w-full items-center justify-between rounded-lg py-1 text-[13px] font-medium text-wet-teal-800 hover:text-wet-teal"
                    >
                      Ustawienia zaawansowane (adres profilu)
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>
                    {showAdvanced && (
                      <div className="mt-2">
                        <label htmlFor="reg-slug" className="block text-[14px] font-medium text-wet-navy">
                          Adres profilu publicznego
                        </label>
                        <input
                          id="reg-slug"
                          pattern="[a-z0-9-]{3,}"
                          value={form.slug}
                          onChange={(e) => {
                            setSlugTouched(true);
                            setForm((p) => ({ ...p, slug: e.target.value.toLowerCase() }));
                          }}
                          className="wet-input font-mono text-[14px]"
                          placeholder="generowany z nazwy"
                        />
                        <p className="mt-1.5 text-[12px] text-wet-navy-muted">
                          weterynaria.odart.pl/wet/przychodnia/
                          <span className="font-medium text-wet-teal-800">{previewSlug}</span>
                        </p>
                      </div>
                    )}
                    {!showAdvanced && (
                      <p className="mt-1 text-[12px] text-wet-navy-muted">
                        Adres: <span className="font-medium text-wet-teal-800">{previewSlug}</span> (ustawiany
                        automatycznie)
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="wet-btn-primary mt-2 w-full py-3.5 text-[16px] disabled:opacity-60"
                  >
                    {loading ? "Tworzenie konta…" : "Załóż darmowe konto"}
                  </button>
                  <p className="text-center text-[13px] text-wet-navy-muted">
                    14 dni testu · bez karty · anulujesz w dowolnym momencie
                  </p>
                  <WetTrustBadges compact />
                  <p className="text-center text-[14px] text-wet-navy-muted">
                    Masz już konto?{" "}
                    <Link href="/wet/login" className="font-medium text-wet-teal hover:underline">
                      Zaloguj się
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-wet-teal-100 bg-white px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-lg font-bold text-wet-navy">Bezpieczeństwo danych</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-[15px] text-wet-navy-muted">
            Dane medyczne i kontaktowe właścicieli zwierząt traktujemy jak w systemie gabinetu — z
            naciskiem na poufność i zgodność z prawem.
          </p>
          <WetTrustBadges />
        </div>
      </section>
    </>
  );
}
