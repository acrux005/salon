/**
 * Konfiguracja usług DPD (SOAP: DPDServices, DPDAppServices, DPDInfoServices, moduł duty)
 * — tylko server-side (importuj wyłącznie z API routes / server actions).
 *
 * Model „świeży towar”: kurier odbiera u nadawcy i dowozi pod adres — **nie wymaga** punktów
 * MyPudo (PUDO). Pola MyPudo poniżej są tylko na wypadek innej integracji (np. wyszukiwarka
 * punktów); możesz je pominąć w `.env`.
 *
 * Wartości ze zmiennych środowiskowych — patrz `.env.example`.
 */

function trim(v: string | undefined): string {
  return (v ?? "").trim();
}

export type DpdApiCredentials = {
  login: string;
  password: string;
  masterFid: string;
  /** FID dla DPDServices (np. generowanie etykiet / paczek). */
  servicesFid: string;
  /** FID dla DPDAppServices (odbiór od osoby trzeciej itd.). */
  appServicesFid: string;
  /** Identyfikator kanału dla DPDInfoServices (zlecenia DPD). */
  infoServicesChannel: string;
  /** FID dla modułu duty (jeśli inny niż services — ustaw env). */
  servicesDutyModuleFid: string;
  /** MyPudo (sieć punktów odbioru/nadania) — **nie** dotyczy dostawy kurierskiej „pod drzwi”; opcjonalne. */
  myPudoLogin: string;
  myPudoPassword: string;
  /** Opcjonalny klucz MyPudo — tylko gdy faktycznie korzystasz z API punktów. */
  myPudoApiKey: string;
};

export function getDpdApiCredentials(): DpdApiCredentials {
  const login = trim(process.env.DPD_SERVICES_LOGIN);
  const password = trim(process.env.DPD_SERVICES_PASSWORD);
  const masterFid = trim(process.env.DPD_MASTER_FID);
  const servicesFid = trim(process.env.DPD_SERVICES_FID) || masterFid;
  return {
    login,
    password,
    masterFid,
    servicesFid,
    appServicesFid: trim(process.env.DPD_APP_SERVICES_FID) || masterFid,
    infoServicesChannel: trim(process.env.DPD_INFO_SERVICES_CHANNELS) || masterFid,
    servicesDutyModuleFid:
      trim(process.env.DPD_SERVICES_DUTY_MODULE_FID) || servicesFid || masterFid,
    myPudoLogin: trim(process.env.DPD_MYPUDO_API_LOGIN) || login,
    myPudoPassword: trim(process.env.DPD_MYPUDO_API_PASSWORD) || password,
    myPudoApiKey: trim(process.env.DPD_MYPUDO_API_KEY),
  };
}

export function dpdApiCredentialsConfigured(): boolean {
  const c = getDpdApiCredentials();
  return Boolean(c.login && c.password && c.masterFid);
}

function dpdServicesHost(): string {
  return trim(process.env.DPD_SERVICES_HOST) ||
    (process.env.DPD_SANDBOX === "1"
      ? "dpdservicesdemo.dpd.com.pl"
      : "dpdservices.dpd.com.pl");
}

/** Domyślne adresy WSDL produkcyjne (PL); nadpisz env, jeśli DPD poda inne. */
export function getDpdWsdlUrls(): {
  packageObjServices: string;
  appServiceObjServices: string;
  infoServicesObjEvents: string;
  /** Moduł duty — brak domyślnego publicznego WSDL; ustaw `DPD_SERVICES_DUTY_MODULE_WSDL_URL`. */
  servicesDutyModule: string;
} {
  const host = dpdServicesHost();
  const base = `https://${host}`;
  return {
    packageObjServices:
      trim(process.env.DPD_WSDL_PACKAGE_OBJ) ||
      `${base}/DPDPackageObjServicesService/DPDPackageObjServices?WSDL`,
    appServiceObjServices:
      trim(process.env.DPD_WSDL_APP_SERVICE_OBJ) ||
      `${base}/DPDAppServiceObjServicesService/DPDAppServiceObjServices?WSDL`,
    infoServicesObjEvents:
      trim(process.env.DPD_WSDL_INFO_SERVICES_EVENTS) ||
      `${base}/DPDInfoServicesObjEventsService/DPDInfoServicesObjEvents?WSDL`,
    servicesDutyModule: trim(process.env.DPD_SERVICES_DUTY_MODULE_WSDL_URL),
  };
}

/** Bazowy URL API MyPudo (REST) — tylko dla sieci punktów PUDO; przy dostawie pod adres nieużywane. */
export function getDpdMyPudoApiBaseUrl(): string {
  return (
    trim(process.env.DPD_MYPUDO_API_URL) ||
    "https://mypudo.dpd.com.pl/api/pudo/"
  ).replace(/\/?$/, "/");
}
