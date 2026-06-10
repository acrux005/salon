"use client";

import { useState } from "react";
import { updateVetAccountPasswordAction } from "@/app/actions/vetSettings";

export function WetAccountPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const res = await updateVetAccountPasswordAction(fd);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setMessage("Hasło zostało zmienione.");
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
      {message && <p className="rounded-lg bg-green-50 px-3 py-2 text-[14px] text-green-800">{message}</p>}
      <label className="block">
        <span className="text-[14px] font-medium">Obecne hasło</span>
        <input type="password" name="currentPassword" className="wet-input mt-1" required autoComplete="current-password" />
      </label>
      <label className="block">
        <span className="text-[14px] font-medium">Nowe hasło</span>
        <input type="password" name="newPassword" className="wet-input mt-1" required minLength={8} autoComplete="new-password" />
      </label>
      <label className="block">
        <span className="text-[14px] font-medium">Powtórz nowe hasło</span>
        <input type="password" name="confirmPassword" className="wet-input mt-1" required minLength={8} autoComplete="new-password" />
      </label>
      <button type="submit" disabled={loading} className="wet-btn-primary disabled:opacity-60">
        {loading ? "Zapisuję…" : "Zmień hasło"}
      </button>
    </form>
  );
}
