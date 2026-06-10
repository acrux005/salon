"use client";

import { useState } from "react";
import { updateRestaurantOrderNumberSettingsAction } from "@/app/panel/actions/restaurantSettings";

type Props = {
  initialPrefix: string;
  initialNext: number;
};

export function RestaurantOrderNumberForm({ initialPrefix, initialNext }: Props) {
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  return (
    <form
      action={async (formData) => {
        setError("");
        setOk(false);
        const res = await updateRestaurantOrderNumberSettingsAction(formData);
        if (res.ok) setOk(true);
        else setError(res.error);
      }}
      className="mt-4 space-y-4"
    >
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {ok && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">Zapisano.</p>}
      <div>
        <label htmlFor="orderNumberPrefix" className="block text-sm font-medium text-stone-700">
          Prefiks numeru (opcjonalnie)
        </label>
        <input
          id="orderNumberPrefix"
          name="orderNumberPrefix"
          type="text"
          defaultValue={initialPrefix}
          maxLength={32}
          placeholder='np. # lub ZAM-'
          className="mt-1 w-full max-w-md rounded-lg border border-stone-300 px-3 py-2"
        />
        <p className="mt-1 text-sm text-stone-500">
          Kolejne zamówienie otrzyma numer w formacie: prefiks + liczba (np. <span className="font-mono">ZAM-12</span> albo{" "}
          <span className="font-mono">#12</span>). Możesz zostawić puste — wtedy tylko liczba.
        </p>
      </div>
      <div>
        <label htmlFor="orderNumberNext" className="block text-sm font-medium text-stone-700">
          Następny numer
        </label>
        <input
          id="orderNumberNext"
          name="orderNumberNext"
          type="number"
          min={1}
          max={99_999_999}
          required
          defaultValue={initialNext}
          className="mt-1 w-full max-w-xs rounded-lg border border-stone-300 px-3 py-2"
        />
        <p className="mt-1 text-sm text-stone-500">
          Nadajesz kolejny numer dla następnego zamówienia (np. start od 1 albo przeskocz wyżej na nowy sezon).
        </p>
      </div>
      <button
        type="submit"
        className="rounded-full bg-zamow-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-zamow-orange-500"
      >
        Zapisz numery zamówień
      </button>
    </form>
  );
}
