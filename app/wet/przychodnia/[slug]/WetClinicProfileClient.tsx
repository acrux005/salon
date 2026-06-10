"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WetBookingModal } from "@/components/wet/WetBookingModal";
import type { VetClinicRecord } from "@/lib/vet/schema";

export function WetClinicProfileClient({ clinic }: { clinic: VetClinicRecord }) {
  const searchParams = useSearchParams();
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("book") === "1") {
      setBookingOpen(true);
    }
  }, [searchParams]);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-4">
        {clinic.bookingPhoneOnly && clinic.phone ? (
          <a href={`tel:${clinic.phone.replace(/\s/g, "")}`} className="wet-btn-primary">
            Zadzwoń: {clinic.phone}
          </a>
        ) : (
          <button type="button" onClick={() => setBookingOpen(true)} className="wet-btn-primary">
            Umów wizytę online
          </button>
        )}
        {clinic.phone && !clinic.bookingPhoneOnly && (
          <a href={`tel:${clinic.phone.replace(/\s/g, "")}`} className="wet-btn-outline">
            {clinic.phone}
          </a>
        )}
      </div>
      {bookingOpen && (
        <WetBookingModal vetSlug={clinic.slug} vetName={clinic.name} onClose={() => setBookingOpen(false)} />
      )}
    </>
  );
}
