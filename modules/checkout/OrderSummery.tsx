"use client";
import Animate from "@/components/animation/Animate";
import { Separator } from "@/components/ui/separator";
import { useLang } from "@/hooks/useLang";
import { fadeD1 } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

function OrderSummery() {
  const { t, isRTL } = useLang();
  const [promoCode, setPromoCode] = useState("");
  return (
    <Animate
      variants={fadeD1}
      className=" flex justify-center lg:justify-end order-1 lg:order-2"
    >
      <div className="bg-white dark:bg-[#22252e]  rounded-4xl p-6 shadow-sm sticky top-8 w-88">
        {/* Premium Badge */}
        <div className="flex items-end justify-between">
          <div>
            <div className="inline-block bg-teal-50 text-teal-500 dark:bg-teal-900 text-xs font-semibold px-2 py-1 rounded-full ">
              %25 {t("checkout.off")}
            </div>
            <h3 className="text-2xl font-bold">{t("checkout.premium")}</h3>
          </div>
          <div className="text-right">
            <div className="text-sm text-foreground/50">
              {t("checkout.month")}
            </div>
            <div className="text-2xl font-bold">SR 5,999</div>
          </div>
        </div>

        <Separator className="my-6 bg-foreground/8" />

        {/* User Info */}
        <div className="space-y-4">
          <div>
            <div className="text-xs text-foreground/50 mb-1 font-semibold">
              {t("checkout.phoneNumber")}
            </div>
            <div className="text-sm font-medium">+966 0123 456 789</div>
          </div>
          <div>
            <div className="text-xs text-foreground/50 mb-1 font-semibold">
              {t("checkout.email")}
            </div>
            <div className="text-sm font-medium">
              ahmed_ibrahim703@hello.com
            </div>
          </div>
          <div>
            <div className="text-xs text-foreground/50 mb-1 font-semibold">
              {t("checkout.country")}
            </div>
            <div className="text-sm font-medium">Saudi Arabia</div>
          </div>
        </div>

        <Separator className="my-6 bg-foreground/8" />

        {/* Promo Code */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder={t("checkout.promoCode")}
              className="w-full pl-4 pr-12 py-3 border-2 border-neutral-200 dark:border-neutral-700 rounded-full transition-all cursor-pointer"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-custom-green hover:bg-custom-green/80 text-white rounded-full flex items-center justify-center transition-colors">
              <ArrowRight
                className={cn("w-4 h-4 text-white", isRTL ? "rotate-180" : "")}
              />
            </button>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 mb-6 pb-4 border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-[#353945] px-4 py-4 rounded-2xl">
          <div className="flex justify-between text-sm">
            <span className="text-foreground/50">
              {t("checkout.yachtRentPremium")}
            </span>
            <span className="font-medium">SR 5,999</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground/50">{t("checkout.vat")}</span>
            <span className="font-medium">SR 180</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground/50">
              {t("checkout.promoCode")}
            </span>
            <span className="font-medium text-cyan-500">-SR 1,200</span>
          </div>
          {/* Total */}
          <div className="flex justify-between items-center mt-3">
            <span className="text-md font-semibold">{t("checkout.total")}</span>
            <span className="text-lg font-semibold">SR 4,979</span>
          </div>
        </div>
      </div>
    </Animate>
  );
}

export default OrderSummery;
