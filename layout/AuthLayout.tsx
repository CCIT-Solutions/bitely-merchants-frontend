"use client";
import Animate from "@/components/animation/Animate";
import FloatingDraggable from "@/components/animation/FloatingDraggable";
import Android from "@/components/icons/Android";
import Apple from "@/components/icons/Apple";
import Heading from "@/components/shared/Heading";
import Logo from "@/components/shared/Logo";
import { useLang } from "@/hooks/useLang";
import { fadeDu1D3 } from "@/lib/animation";
import { useThemeStore } from "@/stores/useThemeStore";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useLang();
  const { isDark } = useThemeStore();

  return (
    <div className={`h-screen w-screen flex`}>
      <div className="flex gap-0 w-full h-full  overflow-hidden">
        {/* Right Side - Form */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-b from-primary to-primary-foreground from-10 to-90">
        
          {/* Content - Animated*/}
          <div className="absolute inset-0 flex flex-col justify-between w-full p-16 z-10 pointer-events-none">
            {/* Logo and Brand */}
            <div className="flex gap-10 justify-between">
              <Link
                href="/"
                className={"w-28 h-12 relative block cursor-pointer"}
              >
                <Image
                  src={`/logo-light.png`}
                  alt="Logo"
                  fill
                  className="w-full h-full object-contain"
                  priority
                  fetchPriority="high"
                  decoding="async"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </Link>
            </div>

            {/* Main Title */}
            <div>
              <span className="uppercase text-xs text-primary/70 tracking-widest">
                {t("auth.membersEntrance")}
              </span>
              <Heading
                i18nKey={"auth.title"}
                components={{
                  custom: <span className="text-primary" />,
                }}
                className="text-start"
              />
              <p className="text-start max-w-lg text-foreground/60 text-base leading-relaxed">
                {t("auth.subtitle")}
              </p>
            </div>

              <Animate
            variants={fadeDu1D3}
            className="
           text-[20vw] 
           absolute 
           xl:text-[300px]  xl:ms-[20%]  ms-[30%] bottom-0  mb-10 lg:mb-14 xl:leading-75
           
           font-bold text-primary/40  "
          >
            Bitely.
          </Animate>

            <div className="relative z-10">
              <span className="text-xs opacity-80 block">
                {t("auth.downloadApp")}
              </span>

              <div className="flex gap-2 mt-2">
                <a
                  href="https://apps.apple.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-primary-foreground hover:bg-primary-foreground/90 text-white w-36 py-2 px-2 rounded-lg opacity-90 border border-primary/20"
                >
                  <Apple className="size-7" />
                  <div className="flex flex-col">
                    <span className="text-[8px] leading-none">
                      {t("auth.appStoreTitle")}
                    </span>
                    <span className="text-sm font-semibold">
                      {t("auth.appStoreName")}
                    </span>
                  </div>
                </a>

                <a
                  href="https://play.google.com/store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-primary-foreground hover:bg-primary-foreground/90 text-white w-36 py-1 px-2 rounded-lg opacity-90 border border-primary/20"
                >
                  <Android className="size-5" />
                  <div className="flex flex-col">
                    <span className="text-[10px] leading-none">
                      {t("auth.googlePlayTitle")}
                    </span>
                    <span className="text-sm font-semibold">
                      {t("auth.googlePlayName")}
                    </span>
                  </div>
                </a>
              </div>
              <span className="text-[0.7rem] opacity-80 block mt-2">
                {t("auth.appRights")}
              </span>
            </div>
          </div>
        </div>

        {/* Left Side - Forms*/}
        <div className="min-w-[450px w-full sm:w-fit lg:w-1/2 flex items-center justify-center bg-white px-3 sm:px-12 lg:px-16 xl:px-24 lg:rounded-none rounded-4xl mx-auto">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
