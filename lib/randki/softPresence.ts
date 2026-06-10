/** Miękkie etykiety obecności — bez presji „online teraz”. */

export function softPresenceCount(count: number): string {
  if (count <= 0) return "cisza w tej porze";
  if (count === 1) return "1 obecność";
  if (count < 5) return `${count} obecności`;
  return `${count} w tej porze`;
}

export function softPhaseLabel(phaseEmoji: string, count: number): string {
  return `${phaseEmoji} ${softPresenceCount(count)}`;
}

export function softMomentBadge(): string {
  return "fragment dnia";
}
