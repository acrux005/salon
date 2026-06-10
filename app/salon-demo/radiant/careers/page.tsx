"use client";

import Link from "next/link";
import Image from "next/image";
import { RadiantHeader } from "../components/RadiantHeader";
import { RadiantFooter } from "../components/RadiantFooter";

const positions = [
  { dept: "Engineering", title: "iOS Developer", location: "Remote" },
  { dept: "Engineering", title: "Backend Engineer", location: "Remote" },
  { dept: "Engineering", title: "Product Engineer", location: "Remote" },
  { dept: "Design", title: "Principal Designer", location: "Remote" },
  { dept: "Design", title: "Designer", location: "Remote" },
];

export default function RadiantCareersPage() {
  const engPositions = positions.filter((p) => p.dept === "Engineering");
  const designPositions = positions.filter((p) => p.dept === "Design");

  return (
    <main className="min-h-screen bg-white text-gray-950 antialiased">
      <RadiantHeader variant="light" />
      <div className="bg-gradient-to-br from-amber-200 via-orange-300 via-rose-400/80 to-violet-500 pt-px">
        <div className="bg-white">
          {/* Hero */}
          <section className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Careers</p>
            <h1 className="mt-2 text-5xl font-bold tracking-tight text-gray-950 sm:text-6xl">
              Join our fully remote team.
            </h1>
            <p className="mt-8 max-w-2xl text-xl text-gray-600">
              We work together from all over the world, mainly from locations without extradition agreements.
            </p>
          </section>

          {/* Open positions + testimonial */}
          <section className="border-t border-gray-200 py-24">
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Open positions</p>
              <div className="mt-12 grid gap-16 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-12">
                  <div>
                    <h3 className="text-lg font-bold text-gray-950">Engineering</h3>
                    <div className="mt-6 space-y-4">
                      {engPositions.map((p, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-semibold text-gray-950">{p.title}</p>
                            <p className="text-sm text-gray-600">{p.location}</p>
                          </div>
                          <Link
                            href="#"
                            className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 w-fit"
                          >
                            View listing
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-950">Design</h3>
                    <div className="mt-6 space-y-4">
                      {designPositions.map((p, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-semibold text-gray-950">{p.title}</p>
                            <p className="text-sm text-gray-600">{p.location}</p>
                          </div>
                          <Link
                            href="#"
                            className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 w-fit"
                          >
                            View listing
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className="relative aspect-[3/4]">
                      <Image
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600"
                        alt="Veronica Winton"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <p className="text-lg font-medium">&ldquo;We&apos;ve managed to put two of our main competitors out of business in 6 months.&rdquo;</p>
                      <p className="mt-4 font-bold">Veronica Winton</p>
                      <p className="text-sm text-white/80">CSO, Planeteria</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <RadiantFooter />
    </main>
  );
}
