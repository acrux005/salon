import Image from "next/image";
import { resolvePetPhotoUrl } from "@/lib/vet/petPhotoUrl";
import { WetSpeciesAvatar } from "@/components/wet/WetSpeciesAvatar";

type WetPetAvatarProps = {
  species: string;
  name: string;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const PHOTO_SIZE = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function WetPetAvatar({ species, name, photoUrl, size = "md", className = "" }: WetPetAvatarProps) {
  const src = resolvePetPhotoUrl(photoUrl ?? null);
  const box = PHOTO_SIZE[size];

  if (src) {
    return (
      <span
        className={`relative inline-block shrink-0 overflow-hidden rounded-full ring-2 ring-wet-teal-100 ${box} ${className}`}
      >
        <Image src={src} alt={name} fill className="object-cover" unoptimized />
      </span>
    );
  }

  return <WetSpeciesAvatar species={species} name={name} size={size} className={className} />;
}
