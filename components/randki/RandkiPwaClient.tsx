"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Smartphone } from "lucide-react";

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

async function getReg(): Promise<ServiceWorkerRegistration> {
  const scope = BASE ? `${BASE}/` : "/";
  let reg = (await navigator.serviceWorker.getRegistration()) ?? (await navigator.serviceWorker.register(`${BASE}/sw.js`, { scope }));
  if (reg.active) return reg;
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Odśwież stronę i spróbuj ponownie.")), 15000);
    const check = () => {
      if (reg.active) {
        clearTimeout(t);
        resolve(reg);
      }
    };
    reg.installing?.addEventListener("statechange", check);
    reg.waiting?.addEventListener("statechange", check);
  });
}

export function RandkiPushToggle() {
  const [status, setStatus] = useState<"idle" | "loading" | "on" | "denied" | "unsupported">("idle");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") setStatus("denied");
  }, []);

  async function subscribe() {
    setStatus("loading");
    setErr("");
    try {
      if (!VAPID_PUBLIC) throw new Error("Push nie skonfigurowany.");
      const reg = await getReg();
      if ((await Notification.requestPermission()) !== "granted") {
        setStatus("denied");
        return;
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
      });
      const json = sub.toJSON();
      const res = await fetch(`${BASE}/api/randki/push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      });
      if (!res.ok) throw new Error("Nie udało się zapisać subskrypcji.");
      setStatus("on");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Błąd push.");
      setStatus("idle");
    }
  }

  if (status === "unsupported") return null;

  return (
    <div className="randki-glass p-4">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-sky-300">Powiadomienia</p>
      <p className="mt-1 text-[13px] text-white/65">Match, wiadomość, voice match — nawet gdy app jest w tle.</p>
      {status === "on" ? (
        <p className="mt-3 inline-flex items-center gap-2 text-[13px] text-emerald-300">
          <Bell className="h-4 w-4" /> Push włączone
        </p>
      ) : status === "denied" ? (
        <p className="mt-3 inline-flex items-center gap-2 text-[13px] text-white/40">
          <BellOff className="h-4 w-4" /> Zablokowane w przeglądarce
        </p>
      ) : (
        <button type="button" disabled={status === "loading"} onClick={subscribe} className="randki-btn-outline mt-3 text-[13px]">
          {status === "loading" ? "Włączam…" : "Włącz push"}
        </button>
      )}
      {err && <p className="mt-2 text-[12px] text-rose-300">{err}</p>}
    </div>
  );
}

export function RandkiPwaInstall() {
  const [prompt, setPrompt] = useState<{ prompt: () => Promise<void> } | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as unknown as { prompt: () => Promise<void> });
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (installed) {
    return (
      <p className="mt-3 text-[13px] text-emerald-300 inline-flex items-center gap-2">
        <Smartphone className="h-4 w-4" /> Aplikacja zainstalowana
      </p>
    );
  }

  if (!prompt) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        await prompt.prompt();
        setPrompt(null);
      }}
      className="randki-btn-primary mt-3 text-[13px]"
    >
      📲 Zainstaluj aplikację
    </button>
  );
}
