"use client";

import { useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  Clock,
  Wifi,
  Monitor,
  Printer,
  Camera,
  Building2,
  CreditCard,
  Mail,
  CircleHelp,
  Phone,
} from "lucide-react";
import { submitContactForm } from "@/lib/contactFormClient";

const CATEGORIES = [
  { id: "wifi", label: "Internet / Wi-Fi", Icon: Wifi },
  { id: "pc", label: "Komputer", Icon: Monitor },
  { id: "printer", label: "Drukarka", Icon: Printer },
  { id: "cctv", label: "Monitoring", Icon: Camera },
  { id: "hotel", label: "System hotelowy", Icon: Building2 },
  { id: "pos", label: "Kasa / POS", Icon: CreditCard },
  { id: "email", label: "Poczta e-mail", Icon: Mail },
  { id: "other", label: "Coś innego", Icon: CircleHelp },
] as const;

const BLOCKING = [
  { id: "full", label: "Tak — praca stoi", Icon: AlertTriangle, tone: "danger" as const },
  { id: "partial", label: "Częściowo", Icon: Clock, tone: "warn" as const },
  { id: "annoy", label: "Nie, ale przeszkadza", Icon: Check, tone: "ok" as const },
] as const;

const inputClass =
  "mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-[15px] text-white placeholder:text-neutral-500 focus:border-odart-accent focus:outline-none focus:ring-2 focus:ring-odart-accent/30 disabled:opacity-60";

function chipClass(active: boolean, tone: "neutral" | "danger" | "warn" | "ok" = "neutral") {
  if (!active) {
    return "border-white/15 bg-white/[0.03] text-neutral-200 hover:border-white/30 hover:bg-white/[0.06]";
  }
  if (tone === "danger") return "border-red-500 bg-red-500/15 text-red-200";
  if (tone === "warn") return "border-amber-500/70 bg-amber-500/10 text-amber-100";
  if (tone === "ok") return "border-emerald-500/60 bg-emerald-500/10 text-emerald-100";
  return "border-odart-accent bg-odart-accent/15 text-white";
}

