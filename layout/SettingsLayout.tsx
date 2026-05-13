"use client";

import React, { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Animate from "@/components/animation/Animate";
import { fade, fadeD2 } from "@/lib/animation";
import Container from "@/components/shared/Container";
import { useLang } from "@/hooks/useLang";
import { IoArrowForwardSharp, IoPulseOutline } from "react-icons/io5";
import { HiOutlineMenuAlt2, HiX } from "react-icons/hi";
import Image from "next/image";
import User from "@/components/icons/User";
import { GiHotMeal } from "react-icons/gi";
import { BsCreditCardFill } from "react-icons/bs";
import { GoHeart } from "react-icons/go";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { GiShoppingBag } from "react-icons/gi";
import SidebarCTA from "@/components/account/SidebarCTA";

const menuItems = [
  {
    id: "my-profile",
    label: "account.myProfile",
    path: "/account/my-profile",
    icon: <User />,
  },
  {
    id: "my-plan",
    label: "account.myPlan",
    path: "/account/my-plan",
    icon: <GiShoppingBag />,
  },
  {
    id: "my-meals",
    label: "account.myMeals",
    path: "/account/my-meals",
    icon: <GiHotMeal />,
  },
  {
    id: "my-orders",
    label: "account.myOrders",
    path: "/account/my-orders",
    icon: <HiOutlineShoppingBag />,
  },
  {
    id: "favorites",
    label: "account.favorites",
    path: "/account/favorites",
    icon: <GoHeart />,
  },
  {
    id: "my-progress",
    label: "account.myProgress",
    path: "/account/my-progress",
    icon: <IoPulseOutline />,
  },
  {
    id: "payment",
    label: "account.paymentAndBilling",
    path: "/account/payment",
    icon: <BsCreditCardFill />,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { t, isRTL } = useLang();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getActiveId = () => {
    if (pathname?.includes("/my-profile")) return "my-profile";
    if (pathname?.includes("/my-plan")) return "my-plan";
    if (pathname?.includes("/my-meals")) return "my-meals";
    if (pathname?.includes("/my-orders")) return "my-orders";
    if (pathname?.includes("/favorites")) return "favorites";
    if (pathname?.includes("/my-progress")) return "my-progress";
    if (pathname?.includes("/payment")) return "payment";

    return "my-profile";
  };

  const activeId = getActiveId();
  const activeItem = menuItems.find((item) => item.id === activeId);

  return (
    <div className="min-h-screen bg-background">
      <Container className="flex flex-col lg:flex-row min-h-screen px-4 sm:px-6 pt-22 lg:pt-25 gap-4 lg:gap-6">
        {/* Mobile Topbar */}
        <div className="lg:hidden sticky top-22 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-full rounded-2xl border border-foreground/10 bg-background/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="text-primary">{activeItem?.icon}</div>
              <div className="text-start">
                <p className="text-xs text-foreground/50">
                  {t("account.accountSection")}
                </p>
                <p className="text-sm font-semibold">
                  {t(activeItem ? activeItem?.label : "")}
                </p>
              </div>
            </div>
            <HiOutlineMenuAlt2 className="text-xl text-foreground/70" />
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.aside
                initial={{
                  x: isRTL ? "100%" : "-100%",
                }}
                animate={{ x: 0 }}
                exit={{
                  x: isRTL ? "100%" : "-100%",
                }}
                transition={{ type: "spring", damping: 24 }}
                className={cn(
                  "fixed top-0 bottom-0 z-50 w-[85%] max-w-xs bg-background border-e border-foreground/10 p-4 overflow-y-auto lg:hidden pb-4",
                  isRTL ? "right-0" : "left-0",
                )}
                onWheel={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-lg font-bold">{t("account.myAccount")}</p>
                    <p className="text-xs text-foreground/50">
                      {t("account.manageProfileAndPlans")}
                    </p>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="size-10 rounded-xl border border-foreground/10 flex items-center justify-center"
                  >
                    <HiX className="text-xl" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <Link
                        key={item.id}
                        href={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-200",
                          isActive
                            ? "bg-primary/5 text-primary-foreground border border-primary/50"
                            : "hover:bg-foreground/3 text-foreground/70",
                        )}
                      >
                        {item.icon}
                        <span className="font-medium">{t(item.label)}</span>
                      </Link>
                    );
                  })}
                </nav>
                <SidebarCTA />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <Animate
          variants={fade}
          element="aside"
          className="hidden lg:block w-64 h-fit shrink-0 p-2 border border-foreground/5 rounded-3xl bg-background/70 backdrop-blur-xl sticky top-24 mb-6"
        >
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = activeId === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary/5 text-primary-foreground border border-primary/50"
                      : "text-foreground/60 hover:text-foreground hover:bg-foreground/3",
                  )}
                >
                  {item.icon}
                  <span className="font-medium">{t(item.label)}</span>
                </Link>
              );
            })}
          </nav>
          <SidebarCTA />
        </Animate>

        {/* Main Content */}
        <Animate variants={fadeD2} className="flex-1 pb-8 min-w-0 lg:pl-2">
          <div className="rounded-3xl">{children}</div>
        </Animate>
      </Container>
    </div>
  );
}