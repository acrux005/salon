"use client";

import { useTransition } from "react";
import { deleteClinicAction } from "@/app/actions/admin";

export function DeleteClinicButton({ clinicId, clinicName }: { clinicId: string; clinicName: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Czy na pewno usunąć gabinet „${clinicName}”? Zostaną usunięte konto, cenniki i propozycje zabiegów.`))
      return;
    startTransition(async () => {
      const result = await deleteClinicAction(clinicId);
      if (result.ok) {
        window.location.reload();
      } else {
        alert(result.error);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="text-[14px] font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Usuwanie…" : "Usuń gabinet"}
    </button>
  );
}
