import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { IoArrowForwardSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SidebarCTA() {
  const { isRTL, t } = useLang();

  return (
    <div className="mt-6 rounded-3xl bg-primary/10 p-5 overflow-hidden relative pb-48">
      <p className="text-[32px] font-bold text-foreground/90 leading-8">
        {t("account.oneBiteAtATime")}
        <br />
        {t("account.startingMonday")}
      </p>

      <p className="text-xs text-foreground/60 mt-4 leading-relaxed">
        {t("account.takeTheGuessworkOut")}
      </p>

      <Link
        href={"/plans"}
        className="mt-4 text-xs bg-foreground/90 text-background px-4 py-2 rounded-2xl font-medium flex items-center gap-1 hover:bg-foreground transition-colors group w-fit"
      >
        {t("account.explorePlans")}
        <IoArrowForwardSharp
          className={cn(
            "transition-transform",
            isRTL
              ? "group-hover:-translate-x-1 rotate-180"
              : "group-hover:translate-x-1",
          )}
        />
      </Link>

      <motion.div
        animate={{
          rotate: [0, -10, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute bottom-40 inset-e-4"
      >
        <Image
          src="/media/images/hero/float-4.png"
          alt={t("account.healthyMealsAlt")}
          width={40}
          height={37}
          className="mt-10 ms-20"
        />
      </motion.div>

      <div className="size-[105%] h-40 mt-10 absolute bottom-0 inset-s-0">
        <Image
          src="/media/images/hero/float-2.png"
          alt={t("account.sidebarDishAlt")}
          fill
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}