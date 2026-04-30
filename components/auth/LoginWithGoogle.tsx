"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useLang } from "@/hooks/useLang";
import { useUser } from "@/hooks/useUser";
import { notify } from "@/lib/notify";
import Translate from "../shared/Translate";
import { useQueryClient } from "@tanstack/react-query";

const LoginWithGoogle = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { t } = useLang();
  const { login } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const popupCheckRef = useRef<NodeJS.Timeout | null>(null);
  const loginCompletedRef = useRef(false);
  const popupRef = useRef<Window | null>(null);

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "";

  const allowedOrigins = useMemo(() => {
    const list = [apiBase];
    if (process.env.NODE_ENV !== "production") {
      list.push("http://localhost:3000");
    }
    return list;
  }, [apiBase]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!allowedOrigins.includes(event.origin)) {
        console.warn("Message from unauthorized origin:", event.origin);
        return;
      }

      const credential = event.data;

      
      

      if (!credential?.token || !credential?.user?.email) {
        console.warn("Invalid credential format received:", credential);
        return;
      }

      loginCompletedRef.current = true;

      if (popupCheckRef.current) {
        clearInterval(popupCheckRef.current);
        popupCheckRef.current = null;
      }

      try {
        queryClient.removeQueries({ queryKey: ["user"] });

        login(credential.user, credential.token);

        queryClient.setQueryData(["user"], credential.user);

        queryClient.invalidateQueries({
          queryKey: ["user"],
          refetchType: "active",
        });

        setIsGoogleLoading(false);

        setTimeout(() => {
          if (typeof onSuccess === "function") onSuccess();
          else router.push("/");
        }, 100);
        
      } catch (error) {
        console.error("Login error:", error);
        notify(t("auth.loginFailed"), { type: "error" });
        setIsGoogleLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      if (popupCheckRef.current) {
        clearInterval(popupCheckRef.current);
        popupCheckRef.current = null;
      }
    };
  }, [allowedOrigins, login, router, t, onSuccess, queryClient]);

  const handleGoogleLogin = () => {
    if (isGoogleLoading) return;

    try {
      setIsGoogleLoading(true);
      loginCompletedRef.current = false;

      const googleOAuthUrl = `${apiBase}/oauth/google`;

      const width = Math.min(500, window.innerWidth * 0.9);
      const height = Math.min(600, window.innerHeight * 0.9);
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        googleOAuthUrl,
        "Google Login",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup || popup.closed || typeof popup.closed === "undefined") {
        console.error("Popup was blocked!");
        notify(t("auth.popupBlocked") || "Please allow popups for this site", {
          type: "error",
        });
        setIsGoogleLoading(false);
        return;
      }

      popupRef.current = popup;

      popupCheckRef.current = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(popupCheckRef.current!);
            popupCheckRef.current = null;

            setTimeout(() => {
              if (!loginCompletedRef.current) {
                setIsGoogleLoading(false);
                notify(t("auth.popupClosed") || "Login was cancelled", { 
                  type: "info" 
                });
              }
            }, 1000);
          }
        } catch {
          console.log("Cannot check popup status (CORS restriction)");
        }
      }, 500);
    } catch (error) {
      console.error("Google login error:", error);
      notify(t("auth.googleLoginFailed"), { type: "error" });
      setIsGoogleLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      disabled={isGoogleLoading}
      className="w-fit bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800 hover:text-neutral-200 py-6 rounded-2xl mx-auto flex gap-5 pe-7 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FcGoogle />
      <span className="text-xs">
        {isGoogleLoading ? (
          <Translate text="auth.signingIn" />
        ) : (
          <Translate text="auth.google" />
        )}
      </span>
    </Button>
  );
};

export default LoginWithGoogle;