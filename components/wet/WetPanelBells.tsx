"use client";

import { NotificationBell } from "@/components/portal/NotificationBell";
import { MessagesBell } from "@/components/portal/MessagesBell";
import { PushToggle } from "@/app/portal/panel/PushToggle";

export function WetPanelBells() {
  return (
    <div className="flex items-center gap-2">
      <NotificationBell notificationsHref="/wet/panel/powiadomienia" />
      <MessagesBell messagesHref="/wet/panel/klienci/wiadomosci" />
      <PushToggle compact />
    </div>
  );
}
