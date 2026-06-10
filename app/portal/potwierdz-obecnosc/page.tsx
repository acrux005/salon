"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

function PotwierdzObecnoscContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "ok" | "already" | "error">("loading");
  const [message, setMessage] = useState<string>("");
  const [clinicName, setClinicName] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Brak linku potwierdzenia.");
      return;
    }
    fetch(`${BASE}/api/booking/confirm-attendance?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data: { ok?: boolean; already?: boolean; message?: string; error?: string; clinicName?: string }) => {
        if (data.ok) {
          setStatus(data.already ? "already" : "ok");
          setMessage(data.message ?? "Potwierdzono przyjście.");
          setClinicName(data.clinicName ?? "");
        } else {
          setStatus("error");
          setMessage((data as { error?: string }).error ?? "Nie udało się potwierdzić.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Błąd połączenia. Spróbuj ponownie.");
      });
  }, [token]);

  return (
    <>
        <div className="mx-auto max-w-lg text-center">
          {status === "loading" && (
            <p className="font-[var(--font-sans)] text-[15px] text-[#6F5E64]">Potwierdzanie…</p>
          )}
          {status === "ok" && (
            <>
              <h1 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
                Dziękujemy!
              </h1>
              <p className="mt-4 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">{message}</p>
              {clinicName && (
                <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#1F1A1C]">
                  Do zobaczenia w <strong>{clinicName}</strong>.
                </p>
              )}
            </>
          )}
          {status === "already" && (
            <>
              <h1 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
                Już potwierdzone
              </h1>
              <p className="mt-4 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">{message}</p>
            </>
          )}
          {status === "error" && (
            <>
              <h1 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
                Nie udało się potwierdzić
              </h1>
              <p className="mt-4 font-[var(--font-sans)] text-[15px] text-red-600">{message}</p>
            </>
          )}
          <Link
            href="/portal"
            className="mt-8 inline-block rounded-full bg-pink-500 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600"
          >
            Wróć do portalu
          </Link>
        </div>
    </>
  );
}

export default function PotwierdzObecnoscPage() {
  return (
    <>
      <HeaderPortal />
      <main className="min-h-[60vh] px-4 py-16">
        <Suspense fallback={<div className="mx-auto max-w-lg text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">Ładowanie…</div>}>
          <PotwierdzObecnoscContent />
        </Suspense>
      </main>
      <FooterPortal />
    </>
  );
}
