export function consentTypeLabel(type: string): string {
  if (type === "marketing") return "Marketing";
  if (type === "email") return "E-mail";
  if (type === "push") return "Push (przeglądarka / telefon)";
  return "SMS";
}
