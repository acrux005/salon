"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useIsGabinetPortal } from "@/contexts/GabHostContext";
import { gabinetPublicHref } from "@/lib/gabinetPlatform/paths";

type GabLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function GabLink({ href, ...props }: GabLinkProps) {
  const isPortal = useIsGabinetPortal();
  return <Link href={gabinetPublicHref(href, isPortal)} {...props} />;
}
