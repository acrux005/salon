"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  adminBanDatingUserAction,
  adminUnbanDatingUserAction,
  hideDatingPhotoAction,
  deleteDatingPhotoAdminAction,
  resolveDatingReportAction,
  searchDatingUsersAction,
  grantDatingPremiumAdminAction,
  revokeDatingPremiumAdminAction,
  type DatingPhotoModRow,
  type DatingPremiumRow,
  type DatingPremiumStats,
  type DatingReportRow,
  type DatingUserRow,
} from "@/app/actions/randkiAdmin";
import { RandkiReportsList } from "./RandkiReportsList";
import { RandkiAdminRoomPreview } from "./RandkiAdminRoomPreview";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function RandkiAdminPanel({
  pendingReports,
  resolvedReports,
  recentPhotos,
  premiumStats,
  premiumUsers,
}: {
  pendingReports: DatingReportRow[];
  resolvedReports: DatingReportRow[];
  recentPhotos: DatingPhotoModRow[];
  premiumStats: DatingPremiumStats | null;
  premiumUsers: DatingPremiumRow[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"reports" | "users" | "photos" | "premium">("reports");
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<DatingUserRow[]>([]);
  const [grantDays, setGrantDays] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function searchUsers() {
    start(async () => {
      setError("");
      const res = await searchDatingUsersAction(query);
      if (!res.ok) setError(res.error);
      else setUsers(res.rows);
    });
  }

  function mod(action: () => Promise<{ ok: boolean; error?: string }>) {
    start(async () => {
      setError("");
      const res = await action();
      if (!res.ok) setError(res.error ?? "Błąd.");
      else router.refresh();
    });
  }

  const tabs = [
    { id: "reports" as const, label: "Zgłoszenia" },
    { id: "users" as const, label: "Użytkownicy" },
    { id: "photos" as const, label: "Zdjęcia" },
    { id: "premium" as const, label: "Premium" },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-[13px] font-medium ${tab === t.id ? "bg-rose-600 text-white" : "border border-neutral-200"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {error && <p className="mb-4 text-red-600">{error}</p>}

      {tab === "reports" && (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 font-semibold">Oczekujące</h2>
            <RandkiReportsList initialRows={pendingReports} />
          </section>
          {resolvedReports.length > 0 && (
            <section>
              <h2 className="mb-3 font-semibold text-neutral-600">Rozstrzygnięte (ostatnie)</h2>
              <ul className="space-y-2 text-[14px] text-neutral-600">
                {resolvedReports.slice(0, 20).map((r) => (
                  <li key={r.id} className="rounded border border-neutral-100 px-3 py-2">
                    {r.reportedName} — {r.actionTaken} ({r.reviewedAt?.toLocaleDateString("pl-PL")})
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {tab === "users" && (
        <div>
          <div className="mb-4 flex gap-2">
            <input className="flex-1 rounded border px-3 py-2 text-[14px]" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="E-mail lub imię…" />
            <button type="button" disabled={pending} onClick={searchUsers} className="rounded bg-rose-600 px-4 py-2 text-[13px] text-white">
              Szukaj
            </button>
          </div>
          <ul className="space-y-3">
            {users.map((u) => (
              <li key={u.accountId} className="rounded border border-neutral-200 p-4">
                <p className="font-medium">{u.displayName} · {u.email}</p>
                <p className="text-[13px] text-neutral-500">{u.city} · {u.active ? "aktywny" : "ukryty"} {u.bannedAt ? "· ZBANOWANY" : ""} {u.warnedAt ? "· ostrzeżony" : ""}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {!u.bannedAt ? (
                    <button type="button" disabled={pending} onClick={() => mod(() => adminBanDatingUserAction(u.accountId, "Ban admina"))} className="rounded bg-red-600 px-3 py-1 text-[12px] text-white">
                      Ban
                    </button>
                  ) : (
                    <button type="button" disabled={pending} onClick={() => mod(() => adminUnbanDatingUserAction(u.accountId))} className="rounded border px-3 py-1 text-[12px]">
                      Odbanuj
                    </button>
                  )}
                </div>
                <RandkiAdminRoomPreview accountId={u.accountId} displayName={u.displayName} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "photos" && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {recentPhotos.map((p) => (
            <div key={p.id} className={`rounded border p-2 ${p.hidden ? "opacity-50" : ""}`}>
              <img src={`${BASE_PATH}${p.url}`} alt="" className="aspect-square w-full rounded object-cover" />
              <p className="mt-2 text-[12px]">{p.displayName}</p>
              <RandkiAdminRoomPreview accountId={p.accountId} displayName={p.displayName} compact />
              <div className="mt-2 flex gap-2">
                <button type="button" disabled={pending} onClick={() => mod(() => hideDatingPhotoAction(p.id))} className="text-[12px] underline">
                  Ukryj
                </button>
                <button type="button" disabled={pending} onClick={() => mod(() => deleteDatingPhotoAdminAction(p.id))} className="text-[12px] text-red-600 underline">
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "premium" && (
        <div className="space-y-6">
          {premiumStats && (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-lg border border-neutral-200 p-4">
                <p className="text-[12px] uppercase text-neutral-500">Aktywne Premium</p>
                <p className="mt-1 text-2xl font-semibold">{premiumStats.activePremiumCount}</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <p className="text-[12px] uppercase text-neutral-500">Stripe / ręczne</p>
                <p className="mt-1 text-[15px]">{premiumStats.stripePremiumCount} / {premiumStats.manualPremiumCount}</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <p className="text-[12px] uppercase text-neutral-500">Wygasa ≤7 dni</p>
                <p className="mt-1 text-2xl font-semibold">{premiumStats.expiringSoonCount}</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4 sm:col-span-2 md:col-span-3">
                <p className="text-[13px] text-neutral-600">
                  Stripe: {premiumStats.stripeConfigured ? "✓ skonfigurowany" : "✗ brak kluczy w .env"} · TURN WebRTC:{" "}
                  {premiumStats.turnConfigured ? "✓" : "✗ (tylko STUN — połączenia za NAT mogą padać)"}
                </p>
              </div>
            </div>
          )}

          <section>
            <h2 className="mb-3 font-semibold">Subskrypcje i granty</h2>
            <ul className="space-y-3">
              {premiumUsers.length === 0 && <li className="text-[14px] text-neutral-500">Brak kont Premium.</li>}
              {premiumUsers.map((u) => (
                <li key={u.accountId} className="rounded border border-neutral-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">
                        {u.displayName} · {u.email}
                        {u.isPremium ? (
                          <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-[11px] text-amber-800">Premium</span>
                        ) : (
                          <span className="ml-2 rounded bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">nieaktywne</span>
                        )}
                      </p>
                      <p className="mt-1 text-[13px] text-neutral-500">
                        Źródło: {u.source === "stripe" ? "Stripe" : u.source === "manual" ? "grant admina" : "—"}
                        {u.premiumUntil ? ` · do ${u.premiumUntil.toLocaleDateString("pl-PL")}` : u.isPremium ? " · bezterminowo" : ""}
                      </p>
                      {u.stripeCustomerId && (
                        <a
                          href={`https://dashboard.stripe.com/customers/${u.stripeCustomerId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-[12px] text-pink-600 underline"
                        >
                          Stripe Dashboard →
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {!u.isPremium && (
                        <>
                          <input
                            type="number"
                            min={1}
                            max={365}
                            value={grantDays[u.accountId] ?? 30}
                            onChange={(e) =>
                              setGrantDays((prev) => ({ ...prev, [u.accountId]: Number(e.target.value) || 30 }))
                            }
                            className="w-16 rounded border px-2 py-1 text-[12px]"
                            title="Dni Premium"
                          />
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => mod(() => grantDatingPremiumAdminAction(u.accountId, grantDays[u.accountId] ?? 30))}
                            className="rounded bg-amber-500 px-3 py-1 text-[12px] text-white"
                          >
                            Nadaj Premium
                          </button>
                        </>
                      )}
                      {u.isPremium && (
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => mod(() => revokeDatingPremiumAdminAction(u.accountId))}
                          className="rounded border border-red-200 px-3 py-1 text-[12px] text-red-600"
                        >
                          Odbierz Premium
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
