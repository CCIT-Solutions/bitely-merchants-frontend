"use client";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Container from "@/components/shared/Container";
import MainBreadcrumb from "@/components/shared/MainBreadcrumb";
import { useLang } from "@/hooks/useLang";
import Animate from "@/components/animation/Animate";
import { fade, fadeDu1 } from "@/lib/animation";
import Link from "next/link";
import Ticket from "@/components/icons/Ticket";
import User from "@/components/icons/User";
import Security from "@/components/icons/Security";

import Translate from "@/components/shared/Translate";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/auth/LogoutButton";
import { AuthGuard } from "@/components/auth/AuthGaurd";
import { useGetUser } from "@/services/profile/query";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import { userAvatarFallback } from "@/constants";

export const menuItems = [
  {
    id: "my-info",
    labelKey: "settings.myInfo",
    icon: <User className="text-current" />,
    path: "/my-info",
  },
  {
    id: "change-password",
    labelKey: "settings.changePassword",
    icon: <Security className="text-current" />,
    path: "/change-password",
  },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t, lang } = useLang();

  const { isAuthenticated } = useUser();
  const { data } = useGetUser(lang, {
    enabled: isAuthenticated,
  });
  const user = data?.data;

  const userAvatar = user?.avatar && user?.avatar !== userAvatarFallback;

  const getCurrentPage = () => {
    if (pathname?.includes("/my-info")) return "my-info";
    if (pathname?.includes("/change-password")) return "change-password";
    return "my-tickets";
  };

  const currentPage = getCurrentPage();

  return (
    <AuthGuard requireAuth redirectTo="/">
      <div className=" pt-28">
        <Container>
          <div className="py-6">
            <MainBreadcrumb
              page={
                currentPage === "my-info"
                  ? t("settings.myInfo")
                  : currentPage === "change-password"
                  ? t("settings.changePassword")
                  : t("settings.myTickets")
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 pb-10 pt-3">
            {/* Sidebar */}
            <Animate variants={fade}>
              <div className="border border-neutral-800 rounded-2xl">
                {/* User Info */}

                <div className="flex items-center gap-3 border-b border-neutral-800 p-5">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-primary font-bold text-black text-xs">
                    {userAvatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name || "User avatar"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>
                        {(user?.name?.slice(0, 2) || "NA").toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div>
                    <div>{user?.name}</div>
                  </div>
                </div>

                {/* Menu Items */}
                <nav className="space-y-2 p-5">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;

                    return (
                      <Link
                        href={`${item.path}`}
                        key={item.id}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? "bg-neutral-950 text-white"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-950/50"
                        }`}
                      >
                        {Icon}
                        <span>
                          <Translate text={item.labelKey} />
                        </span>
                      </Link>
                    );
                  })}

                  {/* Logout */}
                  <LogoutButton />
                </nav>
              </div>
            </Animate>

            {/* Main Content */}
            <Animate variants={fadeDu1}>
              <div className="border border-neutral-800 rounded-2xl px-6 py-8">
                {children}
              </div>
            </Animate>
          </div>
        </Container>
      </div>
    </AuthGuard>
  );
}
