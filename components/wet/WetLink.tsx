"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useIsWetPortal } from "@/contexts/WetHostContext";
import { wetPublicHref } from "@/lib/wetPaths";

type WetLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function WetLink({ href, ...props }: WetLinkProps) {
  const isWetPortal = useIsWetPortal();
  return <Link href={wetPublicHref(href, isWetPortal)} {...props} />;
}
