"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FoodItem } from "@/types/menu";
import { Language } from "@/types/shared";
import { FOOD_ITEMS } from "@/data/menu";
import FoodCard from "@/components/menu/FoodCard";
import { useLang } from "@/hooks/useLang";
import Container from "@/components/shared/Container";
import Currency from "@/components/icons/Currency";
import Heading from "@/components/shared/headings/Heading";
import OrderHeading from "@/components/shared/headings/OrderHeading";
import Stepper from "@/components/shared/Stepper";
import { Checkbox } from "@/components/ui/checkbox";
import { GoArrowRight } from "react-icons/go";
import { BiSolidCoupon } from "react-icons/bi";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const DIET_OPTIONS = [
  {
    id: "balanced",
    image: "balanced",
    priceBase: 8.5,
    descKey: "plans.balanced_desc",
  },
  {
    id: "custom-macros",
    image: "custom",
    priceBase: 9.2,
    descKey: "plans.customMacros_desc",
  },
  {
    id: "chef-picks",
    image: "chef",
    priceBase: 9.8,
    descKey: "plans.chefPicks_desc",
  },
  {
    id: "low-carb",
    image: "low-carb",
    priceBase: 8.9,
    descKey: "plans.lowCarb_desc",
  },
  {
    id: "high-protein",
    image: "protein",
    priceBase: 9.5,
    descKey: "plans.highProtein_desc",
  },
  {
    id: "vegetarian",
    image: "vegeterian",
    priceBase: 8.2,
    descKey: "plans.vegetarian_desc",
  },
];

const DIET_NAMES: Record<string, { en: string; ar: string }> = {
  balanced: { en: "Balanced", ar: "المتوازنة" },
  "custom-macros": { en: "Custom Macros", ar: "ماكروز مخصصة" },
  "chef-picks": { en: "Chef's Picks", ar: "اختيارات الشيف" },
  "low-carb": { en: "Low-Carb", ar: " لو كارب" },
  "high-protein": { en: "High Protein", ar: "عالية البروتين" },
  vegetarian: { en: "Vegetarian", ar: "النباتية" },
};

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const DAYS_AR = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت"
];

const FREQUENCY_OPTIONS = [
  { id: "weekly", multiplier: 1, saveAmount: null },
  { id: "monthly", multiplier: 4, saveAmount: 22 },
  { id: "quarterly", multiplier: 13, saveAmount: 125 },
];

// ─── FoodCard ──────────────────────────────────────────────────────────────────

const macroColors: Record<string, string> = {
  protein: "#22c55e",
  carbs: "#f59e0b",
  fat: "#3b82f6",
  calories: "#ef4444",
};

// ─── Bottom Drawer ──────────────────────────────────────────────────────────────

