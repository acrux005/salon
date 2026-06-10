"use client";

import { useEffect, useState } from "react";
import {
  getCalendarFeedUrlAction,
  regenerateCalendarFeedUrlAction,
} from "@/app/actions/vetCalendar";

export function WetCalendarSyncPanel() {
  const [feedUrl, setFeedUrl] = useState("");
  const [webcalUrl, setWebcalUrl] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCalendarFeedUrlAction().then((result) => {
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      applyUrls(result.feedUrl);
    });
  }, []);

  function applyUrls(url: string) {
    setFeedUrl(url);
    const webcal = url.replace(/^https?:/, "webcal:");
    setWebcalUrl(webcal);
    setGoogleUrl(
      `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}`
    );
  }

  async function handleRegenerate() {
    if (!confirm("Wygenerować nowy link? Stary przestanie działać w Google Calendar / Outlook.")) {
      return;
    }
    setRegenerating(true);
    setError("");
    const result = await regenerateCalendarFeedUrlAction();
    setRegenerating(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    applyUrls(result.feedUrl);
  }

  async function handleCopy() {
    if (!feedUrl) return;
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Nie udało się skopiować linku.");
    }
  }

  return (
    <section className="mt-10 rounded-xl border border-wet-teal-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-wet-navy">Synchronizacja kalendarza</h2>
      <p className="mt-1 text-[14px] text-wet-navy-muted">
        Subskrybuj wizyty w Google Calendar, Apple Calendar (iCal) lub Outlook. Kalendarz odświeża się co kilka godzin.
      </p>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-4 text-[14px] text-wet-navy-muted">Przygotowuję link…</p>
      ) : (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wide text-wet-navy-muted">
              Link iCal (HTTPS)
            </label>
            <div className="mt-1 flex flex-col gap-2 sm:flex-row">
              <input
                readOnly
                value={feedUrl}
                className="wet-input flex-1 font-mono text-[12px]"
                onFocus={(e) => e.target.select()}
              />
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg border border-wet-teal-200 px-4 py-2 text-[13px] font-medium text-wet-teal-800 hover:bg-wet-teal-50"
              >
                {copied ? "Skopiowano" : "Kopiuj"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {googleUrl && (
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="wet-btn-primary text-[13px]"
              >
                Dodaj do Google Calendar
              </a>
            )}
            {webcalUrl && (
              <a
                href={webcalUrl}
                className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-medium hover:bg-slate-50"
              >
                Otwórz w Apple Calendar
              </a>
            )}
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="rounded-lg border border-amber-200 px-4 py-2 text-[13px] font-medium text-amber-800 hover:bg-amber-50 disabled:opacity-60"
            >
              {regenerating ? "Generuję…" : "Nowy link (unieważnij stary)"}
            </button>
          </div>

          <p className="text-[12px] text-wet-navy-muted">
            W Outlook: Kalendarz → Dodaj kalendarz → Z internetu → wklej link iCal.
          </p>
        </div>
      )}
    </section>
  );
}
