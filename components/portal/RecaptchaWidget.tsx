"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_ACTION = "register";

export function RecaptchaWidget({ onToken }: { onToken: (token: string) => void; id?: string }) {
  const mounted = useRef(true);

  useEffect(() => {
    if (!SITE_KEY) return;
    mounted.current = true;
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        if (!mounted.current || !window.grecaptcha) return;
        window.grecaptcha
          .execute(SITE_KEY, { action: RECAPTCHA_ACTION })
          .then((token) => {
            if (mounted.current) onToken(token);
          })
          .catch(() => {});
      });
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.onload = () => {
      window.grecaptcha?.ready(() => {
        if (!mounted.current || !window.grecaptcha) return;
        window.grecaptcha
          .execute(SITE_KEY, { action: RECAPTCHA_ACTION })
          .then((token) => {
            if (mounted.current) onToken(token);
          })
          .catch(() => {});
      });
    };
    document.head.appendChild(script);
    return () => {
      mounted.current = false;
    };
  }, [onToken]);

  if (!SITE_KEY) return null;
  return null;
}

/** Returns a fresh reCAPTCHA v3 token (for use on form submit). */
export function getRecaptchaTokenAsync(): Promise<string> {
  if (typeof window === "undefined" || !SITE_KEY) return Promise.resolve("");
  const g = window.grecaptcha;
  if (!g) return Promise.resolve("");
  return new Promise((resolve, reject) => {
    g.ready(() => {
      g.execute(SITE_KEY!, { action: RECAPTCHA_ACTION }).then(resolve).catch(reject);
    });
  });
}

/** Legacy sync getter; for v3 use getRecaptchaTokenAsync() on submit. */
export function getRecaptchaToken(): string {
  return "";
}

export function hasRecaptcha(): boolean {
  return !!SITE_KEY;
}
