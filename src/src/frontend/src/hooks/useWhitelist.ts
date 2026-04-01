import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "aflino_site_exceptions";
const EVENT_NAME = "aflino:whitelist-change";

function readFromStorage(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useWhitelist() {
  const [exceptions, setExceptions] = useState<string[]>(readFromStorage);

  useEffect(() => {
    const onCustom = (e: Event) => {
      setExceptions((e as CustomEvent<string[]>).detail);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        try {
          setExceptions(JSON.parse(e.newValue || "[]"));
        } catch {
          setExceptions([]);
        }
      }
    };
    window.addEventListener(EVENT_NAME, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const addException = useCallback((domain: string): { added: boolean } => {
    const normalized = domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0];
    if (!normalized) return { added: false };
    const current = readFromStorage();
    if (current.includes(normalized)) return { added: false };
    const next = [...current, normalized];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
    setExceptions(next);
    return { added: true };
  }, []);

  const removeException = useCallback((domain: string) => {
    setExceptions((prev) => {
      const next = prev.filter((e) => e !== domain);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
      return next;
    });
  }, []);

  return { exceptions, addException, removeException };
}
