"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  deleteClientAction,
  deleteClinicAccountAction,
} from "@/app/actions/admin";

type Client = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  createdAt: Date;
};
type ClinicAccount = {
  id: string;
  email: string;
  clinic: { id: string; name: string; slug: string };
};

export function AdminUsersList({
  clients,
  clinicAccounts,
}: {
  clients: Client[];
  clinicAccounts: ClinicAccount[];
}) {
  const [tab, setTab] = useState<"clients" | "clinics">("clients");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDeleteClient(id: string) {
    if (!confirm("Usunąć tego klienta? Zostaną usunięte też jego rezerwacje i ulubione.")) return;
    setError("");
    setDeleting(id);
    const res = await deleteClientAction(id);
    setDeleting(null);
    if (res.ok) window.location.reload();
    else setError(res.error ?? "Błąd usuwania.");
  }

  async function handleDeleteClinicAccount(id: string) {
    if (!confirm("Usunąć to konto gabinetu? Gabinet nie będzie mógł się zalogować.")) return;
    setError("");
    setDeleting(id);
    const res = await deleteClinicAccountAction(id);
    setDeleting(null);
    if (res.ok) window.location.reload();
    else setError(res.error ?? "Błąd usuwania.");
  }

  return (
    <div className="mt-6">
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("clients")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
            tab === "clients" ? "bg-pink-600 text-white" : "bg-neutral-200 text-neutral-700"
          }`}
        >
          Klienci ({clients.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("clinics")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
            tab === "clinics" ? "bg-pink-600 text-white" : "bg-neutral-200 text-neutral-700"
          }`}
        >
          Gabinety ({clinicAccounts.length})
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        {tab === "clients" && (
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr className="bg-neutral-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Imię</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Telefon</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50/50">
                  <td className="px-4 py-3 text-sm text-neutral-900">{c.email}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{c.name ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteClient(c.id)}
                      disabled={deleting === c.id}
                      className="rounded p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
                      title="Usuń"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === "clinics" && (
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr className="bg-neutral-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Gabinet</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {clinicAccounts.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/50">
                  <td className="px-4 py-3 text-sm text-neutral-900">{r.email}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">
                    {r.clinic.name} ({r.clinic.slug})
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteClinicAccount(r.id)}
                      disabled={deleting === r.id}
                      className="rounded p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
                      title="Usuń konto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {tab === "clients" && clients.length === 0 && (
        <p className="py-8 text-center text-neutral-600">Brak klientów.</p>
      )}
      {tab === "clinics" && clinicAccounts.length === 0 && (
        <p className="py-8 text-center text-neutral-600">Brak kont gabinetów.</p>
      )}
    </div>
  );
}
