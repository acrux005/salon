"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { deleteVoiceIntroAction, uploadVoiceIntroAction } from "@/app/actions/randki";
import {
  VOICE_FILE_ACCEPT,
  canUseBrowserVoiceRecorder,
  createVoiceMediaRecorder,
  getVoiceAudioStream,
  isMobileVoiceDevice,
  normalizeVoiceUploadFile,
  startVoiceRecorder,
  stopVoiceRecorderSafely,
  voiceExtFromMime,
} from "@/lib/randki/voiceRecording";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const MAX_RECORD_SEC = 45;
const MIN_RECORD_SEC = 2;

type Props = {
  initialUrl: string | null;
  onMessage?: (msg: string) => void;
  onError?: (msg: string) => void;
  onUrlChange?: (url: string | null) => void;
};

function resolveUrl(url: string) {
  return url.startsWith("http") ? url : `${BASE_PATH}${url}`;
}

export function RandkiVoiceIntroSection({ initialUrl, onMessage, onError, onUrlChange }: Props) {
  const [voiceUrl, setVoiceUrl] = useState<string | null>(initialUrl);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState("");
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();
  const [canRecord, setCanRecord] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [micLevel, setMicLevel] = useState(0);

  const fileRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const levelTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    setIsMobile(isMobileVoiceDevice());
    setCanRecord(canUseBrowserVoiceRecorder());
  }, []);

  useEffect(() => {
    onUrlChange?.(voiceUrl);
  }, [voiceUrl, onUrlChange]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (levelTimerRef.current) clearInterval(levelTimerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      void audioCtxRef.current?.close();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function startMicLevelMeter(stream: MediaStream) {
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      void ctx.resume();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      levelTimerRef.current = setInterval(() => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setMicLevel(Math.min(100, Math.round((avg / 128) * 100)));
      }, 120);
    } catch {
      /* opcjonalny wskaźnik */
    }
  }

  function stopMicLevelMeter() {
    if (levelTimerRef.current) {
      clearInterval(levelTimerRef.current);
      levelTimerRef.current = null;
    }
    void audioCtxRef.current?.close();
    audioCtxRef.current = null;
    setMicLevel(0);
  }

  function reportError(msg: string) {
    setLocalError(msg);
    setStatus("");
    onError?.(msg);
  }

  function clearError() {
    setLocalError("");
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function uploadBlob(blob: Blob, fileName: string) {
    clearError();
    setStatus("Wysyłam nagranie…");
    startTransition(async () => {
      const fd = new FormData();
      const type = blob.type || "audio/mp4";
      fd.set("voice", new File([blob], fileName, { type }));
      const res = await uploadVoiceIntroAction(fd);
      if (res.ok) {
        setVoiceUrl(res.url);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setStatus("");
        onMessage?.("Głos zapisany.");
      } else {
        reportError(res.error);
      }
    });
  }

  async function uploadFileFromInput(file: File) {
    clearError();
    if (file.type.startsWith("video/")) {
      reportError("To jest wideo, nie audio. Wybierz plik .m4a z Dyktafonu lub nagraj przyciskiem poniżej.");
      return;
    }
    const normalized = normalizeVoiceUploadFile(file);
    if (normalized.size > 2 * 1024 * 1024) {
      reportError("Plik za duży (max 2 MB). Skróć nagranie do ~45 s.");
      return;
    }
    setStatus("Wysyłam plik…");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("voice", normalized);
      const res = await uploadVoiceIntroAction(fd);
      if (res.ok) {
        setVoiceUrl(res.url);
        setStatus("");
        onMessage?.("Głos zapisany.");
      } else {
        reportError(res.error);
      }
    });
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) void uploadFileFromInput(file);
  }

  async function startRecording() {
    clearError();
    setStatus("Proszę o dostęp do mikrofonu…");

    if (!canRecord) {
      reportError(
        isMobile
          ? "Nagrywanie w tej przeglądarce nie działa — użyj „Wybierz nagranie audio” (plik z Dyktafonu)."
          : "Użyj Chrome/Firefox albo wgraj plik audio."
      );
      return;
    }

    try {
      const stream = await getVoiceAudioStream();
      streamRef.current = stream;
      chunksRef.current = [];
      startMicLevelMeter(stream);

      const recorder = createVoiceMediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stopTimer();
        stopMicLevelMeter();
        stopStream();
        setRecording(false);
        setSeconds(0);
        setStatus("Przetwarzam nagranie…");

        const mimeType = recorder.mimeType || chunksRef.current[0]?.type || "audio/mp4";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const elapsed = Date.now() - startedAtRef.current;

        if (elapsed < MIN_RECORD_SEC * 1000) {
          reportError(`Nagrywaj minimum ${MIN_RECORD_SEC} sekundy — powiedz kim jesteś.`);
          return;
        }
        if (blob.size < 400) {
          reportError(
            isMobile
              ? "Nagranie puste — na iPhone spróbuj „Wybierz nagranie audio” (Dyktafon → Udostępnij → Pliki)."
              : "Nagranie puste — sprawdź mikrofon lub wgraj plik."
          );
          return;
        }

        const ext = voiceExtFromMime(mimeType);
        setPreviewUrl(URL.createObjectURL(blob));
        void uploadBlob(blob, `intro.${ext}`);
      };

      recorder.onerror = () => {
        reportError("Błąd nagrywania — wybierz plik z Dyktafonu lub spróbuj ponownie.");
        void stopRecording(true);
      };

      startVoiceRecorder(recorder);
      startedAtRef.current = Date.now();
      setRecording(true);
      setSeconds(0);
      setStatus("Nagrywasz — mów naturalnie, potem Zatrzymaj.");
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_RECORD_SEC) void stopRecording(true);
          return s + 1;
        });
      }, 1000);
    } catch (e) {
      stopMicLevelMeter();
      stopStream();
      setStatus("");
      const name = e instanceof DOMException ? e.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        reportError(
          isMobile
            ? "Brak dostępu do mikrofonu. Ustawienia iPhone → Safari → Mikrofon → Włącz dla tej strony."
            : "Brak dostępu do mikrofonu — zezwól w ustawieniach przeglądarki i odśwież stronę."
        );
      } else if (name === "NotFoundError") {
        reportError("Nie wykryto mikrofonu — wgraj plik audio z Dyktafonu.");
      } else {
        reportError(isMobile ? "Nie udało się nagrać — wybierz plik .m4a z Dyktafonu." : "Nie udało się nagrać — sprawdź mikrofon.");
      }
    }
  }

  async function stopRecording(force = false) {
    if (!force && seconds < MIN_RECORD_SEC) {
      reportError(`Nagrywaj jeszcze ${MIN_RECORD_SEC - seconds} s — krótko kim jesteś.`);
      return;
    }
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") {
      setStatus("Zatrzymuję…");
      await stopVoiceRecorderSafely(rec);
    } else {
      stopTimer();
      stopMicLevelMeter();
      stopStream();
      setRecording(false);
      setStatus("");
    }
  }

  function removeVoice() {
    startTransition(async () => {
      const res = await deleteVoiceIntroAction();
      if (res.ok) {
        setVoiceUrl(null);
        setPreviewUrl(null);
        onMessage?.("Nagranie usunięte.");
      } else {
        reportError(res.error);
      }
    });
  }

  const displayUrl = previewUrl ?? (voiceUrl ? resolveUrl(voiceUrl) : null);

  return (
    <section className="p-0">
      <h2 className="font-semibold text-white sr-only">Głos</h2>
      <p className="mt-1 text-[13px] text-white/50">
        Nie musisz brzmieć idealnie. Wystarczy, że brzmisz prawdziwie.
      </p>
      <p className="mt-1 text-[12px] text-white/35">Min. {MIN_RECORD_SEC} s nagrania.</p>

      {isMobile && (
        <div className="mt-3 rounded-xl border border-amber-200/20 bg-amber-950/20 p-3 text-[12px] leading-relaxed text-amber-100/80">
          <p className="font-medium text-amber-100">iPhone — najpewniej:</p>
          <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-white/65">
            <li>Otwórz aplikację <strong className="text-white/85">Dyktafon</strong>, nagraj 10–20 s.</li>
            <li>Udostępnij → <strong className="text-white/85">Zapisz w Plikach</strong> (np. „Na iPhone”).</li>
            <li>Tutaj: <strong className="text-white/85">Wybierz nagranie audio</strong> → plik .m4a.</li>
          </ol>
        </div>
      )}

      {displayUrl && (
        <div className="mt-3">
          <audio controls className="w-full" src={displayUrl} preload="metadata" playsInline />
          {voiceUrl && !previewUrl && (
            <button type="button" className="mt-2 text-[12px] text-rose-400 underline" onClick={removeVoice} disabled={pending}>
              Usuń nagranie
            </button>
          )}
        </div>
      )}

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="mb-2 block text-[12px] font-medium text-white/55">
            {isMobile ? "Wybierz nagranie audio (.m4a z Dyktafonu)" : "Wgraj plik audio"}
          </span>
          <input
            ref={fileRef}
            type="file"
            accept={VOICE_FILE_ACCEPT}
            disabled={pending || recording}
            onChange={handleFileInput}
            className="block w-full text-[13px] text-white/70 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600/80 file:px-3 file:py-2 file:text-[12px] file:font-medium file:text-white"
          />
        </label>

        {canRecord && (
          <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
            {!recording ? (
              <button type="button" disabled={pending} onClick={startRecording} className="randki-btn-primary text-[13px]">
                {pending ? "Zapisywanie…" : "🎙 Nagraj w Safari (mikrofon)"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void stopRecording(false)}
                className="randki-btn-outline border-rose-400/50 text-[13px] text-rose-200"
              >
                ■ Zatrzymaj ({seconds}s)
              </button>
            )}
          </div>
        )}
      </div>

      {recording && (
        <>
          <p className="mt-2 text-[12px] text-rose-300/90">● Nagrywasz… max {MAX_RECORD_SEC} s</p>
          <div className="mt-2">
            <p className="mb-1 text-[10px] text-white/40">
              Poziom mikrofonu {micLevel === 0 ? "— mów głośniej, jeśli pasek stoi" : ""}
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400 transition-[width] duration-100"
                style={{ width: `${Math.max(4, micLevel)}%` }}
              />
            </div>
          </div>
        </>
      )}

      {status && !localError && <p className="mt-2 text-[12px] text-violet-200/80">{status}</p>}
      {localError && <p className="mt-3 text-[12px] text-rose-300">{localError}</p>}
    </section>
  );
}
