"use client";

import { useState } from "react";
import { resendGabPatientVerificationAction, setGabPatientActiveClinicAction } from "@/app/actions/gabinetSettings";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { GabPushToggle } from "@/components/gabinet/GabPushToggle";

type Clinic = { id: string; name: string; active: boolean };

export function GabPatientSettingsClient({
  name,
  phone,
  email,
  emailVerified,
  linkedClinics,
  calendarFeedUrl,
}: {
  name: string;
  phone: string;
  email: string;
  emailVerified: boolean;
  linkedClinics: Clinic[];
  calendarFeedUrl: string;
}) {
  const [profile, setProfile] = useState({ name, phone });
  const [passwords, setPasswords] = useState({ current: "", next: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const { updateGabPatientSettingsAction } = await import("@/app/actions/gabinetSettings");
    const fd = new FormData();
    fd.set("name", profile.name);
    fd.set("phone", profile.phone);
    const res = await updateGabPatientSettingsAction(fd);
    if (!res.ok) setErr(res.error);
    else setMsg("Zapisano dane konta.");
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    const { changeGabPatientPasswordAction } = await import("@/app/actions/gabinetSettings");
    const fd = new FormData();
    fd.set("currentPassword", passwords.current);
    fd.set("newPassword", passwords.next);
    const res = await changeGabPatientPasswordAction(fd);
    if (!res.ok) setErr(res.error);
    else {
      setMsg("Hasło zostało zmienione.");
      setPasswords({ current: "", next: "" });
    }
  }

  async function resendVerify() {
    const res = await resendGabPatientVerificationAction();
    if (!res.ok) setErr(res.error);
    else setMsg("Wysłano link weryfikacyjny.");
  }

  async function switchClinic(clinicId: string) {
    const res = await setGabPatientActiveClinicAction(clinicId);
    if (!res.ok) setErr(res.error);
    else setMsg("Zmieniono aktywny gabinet.");
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <GabLink href="/klient/panel" className="text-[14px] text-gab-sky hover:underline">
        ← Panel pacjenta
      </GabLink>
      <h1 className="mt-4 text-2xl font-bold text-gab-navy">Ustawienia konta</h1>
      <p className="mt-2 text-[14px] text-slate-500">
        E-mail: {email} {emailVerified ? "✓" : "· niepotwierdzony"}
      </p>
      {!emailVerified && (
        <button type="button" onClick={resendVerify} className="mt-2 text-[14px] text-gab-sky hover:underline">
          Wyślij ponownie link weryfikacyjny
        </button>
      )}
      {msg && <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-[14px] text-green-800">{msg}</p>}
      {err && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{err}</p>}

      <section className="mt-8 rounded-xl border border-gab-sky/15 bg-white p-4">
        <h2 className="font-semibold text-gab-navy">Kalendarz wizyt</h2>
        <p className="mt-1 text-[13px] text-slate-600">
          Subskrypcja iCal (Google Calendar, Apple Calendar) — nadchodzące wizyty odświeżają się co kilka minut.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={calendarFeedUrl} className="rounded-lg border border-gab-sky/30 px-3 py-2 text-[13px] text-gab-sky hover:bg-sky-50">
            Pobierz / subskrybuj iCal
          </a>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(calendarFeedUrl).then(() => setMsg("Skopiowano link kalendarza."))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] hover:bg-slate-50"
          >
            Kopiuj link
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-gab-sky/15 bg-white p-4">
        <h2 className="font-semibold text-gab-navy">Powiadomienia push</h2>
        <p className="mt-1 text-[13px] text-slate-600">Przypomnienia o wizytach w przeglądarce (wymaga VAPID na serwerze).</p>
        <div className="mt-3">
          <GabPushToggle context="gab_patient" />
        </div>
      </section>

      {linkedClinics.length > 1 && (
        <section className="mt-8 rounded-xl border border-gab-sky/15 bg-white p-4">
          <h2 className="font-semibold text-gab-navy">Twoje gabinety</h2>
          <ul className="mt-3 space-y-2 text-[14px]">
            {linkedClinics.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2">
                <span>{c.name}{c.active ? " (aktywny)" : ""}</span>
                {!c.active && (
                  <button type="button" onClick={() => switchClinic(c.id)} className="text-gab-sky hover:underline">
                    Wybierz
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <form onSubmit={saveProfile} className="mt-8 space-y-3 rounded-xl border border-gab-sky/15 bg-white p-4">
        <h2 className="font-semibold text-gab-navy">Dane profilu</h2>
        <input className="gab-input" required value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
        <input className="gab-input" required value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
        <button type="submit" className="gab-btn-primary w-full">Zapisz dane</button>
      </form>

      <form onSubmit={savePassword} className="mt-6 space-y-3 rounded-xl border border-gab-sky/15 bg-white p-4">
        <h2 className="font-semibold text-gab-navy">Zmiana hasła</h2>
        <input type="password" className="gab-input" placeholder="Obecne hasło" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} />
        <input type="password" minLength={10} className="gab-input" placeholder="Nowe hasło" value={passwords.next} onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))} />
        <button type="submit" className="gab-btn-primary w-full">Zmień hasło</button>
      </form>

      <p className="mt-6 text-[13px] text-slate-500">
        <GabLink href="/klient/zapomniane-haslo" className="text-gab-sky hover:underline">Nie pamiętasz hasła?</GabLink>
      </p>
    </main>
  );
}
