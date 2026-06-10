"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Phone, X, Heart, Shield, Lock } from "lucide-react";
import { useClinicData } from "@/contexts/ClinicDataContext";
import { useClinicContactModal } from "@/contexts/ClinicContactModalContext";
import { useClinicBooking } from "@/contexts/ClinicBookingContext";
import { BookingCalendarModal } from "@/components/BookingCalendarModal";
import { WaitlistForm } from "@/components/clinic/WaitlistForm";
import { saveClientBookingAction } from "@/app/actions/client";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function ClinicSidebar() {
  const router = useRouter();
  const { sidebar, hero, clinicSlug, clinicId, clinicCosmoStaffId, sessionInfo, initialOpenBooking, profile } = useClinicData();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const { openContactModal } = useClinicContactModal();
  const { calendarOpen, preselectedServiceSlug, openCalendar, closeCalendar, gateOpen, openGate, closeGate } = useClinicBooking();
  const rawUrl = (hero as { imageUrl?: string })?.imageUrl;
  const imageSrc = !rawUrl
    ? DEFAULT_AVATAR
    : rawUrl.startsWith("http")
      ? rawUrl
      : `${BASE_PATH}${rawUrl}`;

  const isClient = sessionInfo?.isClient === true;
  const clientInfo = sessionInfo?.clientInfo;
  const clinicName = profile?.name;

  useEffect(() => {
    if (isClient && clinicId) {
      fetch(`${BASE_PATH}/api/favorites`)
        .then((r) => r.json())
        .then((data: { clinicIds?: string[] }) => {
          if (Array.isArray(data.clinicIds) && data.clinicIds.includes(clinicId)) setIsFavorite(true);
          setFavoritesLoaded(true);
        })
        .catch(() => setFavoritesLoaded(true));
    } else {
      setFavoritesLoaded(true);
    }
  }, [isClient, clinicId]);

  const toggleFavorite = async () => {
    if (!clinicId || !isClient || favoriteLoading) return;
    setFavoriteLoading(true);
    try {
      const res = await fetch(`${BASE_PATH}/api/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicId }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.ok) setIsFavorite((data as { favorite?: boolean }).favorite ?? false);
      router.refresh();
    } finally {
      setFavoriteLoading(false);
    }
  };

  useEffect(() => {
    if (initialOpenBooking && isClient && clinicSlug) {
      openCalendar();
    }
  }, [initialOpenBooking, isClient, clinicSlug, openCalendar]);

  const handleTermsClick = () => {
    if (isClient) {
      openCalendar();
    } else {
      openGate();
    }
  };

  const handleBookingSuccess = async (data: {
    id?: number;
    clinicSlug: string;
    clinicName?: string;
    date: string;
    time: string;
    serviceName?: string;
  }) => {
    if (data.id != null && typeof data.id === "number") {
      await saveClientBookingAction({
        cosmoAppointmentId: data.id,
        clinicSlug: data.clinicSlug,
        clinicName: data.clinicName,
        date: data.date,
        time: data.time,
        serviceName: data.serviceName,
      });
    }
    router.refresh();
  };

  const returnUrl = clinicSlug ? `/portal/gabinet/${clinicSlug}?rezerwacja=1` : "/portal/moje-rezerwacje";
  const loginHref = `/portal/login?callbackUrl=${encodeURIComponent(returnUrl)}`;
  const registerHref = `/portal/register-klient?callbackUrl=${encodeURIComponent(returnUrl)}`;

  return (
    <aside className="order-first w-full shrink-0 lg:order-none lg:sticky lg:top-24 lg:self-start lg:max-w-[320px]">
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="relative aspect-video w-full bg-neutral-100">
          <Image
            src={imageSrc}
            alt={clinicName ?? sidebar.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 320px"
            unoptimized
          />
        </div>
        <div className="p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-[var(--font-sans)] text-[17px] font-semibold text-[#1F1A1C]">
            {sidebar.title}
          </h3>
          {isClient && favoritesLoaded && clinicId && (
            <button
              type="button"
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              className="rounded-full p-1.5 text-[#6F5E64] hover:bg-pink-50 hover:text-pink-600 disabled:opacity-50"
              aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? "fill-pink-500 text-pink-500" : ""}`}
                aria-hidden
              />
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={openContactModal}
            className="block w-full rounded-full bg-pink-500 py-3 text-center font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            {sidebar.ctaBook}
          </button>
          <button
            type="button"
            onClick={handleTermsClick}
            className="block w-full rounded-full border border-pink-200 py-3 text-center font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] hover:bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label="Zobacz dostępne terminy w kalendarzu"
          >
            {sidebar.ctaTerms}
          </button>
          <BookingCalendarModal
            open={calendarOpen}
            onClose={closeCalendar}
            clinicSlug={clinicSlug}
            defaultStaffId={clinicCosmoStaffId}
            serviceSlug={preselectedServiceSlug}
            clientInfo={clientInfo}
            clinicName={clinicName}
            onBookingSuccess={handleBookingSuccess}
          />

          {gateOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gate-title"
            >
              <div className="absolute inset-0 bg-black/50" aria-hidden="true" onClick={closeGate} />
              <div className="relative z-10 w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between gap-2">
                  <h2 id="gate-title" className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
                    Rezerwacja wizyty
                  </h2>
                  <button
                    type="button"
                    onClick={closeGate}
                    className="rounded-full p-2 text-[#6F5E64] hover:bg-neutral-100"
                    aria-label="Zamknij"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-3 text-[14px] text-[#6F5E64]">
                  Aby zarezerwować termin i mieć rezerwację przypisaną do swojego konta (historia w „Moje rezerwacje”), zaloguj się lub załóż konto klienta.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href={loginHref}
                    className="block rounded-full bg-pink-500 py-3 text-center font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600"
                  >
                    Zaloguj się
                  </Link>
                  <Link
                    href={registerHref}
                    className="block rounded-full border border-pink-200 py-3 text-center font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] hover:bg-pink-50/50"
                  >
                    Zarejestruj się
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        {clinicSlug && (
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <WaitlistForm clinicSlug={clinicSlug} />
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3 border-t border-neutral-100 pt-4">
          <span className="inline-flex items-center gap-1.5 text-[12px] text-[#6F5E64]">
            <Shield className="h-3.5 w-3.5" aria-hidden />
            Dane chronione (RODO)
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-[#6F5E64]">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Bezpieczna rezerwacja
          </span>
        </div>
        <div className="mt-4 border-t border-neutral-100 pt-4">
          <a
            href={sidebar.telHref}
            className="flex items-center gap-2 font-[var(--font-sans)] text-[15px] text-[#1F1A1C] hover:text-pink-600"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            {sidebar.telLabel}
          </a>
          <p className="mt-2 flex items-center gap-2 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            {sidebar.address}
          </p>
        </div>
        </div>
      </div>
    </aside>
  );
}
