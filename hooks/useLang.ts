import { useTranslation } from "react-i18next";

export function useLang() {
  const { i18n, t } = useTranslation();
  const lang: "ar" | "en" = i18n.language?.startsWith("ar") ? "ar" : "en";
  const isRTL: boolean = lang === "ar";

  return { lang, i18n, isRTL, t };
}