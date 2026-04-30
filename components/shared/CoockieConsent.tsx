"use client";

import { useEffect, useState } from "react";
import Translate from "@/components/shared/Translate";
import { useLang } from "@/hooks/useLang";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed left-0 bottom-0 p-5 gap-4 z-100 w-full flex justify-center">
      <div className="max-w-[95vw] md:max-w-200 flex flex-col sm:flex-row gap-4  p-3 rounded-2xl items-center backdrop-blur-[3px] border bg-background/50 ">
        <span>
          <Translate text={t("shared.cookies.message")} />
        </span>
        <div className="flex gap-4 w-full sm:w-fit">
          <button
            onClick={handleDecline}
            className="px-4 py-2 border border-red-400 text-red-400 hover:bg-red-400 hover:border-red-400 hover:text-white rounded-lg  duration-500 transition-colors cursor-pointer font-semibold flex-1 text-sm"
          >
            <Translate text={t("shared.cookies.decline")} />
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg transition-colors duration-500 cursor-pointer font-semibold flex-1 block text-sm"
          >
            <Translate text={t("shared.cookies.accept")} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
