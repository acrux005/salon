"use client";

import Link from "next/link";
import { RadiantHeader } from "../components/RadiantHeader";
import { RadiantFooter } from "../components/RadiantFooter";

export default function RadiantGetStartedPage() {
  return (
    <main className="min-h-screen bg-white text-gray-950 antialiased">
      <RadiantHeader variant="light" />
      <div className="bg-gradient-to-br from-amber-200 via-orange-300 via-rose-400/80 to-violet-500 pt-px">
        <div className="bg-white">
          {/* CTA Hero */}
          <section className="mx-auto max-w-3xl px-6 py-32 text-center lg:py-40">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Get started</p>
            <h1 className="mt-2 text-5xl font-bold tracking-tight text-gray-950 sm:text-6xl">
              Ready to dive in? Start your free trial today.
            </h1>
            <p className="mt-8 text-xl text-gray-600">
              Get the cheat codes for selling and unlock your team&apos;s revenue potential.
            </p>
            <Link
              href="#"
              className="mt-10 inline-block rounded-full bg-gray-950 px-10 py-4 text-lg font-semibold text-white hover:bg-gray-800"
            >
              Get started
            </Link>
            <p className="mt-6 text-sm text-gray-500">No credit card required</p>
          </section>
        </div>
      </div>
      <RadiantFooter full />
    </main>
  );
}
