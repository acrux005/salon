"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type * as LeafletNS from "leaflet";
import type { MapPoint } from "@/lib/athensPlanData";
import "leaflet/dist/leaflet.css";
import "./athens-leaflet.css";

type Props = {
  /** Unikalny id kontenera (wiele map na stronie). */
  mapInstanceId: string;
  points: MapPoint[];
  /** Domyślnie true — łączy punkty linią (trasa dnia). */
  showRoute?: boolean;
  /** Przycisk „Moja pozycja (GPS)” — domyślnie włączony na wszystkich mapach planu. */
  showUserLocateButton?: boolean;
};

/** Ładuje Leaflet dopiero gdy sekcja jest blisko viewportu (oszczędność JS przy starcie). */
export function LazyAthensLeafletMap(props: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setShow(true);
      },
      { rootMargin: "180px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full">
      {show ? (
        <AthensLeafletMap {...props} />
      ) : (
        <div
          className="flex h-[min(26rem,52vh)] min-h-[220px] w-full items-center justify-center rounded-2xl bg-[#dfe9f4]/50 text-sm text-[#3d4d5c]/70 ring-1 ring-[#1c2d44]/10 md:h-[min(28rem,55vh)]"
          aria-hidden
        >
          Wczytywanie mapy…
        </div>
      )}
    </div>
  );
}

export function AthensLeafletMap({
  mapInstanceId,
  points,
  showRoute = true,
  showUserLocateButton = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletNS.Map | null>(null);
  /** Runtime `import("leaflet").default` — typ modułu bez pola `default` w @types. */
  const leafletRef = useRef<typeof LeafletNS | null>(null);
  const userMarkerRef = useRef<LeafletNS.Layer | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || points.length === 0) return;

    let map: LeafletNS.Map | null = null;
    let cancelled = false;

    void (async () => {
      const L = (await import("leaflet")).default as unknown as typeof LeafletNS;
      leafletRef.current = L;

      if (cancelled || !containerRef.current) return;

      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      map = L.map(el, {
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const latlngs = points.map((p) => [p.lat, p.lng] as [number, number]);

      points.forEach((p) => {
        const icon = L.divIcon({
          className: "athens-leaflet-marker-wrap",
          html: `<div class="athens-map-pin" aria-hidden="true">${p.order}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        L.marker([p.lat, p.lng], { icon })
          .addTo(map!)
          .bindPopup(`<strong>${escapeHtml(p.title)}</strong><br/>${escapeHtml(p.popupDescription)}`);
      });

      if (showRoute && latlngs.length >= 2) {
        L.polyline(latlngs, {
          color: "#1c2d44",
          weight: 3,
          opacity: 0.88,
          lineJoin: "round",
        }).addTo(map);
      }

      const maxZoomFit = showRoute ? 16 : 11;
      if (latlngs.length === 1) {
        map.setView(latlngs[0], 14);
      } else {
        map.fitBounds(L.latLngBounds(latlngs), { padding: [36, 36], maxZoom: maxZoomFit });
      }

      if (!cancelled) setMapReady(true);
      requestAnimationFrame(() => {
        map?.invalidateSize();
      });
    })();

    return () => {
      cancelled = true;
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      mapRef.current = null;
      leafletRef.current = null;
      setMapReady(false);
      map?.remove();
      map = null;
    };
  }, [mapInstanceId, points, showRoute]);

  const onLocateClick = useCallback(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;
    if (!navigator.geolocation) {
      window.alert("Ta przeglądarka nie udostępnia geolokalizacji.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const latlng = L.latLng(lat, lng);
        userMarkerRef.current?.remove();
        const marker = L.circleMarker(latlng, {
          radius: 11,
          color: "#1e3a5f",
          weight: 3,
          fillColor: "#4a90d9",
          fillOpacity: 0.92,
        })
          .addTo(map)
          .bindPopup(
            "<strong>Twoja pozycja</strong><br/>Przybliżenie z GPS — dokładność zależy od urządzenia i sygnału.",
          );
        userMarkerRef.current = marker;
        marker.openPopup();
        const all: [number, number][] = [...points.map((p) => [p.lat, p.lng] as [number, number]), [lat, lng]];
        map.fitBounds(L.latLngBounds(all), { padding: [52, 52], maxZoom: 14 });
      },
      () => {
        window.alert(
          "Nie udało się odczytać pozycji. Sprawdź, czy strona ma zgodę na lokalizację w ustawieniach przeglądarki.",
        );
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
    );
  }, [points]);

  return (
    <div className="relative w-full">
      <div
        id={mapInstanceId}
        ref={containerRef}
        className="athens-leaflet-map h-[min(26rem,52vh)] min-h-[220px] w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_-12px_rgba(28,45,68,0.2)] ring-1 ring-[#1c2d44]/10 md:h-[min(28rem,55vh)]"
        role="region"
        aria-label={
          showUserLocateButton
            ? "Mapa z OpenStreetMap — możliwość pokazania przybliżonej pozycji z GPS"
            : "Mapa trasy z OpenStreetMap"
        }
      />
      {showUserLocateButton ? (
        <button
          type="button"
          onClick={onLocateClick}
          disabled={!mapReady}
          className="absolute bottom-3 right-3 z-[1000] rounded-lg border border-[#1c2d44]/15 bg-white/95 px-3 py-2 text-xs font-semibold text-[#1c2d44] shadow-md backdrop-blur-sm transition hover:bg-white disabled:cursor-wait disabled:opacity-60 md:text-sm"
        >
          {mapReady ? "Moja pozycja (GPS)" : "Ładowanie mapy…"}
        </button>
      ) : null}
    </div>
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
