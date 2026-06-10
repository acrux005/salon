"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { changeClinicPasswordAction } from "@/app/actions/admin";

interface Props {
  clinicAccountId: string;
  clinicName: string;
}

export function ChangePasswordButton({ clinicAccountId, clinicName }: Props) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPassword("");
      setConfirm("");
      setError("");
      setSuccess(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków.");
      return;
    }
    if (password !== confirm) {
      setError("Hasła się nie zgadzają.");
      return;
    }
    startTransition(async () => {
      const result = await changeClinicPasswordAction(clinicAccountId, password);
      if (result.ok) {
        setSuccess(true);
        setTimeout(() => setOpen(false), 1500);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[14px] font-medium text-amber-600 hover:underline"
      >
        Zmień hasło
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
            <h3 className="font-[var(--font-sans)] text-[16px] font-semibold text-[#1F1A1C]">
              Zmień hasło gabinetu
            </h3>
            <p className="mt-1 font-[var(--font-sans)] text-[13px] text-[#6F5E64]">
              {clinicName}
            </p>

            {success ? (
              <p className="mt-6 rounded-xl bg-green-50 px-4 py-3 font-[var(--font-sans)] text-[14px] text-green-700">
                Hasło zostało zmienione.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
                <div>
                  <label className="mb-1 block font-[var(--font-sans)] text-[13px] font-medium text-[#4a3f42]">
                    Nowe hasło
                  </label>
                  <input
                    ref={inputRef}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="min. 8 znaków"
                    required
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 font-[var(--font-sans)] text-[14px] outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-[var(--font-sans)] text-[13px] font-medium text-[#4a3f42]">
                    Powtórz hasło
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="powtórz nowe hasło"
                    required
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 font-[var(--font-sans)] text-[14px] outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 font-[var(--font-sans)] text-[13px] text-red-600">
                    {error}
                  </p>
                )}

                <div className="mt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={pending}
                    className="flex-1 rounded-full bg-pink-600 px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-white transition-colors hover:bg-pink-700 disabled:opacity-50"
                  >
                    {pending ? "Zapisywanie…" : "Zapisz hasło"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={pending}
                    className="flex-1 rounded-full border border-neutral-200 px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-[#6F5E64] transition-colors hover:bg-neutral-50 disabled:opacity-50"
                  >
                    Anuluj
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
