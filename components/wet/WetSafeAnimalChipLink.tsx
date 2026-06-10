"use client";

import { ExternalLink } from "lucide-react";
import { safeAnimalChipSearchUrl } from "@/lib/vet/safeAnimal";

export function WetSafeAnimalChipLink({
  chipNumber,
  className = "",
}: {
  chipNumber: string | null | undefined;
  className?: string;
}) {
  const url = safeAnimalChipSearchUrl(chipNumber);
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-[13px] font-medium text-wet-teal hover:underline ${className}`}
    >
      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
      Sprawdź chip w SAFE-ANIMAL
    </a>
  );
}
