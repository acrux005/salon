"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Calendar } from "lucide-react";
import { setBookingPhoneOnlyAction } from "@/app/actions/clinic";

export function CalendarOrPhoneOnly({
  bookingPhoneOnly,
  phone,
  children,
}: {
  bookingPhoneOnly: boolean;
  phone?: string | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleSetPhoneOnly = async (value: boolean) => {
    setBusy(true);
    try {
      const res = await setBookingPhoneOnlyAction(value);
      if (res.ok) router.refresh();
      else alert(res.error);
    } finally {
      setBusy(false);
    }
  };

  if (bookingPhoneOnly) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 text-[#1F1A1C]">
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" aria-hidden />
          <div>
            <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
              Rezerwacje tylko telefonicznie
            </h2>
            <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
              Ten gabinet nie korzysta z kalendarza online. Klienci umawiają wizyty wyłącznie przez telefon.
            </p>
            {phone ? (
              <p className="mt-3 font-[var(--font-sans)] text-[15px]">
                <span className="text-[#6F5E64]">Podaj klientom numer: </span>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="font-semibold text-pink-600 hover:underline"
                >
                  {phone}
                </a>
              </p>
            ) : (
              <p className="mt-3 text-[13px] text-amber-700">
                Uzupełnij numer telefonu w sekcji Klinika → Kontakt, aby wyświetlał się tutaj.
              </p>
            )}
            <button
              type="button"
              onClick={() => handleSetPhoneOnly(false)}
              disabled={busy}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] shadow-sm border border-neutral-200 hover:bg-neutral-50 disabled:opacity-60"
            >
              <Calendar className="h-4 w-4" />
              {busy ? "Zapisywanie…" : "Przełącz na kalendarz online"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <div className="mt-6 border-t border-neutral-100 pt-4">
        <button
          type="button"
          onClick={() => handleSetPhoneOnly(true)}
          disabled={busy}
          className="inline-flex items-center gap-2 font-[var(--font-sans)] text-[14px] text-[#6F5E64] hover:text-pink-600 hover:underline disabled:opacity-60"
        >
          <Phone className="h-4 w-4" />
          {busy ? "Zapisywanie…" : "Rezerwacje tylko telefonicznie (wyłącz kalendarz online)"}
        </button>
      </div>
    </>
  );
}
