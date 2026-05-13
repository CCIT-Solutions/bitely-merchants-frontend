"use client";
import { Button } from "@/components/custom/button";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useEffect, useState } from "react";
import { useLang } from "@/hooks/useLang";
import Global from "../icons/Global";

function LangSwitcher() {
  const { lang, setLang } = useLanguageStore();
  const { i18n } = useLang();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const nextLang = lang === "ar" ? "en" : "ar";
  const currentLanguageText = lang === "ar" ? "English" : "العربية";

  function toggleLang() {
    setLang(nextLang);
    i18n.changeLanguage(nextLang);
  }

  if (!isMounted) {
    return (
      <Button
        variant="noStyle"
        className="h-auto border-0 p-0 hover:bg-transparent!"
        disabled
        aria-label="Lang Switcher"
      >
        <div className="rounded uppercase hover:text-primary transition-colors cursor-pointer"></div>
      </Button>
    );
  }

  return (
    <Button
      variant="noStyle"
      className="cursor-pointer p-0!  w-10 h-10 rounded-full border border-neutral-200 dark:border-primary/20 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-primary dark:hover:text-primary-foreground transition"
      onClick={toggleLang}
      title={currentLanguageText}
      aria-label="Lang Switcher"
    >
      <Global className="size-5" />
    </Button>
  );
}

export default LangSwitcher;
