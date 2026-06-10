"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { removePetPhotoAction, uploadPetPhotoAction } from "@/app/actions/vetPetPhoto";
import { resolvePetPhotoUrl } from "@/lib/vet/petPhotoUrl";
import { WetSpeciesAvatar } from "@/components/wet/WetSpeciesAvatar";

type WetPetPhotoUploadProps = {
  petId: string;
  petName: string;
  species: string;
  photoUrl: string | null;
  size?: "md" | "lg";
};

export function WetPetPhotoUpload({
  petId,
  petName,
  species,
  photoUrl,
  size = "lg",
}: WetPetPhotoUploadProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const displayUrl = preview ?? resolvePetPhotoUrl(photoUrl);
  const boxClass = size === "lg" ? "h-28 w-28" : "h-20 w-20";

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage("");
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const fd = new FormData();
    fd.set("petId", petId);
    fd.set("photo", file);
    const result = await uploadPetPhotoAction(fd);
    setLoading(false);

    if (!result.ok) {
      setMessage(result.error);
      setPreview(null);
      return;
    }

    setMessage("Zdjęcie zapisane.");
    router.refresh();
  }

  async function handleRemove() {
    setLoading(true);
    setMessage("");
    const result = await removePetPhotoAction(petId);
    setLoading(false);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    setMessage("Zdjęcie usunięte.");
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
      <div
        className={`relative overflow-hidden rounded-2xl border-2 border-wet-teal-100 bg-wet-teal-50/50 ${boxClass}`}
      >
        {displayUrl ? (
          <Image src={displayUrl} alt={petName} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <WetSpeciesAvatar species={species} name={petName} size={size === "lg" ? "lg" : "md"} />
          </div>
        )}
      </div>

      <div className="text-[13px]">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-wet-teal-200 px-3 py-1.5 font-medium text-wet-teal-800 hover:bg-wet-teal-50 disabled:opacity-50"
          >
            {displayUrl ? "Zmień zdjęcie" : "Dodaj zdjęcie"}
          </button>
          {displayUrl && (
            <button
              type="button"
              disabled={loading}
              onClick={handleRemove}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-wet-navy-muted hover:bg-slate-50 disabled:opacity-50"
            >
              Usuń
            </button>
          )}
        </div>
        <p className="mt-1 text-[12px] text-wet-navy-muted">JPG, PNG lub WebP · max 3 MB</p>
        {message && <p className="mt-1 text-[12px] text-wet-teal-800">{message}</p>}
      </div>
    </div>
  );
}
