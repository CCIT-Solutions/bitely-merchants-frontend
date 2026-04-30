"use client";

import { useRouter } from "next/navigation";
import { useLang } from "@/hooks/useLang";
import Logout from "@/components/icons/Logout";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { apiRequest } from "@/lib/api/api";
import AuthApiEndpoints from "@/services/auth/api";

interface LogoutButtonProps {
  className?: string;
  IconClassName?: string;
}

export default function LogoutButton({ className, IconClassName }: LogoutButtonProps) {
  const router = useRouter();
  const { t, isRTL } = useLang();
  const { logout } = useUser();

  const handleLogout = async () => {
    await apiRequest(AuthApiEndpoints.logout({}), {
      showErrorToast: true,
      onSuccess: () => {
        logout();
        router.push("/");
      },
    });
  };

  return (
    <button
      onClick={handleLogout}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-500 hover:bg-neutral-950/50 transition-all cursor-pointer",
        className
      )}
    >
      <Logout className={cn("w-5 h-5", isRTL ? "rotate-180" : "", IconClassName)} />
      <span className="font-medium">{t("settings.logout")}</span>
    </button>
  );
}
