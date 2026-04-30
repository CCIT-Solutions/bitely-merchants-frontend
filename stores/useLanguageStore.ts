import { Language } from "@/types/shared";
import { create } from "zustand";

interface LanguageStore {
  lang: Language;
  isRTL: boolean;
  setLang: (lang: Language) => void;
}

function getInitialLang(): Language {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("locale") as Language;
  return stored || "en"; // default is English
}

function isLanguageRTL(lang: Language): boolean {
  return lang === "ar";
}

export const useLanguageStore = create<LanguageStore>((set) => {
  const initialLang = getInitialLang();
  const initialRTL = isLanguageRTL(initialLang);

  //  Set default document attributes on load (LTR by default)
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("lang", initialLang);
    document.documentElement.setAttribute("dir", initialRTL ? "rtl" : "ltr");
  }

  return {
    lang: initialLang,
    isRTL: initialRTL,
    setLang: (lang) => {
      const rtl = isLanguageRTL(lang);

      if (typeof window !== "undefined") {
        localStorage.setItem("locale", lang);
        document.documentElement.setAttribute("lang", lang);
        document.documentElement.setAttribute("dir", rtl ? "rtl" : "ltr");
      }

      set({ lang, isRTL: rtl });
    },
  };
});
