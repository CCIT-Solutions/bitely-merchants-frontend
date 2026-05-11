"use client";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    id: "my-profile",
    label: "My Profile",
    path: "/settings/my-profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
  {
    id: "my-plan",
    label: "My Plan",
    path: "/settings/my-plan",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    id: "my-meals",
    label: "My Meals",
    path: "/settings/my-meals",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.7 1.3 3 3 3s3-1.3 3-3V2"/><line x1="6" y1="2" x2="6" y2="5"/><path d="M15 2a5 5 0 0 1 5 5v13H15V2z"/>
      </svg>
    ),
  },
  {
    id: "my-orders",
    label: "My Orders",
    path: "/settings/my-orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    id: "favorites",
    label: "Favorites",
    path: "/settings/favorites",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    id: "my-progress",
    label: "My Progress",
    path: "/settings/my-progress",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    id: "health-data",
    label: "Health Data",
    path: "/settings/health-data",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings/account",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
  },
  {
    id: "payment",
    label: "Payment & Billing",
    path: "/settings/payment",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    id: "notifications",
    label: "Notifications",
    path: "/settings/notifications",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    id: "invite",
    label: "Invite Friends",
    path: "/settings/invite",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
      </svg>
    ),
  },
];

const fade = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.08 } },
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const getActiveId = () => {
    if (pathname?.includes("/my-profile")) return "my-profile";
    if (pathname?.includes("/my-plan")) return "my-plan";
    if (pathname?.includes("/my-meals")) return "my-meals";
    if (pathname?.includes("/my-orders")) return "my-orders";
    if (pathname?.includes("/favorites")) return "favorites";
    if (pathname?.includes("/my-progress")) return "my-progress";
    if (pathname?.includes("/health-data")) return "health-data";
    if (pathname?.includes("/account")) return "settings";
    if (pathname?.includes("/payment")) return "payment";
    if (pathname?.includes("/notifications")) return "notifications";
    if (pathname?.includes("/invite")) return "invite";
    return "my-profile";
  };

  const activeId = getActiveId();

  return (
    <div className="min-h-screen  font-sans">
    

      <div className="pt-14 flex min-h-screen max-w-[1200px] mx-auto px-6 pt-20">
        {/* Sidebar */}
        {/* <motion.aside
          variants={fade}
          initial="hidden"
          animate="visible"
          className="w-56 shrink-0 py-8 pr-4"
        >
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = activeId === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
                    isActive
                      ? "bg-white text-neutral-900 font-medium shadow-sm"
                      : "text-neutral-500 hover:text-neutral-800 hover:bg-white/70"
                  )}
                >
                  <span className={cn(isActive ? "text-[#22C55E]" : "text-current")}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 rounded-2xl bg-white p-4 overflow-hidden relative">
            <p className="text-base font-bold text-neutral-900 leading-snug">One<span className="text-[#22C55E]">bite</span> at a time. Starting Monday.</p>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">Take the guesswork out of eating healthy. Let Bitely handle the planning, you enjoy the results.</p>
            <button className="mt-3 text-xs bg-neutral-900 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 hover:bg-neutral-700 transition-colors">
              Explore Plans <span>→</span>
            </button>
            <div className="mt-3 h-24 rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-3xl">🥗</div>
          </div>
        </motion.aside> */}

        {/* Main */}
        {/* <motion.main
          variants={fadeRight}
          initial="hidden"
          animate="visible"
          className="flex-1 py-8 pl-4 min-w-0"
        >
          {children}
        </motion.main> */}
      </div>
    </div>
  );
}