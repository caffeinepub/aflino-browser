import { useLanguageStore } from "../useLanguageStore";
import { TRANSLATIONS } from "./translations";

export function useTranslation() {
  const selectedCode = useLanguageStore((s) => s.selectedCode);
  return TRANSLATIONS[selectedCode] ?? TRANSLATIONS.en;
}
