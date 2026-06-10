"use client";

import { useState } from "react";
import { VET_PACKAGES, type VetPackageId } from "@/lib/vet/onboarding";
import { Check } from "lucide-react";

export function WetPricingPicker({
  value,
  onChange,
}: {
  value: VetPackageId | "";
  onChange: (id: VetPackageId) => void;
}) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const selected = value || "standard";

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-wet-teal/25 bg-wet-teal-50 px-4 py-3 text-center text-[14px] font-medium text-wet-navy">
        14 dni testu na każdym planie — bez karty, anulujesz w dowolnym momencie.
      </p>
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-[13px] font-medium">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`rounded-full px-4 py-2 transition ${
              billing === "monthly" ? "bg-white text-wet-navy shadow-sm" : "text-wet-navy-muted"
            }`}
          >
            Miesięcznie
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={`rounded-full px-4 py-2 transition ${
              billing === "yearly" ? "bg-white text-wet-navy shadow-sm" : "text-wet-navy-muted"
            }`}
          >
            Rocznie
            <span className="ml-1.5 rounded-full bg-wet-teal/15 px-2 py-0.5 text-[11px] font-semibold text-wet-teal-800">
              −2 mies.
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {VET_PACKAGES.map((pkg) => {
          const isSelected = selected === pkg.id;
          const price = billing === "monthly" ? pkg.monthlyPln : pkg.yearlyPln;
          const priceLabel =
            price === 0
              ? "0 zł"
              : billing === "monthly"
                ? `${price} zł / mies.`
                : `${price} zł / rok`;

          return (
            <label
              key={pkg.id}
              className={`relative flex cursor-pointer flex-col rounded-2xl border-2 p-5 transition-all ${
                isSelected
                  ? "border-wet-teal bg-gradient-to-b from-wet-teal-50/80 to-white shadow-lg shadow-wet-teal/10 ring-1 ring-wet-teal/20"
                  : "border-slate-100 bg-white hover:border-wet-teal-200 hover:shadow-md"
              } ${pkg.popular ? "lg:-mt-1 lg:mb-1" : ""}`}
            >
              <input
                type="radio"
                name="package"
                className="sr-only"
                checked={isSelected}
                onChange={() => onChange(pkg.id)}
              />
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-wet-teal to-teal-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                  Najpopularniejszy
                </span>
              )}
              <p className="text-lg font-bold text-wet-navy">{pkg.name}</p>
              <p className="mt-0.5 text-[13px] text-wet-navy-muted">{pkg.tagline}</p>
              <p className="mt-4 text-3xl font-bold tracking-tight text-wet-navy">{priceLabel}</p>
              <ul className="mt-5 flex-1 space-y-2.5 border-t border-slate-100 pt-5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex gap-2 text-[13px] text-wet-navy-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-wet-teal" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </label>
          );
        })}
      </div>
      <p className="text-center text-[12px] text-wet-navy-muted">
        Płatności online wkrótce — teraz zapisujemy wybrany plan i uruchamiamy 14-dniowy test.
      </p>
    </div>
  );
}
