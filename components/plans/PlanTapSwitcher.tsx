"use client";

import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import React, { Dispatch, SetStateAction } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { Badge } from "../ui/badge";

export default function PlanTapSwitcher({
  billing,
  setBilling,
  className,
  // size = "lg",
}: {
  billing: "weekly" | "monthly";
  setBilling: Dispatch<SetStateAction<"weekly" | "monthly">>;
  className?: string;
  // size?: "sm" | "md" | "lg";
}) {
  const { t } = useLang();

  const tabs = [
    { key: "weekly", label: t("plans.toggle.weekly") },
    { key: "monthly", label: t("plans.toggle.monthly") },
  ];

  return (
    <div className={cn("flex justify-center mb-3", className)}>
      <LayoutGroup>
        <div className="relative border border-primary/40 rounded-full p-1 inline-flex">
          {tabs.map((tab) => {
            const isActive = billing === tab.key;
            const isMonthly = tab.key === "monthly";

     

            return (
              <button
                key={tab.key}
                onClick={() => setBilling(tab.key as "weekly" | "monthly")}
                className={cn(
                  "relative rounded-full font-bold transition-colors duration-300 z-10 cursor-pointer px-6 py-2 text-base",
                  isActive
                    ? "bg-primary-foreground text-white"
                    : "text-foreground/50 hover:text-foreground/80",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full  "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      opacity: { duration: 0.25 },
                      layout: {
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      },
                    }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                {isMonthly && (
                  <Badge
                    className={cn(
                      " text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border-0 ms-2 border-primary bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground"
                    )}
                  >
                    {t("plans.toggle.save")}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
