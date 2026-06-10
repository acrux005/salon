"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import type { CartItem } from "./CartContext";

type Props = {
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  totalPlz: number;
};

export function CartCheckout({ restaurantId, restaurantName, items, totalPlz }: Props) {
  const router = useRouter();
  const { clearCart } = useCart();
  const [type, setType] = useState<"pickup" | "delivery">("pickup");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryPostalCode, setDeliveryPostalCode] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchSlots = useCallback(async (d: string) => {
    if (!d) { setSlots([]); setSlot(""); return; }
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/slots?restaurantId=${encodeURIComponent(restaurantId)}&date=${encodeURIComponent(d)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Błąd slotów");
      setSlots(data.slots ?? []);
      setSlot("");
    } catch (e) {
      setSlots([]);
      setSlot("");
      setError(e instanceof Error ? e.message : "Błąd ładowania slotów");
    } finally {
      setLoadingSlots(false);
    }
  }, [restaurantId]);

  const onDateChange = (d: string) => {
    setDate(d);
    fetchSlots(d);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Podaj imię i nazwisko"); return; }
    if (!phone.trim()) { setError("Podaj numer telefonu"); return; }
    if (!date) { setError("Wybierz dzień"); return; }
    if (!slot) { setError("Wybierz godzinę"); return; }
    if (type === "delivery") {
      if (!deliveryPostalCode.trim()) {
        setError("Podaj kod pocztowy dostawy");
        return;
      }
      if (!deliveryAddress.trim()) {
        setError("Podaj adres dostawy (ulica, numer, miasto)");
        return;
      }
      try {
        const chk = await fetch("/api/delivery-postal-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postalCode: deliveryPostalCode.trim() }),
        });
        const chkData = (await chk.json()) as { ok?: boolean; error?: string };
        if (!chkData.ok) {
          setError(chkData.error || "Kod pocztowy nie jest w strefie dostawy.");
          return;
        }
      } catch {
        setError("Nie udało się zweryfikować kodu pocztowego. Spróbuj ponownie.");
        return;
      }
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim() || undefined,
          type,
          deliveryPostalCode: type === "delivery" ? deliveryPostalCode.trim() : undefined,
          deliveryAddress: type === "delivery" ? deliveryAddress.trim() : undefined,
          scheduledDate: date,
          scheduledSlot: slot,
          note: note.trim() || undefined,
          items: items.map((i) => ({ menuItemId: i.menuItemId, name: i.name, pricePlz: i.pricePlz, quantity: i.quantity, options: i.options })),
          totalPlz,
        }),
      });
      const data = await res.json() as { error?: string; publicNumber?: string | null };
      if (!res.ok) throw new Error(data.error || "Błąd składania zamówienia");
      clearCart();
      const nr = typeof data.publicNumber === "string" && data.publicNumber ? data.publicNumber : "";
      router.push(nr ? `/zamowienie-dziekujemy?nr=${encodeURIComponent(nr)}` : "/zamowienie-dziekujemy");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Błąd zapisu zamówienia");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-stone-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-stone-900">Dane i termin</h2>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-stone-700">Imię i nazwisko *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700">Telefon *</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700">E-mail (opcjonalnie)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </div>
      <div>
        <span className="block text-sm font-medium text-stone-700">Sposób odbioru</span>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" checked={type === "pickup"} onChange={() => setType("pickup")} />
            Odbiór
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={type === "delivery"} onChange={() => setType("delivery")} />
            Dostawa
          </label>
        </div>
      </div>
      {type === "delivery" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">Kod pocztowy *</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              value={deliveryPostalCode}
              onChange={(e) => setDeliveryPostalCode(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
              placeholder="np. 00-950"
            />
            <p className="mt-1 text-xs text-stone-500">
              <a href="/sprawdz-dostawe" className="font-medium text-zamow-orange-600 hover:underline">
                Sprawdź kod przed zamówieniem
              </a>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">Adres (ulica, numer, miasto) *</label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
              placeholder="Bez kodu pocztowego — kod jest powyżej"
            />
          </div>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-stone-700">Dzień *</label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => onDateChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700">Godzina *</label>
        {loadingSlots ? (
          <p className="mt-1 text-sm text-stone-500">Ładowanie…</p>
        ) : (
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
            disabled={!date || slots.length === 0}
          >
            <option value="">Wybierz godzinę</option>
            {slots.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700">Uwagi (opcjonalnie)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          placeholder="Np. alergie, życzenia"
        />
      </div>
      <p className="text-sm text-stone-600">Razem: {totalPlz} zł (płatność przy odbiorze/dostawie)</p>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-zamow-orange-600 py-3 font-medium text-white hover:bg-zamow-orange-500 disabled:opacity-50"
      >
        {submitting ? "Wysyłanie…" : "Złóż zamówienie"}
      </button>
    </form>
  );
}
