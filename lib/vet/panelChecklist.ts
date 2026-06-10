export type PanelChecklistItem = {
  id: string;
  label: string;
  href: string;
  done: boolean;
};

export function buildPanelChecklist(input: {
  vetCount: number;
  hasWorkingHours: boolean;
  patientCount: number;
  smsConfigured: boolean;
  hasLogo: boolean;
}): PanelChecklistItem[] {
  const hasExtraVet = input.vetCount > 1;
  const hasNamedVet = input.vetCount >= 1;

  return [
    {
      id: "doctor",
      label: "Dodaj lekarza",
      href: "/wet/panel/lekarze",
      done: hasExtraVet || hasNamedVet,
    },
    {
      id: "hours",
      label: "Dodaj godziny pracy",
      href: "/wet/panel/godziny-pracy",
      done: input.hasWorkingHours,
    },
    {
      id: "patient",
      label: "Dodaj pierwszego pacjenta",
      href: "/wet/panel/zwierzeta/lista",
      done: input.patientCount > 0,
    },
    {
      id: "sms",
      label: "Podłącz SMS",
      href: "/wet/panel/ustawienia/powiadomienia",
      done: input.smsConfigured,
    },
    {
      id: "logo",
      label: "Dodaj logo przychodni",
      href: "/wet/panel/przychodnia",
      done: input.hasLogo,
    },
  ];
}

export function isPanelChecklistComplete(items: PanelChecklistItem[]): boolean {
  return items.every((i) => i.done);
}