const MenuDialog = ({
  open,
  onClose,
  dietId,
  lang,
  t,
}: {
  open: boolean;
  onClose: () => void;
  dietId: string | null;
  lang: Language;
  t: (k: string) => string;
}) => {
  const items = FOOD_ITEMS.filter((f) => f.dietType === dietId);
  const dietName = dietId ? DIET_NAMES[dietId]?.[lang] : "";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="w-[90vw] md:min-w-3xl lg:min-w-210 max-h-[80vh] overflow-y-auto rounded-3xl p-0"
        onInteractOutside={onClose}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-4 pb-2">
          <DialogTitle className="text-xl font-bold text-foreground/90">
            {dietName}
          </DialogTitle>
          <DialogDescription className="text-sm text-foreground/50">
            {t("plans.menuTitle")}
          </DialogDescription>
        </DialogHeader>

        {/* Macro ratios for specific diets */}
        {dietId === "balanced" && (
          <div className="px-6 pb-4">
            <div className="flex gap-2 items-center">
              <div
                className="h-2 rounded-l-full"
                style={{ flex: 30, backgroundColor: macroColors.protein }}
              />
              <div
                className="h-2"
                style={{ flex: 47, backgroundColor: macroColors.carbs }}
              />
              <div
                className="h-2 rounded-r-full"
                style={{ flex: 25, backgroundColor: macroColors.fat }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-foreground/50">
              <span>20-35% Protein</span>
              <span>40-55% Carbs</span>
              <span>20-30% Fat</span>
            </div>
          </div>
        )}

        {/* Food grid */}
        <div className="px-6 pb-8">
          {items.length === 0 ? (
            <p className="text-foreground/40 text-center py-8">
              No items available
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-115 overflow-y-auto" onWheel={e => e.stopPropagation()}>
              {items.map((item) => (
                <FoodCard key={item.id} item={item} className="mx-auto" />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
// ─── Summary Panel ────────────────────────────────────────────────────────────
const SummaryPanel = ({
  selectedDiet,
  selectedMeals,
  selectedDays,
  selectedFreq,
  lang,
  t,
}: {
  selectedDiet: string;
  selectedMeals: string[];
  selectedDays: number[];
  selectedFreq: string;
  lang: Language;
  t: (k: string) => string;
}) => {
  const isRTL = lang === "ar";
  const dietData = DIET_OPTIONS.find((d) => d.id === selectedDiet);
  const basePrice = dietData?.priceBase || 8.5;
  const freqData = FREQUENCY_OPTIONS.find((f) => f.id === selectedFreq);
  const daysPerWeek = selectedDays.length || 5;
  const weekPrice = basePrice * selectedMeals.length * daysPerWeek;
  const total = weekPrice * (freqData?.multiplier || 1);
  const totalWithVAT = total * 1.1;
  const vat = total * 0.14;

  const descParts = [
    DIET_NAMES[selectedDiet]?.[lang] || selectedDiet,
    `${selectedMeals.length} ${t("plans.meals")}`,
    `${daysPerWeek} ${t("plans.days")}`,
  ].join(", ");

  const freqLabel = t(`plans.${selectedFreq}`);

  return (
    <div className={`rounded-3xl p-6 flex flex-col gap-5 border bg-primary/2`}>
      {/* Header */}
      <div className={`flex items-start justify-between gap-4`}>
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold text-foreground/90">
            {t("plans.yourPackage")}
          </h3>
          <p className="text text-foreground/50 leading-relaxed">{descParts}</p>
        </div>
        <div className="size-20 shrink-0 relative">
          <Image
            src="/media/images/plans/bag.png"
            alt="Bitely bag"
            fill
            className=" object-contain"
          />
        </div>
      </div>

      {/* Promo badge */}
      <div
        className={`flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3`}
      >
        <BiSolidCoupon className="size-5 text-red-400" />
        <input
          type="text"
          placeholder={t("plans.enterPromoCode")}
          className="bg-transparent text-sm outline-none flex-1 placeholder:text-foreground/50"
        />
        <button className="text-sm font-semibold text-primary-foreground/80 hover:text-primary-foreground cursor-pointer">
          {t("plans.apply")}
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-foreground/5" />

      {/* Payment summary */}
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-bold text-foreground/90 mb-2">
          {t("plans.paymentSummary")}
        </h4>
        {[
          {
            label: t("plans.planPrice"),
            value: (
              <div className="flex items-center gap-1">
                {total.toFixed(2)} <Currency />
              </div>
            ),
            highlight: false,
          },
          {
            label: t("plans.delivery"),
            value: t("plans.free"),
            highlight: true,
          },
          {
            label: t("plans.vat"),
            value: (
              <div className="flex items-center gap-1">
                {vat.toFixed(2)} <Currency />
              </div>
            ),
            highlight: false,
          },
        ].map((row) => (
          <div
            key={row.label}
            className={`flex items-center justify-between py-1.5 `}
          >
            <span className="text-sm text-foreground/50">{row.label}</span>
            <span
              className={`text-sm font-semibold ${
                row.highlight ? "text-primary" : "text-foreground/90"
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
        <div
          className={`flex items-center justify-between py-2 border-t border-foreground/5 mt-1 `}
        >
          <span className="text-sm font-bold text-foreground/90">
            {t("plans.total")}
          </span>
          <div
            className={`flex flex-col items-end`}
          >
            <span className="text-base font-bold text-foreground/90 flex items-center gap-1">
              {totalWithVAT.toFixed(2)} <Currency />
            </span>
            <span className="text-xs text-foreground/40">{freqLabel}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        className={`w-full h-14 rounded-2xl bg-primary border-primary hover:bg-primary/80 active:bg-primary-foreground text-white font-bold text-base transition-colors duration-200 shadow-lg hover:border-primary/20 flex justify-center items-center cursor-pointer ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {t("plans.continue")}
      </button>
    </div>
  );
};

const BottomBar = ({
  total,
  freq,
  lang,
  t,
}: {
  total: number;
  freq: string;
  lang: Language;
  t: (k: string) => string;
}) => (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-xs border-t border-foreground/2 px-5 py-4 flex items-center justify-between gap-4 shadow-xl">
    <div className="flex flex-col">
      <span className="text-base font-bold text-foreground/90 flex items-center gap-1">
        {total.toFixed(2)} <Currency /> 
      </span>
      <span className="text-xs text-foreground/40">{t(`plans.${freq}`)}</span>
    </div>
    <button className="h-12 px-8 rounded-2xl bg-primary border-primary hover:bg-primary/80 text-primary-foreground font-bold text-sm transition-colors">
      {t("plans.continue")}
    </button>
  </div>
);

export default function PlansPage() {
  const { lang, t, isRTL } = useLang();

  const [selectedDiet, setSelectedDiet] = useState("balanced");
  const [selectedMeals, setSelectedMeals] = useState([
    "breakfast",
    "lunch",
    "dinner",
  ]);
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4]);
  const [selectedFreq, setSelectedFreq] = useState("quarterly");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalDiet, setModalDiet] = useState<string | null>(null);

  const days = isRTL ? DAYS_AR : DAYS;

  const toggleMeal = (meal: string) => {
    if (meal === "snack") return;
    setSelectedMeals((prev) =>
      prev.includes(meal)
        ? prev.length > 1
          ? prev.filter((m) => m !== meal)
          : prev
        : [...prev, meal],
    );
  };

  const toggleDay = (idx: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(idx)) {
        // Prevent deselecting if it would leave fewer than 5 days
        if (prev.length <= 5) return prev;
        return prev.filter((d) => d !== idx);
      } else {
        return [...prev, idx];
      }
    });
  };

  const openMenuDialog = (dietId: string) => {
    setModalDiet(dietId);
    setDialogOpen(true);
  };

  const dietData = DIET_OPTIONS.find((d) => d.id === selectedDiet);
  const basePrice = dietData?.priceBase || 8.5;
  const freqData = FREQUENCY_OPTIONS.find((f) => f.id === selectedFreq);
  const weekPrice = basePrice * selectedMeals.length * selectedDays.length;
  const total = weekPrice * (freqData?.multiplier || 1) * 1.1;

  return (
    <div className="min-h-screen pt-30 pb-20 lg:py-40">
      <Container>
        {/* Page header */}
        <div className="space-y-4 mb-4">
          <OrderHeading
            label={`${t("plans.plan")} `}
            title={t("plans.heading")}
            subheading={t("plans.subheading")}
          />
          <Stepper currentIndex={0} />
        </div>
        <div className="mb-8 lg:mb-10">
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-foreground/50">
              {t("plans.startingFrom")}
            </span>
            <span className="text-sm font-bold text-primary-foreground border border-primary/50 rounded-full px-3 py-1 flex items-center gap-1">
              4.18 <Currency />
              {t("plans.perDay")}
            </span>
          </div>
        </div>

        {/* Grid layout */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-10">
          {/* Left column */}
          <div className="max-w-2xl flex flex-col gap-10">
            {/* Diet Picker */}
            <section aria-label={t("plans.dietQuestion")}>
              <Heading
                className="sm:text-3xl text-start font-medium"
                title="plans.dietQuestion"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {DIET_OPTIONS.map((diet) => {
                  const isSelected = selectedDiet === diet.id;
                  return (
                    <div
                      key={diet.id}
                      onClick={() => setSelectedDiet(diet.id)}
                      className={`relative cursor-pointer rounded-3xl border-2 p-5 flex flex-col gap-3 transition-all duration-200 select-none
                        ${
                          isSelected
                            ? "border-primary bg-primary/5 hover:bg-primary/10 text-primary-foreground"
                            : "border-foreground/5 bg-primary/2 hover:border-foreground/5 hover:bg-primary/5"
                        }`}
                    >
                      <div className="flex justify-between gap-2">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-sm font-bold text-foreground/90">
                            {DIET_NAMES[diet.id]?.[lang]}
                          </h3>
                          <p className="text-xs text-foreground/50 leading-relaxed line-clamp-2">
                            {t(diet.descKey)}
                          </p>
                        </div>
                        <div className="flex items-start justify-between">
                          <div className="size-15 relative">
                            <Image
                              src={`/media/images/plans/${diet.image}.png`}
                              alt={`${diet.id}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openMenuDialog(diet.id);
                        }}
                        className="flex items-center gap-1 mt-1 w-fit group cursor-pointer"
                      >
                        <span className="text-xs font-semibold text-primary-foreground/90">
                          {t("plans.viewMenu")}
                        </span>
                        <GoArrowRight className={cn(" transition-transform size-4", isRTL? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Meals Picker */}
            <section aria-label={t("plans.mealsQuestion")}>
              <Heading
                className="sm:text-2xl text-start font-medium"
                title={"plans.mealsQuestion"}
              />
              <div className="grid grid-cols-2 gap-3 mt-4">
                {(["breakfast", "lunch", "dinner", "snack"] as const).map(
                  (meal) => {
                    const isSnack = meal === "snack";
                    const isSelected = selectedMeals.includes(meal) || isSnack;

                    return (
                      <Tooltip key={meal}>
                        <TooltipTrigger asChild>
                          <div
                            onClick={() => toggleMeal(meal)}
                            className={`rounded-2xl border-2 px-4 py-4 flex items-center justify-between transition-all duration-200 select-none
                            ${
                              isSelected
                                ? isSnack
                                  ? "border-foreground/5 bg-foreground/1 cursor-not-allowed opacity-90"
                                  : "border-primary bg-primary/5 hover:bg-primary/10 cursor-pointer"
                                : "border-foreground/5 hover:border-foreground/10 cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="size-15 relative">
                                <Image
                                  src={`/media/images/plans/${meal}.png`}
                                  alt={`${meal}`}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-800">
                                {t(`plans.${meal}`)}
                              </span>
                            </div>
                            <Checkbox
                              checked={isSelected}
                              disabled={isSnack}
                              className={`
                                pointer-events-none
                                size-5
                                rounded
                                data-[state=checked]:bg-primary-foreground
                                data-[state=checked]:text-white
                                data-[state=checked]:border-primary-foreground
                                border-foreground/10
                                ${isSnack ? "opacity-60" : ""}
                              `}
                            />
                          </div>
                        </TooltipTrigger>
                        {isSnack && (
                          <TooltipContent>
                            <p>{t("plans.snackIncluded")}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  },
                )}
              </div>
            </section>

            {/* Day Picker */}
            <section aria-label={t("plans.daysQuestion")}>
              <Heading
                className="sm:text-2xl text-start font-medium"
                title={"plans.daysQuestion"}
              />
              <div className="flex gap-2 flex-wrap mt-4">
                {days.map((day, idx) => {
                  const isSelected = selectedDays.includes(idx);
                  const isMinimumSelected = selectedDays.length <= 5;

                  return (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => toggleDay(idx)}
                          disabled={isSelected && isMinimumSelected}
                          className={cn(`w-10 h-10 sm:w-12 sm:h-12 rounded-full  font-medium transition-all duration-200 select-none`,  isSelected
                              ? "bg-primary text-white border border-primary-foreground/5 shadow-md shadow-prborder-primary/30"
                              : "bg-foreground/2 border border-foreground/5 text-foreground/50 hover:bg-foborder-foreground/5 cursor-pointer", isRTL ? "text-[10px]" : "text-sm")
                    }
                        >
                          {day}
                        </button>
                      </TooltipTrigger>
                      {isSelected && isMinimumSelected && (
                        <TooltipContent>
                          <p>{t("plans.minimumDays")}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 rounded-full bg-foreground/2 border border-foreground/5 flex-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${(selectedDays.length / 7) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground/50">
                  {selectedDays.length}/7
                </span>
              </div>
            </section>

            {/* Frequency */}
            <section aria-label={t("plans.paymentCycle")}>
              <Heading
                className="sm:text-2xl text-start font-medium"
                title={"plans.paymentCycle"}
              />
              <div className="flex flex-col gap-3 mt-4">
                {FREQUENCY_OPTIONS.map((freq) => {
                  const isSelected = selectedFreq === freq.id;
                  const daysCount = selectedDays.length || 5;
                  const mealsCount = selectedMeals.length;
                  const baseP = dietData?.priceBase || 8.5;
                  const wPrice = baseP * mealsCount * daysCount;
                  const tPrice = wPrice * freq.multiplier;
                  const dayPrice = (
                    tPrice /
                    (freq.multiplier * daysCount)
                  ).toFixed(2);

                  return (
                    <div
                      key={freq.id}
                      onClick={() => setSelectedFreq(freq.id)}
                      className={`cursor-pointer rounded-2xl border-2 px-5 py-4 flex items-center justify-between transition-all duration-200 select-none
                        ${isSelected ? "border-primary bg-primary/5" : "border-foreground/2 bg-white hover:border-foreground/5"}`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground/90">
                            {t(`plans.${freq.id}`)}
                          </span>
                          {freq.saveAmount && (
                            <span className="text-xs font-bold text-white bg-prborder-primary rounded-full px-2 py-0.5 flex gap-1 items-center">
                              {t("plans.save")} {freq.saveAmount} <Currency />
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-foreground/50 flex gap-1 items-center">
                          {tPrice.toFixed(0)} <Currency />
                          {t(
                            `plans.${freq.id === "quarterly" ? "quarterly_label" : freq.id === "monthly" ? "perMonth" : "perWeek"}`,
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`text-right flex items-center gap-1`}>
                          <div className="text-base font-black text-foreground/90 flex gap-1 items-center">
                            {dayPrice} <Currency />
                          </div>
                          <div className="text-xs text-foreground/40">
                            {t("plans.perDay")}
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-primary" : "border-gray-300"}`}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-prborder-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right column: Summary */}
          <div className="max-w-2xl lg:max-w-sm">
            <div className="sticky top-24">
              <SummaryPanel
                selectedDiet={selectedDiet}
                selectedMeals={selectedMeals}
                selectedDays={selectedDays}
                selectedFreq={selectedFreq}
                lang={lang}
                t={t}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile bottom bar */}
      <BottomBar total={total} freq={selectedFreq} lang={lang} t={t} />

      {/* Menu Drawer */}
      <MenuDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        dietId={modalDiet}
        lang={lang}
        t={t}
      />
    </div>
  );
}
