"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./ar/ar.json";
import en from "./en/en.json";

i18n
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
  });

export default i18n;