"use client";

import { Calendar, MapPin, Ship, Camera } from "lucide-react";

const STEPS = [
  {
    number: 1,
    title: "Rezerwujesz termin",
    text: "Wybierz dogodny termin rejsu i dokonaj szybkiej rezerwacji online.",
    icon: Calendar,
  },
  {
    number: 2,
    title: "Spotkanie w porcie",
    text: "Spotykamy się w porcie w Kołobrzegu przed rozpoczęciem rejsu.",
    icon: MapPin,
  },
  {
    number: 3,
    title: "Wypływamy na Bałtyk",
    text: "Rozpoczynamy rejs łodzią motorową wzdłuż wybrzeża.",
    icon: Ship,
  },
  {
    number: 4,
    title: "Niezapomniane widoki",
    text: "Podziwiaj panoramę Kołobrzegu i piękno Bałtyku z pokładu łodzi.",
    icon: Camera,
  },
];

export function JakWygladaRejs() {
  return (
    <section
      className="py-[100px]"
      style={{ background: "#ffffff" }}
      aria-labelledby="jak-wyglada-rejs-heading"
    >
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <header className="mb-14 text-center">
          <h2
            id="jak-wyglada-rejs-heading"
            className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1F1F] sm:text-3xl"
          >
            Jak wygląda rejs
          </h2>
          <p
            className="mx-auto mt-4 max-w-[600px] text-center font-[var(--font-sans)] text-[15px] leading-relaxed"
            style={{ color: "#6b7280" }}
          >
            Zobacz jak wygląda Twoja morska przygoda krok po kroku.
          </p>
        </header>

        <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ number, title, text, icon: Icon }) => (
            <article
              key={number}
              className="rounded-2xl text-center transition-transform duration-300 ease-out hover:-translate-y-1"
              style={{
                background: "#f8fafc",
                padding: "28px",
                borderRadius: "16px",
              }}
            >
              <div
                className="mx-auto mb-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-[var(--font-sans)] text-sm font-semibold"
                style={{
                  background: "#e6f2ff",
                  color: "#2563eb",
                }}
                aria-hidden
              >
                {number}
              </div>
              <div
                className="mx-auto mb-3 flex h-10 w-10 items-center justify-center"
                style={{ color: "#2563eb" }}
                aria-hidden
              >
                <Icon className="h-10 w-10" strokeWidth={1.5} />
              </div>
              <h3 className="font-[var(--font-sans)] text-[16px] font-semibold text-[#1F1F1F]">
                {title}
              </h3>
              <p className="mt-2 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#6b7280]">
                {text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
