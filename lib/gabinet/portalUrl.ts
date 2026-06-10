import { getGabinetSiteUrl } from "@/lib/gabinetPlatform/host";
import { GABINET_VERTICALS, type GabinetVerticalId } from "@/lib/gabinetPlatform/verticals";

export function getGabVerticalHost(verticalId: string): string {
  const v = GABINET_VERTICALS[(verticalId as GabinetVerticalId) ?? "dent"] ?? GABINET_VERTICALS.dent;
  return v.hosts[0] ?? "dentysta.odart.pl";
}

export function gabPatientPanelUrl(verticalId?: string | null, host?: string | null): string {
  if (host) return `${getGabinetSiteUrl(host)}/klient/panel`;
  return `https://${getGabVerticalHost(verticalId ?? "dent")}/klient/panel`;
}

export function gabPatientPlanUrl(planId: string, verticalId?: string | null, host?: string | null): string {
  return `${gabPatientPanelUrl(verticalId, host)}/plany/${planId}`;
}

export function gabPublicUrl(path: string, verticalId?: string | null, host?: string | null): string {
  const base = host ? getGabinetSiteUrl(host) : `https://${getGabVerticalHost(verticalId ?? "dent")}`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
