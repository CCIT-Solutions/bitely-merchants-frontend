"use client";
import React, { useEffect, useState } from "react";
import { useLang } from "@/hooks/useLang";
import DecorativeParticles from "@/components/animation/DecorativeParticles";
import Animate from "@/components/animation/Animate";
import { fade } from "@/lib/animation";

const SuccessPage = () => {
  const { t } = useLang();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleLogin = () => {
    console.log("Navigating to login...");
    // Add your navigation logic here
  };

  return (
    <Animate variants={fade}  className="min-h-[700px]  flex items-center justify-center p-4 relative overflow-hidden">
      {/* Main Content */}
      <div className="max-w-5xl h-[500px] w-full text-center relative z-10 flex flex-col justify-center items-center ">
        {/* Decorative dots */}
        <DecorativeParticles className="w-full h-full inset-0 lg:start-0"/>

        {/* Heading */}
        <h1
          className={`text-5xl md:text-6xl font-bold mb-6 leading-tight max-w-lg`}
        >
          {t("success.title")}
        </h1>

        {/* Subtext */}
        <div className={`space-y-1 mb-10 max-w-sm`}>
          <p className="text-gray-500 text-lg">{t("success.description")}</p>
        </div>

        {/* Login Button */}
        <div
          className={`${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          style={{ animationDelay: "0.6s" }}
        >
          <button
            onClick={handleLogin}
            className="inline-flex items-center justify-center px-16 py-4 bg-primary hover:bg-primary/80 cursor-pointer text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            {t("success.button")}
          </button>
        </div>
      </div>
    </Animate>
  );
};

export default SuccessPage;
