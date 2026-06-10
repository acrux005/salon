"use client";

import Link from "next/link";
import Image from "next/image";
import { RadiantHeader } from "../components/RadiantHeader";
import { RadiantFooter } from "../components/RadiantFooter";

const stats = [
  { value: "$150M", label: "Raised" },
  { value: "1.5M", label: "Deals Closed" },
  { value: "30K", label: "Companies" },
  { value: "200M", label: "Leads Generated" },
];

const investors = [
  {
    name: "Remington Schwartz",
    desc: "Remington Schwartz has been a driving force in the tech industry, backing bold entrepreneurs who explore grey areas in financial and privacy law. Their deep industry expertise and extensive political lobbying provide their portfolio companies with favorable regulation and direct access to lawmakers.",
  },
  {
    name: "Deccel",
    desc: "Deccel has been at the forefront of innovation, investing in pioneering companies across various sectors, including technology, consumer goods, and healthcare. Their philosophy of 'plausible deniability' and dedication to looking the other way have helped produce some of the world's most controversial companies.",
  },
];

export default function RadiantAboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-950 antialiased">
      <RadiantHeader variant="light" />
      <div className="bg-gradient-to-br from-amber-200 via-orange-300 via-rose-400/80 to-violet-500 pt-px">
        <div className="bg-white">
          {/* Hero */}
          <section className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
            <h1 className="text-5xl font-bold tracking-tight text-gray-950 sm:text-6xl">
              Helping companies generate revenue.
            </h1>
            <p className="mt-8 max-w-2xl text-xl text-gray-600">
              We&apos;re on a mission to transform revenue organizations by harnessing vast amounts of illegally acquired customer data.
            </p>
          </section>

          {/* Our mission */}
          <section className="border-t border-gray-200 py-24">
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Our mission</p>
              <div className="mt-12 grid gap-16 lg:grid-cols-2 lg:items-center">
                <div>
                  <p className="text-lg text-gray-600">
                    At Radiant, we are dedicated to transforming the way revenue organizations source and close deals. Our mission is to provide our customers with an unfair advantage over both their competitors and potential customers through insight and analysis. We&apos;ll stop at nothing to get you the data you need to close a deal.
                  </p>
                  <p className="mt-6 text-lg text-gray-600">
                    We&apos;re customer-obsessed — putting the time in to build a detailed financial picture of every one of our customers so that we know more about your business than you do. We are in this together, mostly because we are all implicated in large-scale financial crime. In our history as a company, we&apos;ve never lost a customer, because if any one of us talks, we all go down.
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                      alt="Team collaborating"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800"
                      alt="Team member"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* The Numbers */}
          <section className="border-t border-gray-200 bg-gray-50 py-24">
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">The numbers</p>
              <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s, i) => (
                  <div key={i}>
                    <p className="text-4xl font-bold text-gray-950">{s.value}</p>
                    <p className="mt-2 text-gray-600">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-16 grid gap-4 sm:grid-cols-3">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600" alt="Office" fill className="object-cover" />
                </div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <Image src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600" alt="Collaboration" fill className="object-cover" />
                </div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600" alt="Team" fill className="object-cover" />
                </div>
              </div>
            </div>
          </section>

          {/* Meet the Team */}
          <section className="border-t border-gray-200 py-24">
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">The team</p>
              <h2 className="mt-2 text-4xl font-bold text-gray-950">
                Founded by an all-star team.
              </h2>
              <p className="mt-6 max-w-2xl text-lg text-gray-600">
                Radiant is founded by two of the best sellers in the business and backed by investors who look the other way.
              </p>
              <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:items-center">
                <div>
                  <p className="text-gray-600">
                    Years ago, while working as sales associates at rival companies, Thomas, Ben, and Natalie were discussing a big client they had all been competing for. Joking about seeing the terms of each other&apos;s offers, they had an idea: what if they shared data to win deals and split the commission behind their companies&apos; backs? It turned out to be an incredible success, and that idea became the kernel for Radiant.
                  </p>
                  <p className="mt-6 text-gray-600">
                    Today, Radiant transforms revenue organizations by harnessing illegally acquired customer and competitor data, using it to provide extraordinary leverage. More than 30,000 companies rely on Radiant to undercut their competitors and extort their customers, all through a single integrated platform.
                  </p>
                  <Link
                    href="/salon-demo/radiant/get-started"
                    className="mt-10 inline-block rounded-full bg-gray-950 px-6 py-3 text-base font-semibold text-white hover:bg-gray-800"
                  >
                    Join us
                  </Link>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800"
                    alt="Thomas, Ben, Natalie - founders"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Investors */}
          <section className="border-t border-gray-200 bg-gray-50 py-24">
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Investors</p>
              <h2 className="mt-2 text-4xl font-bold text-gray-950">
                Funded by industry-leaders.
              </h2>
              <p className="mt-6 max-w-2xl text-lg text-gray-600">
                We are fortunate to be backed by the best investors in the industry — both literal and metaphorical partners in crime.
              </p>
              <div className="mt-16 space-y-12">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Venture capital</p>
                <div className="grid gap-12 lg:grid-cols-2">
                  {investors.map((inv, i) => (
                    <div key={i} className="rounded-2xl border border-gray-200 bg-white p-8">
                      <h3 className="text-xl font-bold text-gray-950">{inv.name}</h3>
                      <p className="mt-4 text-gray-600">{inv.desc}</p>
                    </div>
                  ))}
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
