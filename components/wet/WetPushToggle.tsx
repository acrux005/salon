"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

async function getActivePushRegistration(): Promise<ServiceWorkerRegistration> {
  const scope = BASE ? `${BASE}/` : "/";
  let reg =
    (await navigator.serviceWorker.getRegistration()) ??
    (await navigator.serviceWorker.register(`${BASE}/sw.js`, { scope }));
  if (reg.active) return reg;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Poczekaj chwilę i odśwież stronę, potem spróbuj ponownie.")),
      15000
    );
    const check = () => {
      if (reg.active) {
        clearTimeout(timeout);
        resolve(reg);
      }
    };
    reg.installing?.addEventListener("statechange", check);
    reg.waiting?.addEventListener("statechange", check);
    if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
  });
}

type Status = "idle" | "loading" | "subscribed" | "denied" | "unsupported" | "error";

type WetPushToggleProps = {
  compact?: boolean;
  showLabel?: boolean;
  ownerId?: string;
};

export function WetPushToggle({ compact, showLabel, ownerId }: WetPushToggleProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [sub, setSub] = useState<PushSubscription | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }
    getActivePushRegistration()
      .then(async (reg) => {
        const existing = await reg.pushManager.getSubscription();
        if (existing) {
          setSub(existing);
          setStatus("subscribed");
        }
      })
      .catch(() => {});
  }, []);

  async function subscribe() {
    setStatus("loading");
    setErrorMsg("");
    try {
      if (!VAPID_PUBLIC) {
        throw new Error("Powiadomienia push nie są skonfigurowane na serwerze.");
      }
      const reg = await getActivePushRegistration();
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }
      const pushSub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
      });
      const json = pushSub.toJSON();
      const res = await fetch(`${BASE}/api/push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: json.keys,
          ownerId: ownerId ?? undefined,
          context: "vet_owner",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Błąd zapisu: ${res.status}`);
      }
      setSub(pushSub);
      setStatus("subscribed");
    } catch (err) {
      console.error("[wet-push] subscribe error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Nie udało się włączyć powiadomień.");
      setStatus("error");
    }
  }

  async function unsubscribe() {
    if (!sub) return;
    setStatus("loading");
    try {
      await fetch(`${BASE}/api/push`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
      await sub.unsubscribe();
      setSub(null);
      setStatus("idle");
    } catch {
      setStatus("subscribed");
    }
  }

  const btnBase =
    "inline-flex items-center gap-2 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50";
  const btnSize = compact ? "px-3 py-1.5" : "px-4 py-2";

  if (status === "unsupported") {
    return (
      <p className="text-[12px] text-wet-navy-muted">
        Ta przeglądarka nie obsługuje powiadomień push. Na iPhone dodaj stronę do ekranu początkowego.
      </p>
    );
  }

  if (status === "subscribed") {
    return (
      <button
        type="button"
        onClick={unsubscribe}
        className={`${btnBase} ${btnSize} bg-wet-teal-100 text-wet-teal-900 hover:bg-wet-teal-200`}
      >
        <Bell className="h-4 w-4 shrink-0" />
        {showLabel && <span>Powiadomienia włączone</span>}
      </button>
    );
  }

  if (status === "denied") {
    return (
      <span className={`${btnBase} ${btnSize} cursor-not-allowed bg-slate-100 text-slate-400`}>
        <BellOff className="h-4 w-4 shrink-0" />
        {showLabel && <span>Zablokowane w przeglądarce</span>}
      </span>
    );
  }

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={subscribe}
        disabled={status === "loading"}
        className={`${btnBase} ${btnSize} border border-wet-teal-200 text-wet-teal-800 hover:bg-wet-teal-50`}
      >
        <BellOff className="h-4 w-4 shrink-0" />
        {showLabel && <span>{status === "loading" ? "Włączanie…" : "Włącz powiadomienia push"}</span>}
      </button>
      {status === "error" && errorMsg && <p className="text-[12px] text-red-600">{errorMsg}</p>}
    </div>
  );
}
