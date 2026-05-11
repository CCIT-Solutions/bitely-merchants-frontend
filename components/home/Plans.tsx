"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLang } from "@/hooks/useLang";
import { plans, type Plan } from "@/data/plans";
import PlanTapSwitcher from "../plans/PlanTapSwitcher";
import Heading from "../shared/headings/Heading";
import { Language } from "@/types/shared";
import Animate from "../animation/Animate";
import { fadeDu4 } from "@/lib/animation";
import Link from "next/link";

interface PlanCardProps {
  plan: Plan;
  billing: "weekly" | "monthly";
  lang: Language;
  unitLabel: string;
}

function PlanCard({ plan, billing, lang, unitLabel }: PlanCardProps) {
  const price = billing === "weekly" ? plan.price_weekly : plan.price_monthly;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-7 transition-all duration-300 hover:scale-105 hover:z-2",
        "bg-background/50 backdrop-blur-xs",
        plan.featured
          ? "border-primary-foreground shadow-xl scale-[1.03] z-1"
          : "border-primary/20 shadow-sm hover:shadow-md hover:border-primary/50",
      )}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary-foreground text-white text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full">
            {plan.badge[lang]}
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/40 mb-1">
          {plan.tagline[lang]}
        </p>
        <h3
          className={cn(
            "text-2xl font-bold tracking-tight",
            plan.featured
              ? "text-primbg-primary-foreground"
              : "text-foreground/80",
          )}
        >
          {plan.name[lang]}
        </h3>
      </div>

      {/* Price */}
      <div className="mb-7 flex items-end gap-1">
        <span className="text-[3.25rem] font-extrabold leading-none tracking-tight text-primbg-primary-foreground">
          ${price}
        </span>
        <span className="mb-2 text-foreground/40 text-sm font-medium">
          / {unitLabel}
        </span>
      </div>

      {/* Divider */}
      <div className="mb-6 h-px bg-foreground/5" />

      {/* Features */}
      <ul className="flex-1 space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <CheckCircle2
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                plan.featured ? "text-primary" : "text-foreground/40",
              )}
              strokeWidth={2.2}
            />
            <span className="text-sm text-foreground/80 leading-snug">
              {feature[lang]}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/checkout/meal-plan"
        className={cn(
          "w-full rounded-xl font-semibold tracking-wide text-sm h-12 transition-all duration-200 flex justify-center items-center",
          plan.featured
            ? "bg-primary-foreground text-white hover:bg-primary-foreground/90 shadow-md"
            : "bg-foreground/2 text-primbg-primary-foreground hover:bg-foreground/5 border border-fobg-foreground/5",
        )}
      >
        {plan.cta[lang]}
      </Link>
    </div>
  );
}

// ─── Main Plan Section ─────────────────────────────────────────────────────
export default function Plan() {
  const { t, lang } = useLang();
  const [billing, setBilling] = useState<"weekly" | "monthly">("weekly");

  const unitLabel =
    billing === "weekly" ? t("plans.unit.weekly") : t("plans.unit.monthly");

  return (
    <section className="min-h-screen px-4 pt-20">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}

        <div className="mb-14 text-center">
          <Heading
            title={"plans.title"}
          />
          <p className="mx-auto max-w-lg text-foreground/60 text-base leading-relaxed">
            {t("plans.subtitle")}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mb-16 md:mb-26">
          <PlanTapSwitcher billing={billing} setBilling={setBilling} />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start relative">
          <h1 className="absolute inset-0 w-full text-center text-[8rem] md:text-[15rem] font-bold text-primary leading-2.5 ">
            Plan
          </h1>

          {plans.map((plan, i) => (
            <Animate
              key={i}
              transition={{
                duration: 0.6,
                delay: 0.6 + i * 0.1,
                ease: "easeInOut",
              }}
              variants={fadeDu4}
            >
              <PlanCard
                plan={plan}
                billing={billing}
                lang={lang}
                unitLabel={unitLabel}
              />
            </Animate>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-foreground/60 tracking-wide">
          {t("plans.footer")}
        </p>
      </div>
    </section>
  );
}
