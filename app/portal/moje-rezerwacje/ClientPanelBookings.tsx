"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookingCalendarModal } from "@/components/BookingCalendarModal";
import { saveClientBookingAction } from "@/app/actions/client";

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

const STATUS_LABELS: Record<string, string> = {
  planned: "Zaplanowana",
  done: "Zrealizowana",
  cancelled: "Anulowana",
  archived: "Archiwum",
};

type BookingRow = {
  id: string;
  cosmoAppointmentId?: number;
  clinicSlug: string;
  clinicName: string | null;
  clinicId?: string;
  date: string;
  time: string;
  serviceName: string | null;
  status: string;
  source?: "cosmo" | "portal";
};

type ClinicOption = { slug: string; name: string };

export function ClientPanelBookings({
  bookings,
  clinics,
  favoriteClinics = [],
  clientInfo,
}: {
  bookings: BookingRow[];
  clinics: ClinicOption[];
  favoriteClinics?: ClinicOption[];
  clientInfo?: { name?: string; email?: string; phone?: string };
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<ClinicOption | null>(null);
  // Wiadomość prywatna do gabinetu
  const [msgClinic, setMsgClinic] = useState<{ id: string; name: string; slug: string } | null>(null);
  const [msgBody, setMsgBody] = useState("");
  const [msgSending, setMsgSending] = useState(false);
  const [msgError, setMsgError] = useState<string | null>(null);
  const [msgSent, setMsgSent] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const cancelBooking = async (b: BookingRow) => {
    if (b.status !== "planned" || !b.source) return;
    setCancelError(null);
    setCancellingId(b.id);
    try {
      const res = await fetch(`${BASE}/api/booking/client-cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id, source: b.source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCancelError((data as { error?: string }).error ?? "Nie udało się anulować.");
        return;
      }
      router.refresh();
    } finally {
      setCancellingId(null);
    }
  };

  const openMsg = (b: BookingRow) => {
    if (!b.clinicId) return;
    setMsgClinic({ id: b.clinicId, name: b.clinicName ?? b.clinicSlug, slug: b.clinicSlug });
    setMsgBody("");
    setMsgError(null);
    setMsgSent(false);
  };

  const sendMsg = async () => {
    if (!msgBody.trim() || !msgClinic) return;
    setMsgSending(true);
    setMsgError(null);
    try {
      const res = await fetch(`${BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toType: "clinic",
          toId: msgClinic.id,
          body: msgBody.trim(),
          subject: `Rezerwacja — ${msgClinic.name}`,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMsgError((j as { error?: string }).error ?? "Błąd wysyłania.");
        return;
      }
      setMsgSent(true);
      setMsgBody("");
    } finally {
      setMsgSending(false);
    }
  };

  const handleBookingSuccess = async (data: {
    id?: number | string;
    clinicSlug: string;
    clinicName?: string;
    date: string;
    time: string;
    serviceName?: string;
  }) => {
    if (data.id == null) return;
    if (typeof data.id === "number") {
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

  const openModal = () => {
    if (selectedClinic) setModalOpen(true);
  };

  return (
    <div className="mt-8 space-y-8">
      {favoriteClinics.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <h2 className="font-[var(--font-sans)] text-lg font-medium text-[#1F1A1C]">
            Ulubione gabinety
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {favoriteClinics.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/portal/gabinet/${c.slug}`}
                  className="rounded-full border border-pink-200 px-4 py-2 text-[14px] font-medium text-pink-600 hover:bg-pink-50"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Nowa rezerwacja */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h2 className="font-[var(--font-sans)] text-lg font-medium text-[#1F1A1C]">
          Zarezerwuj wizytę
        </h2>
        <p className="mt-1 text-[14px] text-[#6F5E64]">
          Wybierz gabinet i termin. Rezerwacja trafi do kalendarza gabinetu.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[200px]">
            <label htmlFor="client-clinic" className="block text-[13px] font-medium text-[#6F5E64]">
              Gabinet
            </label>
            <select
              id="client-clinic"
              value={selectedClinic?.slug ?? ""}
              onChange={(e) => {
                const c = clinics.find((x) => x.slug === e.target.value);
                setSelectedClinic(c ?? null);
              }}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px]"
            >
              <option value="">— wybierz gabinet —</option>
              {clinics.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={openModal}
            disabled={!selectedClinic}
            className="rounded-full bg-pink-500 px-5 py-2.5 text-[14px] font-medium text-white hover:bg-pink-600 disabled:opacity-50"
          >
            Wybierz termin
          </button>
        </div>
      </div>

      {/* Lista rezerwacji */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h2 className="font-[var(--font-sans)] text-lg font-medium text-[#1F1A1C]">
          Twoje rezerwacje
        </h2>
        {cancelError && (
          <p className="mt-2 text-[13px] text-red-600">{cancelError}</p>
        )}
        {bookings.length === 0 ? (
          <p className="mt-3 text-[14px] text-[#6F5E64]">
            Nie masz jeszcze żadnych rezerwacji. Użyj formularza powyżej, aby zarezerwować wizytę.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="rounded-lg border border-neutral-100 bg-neutral-50/50 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <Link
                      href={`/portal/gabinet/${b.clinicSlug}`}
                      className="font-semibold text-pink-600 hover:underline"
                    >
                      {b.clinicName || b.clinicSlug}
                    </Link>
                    <span className="ml-2 text-[14px] text-[#6F5E64]">
                      {b.date} {b.time}
                      {b.serviceName ? ` · ${b.serviceName}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-neutral-200 px-2.5 py-0.5 text-[13px] text-[#1F1A1C]">
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                    {b.status === "planned" && b.source === "portal" && (
                      <a
                        href={`${BASE}/api/booking/ical?id=cb-${b.id}`}
                        className="rounded-full border border-neutral-200 px-3 py-1 text-[12px] font-medium text-[#6F5E64] hover:bg-neutral-50"
                      >
                        📅 Kalendarz
                      </a>
                    )}
                    {b.status === "planned" && (
                      <button
                        type="button"
                        onClick={() => cancelBooking(b)}
                        disabled={!!cancellingId}
                        className="rounded-full border border-red-200 px-3 py-1 text-[12px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {cancellingId === b.id ? "Anulowanie…" : "Anuluj wizytę"}
                      </button>
                    )}
                    {b.clinicId && (
                      <button
                        type="button"
                        onClick={() => openMsg(b)}
                        className="rounded-full border border-pink-300 px-3 py-1 text-[12px] font-medium text-pink-600 hover:bg-pink-50"
                      >
                        ✉ Napisz
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline formularz wiadomości */}
                {msgClinic?.id === b.clinicId && msgClinic && (
                  <div className="mt-3 rounded-xl border border-pink-100 bg-pink-50/40 p-3">
                    {msgSent ? (
                      <div className="flex items-center justify-between">
                        <p className="text-[14px] font-medium text-green-700">
                          Wiadomość wysłana do {msgClinic.name} ✓
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setMsgSent(false); setMsgBody(""); }}
                            className="text-[13px] text-pink-600 hover:underline"
                          >
                            Napisz kolejną
                          </button>
                          <Link
                            href="/portal/wiadomosci"
                            className="text-[13px] text-pink-600 hover:underline"
                          >
                            Skrzynka →
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mb-2 text-[13px] font-medium text-[#1F1A1C]">
                          Wiadomość do: <span className="text-pink-600">{msgClinic.name}</span>
                        </p>
                        {msgError && (
                          <p className="mb-2 text-[13px] text-red-500">{msgError}</p>
                        )}
                        <textarea
                          value={msgBody}
                          onChange={(e) => setMsgBody(e.target.value)}
                          rows={3}
                          placeholder="Napisz wiadomość do gabinetu…"
                          className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[14px] text-[#1F1A1C] placeholder-neutral-400 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                        />
                        <div className="mt-2 flex justify-between">
                          <button
                            type="button"
                            onClick={() => setMsgClinic(null)}
                            className="text-[13px] text-neutral-400 hover:text-neutral-600"
                          >
                            Anuluj
                          </button>
                          <button
                            type="button"
                            onClick={sendMsg}
                            disabled={msgSending || !msgBody.trim()}
                            className="rounded-full bg-pink-500 px-4 py-1.5 text-[13px] font-medium text-white hover:bg-pink-600 disabled:opacity-40"
                          >
                            {msgSending ? "Wysyłanie…" : "Wyślij"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <BookingCalendarModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        clinicSlug={selectedClinic?.slug}
        clientInfo={clientInfo}
        clinicName={selectedClinic?.name}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}
