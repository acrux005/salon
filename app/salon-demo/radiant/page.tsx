"use client";

import Link from "next/link";
import { RadiantHeader } from "./components/RadiantHeader";
import { RadiantFooter } from "./components/RadiantFooter";

const salesFeatures = [
  {
    title: "Insight",
    headline: "Get perfect clarity",
    desc: "Radiant uses social engineering to build a detailed financial picture of your leads. Know their budget, compensation package, social security number, and more.",
  },
  {
    title: "Analysis",
    headline: "Undercut your competitors",
    desc: "With our advanced data mining, you'll know which companies your leads are talking to and exactly how much they're being charged.",
  },
  {
    title: "Speed",
    headline: "Built for power users",
    desc: "It's never been faster to cold email your entire contact list using our streamlined keyboard shortcuts.",
  },
  {
    title: "Source",
    headline: "Get the furthest reach",
    desc: "Bypass those inconvenient privacy laws to source leads from the most unexpected places.",
  },
  {
    title: "Limitless",
    headline: "Sell globally",
    desc: "Radiant helps you sell in locations currently under international embargo.",
  },
];

const outreachFeatures = [
  {
    title: "Networking",
    headline: "Sell at the speed of light",
    desc: "Our RadiantAI chat assistants analyze the sentiment of your conversations in real time, ensuring you're always one step ahead.",
  },
  {
    title: "Integrations",
    headline: "Meet leads where they are",
    desc: "With thousands of integrations, no one will be able to escape your cold outreach.",
  },
  {
    title: "Meetings",
    headline: "Smart call scheduling",
    desc: "Automatically insert intro calls into your leads' calendars without their consent.",
  },
  {
    title: "Engagement",
    headline: "Become a thought leader",
    desc: "RadiantAI automatically writes LinkedIn posts that relate current events to B2B sales, helping you build a reputation as a thought leader.",
  },
];

const testimonials = [
  { quote: "Thanks to Radiant, we're finding new leads that we never would have found with legal methods.", name: "Tina Yards", role: "VP of Sales, Protocol" },
  { quote: "Radiant made undercutting all of our competitors an absolute breeze.", name: "Conor Neville", role: "Head of Customer Success, TaxPal" },
  { quote: "We closed a deal in literally a few minutes because we knew their exact budget.", name: "Amy Chase", role: "Head of GTM, Pocket" },
  { quote: "We've managed to put two of our main competitors out of business in 6 months.", name: "Veronica Winton", role: "CSO, Planeteria" },
  { quote: "I was able to replace 80% of my team with RadiantAI bots.", name: "Dillon Lenora", role: "VP of Sales, Detax" },
  { quote: "I've smashed all my targets without having to speak to a lead in months.", name: "Harriet Arron", role: "Account Manager, Commit" },
];

export default function RadiantPage() {
  return (
    <main className="min-h-screen text-gray-950 antialiased">
      {/* Radiant gradient hero background */}
      <div className="relative bg-gradient-to-br from-amber-200 via-orange-300 via-rose-400/80 to-violet-500 min-h-screen">
        <RadiantHeader variant="light" />

        {/* Hero */}
        <section className="relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-32 lg:pt-32 lg:pb-40">
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
            Close every deal.
          </h1>
          <p className="mt-8 max-w-2xl text-xl text-gray-800">
            Radiant helps you sell more by revealing sensitive information about your customers.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="#"
              className="rounded-full bg-gray-950 px-6 py-3 text-base font-semibold text-white hover:bg-gray-800"
            >
              Get started
            </Link>
            <Link
              href="#pricing"
              className="rounded-full border-2 border-gray-950 bg-white/60 px-6 py-3 text-base font-semibold text-gray-950 backdrop-blur-sm hover:bg-white/80"
            >
              See pricing
            </Link>
          </div>
        </section>
      </div>

      {/* Snapshot section */}
      <section className="border-t border-gray-200 bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-gray-950">
            A snapshot of your entire sales pipeline.
          </h2>
        </div>
      </section>

      {/* Sales */}
      <section className="border-t border-gray-200 bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Sales</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-950">
            Know more about your customers than they do.
          </h2>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {salesFeatures.map((f, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-8">
                <h3 className="text-lg font-bold text-gray-950">{f.title}</h3>
                <p className="mt-2 font-semibold text-gray-900">{f.headline}</p>
                <p className="mt-4 text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outreach */}
      <section className="border-t border-gray-200 bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Outreach</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-950">
            Customer outreach has never been easier.
          </h2>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {outreachFeatures.map((f, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
                <h3 className="text-lg font-bold text-gray-950">{f.title}</h3>
                <p className="mt-2 font-semibold text-gray-900">{f.headline}</p>
                <p className="mt-4 text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-gray-200 bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-gray-950">
            What everyone is saying
          </h2>
          <p className="mt-4 text-lg text-gray-600">Trusted by professionals.</p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <blockquote key={i} className="rounded-2xl border border-gray-200 bg-white p-8">
                <p className="text-gray-800">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-6">
                  <p className="font-bold text-gray-950">{t.name}</p>
                  <p className="text-sm text-gray-600">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-gray-200 bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-gray-950">
            Pricing to fit your sales needs
          </h2>
          <p className="mt-4 text-gray-600">
            Start closing deals with Radiant. No credit card required.
          </p>
          <div className="mt-12 flex flex-wrap gap-6">
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8">
              <h3 className="text-xl font-bold text-gray-950">Starter</h3>
              <p className="mt-2 text-3xl font-bold">$49<span className="text-base font-normal text-gray-500">/mo</span></p>
              <Link href="#" className="mt-6 block rounded-full bg-gray-950 py-3 text-center font-semibold text-white hover:bg-gray-800">Get started</Link>
            </div>
            <div className="rounded-2xl border-2 border-gray-950 bg-gray-950 p-8 text-white">
              <h3 className="text-xl font-bold">Pro</h3>
              <p className="mt-2 text-3xl font-bold">$199<span className="text-base font-normal opacity-80">/mo</span></p>
              <Link href="#" className="mt-6 block rounded-full bg-white py-3 text-center font-semibold text-gray-950 hover:bg-gray-100">Get started</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 bg-gray-50 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-950">
            Join the best sellers in the business and start using Radiant to hit your targets today.
          </h2>
          <Link
            href="#"
            className="mt-10 inline-block rounded-full bg-gray-950 px-8 py-4 text-lg font-semibold text-white hover:bg-gray-800"
          >
            Get started
          </Link>
        </div>
      </section>

      <RadiantFooter />
    </main>
  );
}
