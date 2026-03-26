import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RTL_LANGUAGES, getLanguage } from "./i18n/languages";

type LanguageState = {
  selectedCode: string;
  landmarkIcons: Record<string, string>;
  setLanguage: (code: string) => void;
  setLandmarkIcon: (code: string, dataUrl: string) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedCode: "en",
      landmarkIcons: {},
      setLanguage: (code) => {
        set({ selectedCode: code });
        // Apply RTL direction
        const isRTL = RTL_LANGUAGES.has(code);
        document.documentElement.dir = isRTL ? "rtl" : "ltr";
        // Apply font class
        const lang = getLanguage(code);
        const fontClasses = ["font-urdu", "font-sanskrit", "font-devanagari"];
        for (const cls of fontClasses) {
          document.documentElement.classList.remove(cls);
        }
        if (lang?.fontClass) {
          document.documentElement.classList.add(lang.fontClass);
        }
      },
      setLandmarkIcon: (code, dataUrl) =>
        set((state) => ({
          landmarkIcons: { ...state.landmarkIcons, [code]: dataUrl },
        })),
    }),
    { name: "aflino_language" },
  ),
);
