"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type IceServer = { urls: string | string[]; username?: string; credential?: string };

async function fetchIceServers(): Promise<IceServer[]> {
  const fallback: IceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];
  try {
    const res = await fetch(`${BASE}/api/randki/voice/ice-servers`, { credentials: "include" });
    if (!res.ok) return fallback;
    const data = (await res.json()) as { iceServers?: IceServer[] };
    return data.iceServers?.length ? data.iceServers : fallback;
  } catch {
    return fallback;
  }
}

type Snap = {
  offerSdp: string | null;
  answerSdp: string | null;
  ice: { fromAccountId: string; candidate: string; at: number }[];
  isInitiator: boolean;
};

export function RandkiVoiceCallLive({
  callId,
  myAccountId,
  partnerName,
}: {
  callId: string;
  myAccountId: string;
  partnerName: string;
}) {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const seenIceRef = useRef<Set<string>>(new Set());
  const [status, setStatus] = useState<"idle" | "connecting" | "live" | "ended" | "error">("idle");
  const [err, setErr] = useState("");
  const lastSnapRef = useRef<Snap | null>(null);

  const api = useCallback(
    (path: string, init?: RequestInit) =>
      fetch(`${BASE}/api/randki/voice/signal${path}`, { credentials: "include", ...init }),
    []
  );

  const postSignal = useCallback(
    async (payload: { type: "offer" | "answer" | "ice"; sdp?: string; candidate?: string }) => {
      await api("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId, ...payload }),
      });
    },
    [api, callId]
  );

  const applyRemoteIce = useCallback(async (snap: Snap) => {
    const pc = pcRef.current;
    if (!pc) return;
    for (const item of snap.ice) {
      if (item.fromAccountId === myAccountId) continue;
      const key = `${item.fromAccountId}:${item.candidate}`;
      if (seenIceRef.current.has(key)) continue;
      seenIceRef.current.add(key);
      try {
        await pc.addIceCandidate(JSON.parse(item.candidate));
      } catch {
        /* ignore duplicate / ordering */
      }
    }
  }, [myAccountId]);

  const poll = useCallback(async () => {
    const res = await api(`?callId=${encodeURIComponent(callId)}`);
    if (!res.ok) return null;
    return (await res.json()) as Snap & { callId: string };
  }, [api, callId]);

  const cleanup = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
  }, []);

  const startCall = useCallback(async () => {
    setStatus("connecting");
    setErr("");
    seenIceRef.current.clear();
    try {
      const [stream, iceServers] = await Promise.all([
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }),
        fetchIceServers(),
      ]);
      localStreamRef.current = stream;

      const pc = new RTCPeerConnection({ iceServers });
      pcRef.current = pc;
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      pc.ontrack = (ev) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = ev.streams[0] ?? null;
          remoteAudioRef.current.play().catch(() => {});
        }
      };
      pc.onicecandidate = (ev) => {
        if (ev.candidate) {
          postSignal({ type: "ice", candidate: JSON.stringify(ev.candidate.toJSON()) }).catch(() => {});
        }
      };
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") setStatus("live");
        if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
          setStatus("ended");
        }
      };

      const snap = await poll();
      if (!snap) throw new Error("Brak sesji sygnalizacji.");

      if (snap.isInitiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await postSignal({ type: "offer", sdp: offer.sdp ?? undefined });
      } else if (snap.offerSdp) {
        await pc.setRemoteDescription({ type: "offer", sdp: snap.offerSdp });
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await postSignal({ type: "answer", sdp: answer.sdp ?? undefined });
      }

      lastSnapRef.current = snap;
      await applyRemoteIce(snap);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Nie udało się połączyć.");
      setStatus("error");
      cleanup();
    }
  }, [applyRemoteIce, cleanup, poll, postSignal]);

  useEffect(() => {
    if (status !== "connecting" && status !== "live") return;
    const id = setInterval(async () => {
      const snap = await poll();
      if (!snap) return;
      const pc = pcRef.current;
      if (!pc) return;

      if (!snap.isInitiator && snap.offerSdp && !pc.remoteDescription) {
        await pc.setRemoteDescription({ type: "offer", sdp: snap.offerSdp });
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await postSignal({ type: "answer", sdp: answer.sdp ?? undefined });
      }
      if (snap.isInitiator && snap.answerSdp && !pc.remoteDescription) {
        await pc.setRemoteDescription({ type: "answer", sdp: snap.answerSdp });
      }
      await applyRemoteIce(snap);
      lastSnapRef.current = snap;
    }, 1500);
    return () => clearInterval(id);
  }, [applyRemoteIce, poll, postSignal, status]);

  useEffect(() => () => cleanup(), [cleanup]);

  return (
    <div className="border-t border-white/10 bg-emerald-950/30 px-4 py-4">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-emerald-300">WebRTC · rozmowa live</p>
      <p className="mt-1 text-[13px] text-white/70">Bezpośredni głos z {partnerName} — max ~5 min.</p>
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />
      {status === "idle" && (
        <button type="button" onClick={startCall} className="randki-btn-primary mt-3 text-[13px]">
          📞 Połącz live (WebRTC)
        </button>
      )}
      {status === "connecting" && <p className="mt-3 text-[13px] text-amber-200">Łączenie…</p>}
      {status === "live" && (
        <p className="mt-3 text-[13px] text-emerald-300">● Na żywo — mów normalnie, słuchaj partnera.</p>
      )}
      {(status === "live" || status === "connecting") && (
        <button
          type="button"
          onClick={() => {
            cleanup();
            setStatus("ended");
          }}
          className="mt-2 text-[12px] text-white/40 underline"
        >
          Rozłącz
        </button>
      )}
      {status === "ended" && <p className="mt-3 text-[13px] text-white/50">Rozmowa zakończona.</p>}
      {err && <p className="mt-2 text-[13px] text-rose-300">{err}</p>}
    </div>
  );
}
