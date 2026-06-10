"use client";

import { useTransition } from "react";
import { deleteClientAction } from "@/app/actions/admin";

export function DeleteClientButton({ clientId, clientEmail }: { clientId: string; clientEmail: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Czy na pewno usunąć konto klienta „${clientEmail}”? Zostaną usunięte też jego rezerwacje.`))
      return;
    startTransition(async () => {
      const result = await deleteClientAction(clientId);
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
      {pending ? "Usuwanie…" : "Usuń"}
    </button>
  );
}
