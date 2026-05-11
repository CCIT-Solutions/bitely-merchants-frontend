"use client";
import Animate from "@/components/animation/Animate";
import FloatingDraggable from "@/components/animation/FloatingDraggable";
import Android from "@/components/icons/Android";
import Apple from "@/components/icons/Apple";
import Heading from "@/components/shared/headings/Heading";
import Logo from "@/components/shared/Logo";
import { useLang } from "@/hooks/useLang";
import { fadeDu1D3 } from "@/lib/animation";
import { useThemeStore } from "@/stores/useThemeStore";
import Image from "next/image";
import Link from "next/link";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BsLeaf } from "react-icons/bs";
import { PiChefHatLight } from "react-icons/pi";

import { LuChefHat } from "react-icons/lu";
import { CiDeliveryTruck } from "react-icons/ci";
import { PiPlantFill } from "react-icons/pi";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { t, isRTL } = useLang();
  const { isDark } = useThemeStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const authRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!authRef.current) return;
    const rect = authRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  const float1Style = {
    transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`,
    transition: "transform 1s ease-out",
  };

  const float3Style = {
    transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
    transition: "transform 1s ease-out",
  };

  return (
    <div
      className={`h-screen w-screen flex bg-[#fbfbf9] dark:bg-background/80 ${isDark ? "dark" : "light"}`}
      ref={authRef}
      onMouseMove={handleMouseMove}
    >
      <div className="flex gap-0 w-full h-full max-w-400 mx-auto">
        {/* Right Side - Form */}
        <div className="hidden lg:flex lg:w-[60%] relative">
          <div className="w-[90%] h-[95%] absolute top-0 inset-e-0 my-10 hidden xl:block">
            <Image
              src="/media/images/auth/auth-bg.png"
              alt="Auth Background"
              fill
              className={`object-contain ${isRTL ? "-scale-x-100" : ""}`}
            />
          </div>
          <div
            className="size-50 xl:size-120 absolute top-[calc((100%-300px)/2)] xl:top-[calc((100%-500px)/2)] inset-e-0 my-10"
            style={float1Style}
          >
            <Image
              src="/media/images/auth/dish.png"
              alt="Auth Background"
              fill
              className="object-contain"
            />
          </div>
          {/* Content - Animated*/}
          <div className="absolute inset-0 flex flex-col w-full p-20 z-10">
            {/* Logo and Brand */}
            <div className="flex gap-10 justify-between w-40 h-18 relative  cursor-pointer">
              <Logo />
            </div>

            {/* Main Title */}
            <div className="mt-25">
              <span className="block text-5xl font-bold text-primary-foreground dark:text-foreground/90">
                {t("auth.title_1")}
              </span>
              <span className="block text-5xl font-bold text-primary mt-5">
                {t("auth.title_2")}
              </span>

              <p className="text-start max-w-xs text-foreground/50 text-lg font-medium leading-relaxed mt-6">
                {t("auth.subtitle")}
              </p>

              <div className="flex gap-4 mt-10" style={float3Style}>
                <div className="flex flex-col gap-4 justify-center items-center bg-[#fbfbf9]/30 dark:bg-background/40 backdrop-blur-xs border border-primary/50 rounded-lg p-2">
                  <BsLeaf className="text-primary size-12" />
                  <span className="text-foregroundk/50 font-medium max-w-20 text-center">
                    {t("auth.feature_1")}
                  </span>
                </div>
                <div className="flex flex-col gap-4 justify-center items-center bg-[#fbfbf9]/30 dark:bg-background/40 backdrop-blur-xs border border-primary/50 rounded-lg p-2">
                  <PiChefHatLight className="text-primary size-12" />
                  <span className="text-foregroundk/50 font-medium max-w-20 text-center">
                    {t("auth.feature_2")}
                  </span>
                </div>
                <div className="flex flex-col gap-4 justify-center items-center bg-[#fbfbf9]/30 dark:bg-background/40 backdrop-blur-xs border border-primary/50 rounded-lg p-2">
                  <CiDeliveryTruck className="text-primary size-12" />
                  <span className="text-foregroundk/50 font-medium max-w-20 text-center">
                    {t("auth.feature_3")}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="flex gap-3 items-center mt-25 bg-[#fbfbf9]/60 dark:bg-background/70 border  rounded-lg shadow-xs w-fit  p-3 font-medium"
              style={float1Style}
            >
              <div className="rounded-full size-10 bg-primary-foreground flex justify-center items-center">
                <PiPlantFill className="text-white size-6" />
              </div>

              <div className="flex gap-1">
                <span className="text-md block text-foreground/50">
                  {t("auth.eatWell")}
                </span>
                <span className="text-md block text-primary">
                  {t("auth.liveWell")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side - Forms*/}
        <div className=" w-full sm:w-fit lg:w-163 flex items-center px-4 lg:px-0 lg:rounded-none rounded-4xl mx-auto lg:mx-0">
          <div className="min-w-80 w-full sm:min-w-100 md:w-fit shadow-[0px_0px_10px_10px_#f3f3f394] dark:shadow-[0px_0px_10px_10px_#18181894] rounded-3xl bg-white dark:bg-primary-foreground/20 border p-10 flex flex-col justify-center items-center gap-5  md:ms-10 mx-auto lg:ms-5">
            <Image
              src="/logo-short.png"
              alt="Short Logo"
              height={60}
              width={60}
            />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