export function OdartAwariaForm() {
  const [categories, setCategories] = useState<string[]>([]);
  const [blocking, setBlocking] = useState<string>("full");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formLoadedAt = useRef(Date.now());

  function toggleCategory(id: string) {
    setCategories((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get("name") as string)?.trim();
    const email = (fd.get("email") as string)?.trim();
    const phone = (fd.get("phone") as string)?.trim();
    const company = (fd.get("company") as string)?.trim();
    const message = (fd.get("message") as string)?.trim();
    const honeypot = (fd.get("company_website") as string)?.trim();

    if (!categories.length) {
      setErrorMsg("Wybierz przynajmniej jedną kategorię — co nie działa.");
      setStatus("error");
      return;
    }
    if (!blocking) {
      setErrorMsg("Wybierz, czy problem blokuje pracę.");
      setStatus("error");
      return;
    }
    if (!name || !email || !phone || !message) {
      setErrorMsg("Wypełnij imię, telefon, e-mail i opis sytuacji.");
      setStatus("error");
      return;
    }

    const catLabels = CATEGORIES.filter((c) => categories.includes(c.id)).map((c) => c.label);
    const blockLabel = BLOCKING.find((b) => b.id === blocking)?.label ?? blocking;

    const composed = [
      `Co nie działa: ${catLabels.join(", ")}`,
      `Blokuje pracę: ${blockLabel}`,
      company ? `Firma / obiekt: ${company}` : null,
      "",
      message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    setStatus("sending");
    setErrorMsg("");

    const result = await submitContactForm(
      {
        name,
        email,
        phone,
        message: composed,
        projectType: "awaria-it",
        source: "odart",
        context: "/pogotowie-it/#zgloszenie",
        subject: `Awaria IT — ${blockLabel}`,
        contactPreference: "telefon",
      },
      { honeypot, formLoadedAt: formLoadedAt.current }
    );

    if (result.ok) {
      setStatus("ok");
      form.reset();
      setCategories([]);
      setBlocking("full");
      formLoadedAt.current = Date.now();
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Wystąpił błąd. Zadzwoń: 695 432 415.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start">
      <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="awaria-hp">Strona www firmy</label>
          <input id="awaria-hp" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <fieldset>
          <legend className="text-lg font-semibold text-white">1. Co nie działa?</legend>
          <p className="mt-1 text-sm text-neutral-500">Możesz zaznaczyć kilka rzeczy.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map(({ id, label, Icon }) => {
              const active = categories.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleCategory(id)}
                  aria-pressed={active}
                  className={`flex flex-col items-start gap-2 rounded-xl border px-3 py-3 text-left text-sm font-medium transition ${chipClass(active)}`}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-odart-accent" : "text-neutral-400"}`} aria-hidden />
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-semibold text-white">2. Czy problem blokuje pracę?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {BLOCKING.map(({ id, label, Icon, tone }) => {
              const active = blocking === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setBlocking(id)}
                  aria-pressed={active}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${chipClass(active, tone)}`}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="awaria-msg" className="text-lg font-semibold text-white">
            3. Opisz sytuację
          </label>
          <textarea
            id="awaria-msg"
            name="message"
            required
            rows={4}
            disabled={status === "sending"}
            className={`${inputClass} mt-3 resize-y`}
            placeholder="Co się dzieje, od kiedy, co już próbowano?"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="awaria-phone" className="block text-sm font-medium text-neutral-300">
              Telefon *
            </label>
            <input
              id="awaria-phone"
              name="phone"
              type="tel"
              required
              disabled={status === "sending"}
              autoComplete="tel"
              className={inputClass}
              placeholder="695 432 415"
            />
          </div>
          <div>
            <label htmlFor="awaria-email" className="block text-sm font-medium text-neutral-300">
              E-mail *
            </label>
            <input
              id="awaria-email"
              name="email"
              type="email"
              required
              disabled={status === "sending"}
              autoComplete="email"
              className={inputClass}
              placeholder="nazwa@firma.pl"
            />
          </div>
          <div>
            <label htmlFor="awaria-name" className="block text-sm font-medium text-neutral-300">
              Imię i nazwisko *
            </label>
            <input
              id="awaria-name"
              name="name"
              type="text"
              required
              disabled={status === "sending"}
              autoComplete="name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="awaria-company" className="block text-sm font-medium text-neutral-300">
              Firma / obiekt
            </label>
            <input
              id="awaria-company"
              name="company"
              type="text"
              disabled={status === "sending"}
              autoComplete="organization"
              className={inputClass}
              placeholder="np. pensjonat, biuro"
            />
          </div>
        </div>

        {status === "error" ? <p className="text-sm text-red-400">{errorMsg}</p> : null}
        {status === "ok" ? (
          <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Zgłoszenie wysłane. Oddzwonię albo napiszę — zwykle tego samego dnia. Przy krytycznej awarii dzwoń od razu:{" "}
            <a href="tel:+48695432415" className="font-semibold underline">
              695 432 415
            </a>
            .
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-lg border border-red-500 bg-red-600 px-6 py-3.5 font-semibold text-white hover:bg-red-500 disabled:opacity-60"
        >
          <AlertTriangle className="h-5 w-5" aria-hidden />
          {status === "sending" ? "Wysyłanie…" : "Wyślij zgłoszenie"}
        </button>
        <p className="text-xs text-neutral-500">
          Bez numerów ticketów i panelu statusów — mail trafia prosto do mnie (Rafał Kowalkowski / ODART).
        </p>
      </form>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6">
          <h3 className="text-lg font-bold text-white">Praca stoi? Dzwoń.</h3>
          <p className="mt-2 text-sm text-neutral-300">
            Przy krytycznej awarii telefon jest szybszy. Formularz możesz uzupełnić później.
          </p>
          <a
            href="tel:+48695432415"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3.5 text-lg font-bold text-white hover:bg-red-500"
          >
            <Phone className="h-5 w-5" aria-hidden />
            695 432 415
          </a>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-neutral-400">
          <p className="font-semibold text-white">Jak to działa u ODART</p>
          <ol className="mt-3 list-decimal space-y-2 pl-4">
            <li>Wybierasz kategorię i pilność.</li>
            <li>Wiadomość leci na biuro@odart.pl.</li>
            <li>Oddzwaniam / piszę — bez portalu śledzenia.</li>
          </ol>
        </div>
      </aside>
    </div>
  );
}
