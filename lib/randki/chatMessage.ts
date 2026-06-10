/** Konwencja wiadomości głosowych w czacie — bez osobnej kolumny w DB. */
const VOICE_PREFIX = "[voice:";

export function isVoiceChatMessage(body: string): boolean {
  return body.startsWith(VOICE_PREFIX) && body.endsWith("]");
}

export function voiceUrlFromChatMessage(body: string): string | null {
  if (!isVoiceChatMessage(body)) return null;
  return body.slice(VOICE_PREFIX.length, -1);
}

export function formatVoiceChatBody(url: string): string {
  return `${VOICE_PREFIX}${url}]`;
}

export function chatMessagePreview(body: string): string {
  if (isVoiceChatMessage(body)) return "🎙 notka głosowa";
  return body.length > 80 ? `${body.slice(0, 77)}…` : body;
}
