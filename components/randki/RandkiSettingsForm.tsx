"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import {
  changeDatingPasswordAction,
  deleteDatingAccountAction,
  exportDatingDataAction,
  resendDatingVerificationAction,
  toggleDatingProfileActiveAction,
} from "@/app/actions/randkiAuth";

export function RandkiSettingsForm({
  email,
  emailVerified,
  profileActive,
  warnedAt,
  bannedAt,
  banReason,
}: {
  email: string;
  emailVerified: boolean;
  profileActive: boolean;
  warnedAt: Date | string | null;
  bannedAt: Date | string | null;
  banReason: string | null;
}) {
  const [active, setActive] = useState(profileActive);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const [passwords, setPasswords] = useState({ current: "", next: "" });
  const [deletePw, setDeletePw] = useState("");

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    start(async () => {
      setMsg("");
      setErr("");
      const res = await fn();
      if (res.ok) setMsg("Zapisano.");
      else setErr(res.error ?? "Błąd.");
    });
  }

  return (
    <div className="space-y-6">
      {bannedAt && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[14px] text-red-900">
          Twoje konto zostało zablokowane{banReason ? `: ${banReason}` : "."} Skontaktuj się z moderacją: kontakt@odart.pl
        </div>
      )}
      {warnedAt && !bannedAt && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[14px] text-amber-900">
          Otrzymałeś ostrzeżenie od moderacji ({new Date(warnedAt).toLocaleDateString("pl-PL")}). Upewnij się, że Twój profil i zachowanie są zgodne z regulaminem.
        </div>
      )}
      <section className="bg-randki-card p-5">
        <h2 className="font-semibold text-randki-navy">Konto</h2>
        <p className="mt-2 text-[14px] text-randki-muted">{email}</p>
        <p className="mt-1 text-[13px]">
          E-mail: {emailVerified ? <span className="text-green-700">potwierdzony</span> : <span className="text-amber-700">niepotwierdzony</span>}
        </p>
        {!emailVerified && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => resendDatingVerificationAction(email))}
            className="randki-btn-outline mt-3 text-[13px]"
          >
            Wyślij ponownie link weryfikacyjny
          </button>
        )}
      </section>

      <section className="bg-randki-card p-5">
        <h2 className="font-semibold text-randki-navy">Widoczność profilu</h2>
        <label className="mt-3 flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => {
              const v = e.target.checked;
              setActive(v);
              run(() => toggleDatingProfileActiveAction(v));
            }}
          />
          <span className="text-[14px]">Profil aktywny (widoczny w odkrywaniu)</span>
        </label>
      </section>

      <section className="bg-randki-card space-y-3 p-5">
        <h2 className="font-semibold text-randki-navy">Zmiana hasła</h2>
        <input
          type="password"
          className="randki-input"
          placeholder="Obecne hasło"
          value={passwords.current}
          onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
        />
        <input
          type="password"
          className="randki-input"
          placeholder="Nowe hasło"
          value={passwords.next}
          onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
        />
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => changeDatingPasswordAction(passwords.current, passwords.next))}
          className="randki-btn-primary text-[13px]"
        >
          Zmień hasło
        </button>
      </section>

      <section className="bg-randki-card space-y-3 p-5">
        <h2 className="font-semibold text-randki-navy">RODO — eksport danych</h2>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const res = await exportDatingDataAction();
              if (!res.ok) {
                setErr(res.error);
                return;
              }
              const blob = new Blob([res.json], { type: "application/json" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "randki-odart-dane.json";
              a.click();
              setMsg("Pobrano plik JSON.");
            })
          }
          className="randki-btn-outline text-[13px]"
        >
          Pobierz moje dane
        </button>
      </section>

      <section className="bg-randki-card space-y-3 p-5 border border-red-100">
        <h2 className="font-semibold text-red-800">Usuń konto</h2>
        <input
          type="password"
          className="randki-input"
          placeholder="Hasło do potwierdzenia"
          value={deletePw}
          onChange={(e) => setDeletePw(e.target.value)}
        />
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const res = await deleteDatingAccountAction(deletePw);
              if (!res.ok) setErr(res.error);
              else signOut({ callbackUrl: "/" });
            })
          }
          className="rounded-xl bg-red-600 px-4 py-2 text-[13px] font-medium text-white"
        >
          Usuń konto na stałe
        </button>
      </section>

      {msg && <p className="text-[14px] text-green-700">{msg}</p>}
      {err && <p className="text-[14px] text-red-600">{err}</p>}
    </div>
  );
}
