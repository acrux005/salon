"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateClientSettingsAction } from "@/app/actions/client";

export function ClientSettingsForm({
  name,
  email,
  phone,
  notifyReminders,
  notifyPromo,
  invoiceName,
  invoiceNip,
  invoiceAddress,
}: {
  name: string;
  email: string;
  phone: string;
  notifyReminders: boolean;
  notifyPromo: boolean;
  invoiceName: string;
  invoiceNip: string;
  invoiceAddress: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const rem = (form.querySelector('[name="notifyReminders"]') as HTMLInputElement | null)?.checked ?? false;
    const prom = (form.querySelector('[name="notifyPromo"]') as HTMLInputElement | null)?.checked ?? false;
    formData.set("notifyReminders", rem ? "1" : "0");
    formData.set("notifyPromo", prom ? "1" : "0");
    const result = await updateClientSettingsAction(formData);
    setSaving(false);
    if (result.ok) {
      setMessage({ type: "ok", text: "Ustawienia zapisane." });
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="font-[var(--font-sans)] text-lg font-medium text-[#1F1A1C]">
          Profil
        </h2>
        <p className="mt-1 text-[14px] text-[#6F5E64]">
          Imię i nazwisko wyświetlane przy opiniach i w gabinecie.
        </p>
        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="name" className="block text-[13px] font-medium text-[#6F5E64]">
              Imię i nazwisko
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={name}
              placeholder="np. Anna Kowalska"
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-[13px] font-medium text-[#6F5E64]">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              readOnly
              className="mt-1 w-full rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2 text-[15px] text-[#6F5E64]"
            />
            <p className="mt-1 text-[12px] text-[#6F5E64]">E-mailu nie można zmienić tutaj.</p>
          </div>
          <div>
            <label htmlFor="phone" className="block text-[13px] font-medium text-[#6F5E64]">
              Telefon
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={phone}
              placeholder="np. 500 123 456"
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="font-[var(--font-sans)] text-lg font-medium text-[#1F1A1C]">
          Powiadomienia
        </h2>
        <label className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            name="notifyReminders"
            defaultChecked={notifyReminders}
            className="h-4 w-4 rounded border-neutral-300 text-pink-500 focus:ring-pink-500"
          />
          <span className="text-[15px] text-[#1F1A1C]">Przypomnienia e-mail przed wizytą (24h)</span>
        </label>
        <label className="mt-3 flex items-center gap-3">
          <input
            type="checkbox"
            name="notifyPromo"
            defaultChecked={notifyPromo}
            className="h-4 w-4 rounded border-neutral-300 text-pink-500 focus:ring-pink-500"
          />
          <span className="text-[15px] text-[#1F1A1C]">Promocje i newsy od gabinetów</span>
        </label>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="font-[var(--font-sans)] text-lg font-medium text-[#1F1A1C]">
          Dane do faktury
        </h2>
        <p className="mt-1 text-[14px] text-[#6F5E64]">
          Opcjonalnie — do wydruku faktury w gabinecie.
        </p>
        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="invoiceName" className="block text-[13px] font-medium text-[#6F5E64]">
              Nazwa (firma / imię i nazwisko)
            </label>
            <input
              id="invoiceName"
              name="invoiceName"
              type="text"
              defaultValue={invoiceName}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
            />
          </div>
          <div>
            <label htmlFor="invoiceNip" className="block text-[13px] font-medium text-[#6F5E64]">
              NIP
            </label>
            <input
              id="invoiceNip"
              name="invoiceNip"
              type="text"
              defaultValue={invoiceNip}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
            />
          </div>
          <div>
            <label htmlFor="invoiceAddress" className="block text-[13px] font-medium text-[#6F5E64]">
              Adres
            </label>
            <textarea
              id="invoiceAddress"
              name="invoiceAddress"
              rows={2}
              defaultValue={invoiceAddress}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
            />
          </div>
        </div>
      </div>

      {message && (
        <p className={message.type === "ok" ? "text-green-700" : "text-red-600"}>
          {message.text}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-pink-500 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600 disabled:opacity-50"
      >
        {saving ? "Zapisywanie…" : "Zapisz ustawienia"}
      </button>
    </form>
  );
}
