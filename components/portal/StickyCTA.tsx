"use client";

import { usePortalQuiz } from "./PortalQuizContext";

export function StickyCTA() {
  const { openModal } = usePortalQuiz();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white p-3 lg:hidden">
      <button
        type="button"
        onClick={openModal}
        className="block w-full rounded-full bg-pink-500 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600"
      >
        Rozpocznij analizę
      </button>
    </div>
  );
}
