"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AlertTriangle, ChevronDown, Menu, X } from "lucide-react";
import { ODART_SITE_URL, ODART_MARKETING_ORIGIN } from "@/lib/odartSite";
import {
  getOdartNav,
  getOdartServices,
  getRafalKowalkowskiNav,
  getRafalKowalkowskiNavEn,
  getRafalKowalkowskiServices,
  type OdartLocale,
  type OdartNavKey,
} from "@/components/odart/odartNav";
import { OdartServicesDropdown } from "@/components/odart/OdartServicesDropdown";
const SITE = ODART_SITE_URL;
const AWARIA_HREF = `${SITE}/pogotowie-it/#zgloszenie`;

type Props = {
  activeNav?: OdartNavKey;
  locale?: OdartLocale;
  /** Na rafalkowalkowski.pl linki menu wskazują na profil zamiast odart.pl. */
  profileNavVariant?: "odart" | "rafal";
};

const LABELS = {
  pl: {
    menu: "Menu",
    nav: "Menu",
    mobileNav: "Menu mobilne",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
    services: "Usługi",
    consultation: "Konsultacja",
    consultationHref: `${SITE}/kontakt/`,
    reportOutage: "Zgłoś awarię",
    reportOutageAria: "Zgłoś awarię IT — pogotowie",
    languageLabel: "Wersja językowa",
  },
  en: {
    menu: "Menu",
    nav: "Navigation",
    mobileNav: "Mobile navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    services: "Services",
    consultation: "Consultation",
    consultationHref: `${SITE}/en/#contact`,
    reportOutage: "Report outage",
    reportOutageAria: "Report IT outage — emergency support",
    languageLabel: "Language version",
  },
} as const;

export function OdartResponsiveNav({
  activeNav,
  locale = "pl",
  profileNavVariant = "odart",
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const isRafalNav = profileNavVariant === "rafal";
  const nav = isRafalNav
    ? locale === "en"
      ? getRafalKowalkowskiNavEn()
      : getRafalKowalkowskiNav()
    : getOdartNav(locale);
  const services = isRafalNav ? getRafalKowalkowskiServices() : getOdartServices(locale);
  const baseLabels = LABELS[locale];
  const consultationHref = isRafalNav ? "/kontakt/" : baseLabels.consultationHref;
  const labels = { ...baseLabels, consultationHref };
  const mobilePlHref = isRafalNav ? "/" : `${SITE}/`;
  const mobileEnHref = isRafalNav ? `${ODART_MARKETING_ORIGIN}/en/` : `${SITE}/en/`;

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => {
    setMobileOpen(false);
    setServicesOpen(false);
  };

  return (
    <>
      <div className="flex min-w-0 flex-1 items-center justify-end">
        {/* Desktop */}
        <nav
          className="hidden w-full flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm font-medium text-neutral-300 md:flex lg:gap-x-6"
          aria-label={labels.nav}
        >
        {nav.map((item) => {
          const isActive = activeNav === item.key;
          if (item.key === "uslugi") {
            return (
              <OdartServicesDropdown
                key={item.key}
                isActive={isActive}
                label={labels.services}
                services={services}
              />
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap hover:text-white ${isActive ? "font-semibold text-white" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
        {locale === "pl" ? (
          <Link
            href={AWARIA_HREF}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-red-500/80 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300"
            aria-label={labels.reportOutageAria}
          >
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
            {labels.reportOutage}
          </Link>
        ) : null}
        <Link
          href={labels.consultationHref}
          className="whitespace-nowrap rounded-full bg-odart-accent px-5 py-2 text-sm text-white hover:brightness-110"
        >
          {labels.consultation}
        </Link>
        </nav>

        {/* Mobile — hamburger po prawej */}
        <div className="flex justify-end md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-white hover:bg-white/10"
            aria-label={labels.openMenu}
            aria-expanded={mobileOpen}
            aria-controls="odart-mobile-menu"
          >
            <Menu className="h-7 w-7" strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>

      {typeof document !== "undefined" && mobileOpen
        ? createPortal(
            <div
              className="fixed inset-0 isolate z-[9999] md:hidden"
              id="odart-mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={labels.nav}
            >
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                role="presentation"
                onClick={close}
              />
              <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-white/10 bg-neutral-950 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                  <span className="text-lg font-semibold text-white">{labels.menu}</span>
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-lg p-2 text-neutral-400 hover:bg-white/10 hover:text-white"
                    aria-label={labels.closeMenu}
                  >
                    <X className="h-7 w-7" strokeWidth={2} aria-hidden />
                  </button>
                </div>
                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4" aria-label={labels.mobileNav}>
                  {nav.map((item) => {
                    const isActive = activeNav === item.key;
                    if (item.key === "uslugi") {
                      return (
                        <div key={item.key} className="border-b border-white/10 pb-2">
                          <button
                            type="button"
                            onClick={() => setServicesOpen((v) => !v)}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-base font-medium hover:bg-white/5 ${
                              isActive ? "text-white" : "text-neutral-200"
                            }`}
                            aria-expanded={servicesOpen}
                          >
                            {labels.services}
                            <ChevronDown
                              className={`h-5 w-5 shrink-0 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                              aria-hidden
                            />
                          </button>
                          {servicesOpen ? (
                            <div className="mt-1 flex flex-col gap-0.5 pl-2">
                              {services.map((s) => (
                                <Link
                                  key={s.href}
                                  href={s.href}
                                  className="rounded-lg px-3 py-2.5 text-sm text-neutral-400 hover:bg-white/5 hover:text-white"
                                  onClick={close}
                                >
                                  {s.label}
                                </Link>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className={`rounded-lg px-3 py-3 text-base font-medium hover:bg-white/5 ${
                          isActive ? "bg-white/[0.06] text-white" : "text-neutral-200"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                  {locale === "pl" ? (
                    <Link
                      href={AWARIA_HREF}
                      onClick={close}
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-red-500/80 px-5 py-3 text-center text-base font-semibold text-red-400 hover:bg-red-500/10"
                      aria-label={labels.reportOutageAria}
                    >
                      <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
                      {labels.reportOutage}
                    </Link>
                  ) : null}
                  <Link
                    href={labels.consultationHref}
                    onClick={close}
                    className={`rounded-full bg-odart-accent px-5 py-3 text-center text-base font-semibold text-white hover:brightness-110 ${
                      locale === "pl" ? "mt-2" : "mt-4"
                    }`}
                  >
                    {labels.consultation}
                  </Link>
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="px-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {labels.languageLabel}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Link
                        href={mobilePlHref}
                        onClick={close}
                        className={`rounded-lg px-3 py-2 text-center text-sm font-semibold ${
                          locale === "pl" ? "bg-white text-black" : "bg-white/[0.05] text-neutral-200"
                        }`}
                      >
                        PL
                      </Link>
                      <Link
                        href={mobileEnHref}
                        onClick={close}
                        className={`rounded-lg px-3 py-2 text-center text-sm font-semibold ${
                          locale === "en" ? "bg-white text-black" : "bg-white/[0.05] text-neutral-200"
                        }`}
                      >
                        EN
                      </Link>
                    </div>
                  </div>
                </nav>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
