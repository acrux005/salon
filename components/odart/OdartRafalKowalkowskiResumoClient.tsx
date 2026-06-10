"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Facebook, Instagram, Music2, Video, Youtube } from "lucide-react";
import { RAFAL_KOWALKOWSKI_GALLERY_PATH } from "@/lib/rafalKowalkowskiGallery";
import { rafalPublicHref } from "@/lib/rafalKowalkowskiLegacyRoutes";

const NAV = [
  { href: "/#home", label: "Start" },
  { href: "/#about", label: "O mnie" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: rafalPublicHref(RAFAL_KOWALKOWSKI_GALLERY_PATH), label: "Galeria" },
  { href: "/#services", label: "Usługi" },
  { href: "/#customers", label: "Klienci" },
  { href: "/blog/", label: "Blog" },
  { href: "/kontakt/", label: "Kontakt" },
] as const;

type Social = { href: string; label: string; key: "tiktok" | "facebook" | "instagram" | "youtube" | "spotify" };

const ICONS: Record<Social["key"], ReactNode> = {
  tiktok: <Video className="h-4 w-4" aria-hidden />,
  facebook: <Facebook className="h-4 w-4" aria-hidden />,
  instagram: <Instagram className="h-4 w-4" aria-hidden />,
  youtube: <Youtube className="h-4 w-4" aria-hidden />,
  spotify: <Music2 className="h-4 w-4" aria-hidden />,
};

export function OdartRafalKowalkowskiResumoMenu({ social }: { social: Social[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      const hashIdx = href.indexOf("#");
      if (href.startsWith("/") && hashIdx > 0) {
        const path = href.slice(0, hashIdx);
        const id = href.slice(hashIdx + 1);
        router.push(path);
        window.setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
        return;
      }
      if (href.startsWith("/")) {
        router.push(href);
        return;
      }
      const id = href.replace(/^#/, "");
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [router],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur transition hover:border-odart-accent/50"
        aria-expanded={open}
        aria-controls="rafal-resumo-nav"
      >
        <span>Menu</span>
        <span className="flex h-3 w-5 flex-col justify-between" aria-hidden>
          <span className="h-0.5 w-full origin-left rounded-full bg-white transition group-hover:bg-odart-accent" />
          <span className="h-0.5 w-full rounded-full bg-white transition group-hover:bg-odart-accent" />
          <span className="h-0.5 w-full origin-right rounded-full bg-white transition group-hover:bg-odart-accent" />
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[200] flex flex-col bg-[#0a0a0a]/95 backdrop-blur-md"
          id="rafal-resumo-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Menu nawigacji"
        >
          <div className="flex items-center justify-end border-b border-white/10 px-4 py-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:border-odart-accent/60"
            >
              Zamknij
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center px-8 pb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-odart-accent">Nawigacja</p>
            <ul className="mt-8 space-y-1">
              {NAV.map((item, i) => (
                <li key={item.href} style={{ transitionDelay: `${i * 40}ms` }}>
                  <button
                    type="button"
                    onClick={() => go(item.href)}
                    className="block w-full py-3 text-left text-3xl font-medium text-white transition hover:text-odart-accent sm:text-4xl"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-12 border-t border-white/10 pt-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-neutral-500">Social</p>
              <ul className="mt-4 flex flex-wrap gap-4">
                {social.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-neutral-400 transition hover:text-odart-accent"
                      onClick={() => setOpen(false)}
                    >
                      {ICONS[s.key]}
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

type TabKey = "exp" | "edu" | "skills";

export function OdartRafalKowalkowskiAboutTabs() {
  const [tab, setTab] = useState<TabKey>("exp");

  const tabs: { id: TabKey; label: string }[] = [
    { id: "exp", label: "Doświadczenie" },
    { id: "edu", label: "Edukacja" },
    { id: "skills", label: "Umiejętności" },
  ];

  return (
    <div>
      <div className="flex border-b border-white/10">
        {tabs.map((t) => {
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative flex-1 py-4 text-center text-xs font-semibold uppercase tracking-wide transition sm:text-sm ${
                on ? "text-white" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {t.label}
              {on ? <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-odart-accent" /> : null}
            </button>
          );
        })}
      </div>
      <div className="pt-8">
        {tab === "exp" ? (
          <ul className="space-y-6">
            {[
              { org: "ODART / ACRUX", range: "2018 — dziś", role: "Fotografia, audio, WWW, IT", body: "Realizacje dla klientów indywidualnych i firm: sesje, teledyski, strony, administracja systemów." },
              { org: "Fotoferia", range: "2005 — dziś", role: "Współtwórca platformy", body: "Pasja do fotografii zaowocowała projektem społecznościowym łączącą entuzjastów zdjęć." },
              { org: "Freelance", range: "2005 — dziś", role: "Produkcje muzyczne", body: "Autorskie nagrania, mix, mastering i teledyski — m.in. pod marką ACRUX." },
            ].map((x) => (
              <li key={x.org} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h5 className="text-sm font-semibold text-white">{x.org}</h5>
                  <span className="text-xs text-neutral-500">({x.range})</span>
                </div>
                <h3 className="mt-2 text-lg font-medium text-odart-accent">{x.role}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{x.body}</p>
              </li>
            ))}
          </ul>
        ) : null}
        {tab === "edu" ? (
          <ul className="space-y-6">
            {[
              { org: "Praktyka i autodydaktyka", range: "ciągle", role: "Stack webowy i audio", body: "Nowe narzędzia, AI w produkcji, bezpieczeństwo i DevOps — stałe doskonalenie." },
              { org: "Projekty komercyjne", range: "15+ lat", role: "Branża kreatywna + IT", body: "Setki wdrożeń od prostych stron po integracje z ERP i sklepy." },
            ].map((x) => (
              <li key={x.org} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h5 className="text-sm font-semibold text-white">{x.org}</h5>
                  <span className="text-xs text-neutral-500">({x.range})</span>
                </div>
                <h3 className="mt-2 text-lg font-medium text-odart-accent">{x.role}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{x.body}</p>
              </li>
            ))}
          </ul>
        ) : null}
        {tab === "skills" ? (
          <div>
            <div className="space-y-4">
              {[
                { n: "Fotografia i video", v: 94 },
                { n: "Audio / DAW", v: 90 },
                { n: "WordPress / Next.js", v: 88 },
                { n: "Sieci i administracja", v: 85 },
              ].map((s) => (
                <div key={s.n} className="rounded-lg border border-white/[0.06] bg-black/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium text-white">{s.n}</h3>
                    <span className="text-xs tabular-nums text-odart-accent">{s.v}%</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-odart-accent transition-all duration-700" style={{ width: `${s.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm leading-relaxed text-neutral-500">
              Minimalizm w kadrze, porządek w kodzie i brzmieniu — od briefu po publikację.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const ROLES = ["Fotograf", "Producent muzyczny", "Programista", "ACRUX"] as const;

export function OdartRafalKowalkowskiAnimatedTitle() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setI((x) => (x + 1) % ROLES.length), 2800);
    return () => window.clearInterval(t);
  }, []);

  return (
    <p className="text-2xl font-medium text-white sm:text-3xl">
      <span className="inline-block min-h-[1.25em] text-odart-accent transition-opacity duration-500" key={ROLES[i]}>
        {ROLES[i]}
      </span>
    </p>
  );
}
