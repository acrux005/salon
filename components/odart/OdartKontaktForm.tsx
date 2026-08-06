"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { submitContactForm } from "@/lib/contactFormClient";

const SITE = ODART_SITE_URL;

export type OdartKontaktFormProps = {
  /** Wstępnie wybrany typ projektu (wartość opcji selecta, np. strona-standardowa) */
  defaultProjectType?: string;
  /** Ścieżka dla maila (np. /strony-internetowe/) — w temacie i stopce */
  contextPath?: string;
};

export function OdartKontaktForm({ defaultProjectType, contextPath }: OdartKontaktFormProps = {}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formLoadedAt = useRef(Date.now());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get("name") as string)?.trim();
    const email = (fd.get("email") as string)?.trim();
    const phone = (fd.get("phone") as string)?.trim();
    const projectType = (fd.get("project_type") as string)?.trim();
    const message = (fd.get("message") as string)?.trim();
    const consentRegulamin = fd.get("consent_regulamin") === "on";
    const consentPrzetwarzanie = fd.get("consent_przetwarzanie") === "on";
    const honeypot = (fd.get("company_website") as string)?.trim();

    if (!name || !email || !message) {
      setErrorMsg("Wypełnij wymagane pola: imię, e-mail i wiadomość.");
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
    const result = await submitContactForm(
      {
        name,
        email,
        message,
        phone: phone || undefined,
        projectType: projectType || undefined,
        source: "odart",
        ...(contextPath ? { context: contextPath } : {}),
      },
      { honeypot, formLoadedAt: formLoadedAt.current }
    );
    if (result.ok) {
      setStatus("ok");
      form.reset();
      formLoadedAt.current = Date.now();
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Wystąpił błąd. Spróbuj ponownie.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="odart-k-hp">Strona www firmy</label>
        <input
          id="odart-k-hp"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor="odart-k-name" className="mb-1 block text-sm font-medium text-neutral-300">
          Imię *
        </label>
        <input
          id="odart-k-name"
          name="name"
          type="text"
          required
          disabled={status === "sending"}
          className="w-full rounded-lg border border-white/10 bg-neutral-900/80 px-4 py-3 text-[15px] text-white placeholder:text-neutral-500 focus:border-odart-accent focus:outline-none focus:ring-1 focus:ring-odart-accent disabled:opacity-60"
          placeholder="Jan Kowalski"
        />
      </div>
      <div>
        <label htmlFor="odart-k-email" className="mb-1 block text-sm font-medium text-neutral-300">
          E-mail *
        </label>
        <input
          id="odart-k-email"
          name="email"
          type="email"
          required
          disabled={status === "sending"}
          className="w-full rounded-lg border border-white/10 bg-neutral-900/80 px-4 py-3 text-[15px] text-white placeholder:text-neutral-500 focus:border-odart-accent focus:outline-none focus:ring-1 focus:ring-odart-accent disabled:opacity-60"
          placeholder="jan@firma.pl"
        />
      </div>
      <div>
        <label htmlFor="odart-k-phone" className="mb-1 block text-sm font-medium text-neutral-300">
          Telefon
        </label>
        <input
          id="odart-k-phone"
          name="phone"
          type="tel"
          disabled={status === "sending"}
          className="w-full rounded-lg border border-white/10 bg-neutral-900/80 px-4 py-3 text-[15px] text-white placeholder:text-neutral-500 focus:border-odart-accent focus:outline-none focus:ring-1 focus:ring-odart-accent disabled:opacity-60"
          placeholder="+48 …"
        />
      </div>
      <div>
        <label htmlFor="odart-k-type" className="mb-1 block text-sm font-medium text-neutral-300">
          Wybierz typ projektu
        </label>
        <select
          id="odart-k-type"
          name="project_type"
          disabled={status === "sending"}
          className="w-full rounded-lg border border-white/10 bg-neutral-900/80 px-4 py-3 text-[15px] text-white focus:border-odart-accent focus:outline-none focus:ring-1 focus:ring-odart-accent disabled:opacity-60"
          defaultValue={defaultProjectType ?? ""}
        >
          <option value="" disabled>
            Wybierz…
          </option>
          <option value="prosta-strona">Prosta strona</option>
          <option value="strona-standardowa">Strona standardowa</option>
          <option value="sklep-internetowy">Sklep internetowy</option>
          <option value="inne">Inne / nie wiem</option>
        </select>
      </div>
      <div>
        <label htmlFor="odart-k-msg" className="mb-1 block text-sm font-medium text-neutral-300">
          Wiadomość *
        </label>
        <textarea
          id="odart-k-msg"
          name="message"
          required
          rows={5}
          disabled={status === "sending"}
          className="w-full rounded-lg border border-white/10 bg-neutral-900/80 px-4 py-3 text-[15px] text-white placeholder:text-neutral-500 focus:border-odart-accent focus:outline-none focus:ring-1 focus:ring-odart-accent disabled:opacity-60"
          placeholder="Opisz krótko cel i oczekiwania…"
        />
      </div>
      <div className="space-y-3">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent_regulamin"
            disabled={status === "sending"}
            className="mt-1 h-4 w-4 rounded border-white/10 bg-neutral-800 text-odart-accent focus:ring-odart-accent"
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
            className="mt-1 h-4 w-4 rounded border-white/10 bg-neutral-800 text-odart-accent focus:ring-odart-accent"
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
          Wiadomość została wysłana. Odpowiemy najszybciej, jak to możliwe.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-odart-accent px-8 py-3 text-[15px] font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-60"
      >
        {status === "sending" ? "Wysyłanie…" : "Prześlij"}
      </button>
    </form>
  );
}
