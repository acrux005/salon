"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateOwnerConsentsAction } from "@/app/actions/vetClients";
import { consentTypeLabel } from "@/lib/vet/consentLabels";
import { WetOwnerNotificationPrefs } from "@/components/wet/WetOwnerNotificationPrefs";

export type WetClientCardData = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  smsConsent: boolean;
  emailConsent: boolean;
  pushConsent: boolean;
  marketingConsent: boolean;
  notes: string | null;
  createdAt: string;
  pets: { id: string; name: string; species: string }[];
  consentLogs: {
    id: string;
    consentType: string;
    granted: boolean;
    source: string;
    note: string | null;
    createdAt: string;
  }[];
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function WetClientCardView({ client }: { client: WetClientCardData }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function toggleConsent(consentType: "sms" | "email" | "push" | "marketing", granted: boolean) {
    setError("");
    setLoading(consentType);
    const fd = new FormData();
    fd.set("ownerId", client.id);
    fd.set("consentType", consentType);
    fd.set("granted", granted ? "true" : "false");
    fd.set("note", granted ? "Włączono w panelu" : "Wyłączono w panelu");
    const result = await updateOwnerConsentsAction(fd);
    setLoading(null);
    if (result.ok) {
      router.refresh();
      return;
    }
    setError(result.error);
  }

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6">
        <Link href="/wet/panel/klienci/lista" className="text-[13px] font-medium text-wet-teal hover:underline">
          ← Lista klientów
        </Link>
        <h2 className="mt-2 text-xl font-bold text-wet-navy">{client.name}</h2>
        <p className="mt-1 text-[14px] text-wet-navy-muted">
          {client.phone}
          {client.email ? ` · ${client.email}` : ""}
        </p>
        <p className="mt-1 text-[12px] text-wet-navy-muted">
          Klient od {formatDateTime(client.createdAt)}
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700" role="alert">
          {error}
        </p>
      )}

      <section className="mb-8">
        <WetOwnerNotificationPrefs
          value={{
            smsConsent: client.smsConsent,
            emailConsent: client.emailConsent,
            pushConsent: client.pushConsent,
            marketingConsent: client.marketingConsent,
          }}
          onChange={(next) => {
            const keys = ["sms", "email", "push", "marketing"] as const;
            for (const key of keys) {
              const field = `${key}Consent` as keyof typeof next;
              const prev =
                key === "sms"
                  ? client.smsConsent
                  : key === "email"
                    ? client.emailConsent
                    : key === "push"
                      ? client.pushConsent
                      : client.marketingConsent;
              if (next[field] !== prev) {
                toggleConsent(key, next[field]);
                break;
              }
            }
          }}
          ownerId={client.id}
          disabled={!!loading}
        />
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-wet-teal-200 bg-white p-4 lg:col-span-2">
          <h3 className="text-[15px] font-semibold text-wet-navy">Zwierzęta</h3>
          {client.pets.length === 0 ? (
            <p className="mt-3 text-[14px] text-wet-navy-muted">Brak zarejestrowanych zwierząt.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {client.pets.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/wet/panel/zwierzeta/${p.id}`}
                    className="text-[14px] font-medium text-wet-teal hover:underline"
                  >
                    {p.name}
                  </Link>
                  <span className="ml-2 text-[13px] text-wet-navy-muted">({p.species})</span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/wet/panel/zwierzeta/nowe"
            className="mt-4 inline-block text-[13px] font-medium text-wet-teal hover:underline"
          >
            + Dodaj zwierzę
          </Link>
        </div>
      </section>

      {client.notes && (
        <div className="mb-8 rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 px-4 py-3 text-[14px]">
          <p className="font-medium text-wet-teal-800">Uwagi</p>
          <p className="mt-1 whitespace-pre-wrap">{client.notes}</p>
        </div>
      )}

      <section>
        <h3 className="mb-3 text-lg font-semibold text-wet-navy">Historia zgód</h3>
        <div className="overflow-hidden rounded-xl border border-wet-teal-200 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-wet-teal-100 bg-wet-teal-50/80 text-[12px] font-semibold uppercase tracking-wide text-wet-navy-muted">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Typ</th>
                <th className="px-4 py-3">Status</th>
                <th className="hidden px-4 py-3 sm:table-cell">Źródło</th>
                <th className="hidden px-4 py-3 md:table-cell">Notatka</th>
              </tr>
            </thead>
            <tbody>
              {client.consentLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-wet-navy-muted">
                    Brak wpisów w historii zgód.
                  </td>
                </tr>
              ) : (
                client.consentLogs.map((log) => (
                  <tr key={log.id} className="border-b border-wet-teal-50 last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
                    <td className="px-4 py-3">{consentTypeLabel(log.consentType)}</td>
                    <td className="px-4 py-3">
                      {log.granted ? (
                        <span className="font-medium text-green-700">Wyrażona</span>
                      ) : (
                        <span className="text-wet-navy-muted">Cofnięta</span>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell capitalize">{log.source}</td>
                    <td className="hidden px-4 py-3 md:table-cell text-wet-navy-muted">
                      {log.note || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
