"use client";
import { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useUser } from "@/hooks/useUser";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import i18n from "@/i18n/i18n";
import Loading from "@/components/shared/Loading";
import NoInternet from "@/components/shared/NoInternet";
import MinimalLayout from "./MinimalLayout";
import AppLayout from "./AppLayout";
import CookieConsent from "@/components/shared/CoockieConsent";
import SessionLayout from "./SessionLayout";
import ProfileApiEndpoints from "@/services/profile/api";
import { apiRequest } from "@/lib/api/api";
import { UserData } from "@/types/auth";

const LazyLenis = dynamic(
  () => import("lenis/react").then((mod) => mod.ReactLenis),
  { ssr: false, loading: () => <></> }
);

interface MainLayoutProps {
  children: ReactNode;
  minimal?: boolean;
  preventLinks?: boolean;
}

export default function MainLayout({
  children,
  minimal = false,
  preventLinks = false,
}: MainLayoutProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [completeProfile, setCompleteProfile] = useState(false);
  const [isLanguageReady, setIsLanguageReady] = useState(false);
  const { lang } = useLanguageStore();
  const { logout } = useUser();

  useEffect(() => {
    const checkLanguageSync = () => {
      if (i18n.language === lang) setIsLanguageReady(true);
    };

    checkLanguageSync();
    i18n.on("languageChanged", checkLanguageSync);

    return () => i18n.off("languageChanged", checkLanguageSync);
  }, [lang]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");

    if (!token || !loginTime) return;

    const currentTime = Date.now();
    const elapsed = currentTime - parseInt(loginTime, 10);
    const maxSession = 3 * 24 * 60 * 60 * 1000; // 3 days

    if (elapsed >= maxSession) {
      logout();
      return;
    }

    const remaining = maxSession - elapsed;
    const timer = setTimeout(logout, remaining);

    return () => clearTimeout(timer);
  }, [logout]);

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") || "en";
    if (!localStorage.getItem("locale")) {
      localStorage.setItem("locale", savedLocale);
    }

    i18n.changeLanguage(savedLocale);
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = savedLocale;
  }, []);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCompleteProfile(false);
      return;
    }

    const checkProfile = async () => {
      await apiRequest<UserData, { token: string }>(
        ProfileApiEndpoints.user(),
        {
          showErrorToast: false,
          onSuccess: () => setCompleteProfile(false),
          onError: () => setCompleteProfile(true),
        }
      );
    };

    checkProfile();
  }, []);

  if (!isLanguageReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isOnline) return <NoInternet />;

  const LayoutComponent = minimal
    ? preventLinks
      ? SessionLayout
      : MinimalLayout
    : AppLayout;

  const content = (
    <AuthInitializer>
      <LayoutComponent>
        {/* {completeProfile ? (
          <CompleteProfile onSuccess={() => setCompleteProfile(false)} />
        ) : ( */}
          {children}
        {/* )} */}
        {/* {children} */}
      </LayoutComponent>
      <CookieConsent />
    </AuthInitializer>
  );

  return <LazyLenis root>{content}</LazyLenis>;
}
