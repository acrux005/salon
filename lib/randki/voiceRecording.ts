/** Pomocniki nagrywania głosu w przeglądarce (Safari iOS wymaga osobnej obsługi). */

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isMobileVoiceDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

/** Bez samego audio/* — na iOS często otwiera Galerię / aparat. */
export const VOICE_FILE_ACCEPT =
  ".m4a,.mp3,.wav,.aac,.mp4,.caf,audio/mp4,audio/mpeg,audio/x-m4a,audio/m4a,audio/wav,audio/aac,audio/x-caf";

export function canUseBrowserVoiceRecorder(): boolean {
  if (typeof window === "undefined") return false;
  if (!navigator.mediaDevices?.getUserMedia) return false;
  if (typeof MediaRecorder === "undefined") return false;
  if (isIosDevice()) {
    return (
      MediaRecorder.isTypeSupported("audio/mp4") ||
      MediaRecorder.isTypeSupported("audio/aac") ||
      MediaRecorder.isTypeSupported("audio/webm")
    );
  }
  return true;
}

export function pickVoiceRecorderMime(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const iosFirst = isIosDevice()
    ? ["audio/mp4", "audio/aac", "audio/webm;codecs=opus", "audio/webm"]
    : [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/aac",
        "audio/ogg;codecs=opus",
        "audio/ogg",
      ];
  return iosFirst.find((t) => MediaRecorder.isTypeSupported(t));
}

export function voiceExtFromMime(mime: string): string {
  const m = mime.toLowerCase();
  if (m.includes("mp4") || m.includes("aac") || m.includes("m4a") || m.includes("caf")) return "m4a";
  if (m.includes("ogg")) return "ogg";
  if (m.includes("mpeg") || m.includes("mp3")) return "mp3";
  if (m.includes("wav")) return "wav";
  return "webm";
}

export async function getVoiceAudioStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: false,
  });
}

export function createVoiceMediaRecorder(stream: MediaStream): MediaRecorder {
  const mime = pickVoiceRecorderMime();
  try {
    return mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
  } catch {
    return new MediaRecorder(stream);
  }
}

/** iOS Safari: bez timeslice blob bywa pusty po stop(). */
export function startVoiceRecorder(recorder: MediaRecorder): void {
  if (isIosDevice()) {
    recorder.start(500);
  } else {
    recorder.start();
  }
}

export function stopVoiceRecorderSafely(recorder: MediaRecorder): Promise<void> {
  return new Promise((resolve) => {
    if (recorder.state === "inactive") {
      resolve();
      return;
    }
    const done = () => resolve();
    recorder.addEventListener("stop", done, { once: true });
    try {
      recorder.requestData();
    } catch {
      /* ignore */
    }
    const delay = isIosDevice() ? 200 : 50;
    window.setTimeout(() => {
      try {
        recorder.stop();
      } catch {
        done();
      }
    }, delay);
  });
}

export function normalizeVoiceUploadFile(file: File): File {
  const type = file.type?.toLowerCase() ?? "";
  if (type && type !== "application/octet-stream") return file;
  const name = file.name.toLowerCase();
  if (name.endsWith(".m4a") || name.endsWith(".mp4") || name.endsWith(".aac") || name.endsWith(".caf")) {
    return new File([file], name.endsWith(".m4a") ? file.name : `${file.name.replace(/\.[^.]+$/, "") || "voice"}.m4a`, {
      type: "audio/mp4",
      lastModified: file.lastModified,
    });
  }
  if (name.endsWith(".mp3")) {
    return new File([file], file.name, { type: "audio/mpeg", lastModified: file.lastModified });
  }
  if (name.endsWith(".wav")) {
    return new File([file], file.name, { type: "audio/wav", lastModified: file.lastModified });
  }
  if (name.endsWith(".webm")) {
    return new File([file], file.name, { type: "audio/webm", lastModified: file.lastModified });
  }
  return file;
}
