"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Pencil, Trash2, ExternalLink, KeyRound } from "lucide-react";
import { changeClinicPasswordAction, deleteClinicAction } from "@/app/actions/admin";

type Clinic = {
  id: string;
  slug: string;
  name: string;
  city: string;
  isPublished: boolean;
  account: { id: string; email: string } | null;
};

export function AdminGabinetyList({ clinics }: { clinics: Clinic[] }) {
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pwdModal, setPwdModal] = useState<{
    accountId: string;
    clinicName: string;
  } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdSubmitting, setPwdSubmitting] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  function openPasswordModal(accountId: string, clinicName: string) {
    setPwdModal({ accountId, clinicName });
    setNewPassword("");
    setConfirmPassword("");
    setPwdError("");
    setPwdSuccess("");
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    if (!pwdModal) return;
    setPwdError("");
    setPwdSuccess("");
    if (newPassword.length < 10) {
      setPwdError("Hasło musi mieć min. 10 znaków.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("Hasła nie są takie same.");
      return;
    }
    setPwdSubmitting(true);
    const res = await changeClinicPasswordAction(pwdModal.accountId, newPassword);
    setPwdSubmitting(false);
    if (res.ok) {
      setPwdSuccess("Hasło zostało zmienione.");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwdModal(null), 1200);
    } else {
      setPwdError(res.error ?? "Błąd zapisu.");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (
      !confirm(
        `Usunąć gabinet „${name}"? Spowoduje to usunięcie konta, pracowników, rezerwacji i powiązanych danych.`
      )
    )
      return;
    setError("");
    setDeleting(id);
    const res = await deleteClinicAction(id);
    setDeleting(null);
    if (res.ok) window.location.reload();
    else setError(res.error ?? "Błąd usuwania.");
  }

  if (clinics.length === 0) {
    return <p className="mt-6 text-neutral-600">Brak gabinetów.</p>;
  }

  return (
    <div className="mt-6">
      {pwdModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwd-modal-title"
        >
          <form
            onSubmit={handlePasswordSubmit}
            className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-lg"
          >
            <h2 id="pwd-modal-title" className="text-lg font-medium text-neutral-900">
              Nowe hasło — {pwdModal.clinicName}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Ustaw nowe hasło do logowania na konto gabinetu (e-mail i hasło).
            </p>
            {pwdError && (
              <p className="mt-3 rounded-lg bg-red-50 p-2 text-sm text-red-700">{pwdError}</p>
            )}
            {pwdSuccess && (
              <p className="mt-3 rounded-lg bg-green-50 p-2 text-sm text-green-800">{pwdSuccess}</p>
            )}
            <label className="mt-4 block">
              <span className="text-sm font-medium text-neutral-700">Nowe hasło (min. 10 znaków)</span>
              <input
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                minLength={10}
                required
              />
            </label>
            <label className="mt-3 block">
              <span className="text-sm font-medium text-neutral-700">Powtórz hasło</span>
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                minLength={10}
                required
              />
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPwdModal(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Anuluj
              </button>
              <button
                type="submit"
                disabled={pwdSubmitting || !!pwdSuccess}
                className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50"
              >
                {pwdSubmitting ? "Zapisywanie…" : "Zapisz hasło"}
              </button>
            </div>
          </form>
        </div>
      )}
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
          <thead>
            <tr className="bg-neutral-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                Nazwa
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                Miasto
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {clinics.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50/50">
                <td className="px-4 py-3 font-medium text-neutral-900">{c.name}</td>
                <td className="px-4 py-3 text-sm text-neutral-600">{c.city}</td>
                <td className="px-4 py-3 text-sm text-neutral-600">{c.slug}</td>
                <td className="px-4 py-3 text-sm text-neutral-600">
                  {c.account?.email ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {c.isPublished ? "Opublikowany" : "Ukryty"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/portal/gabinet/${c.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                      title="Zobacz stronę"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/portal/admin/gabinet/${c.id}/edit`}
                      className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                      title="Edytuj"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (c.account) openPasswordModal(c.account.id, c.name);
                      }}
                      disabled={!c.account}
                      className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                      title={c.account ? "Zmień hasło konta" : "Brak konta logowania"}
                    >
                      <KeyRound className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id, c.name)}
                      disabled={deleting === c.id}
                      className="rounded p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                      title="Usuń"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
