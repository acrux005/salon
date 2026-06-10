"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GabBookingModal } from "@/components/gabinet/GabBookingModal";
import type { GabClinicRecord } from "@/lib/gabinet/schema";

export function GabClinicProfileClient({ clinic }: { clinic: GabClinicRecord }) {
  const searchParams = useSearchParams();
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("book") === "1") setBookingOpen(true);
  }, [searchParams]);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-4">
        {clinic.bookingPhoneOnly && clinic.phone ? (
          <a href={`tel:${clinic.phone.replace(/\s/g, "")}`} className="gab-btn-primary">
            Zadzwoń: {clinic.phone}
          </a>
        ) : (
          <button type="button" onClick={() => setBookingOpen(true)} className="gab-btn-primary">
            Umów wizytę online
          </button>
        )}
        {clinic.phone && !clinic.bookingPhoneOnly && (
          <a href={`tel:${clinic.phone.replace(/\s/g, "")}`} className="inline-flex items-center rounded-lg border-2 border-sky-200 px-6 py-2.5 text-[15px] font-semibold text-sky-800 hover:bg-sky-50">
            {clinic.phone}
          </a>
        )}
      </div>
      {bookingOpen && (
        <GabBookingModal
          gabSlug={clinic.slug}
          gabName={clinic.name}
          vertical={clinic.vertical}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </>
  );
}
