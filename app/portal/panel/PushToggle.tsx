"use client";
import { useState, useEffect } from "react";
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

type PushToggleProps = { compact?: boolean };

export function PushToggle({ compact }: PushToggleProps) {
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
        throw new Error("Powiadomienia nie są skonfigurowane. Skontaktuj się z administratorem.");
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
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Błąd zapisu: ${res.status}`);
      }
      setSub(pushSub);
      setStatus("subscribed");
    } catch (err) {
      console.error("[push] subscribe error:", err);
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
    } catch (err) {
      console.error("[push] unsubscribe error:", err);
      setStatus("subscribed");
    }
  }

  if (status === "unsupported") {
    const isStandalone = typeof navigator !== "undefined" && (window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true);
    return (
      <div className={compact ? "" : "space-y-2"}>
        {!compact && (
          <p className="text-sm text-stone-600">
            {isStandalone
              ? "Twoja przeglądarka nie obsługuje powiadomień push."
              : "Na iPhonie: dodaj stronę do ekranu początkowego (ikonka „Udostępnij” → „Dodaj do ekranu początkowego”), potem otwórz panel z ikony. Dopiero wtedy pojawi się możliwość włączenia powiadomień push."}
          </p>
        )}
        <span
          title={compact ? "Dodaj do ekranu początkowego, aby włączyć push na iPhonie" : undefined}
          className={`flex items-center gap-1.5 rounded-full text-[13px] font-medium text-stone-500 ${compact ? "p-1.5" : "inline-flex px-3 py-1.5"}`}
        >
          <BellOff className="h-4 w-4 shrink-0" />
          {!compact && <span>Push: wymaga dodania do ekranu początkowego (iPhone)</span>}
        </span>
      </div>
    );
  }

  const showText = !compact;
  const btnBase = "flex items-center gap-1.5 rounded-full text-[13px] font-medium transition-colors";
  const btnCompact = compact ? "p-1.5" : "px-3 py-1.5";

  if (status === "subscribed") {
    return (
      <button
        onClick={unsubscribe}
        title="Wyłącz powiadomienia push"
        className={`${btnBase} ${btnCompact} bg-pink-50 text-pink-700 hover:bg-pink-100`}
      >
        <Bell className="h-4 w-4 shrink-0" />
        {showText && <span className="hidden sm:inline">Powiadomienia włączone</span>}
      </button>
    );
  }

  if (status === "denied") {
    return (
      <span
        title="Powiadomienia zablokowane w ustawieniach przeglądarki"
        className={`${btnBase} ${btnCompact} bg-neutral-100 text-neutral-400 cursor-not-allowed`}
      >
        <BellOff className="h-4 w-4 shrink-0" />
        {showText && <span className="hidden sm:inline">Zablokowane</span>}
      </span>
    );
  }

  if (status === "error" && errorMsg) {
    return (
      <div className="space-y-1.5">
        <button
          onClick={() => { setErrorMsg(""); setStatus("idle"); subscribe(); }}
          className={`${btnBase} ${btnCompact} border border-neutral-200 text-[#4a3f42] hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 disabled:opacity-50`}
        >
          <BellOff className="h-4 w-4 shrink-0" />
          {showText && <span className="hidden sm:inline">Włącz powiadomienia</span>}
        </button>
        <p className="text-xs text-red-600">{errorMsg}</p>
      </div>
    );
  }

  return (
    <button
      onClick={subscribe}
      disabled={status === "loading"}
      title="Włącz powiadomienia push"
      className={`${btnBase} ${btnCompact} border border-neutral-200 text-[#4a3f42] hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 disabled:opacity-50`}
    >
      <BellOff className="h-4 w-4 shrink-0" />
      {showText && (
        <span className="hidden sm:inline">
          {status === "loading" ? "Włączanie…" : "Włącz powiadomienia"}
        </span>
      )}
    </button>
  );
}
