"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import { ODART_SITE_URL } from "@/lib/odartSite";

const SITE = ODART_SITE_URL;

const inputClass =
  "mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-[15px] text-white placeholder:text-neutral-500 focus:border-odart-accent focus:outline-none focus:ring-2 focus:ring-odart-accent/30 disabled:opacity-60";

type Props = {
  contextPath: string;
  contactAvatarSrc: string;
};

export function OdartOpiekaKontaktBlock({ contextPath, contactAvatarSrc }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get("name") as string)?.trim();
    const email = (fd.get("email") as string)?.trim();
    const phone = (fd.get("phone") as string)?.trim();
    const subject = (fd.get("subject") as string)?.trim();
    const message = (fd.get("message") as string)?.trim();
    const contactPreference = (fd.get("contact_preference") as string)?.trim();
    const consentRegulamin = fd.get("consent_regulamin") === "on";
    const consentPrzetwarzanie = fd.get("consent_przetwarzanie") === "on";

    if (!name || !email || !message || !subject) {
      setErrorMsg("Wypełnij wymagane pola: imię, e-mail, temat i opis.");
      setStatus("error");
      return;
    }
    if (!consentRegulamin || !consentPrzetwarzanie) {
      setErrorMsg("Zaakceptuj regulamin, politykę prywatności oraz zgodę na przetwarzanie danych.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMsg("");
    const prefLabel =
      contactPreference === "telefon" ? "telefon" : contactPreference === "email" ? "e-mail" : contactPreference;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          phone: phone || undefined,
          projectType: "opieka-it",
          source: "odart",
          context: contextPath,
          subject,
          contactPreference: prefLabel,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (data.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Wystąpił błąd. Spróbuj ponownie.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Wystąpił błąd połączenia. Spróbuj ponownie.");
    }
  }

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
      {/* Lewa kolumna — formularz (jak demo) */}
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="opieka-k-name" className="block text-sm font-medium text-neutral-300">
                Imię *
              </label>
              <input
                id="opieka-k-name"
                name="name"
                type="text"
                required
                disabled={status === "sending"}
                autoComplete="name"
                className={inputClass}
                placeholder="Imię"
              />
            </div>
            <div>
              <label htmlFor="opieka-k-phone" className="block text-sm font-medium text-neutral-300">
                Telefon
              </label>
              <input
                id="opieka-k-phone"
                name="phone"
                type="tel"
                disabled={status === "sending"}
                autoComplete="tel"
                className={inputClass}
                placeholder="+48 000 000 000"
              />
            </div>
          </div>

          <div>
            <label htmlFor="opieka-k-email" className="block text-sm font-medium text-neutral-300">
              Email *
            </label>
            <input
              id="opieka-k-email"
              name="email"
              type="email"
              required
              disabled={status === "sending"}
              autoComplete="email"
              className={inputClass}
              placeholder="Email"
            />
          </div>

          <div>
            <p className="block text-sm font-medium text-neutral-300">Preferuję kontakt</p>
            <div className="mt-2 flex flex-wrap gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-300">
                <input
                  type="radio"
                  name="contact_preference"
                  value="telefon"
                  defaultChecked
                  disabled={status === "sending"}
                  className="h-4 w-4 accent-odart-accent"
                />
                telefon
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-300">
                <input
                  type="radio"
                  name="contact_preference"
                  value="email"
                  disabled={status === "sending"}
                  className="h-4 w-4 accent-odart-accent"
                />
                e-mail
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="opieka-k-subject" className="block text-sm font-medium text-neutral-300">
              Temat *
            </label>
            <input
              id="opieka-k-subject"
              name="subject"
              type="text"
              required
              disabled={status === "sending"}
              className={inputClass}
              placeholder="Temat"
            />
          </div>

          <div>
            <label htmlFor="opieka-k-msg" className="block text-sm font-medium text-neutral-300">
              Opisz problem lub pytanie *
            </label>
            <textarea
              id="opieka-k-msg"
              name="message"
              required
              rows={4}
              disabled={status === "sending"}
              className={inputClass}
              placeholder="Opisz problem lub pytanie"
            />
          </div>

          <div className="space-y-3 pt-1">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="consent_regulamin"
                disabled={status === "sending"}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-neutral-800 text-odart-accent focus:ring-odart-accent"
              />
              <span className="text-[14px] text-neutral-400">
                Akceptuję{" "}
                <Link href={`${SITE}/regulamin/`} className="text-odart-accent hover:underline">
                  regulamin
                </Link>{" "}
                oraz{" "}
                <Link href={`${SITE}/polityka-prywatnosci/`} className="text-odart-accent hover:underline">
                  politykę prywatności
                </Link>
                . *
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="consent_przetwarzanie"
                disabled={status === "sending"}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-neutral-800 text-odart-accent focus:ring-odart-accent"
              />
              <span className="text-[14px] text-neutral-400">
                Wyrażam zgodę na przetwarzanie danych w celu odpowiedzi na zapytanie (zgodnie z{" "}
                <Link href={`${SITE}/polityka-prywatnosci/`} className="text-odart-accent hover:underline">
                  polityką prywatności
                </Link>
                ). *
              </span>
            </label>
          </div>

          {status === "error" && errorMsg && (
            <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-2 text-sm text-red-200">{errorMsg}</p>
          )}
          {status === "ok" && (
            <p className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-4 py-2 text-sm text-emerald-200">
              Wiadomość została wysłana. Odpowiem najszybciej, jak to możliwe.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-70"
          >
            {status === "sending" ? "Wysyłanie…" : "Opisz problem — oddzwonię"}
          </button>
          <p className="text-sm text-neutral-500">Odpowiadam zwykle tego samego dnia</p>
        </form>
      </div>

      {/* Prawa kolumna — karta jak demo */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 lg:sticky lg:top-28">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-odart-accent/20 bg-neutral-800">
            <Image src={contactAvatarSrc} alt="Rafał Kowalkowski" fill className="object-cover" sizes="128px" />
          </div>
          <h3 className="text-xl font-semibold text-white">Rafał Kowalkowski</h3>
          <p className="text-sm text-neutral-400">Kontakt</p>
          <div className="mt-4 space-y-2 text-sm">
            <a
              href="tel:+48695432415"
              className="flex items-center justify-center gap-2 text-odart-accent hover:underline"
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              +48 695 432 415
            </a>
            <a
              href="mailto:biuro@odart.pl"
              className="flex items-center justify-center gap-2 text-odart-accent hover:underline"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              biuro@odart.pl
            </a>
          </div>
        </div>

        <div className="relative mx-auto mt-6 flex h-40 w-full max-w-xs items-center justify-center">
          <Mail className="h-28 w-28 text-odart-accent/50" strokeWidth={1.25} aria-hidden />
        </div>

        <p className="mt-4 text-center text-sm text-neutral-500">Odpowiadam zwykle tego samego dnia</p>

        <p className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-neutral-500">
          Pełny formularz jest też na{" "}
          <Link href={`${SITE}/kontakt/`} className="font-medium text-odart-accent hover:text-orange-300">
            stronie Kontakt
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
