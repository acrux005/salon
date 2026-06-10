import { cookies } from "next/headers";
import crypto from "crypto";

export const GUEST_COOKIE = "randki-guest-id";
export const GUEST_ROOM_COOKIE = "randki-guest-room";
export const GUEST_ALIAS_COOKIE = "randki-guest-alias";
export const GUEST_MAX_AGE_SEC = 60 * 60 * 12;

const GUEST_ALIASES = [
  "Gość · cichy",
  "Gość · obecny",
  "Gość · w tle",
  "Gość · bez imienia",
  "Gość · klimat",
  "Gość · spokojnie",
];

export function generateGuestId(): string {
  return `guest_${crypto.randomBytes(12).toString("hex")}`;
}

export function pickGuestAlias(seed?: string): string {
  if (!seed) return GUEST_ALIASES[Math.floor(Math.random() * GUEST_ALIASES.length)];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i) * (i + 1)) % GUEST_ALIASES.length;
  return GUEST_ALIASES[h];
}

export async function readGuestSession(): Promise<{ guestId: string | null; roomId: string | null; alias: string | null }> {
  const jar = await cookies();
  return {
    guestId: jar.get(GUEST_COOKIE)?.value ?? null,
    roomId: jar.get(GUEST_ROOM_COOKIE)?.value ?? null,
    alias: jar.get(GUEST_ALIAS_COOKIE)?.value ?? null,
  };
}

export async function writeGuestSession(guestId: string, roomId: string, alias: string): Promise<void> {
  const jar = await cookies();
  const opts = { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: GUEST_MAX_AGE_SEC };
  jar.set(GUEST_COOKIE, guestId, opts);
  jar.set(GUEST_ROOM_COOKIE, roomId, opts);
  jar.set(GUEST_ALIAS_COOKIE, alias, opts);
}

export async function clearGuestSession(): Promise<void> {
  const jar = await cookies();
  for (const name of [GUEST_COOKIE, GUEST_ROOM_COOKIE, GUEST_ALIAS_COOKIE]) {
    jar.delete(name);
  }
}
