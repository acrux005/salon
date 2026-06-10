"use client";

import Link from "next/link";
import { clinicDemo } from "@/content/clinicDemo";

export function ClinicFooter() {
  const { footer, siteName } = clinicDemo;
  return (
    <footer className="border-t border-neutral-200 bg-neutral-100 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-[var(--font-serif)] text-lg font-medium text-[#1F1A1C]">
              {siteName}
            </p>
            <p className="mt-2 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#6F5E64]">
              {footer.description}
            </p>
          </div>
          <div>
            <p className="font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C]">
              {footer.contact}
            </p>
            <ul className="mt-3 space-y-2">
              {footer.links.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-[var(--font-sans)] text-[14px] text-[#6F5E64] hover:text-pink-600"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
              {footer.domain}
            </p>
          </div>
        </div>
        <p className="mt-10 border-t border-neutral-200 pt-8 font-[var(--font-sans)] text-[13px] text-neutral-500">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
