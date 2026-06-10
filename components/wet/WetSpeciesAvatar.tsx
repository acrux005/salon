import type { LucideIcon } from "lucide-react";
import {
  Bird,
  Bug,
  Cat,
  Dog,
  Egg,
  Fish,
  Layers,
  PawPrint,
  Rabbit,
  Turtle,
} from "lucide-react";

export type SpeciesAvatarConfig = {
  icon: LucideIcon;
  bg: string;
  fg: string;
  ring: string;
};

const SPECIES_AVATARS: Record<string, SpeciesAvatarConfig> = {
  pies: { icon: Dog, bg: "bg-teal-100", fg: "text-teal-700", ring: "ring-teal-200" },
  kot: { icon: Cat, bg: "bg-violet-100", fg: "text-violet-700", ring: "ring-violet-200" },
  krolik: { icon: Rabbit, bg: "bg-orange-100", fg: "text-orange-700", ring: "ring-orange-200" },
  królik: { icon: Rabbit, bg: "bg-orange-100", fg: "text-orange-700", ring: "ring-orange-200" },
  fretka: { icon: Bug, bg: "bg-amber-100", fg: "text-amber-800", ring: "ring-amber-200" },
  chomik: { icon: Bug, bg: "bg-yellow-100", fg: "text-yellow-800", ring: "ring-yellow-200" },
  szczur: { icon: Bug, bg: "bg-stone-200", fg: "text-stone-700", ring: "ring-stone-300" },
  swinka_morska: { icon: Bug, bg: "bg-rose-100", fg: "text-rose-700", ring: "ring-rose-200" },
  papuga: { icon: Bird, bg: "bg-sky-100", fg: "text-sky-700", ring: "ring-sky-200" },
  kanarek: { icon: Bird, bg: "bg-sky-100", fg: "text-sky-700", ring: "ring-sky-200" },
  ptak: { icon: Bird, bg: "bg-sky-100", fg: "text-sky-700", ring: "ring-sky-200" },
  drob: { icon: Egg, bg: "bg-yellow-100", fg: "text-yellow-800", ring: "ring-yellow-200" },
  kura: { icon: Egg, bg: "bg-yellow-100", fg: "text-yellow-800", ring: "ring-yellow-200" },
  ryba: { icon: Fish, bg: "bg-cyan-100", fg: "text-cyan-700", ring: "ring-cyan-200" },
  zolw: { icon: Turtle, bg: "bg-emerald-100", fg: "text-emerald-700", ring: "ring-emerald-200" },
  kon: { icon: PawPrint, bg: "bg-amber-100", fg: "text-amber-900", ring: "ring-amber-300" },
  krowa: { icon: PawPrint, bg: "bg-amber-50", fg: "text-amber-900", ring: "ring-amber-200" },
  bydlo: { icon: PawPrint, bg: "bg-amber-50", fg: "text-amber-900", ring: "ring-amber-200" },
  owca: { icon: Layers, bg: "bg-lime-100", fg: "text-lime-800", ring: "ring-lime-200" },
  koza: { icon: Layers, bg: "bg-lime-100", fg: "text-lime-800", ring: "ring-lime-200" },
  swinia: { icon: PawPrint, bg: "bg-pink-100", fg: "text-pink-800", ring: "ring-pink-200" },
};

const DEFAULT: SpeciesAvatarConfig = {
  icon: PawPrint,
  bg: "bg-wet-teal-50",
  fg: "text-wet-teal-800",
  ring: "ring-wet-teal-100",
};

const HERD_DEFAULT: SpeciesAvatarConfig = {
  icon: Layers,
  bg: "bg-lime-100",
  fg: "text-lime-800",
  ring: "ring-lime-200",
};

export function getSpeciesAvatarConfig(species: string, kind: "pet" | "herd" = "pet"): SpeciesAvatarConfig {
  const key = species.trim().toLowerCase();
  return SPECIES_AVATARS[key] ?? (kind === "herd" ? HERD_DEFAULT : DEFAULT);
}

type WetSpeciesAvatarProps = {
  species: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  kind?: "pet" | "herd";
  className?: string;
};

const SIZE = {
  sm: { box: "h-8 w-8", icon: "h-4 w-4", text: "text-[10px]" },
  md: { box: "h-10 w-10", icon: "h-5 w-5", text: "text-[11px]" },
  lg: { box: "h-12 w-12", icon: "h-6 w-6", text: "text-[12px]" },
};

export function WetSpeciesAvatar({ species, name, size = "md", kind = "pet", className = "" }: WetSpeciesAvatarProps) {
  const cfg = getSpeciesAvatarConfig(species, kind);
  const Icon = cfg.icon;
  const s = SIZE[size];
  const initial = name?.trim().slice(0, 1).toUpperCase();

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ring-2 ${cfg.bg} ${cfg.fg} ${cfg.ring} ${s.box} ${className}`}
      title={name ? `${name} (${species})` : species}
    >
      {initial && size === "lg" ? (
        <span className={`font-bold ${s.text}`}>{initial}</span>
      ) : (
        <Icon className={s.icon} strokeWidth={2} aria-hidden />
      )}
    </span>
  );
}

export function WetOwnerAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const s = SIZE[size];
  const parts = name.trim().split(/\s+/);
  const initials = (parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2)).toUpperCase();
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-wet-navy/10 font-semibold uppercase text-wet-navy ring-2 ring-wet-teal-100 ${s.box} ${s.text}`}
    >
      {initials}
    </span>
  );
}
