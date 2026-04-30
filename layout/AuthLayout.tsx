"use client";
import FloatingDraggable from "@/components/animation/FloatingDraggable";
import { useLang } from "@/hooks/useLang";
import Image from "next/image";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useLang();

  return (
    <div className={`h-screen w-screen px-6 sm:px-10 xl:px-40 py-10 flex`}>
      <div className="flex gap-0 w-full h-full rounded-4xl overflow-hidden">
        {/* Right Side - Form */}
        <div className="min-w-[450px w-full sm:w-fit lg:w-1/2 flex items-center justify-center bg-white px-3 sm:px-12 lg:px-16 xl:px-24 lg:rounded-none rounded-4xl mx-auto">
          <div className="w-full">
            {children}
            </div>
        </div>

        {/* Left Side - Animated Background and Content */}
        <div className="hidden lg:flex lg:w-1/2 relative  overflow-hidden bg-[#281a3a]">
          {/* Animated Background (z-index: 0) */}
          <div className="absolute inset-0 z-0">
            <FloatingDraggable />
          </div>

          {/* Content (z-index: 10, but ignore mouse events) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center w-full px-16 text-center z-10 pointer-events-none">
            <div className="max-w-2xl mx-auto">
              {/* Main Title */}
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
                {t("auth.title")}
              </h1>
              {/* Logo and Brand */}
              <div className="flex flex-col gap-10 items-center">
                <Image
                  src="/logo-short.png"
                  alt="Logo Short"
                  width={80}
                  height={80}
                  className="mx-auto"
                />
                <h2 className="text-4xl font-bold text-white tracking-tight">
                  {t("auth.brand")}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
