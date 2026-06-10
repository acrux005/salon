"use client";

import { Bell, Mail, Megaphone, Smartphone } from "lucide-react";
import { WetPushToggle } from "@/components/wet/WetPushToggle";

export type WetOwnerNotificationPrefsValue = {
  smsConsent: boolean;
  emailConsent: boolean;
  pushConsent: boolean;
  marketingConsent: boolean;
};

type Props = {
  value: WetOwnerNotificationPrefsValue;
  onChange: (next: WetOwnerNotificationPrefsValue) => void;
  /** Po zapisaniu klienta — pokaż przycisk aktywacji push w tej przeglądarce */
  ownerId?: string | null;
  disabled?: boolean;
};

export function WetOwnerNotificationPrefs({ value, onChange, ownerId, disabled }: Props) {
  function set<K extends keyof WetOwnerNotificationPrefsValue>(key: K, checked: boolean) {
    onChange({ ...value, [key]: checked });
  }

  return (
    <div className="rounded-xl border border-wet-teal-200 bg-white p-4">
      <h3 className="text-[15px] font-semibold text-wet-navy">Powiadomienia</h3>
      <p className="mt-1 text-[13px] text-wet-navy-muted">
        Zgody klienta na przypomnienia i komunikację — jak w panelu Salon / Zamów.
      </p>

      <div className="mt-4 space-y-3">
        <NotificationRow
          icon={<Mail className="h-4 w-4" />}
          label="E-mail"
          description="Przypomnienia o wizytach i szczepieniach"
          checked={value.emailConsent}
          disabled={disabled}
          onChange={(v) => set("emailConsent", v)}
        />
        <NotificationRow
          icon={<Smartphone className="h-4 w-4" />}
          label="Telefon (SMS)"
          description="Wiadomości tekstowe na numer klienta"
          checked={value.smsConsent}
          disabled={disabled}
          onChange={(v) => set("smsConsent", v)}
        />
        <NotificationRow
          icon={<Bell className="h-4 w-4" />}
          label="Przeglądarka i telefon (push)"
          description="Zgoda na powiadomienia push — aktywacja poniżej na urządzeniu klienta"
          checked={value.pushConsent}
          disabled={disabled}
          onChange={(v) => set("pushConsent", v)}
        />
        <NotificationRow
          icon={<Megaphone className="h-4 w-4" />}
          label="Marketing"
          description="Promocje, newsletter przychodni"
          checked={value.marketingConsent}
          disabled={disabled}
          onChange={(v) => set("marketingConsent", v)}
        />
      </div>

      {value.pushConsent && !ownerId && (
        <p className="mt-3 text-[12px] text-wet-navy-muted">
          Po zapisaniu klienta będziesz mógł włączyć powiadomienia push na urządzeniu klienta.
        </p>
      )}

      {value.pushConsent && ownerId && (
        <div className="mt-4 rounded-lg border border-wet-teal-100 bg-wet-teal-50/50 p-3">
          <p className="text-[13px] font-medium text-wet-teal-900">Aktywacja push na urządzeniu</p>
          <p className="mt-1 text-[12px] text-wet-navy-muted">
            Poproś klienta o włączenie powiadomień w tej przeglądarce lub na telefonie (po dodaniu strony do ekranu
            początkowego na iPhone).
          </p>
          <div className="mt-3">
            <WetPushToggle showLabel ownerId={ownerId} />
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationRow({
  icon,
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-wet-teal-50 px-3 py-2.5 hover:bg-wet-mint/30">
      <span className="mt-0.5 text-wet-teal">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium text-wet-navy">{label}</span>
        <span className="block text-[12px] text-wet-navy-muted">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-wet-teal disabled:opacity-50"
      />
    </label>
  );
}
