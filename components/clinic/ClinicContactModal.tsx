"use client";

import Link from "next/link";
import { MapPin, Phone, X } from "lucide-react";
import { useClinicData } from "@/contexts/ClinicDataContext";

interface ClinicContactModalProps {
  open: boolean;
  onClose: () => void;
}

export function ClinicContactModal({ open, onClose }: ClinicContactModalProps) {
  const { profile, sidebar } = useClinicData();

  if (!open) return null;

  const hasPhone = sidebar.telHref && sidebar.telHref !== "#";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="contact-modal-title"
            className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C]"
          >
            Dane kontaktowe
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-1.5 text-[#6F5E64] hover:bg-neutral-100 hover:text-[#1F1A1C] focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label="Zamknij"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
          {profile.name}
        </p>
        <div className="mt-6 space-y-4">
          {hasPhone && (
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 shrink-0 text-pink-500" aria-hidden />
              <div>
                <p className="text-[13px] font-medium text-[#6F5E64]">Telefon</p>
                <a
                  href={sidebar.telHref}
                  className="font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] hover:text-pink-600 hover:underline"
                >
                  {sidebar.telLabel}
                </a>
              </div>
            </div>
          )}
          {sidebar.address && sidebar.address !== "—" && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-pink-500" aria-hidden />
              <div>
                <p className="text-[13px] font-medium text-[#6F5E64]">Adres</p>
                <p className="font-[var(--font-sans)] text-[15px] text-[#1F1A1C]">
                  {sidebar.address}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-8 flex flex-col gap-3">
          {sidebar.ctaBookHref && (
            <Link
              href={sidebar.ctaBookHref}
              onClick={onClose}
              className="block rounded-full bg-pink-500 py-3 text-center font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600"
            >
              {sidebar.ctaBook}
            </Link>
          )}
          <button
            type="button"
            onClick={onClose}
            className="block w-full rounded-full border border-neutral-200 py-3 text-center font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            Zamknij
          </button>
        </div>
      </div>
    </>
  );
}
