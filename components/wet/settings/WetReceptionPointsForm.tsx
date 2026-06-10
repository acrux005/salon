"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { updateVetReceptionPointsAction } from "@/app/actions/vetSettings";
import type { VetReceptionPoint } from "@/lib/vet/onboarding";

const TYPE_OPTIONS = [
  { value: "gabinet", label: "Gabinet" },
  { value: "oddzial", label: "Oddział" },
  { value: "teren", label: "Teren / wizyty terenowe" },
  { value: "mobilny", label: "Mobilny wet" },
] as const;

function emptyPoint(): VetReceptionPoint {
  return { id: crypto.randomUUID(), name: "", type: "gabinet" };
}

export function WetReceptionPointsForm({ initial }: { initial: VetReceptionPoint[] }) {
  const [points, setPoints] = useState<VetReceptionPoint[]>(initial.length ? initial : [emptyPoint()]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updatePoint(index: number, patch: Partial<VetReceptionPoint>) {
    setPoints((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const res = await updateVetReceptionPointsAction(points);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setMessage("Zapisano punkty przyjęć.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
      {message && <p className="rounded-lg bg-green-50 px-3 py-2 text-[14px] text-green-800">{message}</p>}

      <p className="text-[14px] text-wet-navy-muted">
        Gabinet 1, gabinet 2, oddział, wizyty terenowe — bez magazynu i ERP. Punkty pomagają w większych klinikach
        i przy kilku lekarzach.
      </p>

      {points.map((point, index) => (
        <div key={point.id} className="rounded-xl border border-wet-teal-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-wet-navy">Punkt {index + 1}</p>
            {points.length > 1 && (
              <button
                type="button"
                onClick={() => setPoints((prev) => prev.filter((_, i) => i !== index))}
                className="inline-flex items-center gap-1 text-[13px] text-red-600 hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Usuń
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-[13px] font-medium">Nazwa</span>
              <input
                className="wet-input mt-1"
                value={point.name}
                onChange={(e) => updatePoint(index, { name: e.target.value })}
                placeholder="np. Gabinet 1, Oddział terenowy"
                required
              />
            </label>
            <label className="block">
              <span className="text-[13px] font-medium">Typ</span>
              <select
                className="wet-input mt-1"
                value={point.type ?? "gabinet"}
                onChange={(e) => updatePoint(index, { type: e.target.value as VetReceptionPoint["type"] })}
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[13px] font-medium">Telefon</span>
              <input
                className="wet-input mt-1"
                value={point.phone ?? ""}
                onChange={(e) => updatePoint(index, { phone: e.target.value })}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[13px] font-medium">Ulica i numer</span>
              <input
                className="wet-input mt-1"
                value={[point.street, point.houseNumber].filter(Boolean).join(" ")}
                onChange={(e) => {
                  const parts = e.target.value.trim().split(/\s+/);
                  const houseNumber = parts.length > 1 ? parts.pop() : "";
                  updatePoint(index, { street: parts.join(" "), houseNumber: houseNumber || undefined });
                }}
              />
            </label>
            <label className="block">
              <span className="text-[13px] font-medium">Kod pocztowy</span>
              <input
                className="wet-input mt-1"
                value={point.postalCode ?? ""}
                onChange={(e) => updatePoint(index, { postalCode: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-[13px] font-medium">Miasto</span>
              <input
                className="wet-input mt-1"
                value={point.city ?? ""}
                onChange={(e) => updatePoint(index, { city: e.target.value })}
              />
            </label>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setPoints((prev) => [...prev, emptyPoint()])}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-wet-teal-300 px-4 py-2 text-[13px] font-medium text-wet-teal-800 hover:bg-wet-teal-50"
      >
        <Plus className="h-4 w-4" />
        Dodaj punkt
      </button>

      <button type="submit" disabled={loading} className="wet-btn-primary disabled:opacity-60">
        {loading ? "Zapisuję…" : "Zapisz punkty"}
      </button>
    </form>
  );
}
