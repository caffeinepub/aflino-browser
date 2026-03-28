import { useEffect } from "react";
import { useShortcutsStore } from "../useShortcutsStore";

const GEO_CACHE_KEY = "aflino_geo_cache";
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

type GeoCache = {
  countryCode: string;
  vpnDetected: boolean;
  cachedAt: number;
};

export function useGeoDetection() {
  const setGeoResult = useShortcutsStore((s) => s.setGeoResult);

  useEffect(() => {
    // Check cache first
    try {
      const raw = localStorage.getItem(GEO_CACHE_KEY);
      if (raw) {
        const cache: GeoCache = JSON.parse(raw);
        if (Date.now() - cache.cachedAt < CACHE_TTL) {
          setGeoResult(cache.countryCode, cache.vpnDetected);
          return;
        }
      }
    } catch {
      /* ignore */
    }

    // Fetch from ip-api.com (free, no key needed, includes proxy/vpn fields)
    fetch("http://ip-api.com/json/?fields=status,countryCode,proxy,hosting")
      .then((r) => r.json())
      .then((data) => {
        if (data.status !== "success") return;
        const countryCode: string = data.countryCode ?? "OTHER";
        const vpnDetected: boolean = !!(data.proxy || data.hosting);
        setGeoResult(countryCode, vpnDetected);
        const cache: GeoCache = {
          countryCode,
          vpnDetected,
          cachedAt: Date.now(),
        };
        localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(cache));
      })
      .catch(() => {
        // Silently fail — rewards remain in default state
      });
  }, [setGeoResult]);
}
