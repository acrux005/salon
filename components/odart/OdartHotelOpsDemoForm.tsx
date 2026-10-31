"use client";

import { useRef, useState } from "react";
import { submitContactForm } from "@/lib/contactFormClient";

type Props = {
  variant?: "banner" | "inline";
};

export function OdartHotelOpsDemoForm({ variant = "banner" }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formLoadedAt = useRef(Date.now());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const hotel = (fd.get("hotel") as string)?.trim();
    const email = (fd.get("email") as string)?.trim();
    const honeypot = (fd.get("company_website") as string)?.trim();

    if (!hotel || !email) {
      setErrorMsg("Podaj nazwę obiektu i e-mail.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMsg("");
    const result = await submitContactForm(
      {
        name: hotel,
        email,
        message: `Prośba o demo HotelOps (15 min).\nObiekt: ${hotel}`,
        projectType: "hotelops-demo",
        source: "odart",
        context: "/hotel/",
        subject: `HotelOps demo — ${hotel}`,
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

  const isBanner = variant === "banner";

  return (
    <form
      onSubmit={handleSubmit}
      className={
        isBanner
          ? "mx-auto flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:items-stretch"
          : "flex w-full flex-col gap-3"
      }
    >
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="hotelops-demo-hp">Strona www firmy</label>
        <input
          id="hotelops-demo-hp"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="sr-only" htmlFor="hotelops-hotel">
        Nazwa obiektu / hotelu
      </label>
      <input
        id="hotelops-hotel"
        name="hotel"
        type="text"
        required
        placeholder="Nazwa obiektu / hotelu"
        className="min-h-12 flex-1 rounded-full border-0 bg-white/95 px-5 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:ring-2 focus:ring-white/60"
      />

      <label className="sr-only" htmlFor="hotelops-email">
        Email
      </label>
      <input
        id="hotelops-email"
        name="email"
        type="email"
        required
        placeholder="Email"
        className="min-h-12 flex-1 rounded-full border-0 bg-white/95 px-5 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:ring-2 focus:ring-white/60"
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="min-h-12 shrink-0 rounded-full bg-[#1e2a44] px-8 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#152036] disabled:opacity-70"
      >
        {status === "sending" ? "Wysyłanie…" : "Umów demo"}
      </button>

      {status === "ok" ? (
        <p className="w-full text-center text-sm font-medium text-white sm:basis-full">
          Dziękujemy — odezwiemy się w sprawie demo.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="w-full text-center text-sm font-medium text-amber-100 sm:basis-full" role="alert">
          {errorMsg}
        </p>
      ) : null}
    </form>
  );
}
