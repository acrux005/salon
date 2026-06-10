/**
 * WebRTC ICE — STUN (Google) + TURN z .env (wymagany w produkcji za NAT/firewall):
 *
 * TURN_URLS=turn:turn.example.com:3478,turns:turn.example.com:5349
 * TURN_USERNAME=...
 * TURN_CREDENTIAL=...
 *
 * Bez TURN voice match działa tylko w idealnych warunkach sieciowych.
 */

export type IceServerConfig = { urls: string | string[]; username?: string; credential?: string };

const STUN_SERVERS: IceServerConfig[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export function getIceServers(): IceServerConfig[] {
  const servers: IceServerConfig[] = [...STUN_SERVERS];

  const rawUrls = process.env.TURN_URLS?.trim();
  const username = process.env.TURN_USERNAME?.trim();
  const credential = process.env.TURN_CREDENTIAL?.trim();

  if (rawUrls && username && credential) {
    const urls = rawUrls
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);
    if (urls.length) {
      servers.push({ urls, username, credential });
    }
  }

  return servers;
}

export function isTurnConfigured(): boolean {
  return !!(process.env.TURN_URLS?.trim() && process.env.TURN_USERNAME?.trim() && process.env.TURN_CREDENTIAL?.trim());
}
