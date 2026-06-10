"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { seedPreventionCatalogAction } from "@/app/actions/vetCatalog";

export function WetSeedPreventionCatalogButton({ templateCount }: { templateCount: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSeed() {
    setLoading(true);
    setMessage("");
    const result = await seedPreventionCatalogAction();
    setLoading(false);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    setMessage(`Dodano ${result.added ?? 0} pozycji (pominięto ${result.skipped ?? 0} duplikatów).`);
    router.refresh();
  }

  return (
    <div className="mb-10">
      <button type="button" onClick={handleSeed} disabled={loading} className="wet-btn-primary text-[14px]">
        {loading ? "Dodawanie…" : "Dodaj pozycje profilaktyki do katalogu"}
      </button>
      <p className="mt-2 text-[13px] text-wet-navy-muted">
        Uzupełnia cennik o typowe szczepionki, badania i zabiegi ({templateCount} pozycji). Pomija duplikaty.
      </p>
      {message && <p className="mt-2 text-[13px] text-wet-teal-800">{message}</p>}
    </div>
  );
}
