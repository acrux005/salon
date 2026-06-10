"use client";

export function GabPrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="mt-6 rounded-lg bg-gab-sky px-4 py-2 text-white print:hidden">
      Drukuj
    </button>
  );
}
