"use client";
import { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n/i18n";
import { useLanguageStore } from "@/stores/useLanguageStore";

export default function LocaleProvider({ children }: { children: ReactNode }) {
  const { lang } = useLanguageStore();

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
