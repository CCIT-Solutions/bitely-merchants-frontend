"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { FaCheck } from "react-icons/fa6";

import { Button } from "@/components/custom/button";
import { FOOD_ITEMS } from "@/data/menu";
import { FoodItem } from "@/types/menu";
import Image from "next/image";
import FoodCard from "@/components/menu/FoodCard";
import { Language } from "@/types/shared";
import { useLang } from "@/hooks/useLang";
import OrderHeading from "@/components/shared/headings/OrderHeading";
import Stepper from "@/components/shared/Stepper";
import RecipeDetails from "@/components/meal-planner/RecipeDetails";

type SlotKey = "breakfast" | "lunch" | "dinner";
type ViewMode = "week" | "day" | "list";

// ─── Data ─────────────────────────────────────────────────────────────────────
const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DATES = [20, 21, 22, 23, 24, 25, 26];
const SLOTS: { key: SlotKey; label: string; time: string }[] = [
  { key: "breakfast", label: "breakfast", time: "7–9 AM" },
  { key: "lunch", label: "lunch", time: "12–2 PM" },
  { key: "dinner", label: "dinner", time: "6–8 PM" },
];

function mapFoodToMeal(food: FoodItem): FoodItem {
  return {
    id: food.id,
    name: { en: food.name.en, ar: food.name.ar },
    description: { en: food.description.en, ar: food.description.ar },
    tag: "Meal",
    protein: food.protein ?? 0,
    carbs: food.carbs ?? 0,
    fat: food.fat ?? 0,
    calories: food.calories ?? 0,
    image: food.image,
  };
}

const breakfastMeals = FOOD_ITEMS.filter(
  (f) =>
    f.name.en.toLowerCase().includes("salad") ||
    f.name.en.toLowerCase().includes("light"),
);

const lunchMeals = FOOD_ITEMS.slice(0, 7);
const dinnerMeals = FOOD_ITEMS.slice(7, 14);

function padTo7<T>(arr: T[]): (T | null)[] {
  return [...arr, ...Array(Math.max(0, 7 - arr.length)).fill(null)].slice(0, 7);
}

const INITIAL_WEEK_MEALS: Record<SlotKey, (FoodItem | null)[]> = {
  breakfast: padTo7(breakfastMeals.map(mapFoodToMeal)),
  lunch: padTo7(lunchMeals.map(mapFoodToMeal)),
  dinner: padTo7(dinnerMeals.map(mapFoodToMeal)),
};

function getSwapOptions(
  currentMeal: FoodItem | null,
  slot: SlotKey,
  filter: string,
): FoodItem[] {
  let options = FOOD_ITEMS.map(mapFoodToMeal).filter(
    (m) => m.id !== currentMeal?.id,
  );

  switch (filter) {
    case "high protein":
      options = options.filter((m) => m?.protein && m.protein >= 40);
      break;
    case "< 500 kcal":
      options = options.filter((m) => m.calories && m.calories <= 500);
      break;
    case "plant-based":
      options = options.filter(
        (m) => FOOD_ITEMS.find((f) => f.id === m.id)?.dietType === "vegetarian",
      );
      break;
  }

  return options;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function MealChip({
  meal,
  selected,
  onClick,
  lang,
  addLabel,
}: {
  meal: FoodItem | null;
  selected?: boolean;
  onClick?: () => void;
  lang: Language;
  addLabel: string;
}) {
  if (!meal) {
    return (
      <button
        onClick={onClick}
        className="w-full h-full min-h-20 rounded-xl border border-dashed border-foreground/10 hover:border-foreground/25 flex items-center justify-center text-foreground/25 text-xs tracking-widest uppercase transition-all duration-200 hover:bg-foborder-foreground/[0.02] group"
      >
        <span className="group-hover:text-foreground/60 transition-colors">
          {addLabel}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-start rounded-xl border transition-all duration-200 group relative overflow-hidden h-full flex flex-col cursor-pointer",
        selected
          ? "border-primary-foreground/40 bg-primary/10 shadow-[0_0_20px_rgba(163,230,53,0.08)]"
          : "bg-fo border-foreground/5 hover:bg-foborder-foreground/[0.06] hover:border-foreground/15",
      )}
    >
      <div className="w-full h-14 overflow-hidden relative">
        <Image
          src={meal.image}
          alt={meal.name[lang]}
          fill
          className="object-cover"
        />
        {selected && (
          <div className="shrink-0 size-5 rounded-full text-primary bg-primary-foreground/60 flex items-center justify-center mt-0.5 absolute z-1 top-2 inset-e-2">
            <FaCheck className="size-3.5" />
          </div>
        )}
      </div>
      <div className="flex items-start gap-2.5 p-3 grow">
        <div className="h-full min-w-0 flex flex-col justify-between">
          <p className="text-[13px] font-medium text-foreground/80 leading-snug line-clamp-2 group-hover:text-foreground transition-colors">
            {meal.name[lang]}
          </p>
          <div className="flex gap-2.5 mt-1.5 flex-wrap">
            <span className="text-[11px] text-foreground/35 font-mono">
              {meal.protein}g P
            </span>
            <span className="text-[11px] text-foreground/35 font-mono">
              {meal.calories} kcal
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function StatCard({
  value,
  sub,
  label,
  progress,
}: {
  value: string;
  sub?: string;
  label: string;
  progress: number;
}) {
  return (
    <div className="border border-foreground/15 rounded-2xl p-5 flex flex-col gap-3 bg-foreground/1">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground tracking-tight font-mono">
          {value}
        </span>
        {sub && <span className="text-xs text-foreground/50">{sub}</span>}
      </div>
      <span className="text-xs uppercase tracking-widest text-foreground/50">
        {label}
      </span>
      <div className="h-1 bg-foreground/10 border-foreground/6 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ─── Weekly Grid View ─────────────────────────────────────────────────────────
function WeekView({
  weekMeals,
  selectedMeal,
  onSelectMeal,
  totalMeals,
  lang,
  t,
}: {
  weekMeals: Record<SlotKey, (FoodItem | null)[]>;
  selectedMeal: { slot: SlotKey; day: number } | null;
  onSelectMeal: (slot: SlotKey, day: number) => void;
  totalMeals: number;
  lang: Language;
  t: (key: string) => string;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-253">
        {/* Header row */}
        <div className="grid grid-cols-[88px_repeat(7,1fr)] border-b border-foreground/10">
          <div className="flex flex-col items-start justify-center px-3 py-3 border-e border-foreground/10 bg-foreground/1.5">
            <span className="text-[18px] font-bold font-mono text-primary leading-none">
              {totalMeals}
              <span className="text-foreground/50 text-[13px] font-normal">
                /21
              </span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-foreground mt-0.5">
              {t("mealPlanner.plates")}
            </span>
          </div>
          {DAYS.map((d, i) => (
            <div
              key={d}
              className={cn(
                "text-center py-3 px-1 bg-foreground/1.5",
                i < DAYS.length - 1 ? "border-e border-foreground/10" : "",
              )}
            >
              <div
                className={cn(
                  "text-[10px] uppercase tracking-widest",
                  i === 0 ? "text-primary" : "text-foreground/45",
                )}
              >
                {t(`mealPlanner.days.${d}`)}
              </div>
              <div
                className={cn(
                  "text-lg font-bold mt-0.5 font-mono",
                  i === 0 ? "text-primary" : "text-foreground/70",
                )}
              >
                {DATES[i]}
              </div>
            </div>
          ))}
        </div>

        {/* Slot rows */}
        {SLOTS.map((slot, slotIdx) => (
          <div
            key={slot.key}
            className={cn(
              "grid grid-cols-[88px_repeat(7,1fr)]",
              slotIdx < SLOTS.length - 1 ? "border-b border-foreground/10" : "",
            )}
          >
            <div className="flex flex-col justify-center px-3 py-3 border-e border-foreground/10 bg-foreground/1.5">
              <span className="text-[11px] font-semibold text-foreground/65">
                {t(`mealPlanner.slots.${slot.label}`)}
              </span>
              <span className="text-[9px] text-foreground/35 mt-0.5 tracking-wide">
                {slot.time}
              </span>
            </div>
            {weekMeals[slot.key].map((meal, dayIdx) => (
              <div
                key={dayIdx}
                className={cn(
                  "p-2",
                  dayIdx < 6 ? "border-e border-foreground/10" : "",
                )}
              >
                <MealChip
                  meal={meal}
                  selected={
                    selectedMeal?.slot === slot.key &&
                    selectedMeal?.day === dayIdx
                  }
                  onClick={() => onSelectMeal(slot.key, dayIdx)}
                  lang={lang}
                  addLabel={t("mealPlanner.addPlate")}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Daily View ───────────────────────────────────────────────────────────────
function DayView({
  day,
  dayIdx,
  weekMeals,
  onSelectMeal,
  t,
}: {
  day: string;
  dayIdx: number;
  weekMeals: Record<SlotKey, (FoodItem | null)[]>;
  onSelectMeal: (slot: SlotKey, day: number) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="space-y-4 p-5">
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold font-mono text-foreground">
          {DATES[dayIdx]}
        </span>
        <span className="text-foreground/60 uppercase tracking-widest text-sm">
          {day}, Apr 2026
        </span>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        {SLOTS.map((slot) => {
          const meal = weekMeals[slot.key][dayIdx];

          return (
            <div
              key={slot.key}
              className="bg-foborder-foreground/3] border border-foreground/8 rounded-2xl p-5 w-fit md:min-w-65 mx-auto"
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    "bg-foborder-foreground/15",
                  )}
                />
                <span className="text-[11px] uppercase tracking-widest text-foreground/60">
                  {t(`mealPlanner.slots.${slot.label}`)}
                </span>
                <span className="text-[10px] text-foreground/40 ml-auto">
                  {slot.time}
                </span>
              </div>
              {meal ? (
                <FoodCard key={slot.key} item={meal} />
              ) : (
                <button
                  onClick={() => onSelectMeal(slot.key, dayIdx)}
                  className="w-full h-auto py-4 border border-dashed border-foreground/15 rounded-xl text-foreground/40 text-sm hover:border-foreground/40 hover:text-foreground/35 transition-all"
                >
                  {t("mealPlanner.addPlate")}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────
function ListView({
  lang,
  weekMeals,
  onSelectMeal,
  t,
}: {
  lang: Language;
  weekMeals: Record<SlotKey, (FoodItem | null)[]>;
  onSelectMeal: (slot: SlotKey, day: number) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="space-y-5 p-5">
      {DAYS.map((day, dayIdx) => (
        <div key={dayIdx} className="px-4">
          <div className="flex items-center gap-4 py-2">
            <div className="w-20 shrink-0">
              <div className="text-[10px] uppercase tracking-widest font-semibold text-foreground">
                {day} {DATES[dayIdx]}
              </div>
            </div>
          </div>

          {SLOTS.map((slot) => {
            const meal = weekMeals[slot.key][dayIdx];
            const isBreakfast = slot.key === "breakfast";
            return (
              <div
                key={`${dayIdx}-${slot.key}`}
                className={cn(
                  "flex flex-col md:flex-row md:items-center gap-4 py-3 hover:bg-foreground/2 transition-colors group border-foreground/10 px-4",
                  isBreakfast ? "" : "border-t",
                )}
              >
                <div className="w-16 shrink-0">
                  <span className="text-[10px]  uppercase tracking-widest text-foreground/50">
                    {t(`mealPlanner.slots.${slot.label}`)}
                  </span>
                </div>

                {meal ? (
                  <>
                    {/* <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-foreground/10" /> */}
                    <div className="flex items-center gap-2 flex-1">
                      {meal.image && (
                        <Image
                          src={meal.image}
                          alt={meal.name[lang]}
                          width={24}
                          height={24}
                          className="rounded-sm"
                        />
                      )}
                      <span className="text-sm text-foreground/70 group-hover:text-foreground/90 transition-colors">
                        {meal.name[lang]}
                      </span>
                    </div>
                    <div className="flex gap-4 shrink-0">
                      <span className="text-[11px] font-mono text-foreground/50">
                        {meal.protein}g P
                      </span>
                      <span className="text-[11px] font-mono text-foreground/50">
                        {meal.calories} kcal
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectMeal(slot.key, dayIdx)}
                      className="text-xs text-primary-foreground dark:text-foreground text-end hover:text-primary-foreground/90 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      {t("mealPlanner.swap")}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-border-foreground/10" />
                    <span className="flex-1 text-sm text-foreground/50 italic">
                      {t("mealPlanner.emptySlot")}
                    </span>
                    <button
                      onClick={() => onSelectMeal(slot.key, dayIdx)}
                      className="text-xs text-primary-foreground dark:text-foreground text-end hover:text-primary-foreground/90 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      {t("mealPlanner.add")}
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({
  meal,
  day,
  slot,
  lang,
  isAddMode,
  onMealConfirmed,
  t,
}: {
  meal: FoodItem | null;
  day: number;
  slot: SlotKey;
  lang: Language;
  isAddMode: boolean;
  onMealConfirmed: (slot: SlotKey, day: number, newMeal: FoodItem) => void;
  t: (key: string) => string;
}) {
  const [selectedSwap, setSelectedSwap] = useState<string | null>(null);
  const [swapFilter, setSwapFilter] = useState("all");

  const [showRecipe, setShowRecipe] = useState(false);

  const filters = [
    t("mealPlanner.filterAll"),
    t("mealPlanner.filterHighProtein"),
    t("mealPlanner.filterLowCal"),
    t("mealPlanner.filterPlantBased"),
  ];
  const filterKeys = ["all", "high protein", "< 500 kcal", "plant-based"];

  const swapOptions = getSwapOptions(meal, slot, swapFilter);

  function handleConfirm() {
    if (!selectedSwap) return;
    const chosen = swapOptions.find((o) => o.id === selectedSwap);
    if (chosen) {
      onMealConfirmed(slot, day, chosen);
      setSelectedSwap(null);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-5 mt-6">
      {/* Selected plate (only shown when not in add mode / meal exists) */}
      {!isAddMode && meal && (
        <div className="flex flex-col items-center justify">
          <FoodCard item={meal} />

          <div className="grid grid-cols-2 gap-3 w-full max-w-60">
            <button className="bg-primary hover:bg-primary/80 text-black text-sm font-semibold py-3.5 rounded-xl transition-all duration-200">
              {t("mealPlanner.keepPlate")}
            </button>
            <button className="text-sm text-foreground/60 hover:text-foreground/70 border border-foreground/10 hover:border-foreground/15 px-4 py-3.5 rounded-xl transition-all dark:bg-primary-foreground/20">
              ↻ {t("mealPlanner.chef")}
            </button>
            <button
              className="col-span-2 text-sm text-foreground/60 hover:text-foreground/70 transition-colors px-4 border rounded-xl py-3.5 dark:bg-primary-foreground/20 hover:border-foreground/15"
              onClick={() => setShowRecipe(true)}
            >
              {t("mealPlanner.viewRecipe")} →
            </button>
          </div>
        </div>
      )}

      {/* Swap / Add panel */}
      <div className="border border-foreground/10 rounded-2xl p-5 flex-1 min-h-144 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-foreground/70">
            {isAddMode
              ? t("mealPlanner.choosePlate")
              : t("mealPlanner.swapFor")}
          </h4>
          <span className="text-xs uppercase tracking-widest text-foreground/25 cursor-pointer hover:text-foreground/45">
            {t("mealPlanner.filter")} ▾
          </span>
        </div>

        <div className="flex gap-1.5 flex-wrap mb-4">
          {filters.map((f, idx) => (
            <button
              key={f}
              onClick={() => setSwapFilter(filterKeys[idx])}
              className={cn(
                "text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all cursor-pointer",
                swapFilter === filterKeys[idx]
                  ? "bg-primary/5 text-primary-foreground/80 dark:text-primary border border-primary-foreground/40 dark:border-primary/50"
                  : "text-foreground/50 border border-foreground/10 hover:border-foreground/15 hover:text-foreground/60",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <div
            className="max-h-110 overflow-y-auto scrollbar-none grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4"
            onWheel={(e) => e.stopPropagation()}
          >
            {swapOptions.slice(0, 20).map((opt) => {
              const isSel = selectedSwap === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedSwap(isSel ? null : opt.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all cursor-pointer dark:bg-primary-foreground/20",
                    isSel
                      ? "border-primary/40 bg-primary/5"
                      : "border-foreground/6 hover:border-foreground/15 hover:bg-foborder-foreground/[0.04]",
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <img
                      src={opt.image}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-foreground/75">
                        {opt.name[lang]}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] font-mono text-foreground/40">
                          {opt.protein}g P
                        </span>
                        <span className="text-[10px] font-mono text-foreground/40">
                          {opt.carbs}g C
                        </span>
                        <span className="text-[10px] font-mono text-foreground/40">
                          {opt.calories} kcal
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border shrink-0 mt-0.5 transition-all",
                        isSel
                          ? "bg-primary/30 border-primary"
                          : "border-foreground/15",
                      )}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedSwap && (
          <div className="flex mt-4 justify-end">
            <button
              onClick={handleConfirm}
              className="px-6 bg-primary hover:bg-primary/90 border border-primary-foreground/10 text-primary-foreground text-sm font-medium py-2.5 rounded-full transition-all cursor-pointer"
            >
              {isAddMode
                ? t("mealPlanner.confirmAdd")
                : t("mealPlanner.confirmSwap")}
            </button>
          </div>
        )}
      </div>
      {showRecipe && meal && (
        <RecipeDetails
          meal={meal}
          lang={lang}
          onClose={() => setShowRecipe(false)}
        />
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MenuMealPlanner() {
  const { lang, t, isRTL } = useLang();
  const [view, setView] = useState<ViewMode>("week");
  const [activeDay, setActiveDay] = useState(0);
  const [weekMeals, setWeekMeals] =
    useState<Record<SlotKey, (FoodItem | null)[]>>(INITIAL_WEEK_MEALS);
  const [selectedMeal, setSelectedMeal] = useState<{
    slot: SlotKey;
    day: number;
  } | null>({
    slot: "breakfast",
    day: 0,
  });

  const selectedMealData = selectedMeal
    ? weekMeals[selectedMeal.slot][selectedMeal.day]
    : null;

  // true when user clicked an empty slot (add mode), false when clicked an existing meal (swap mode)
  const isAddMode = selectedMeal
    ? weekMeals[selectedMeal.slot][selectedMeal.day] === null
    : false;

  const totalMeals = Object.values(weekMeals).flat().filter(Boolean).length;
  const allMeals = Object.values(weekMeals)
    .flat()
    .filter((m): m is FoodItem => m !== null);
  const avgKcal = allMeals.length
    ? Math.round(
        allMeals.reduce((s, m) => s + (m.calories ? m.calories : 0), 0) / 7,
      )
    : 0;
  const avgProtein = allMeals.length
    ? Math.round(
        allMeals.reduce((s, m) => s + (m.protein ? m.protein : 0), 0) /
          allMeals.length,
      )
    : 0;

  function handleSelectMeal(slot: SlotKey, day: number) {
    setSelectedMeal({ slot, day });
  }

  function handleMealConfirmed(slot: SlotKey, day: number, newMeal: FoodItem) {
    setWeekMeals((prev) => {
      const updated = [...prev[slot]];
      updated[day] = newMeal;
      return { ...prev, [slot]: updated };
    });
    // keep the detail panel open, now showing the placed meal
    setSelectedMeal({ slot, day });
  }

  const showDetailPanel =
    selectedMeal !== null &&
    (view === "week" || view === "day" || view === "list");

  return (
    <div className="min-h-screen">
      <div className="relative max-w-6xl mx-auto px-6">
        {/* ── Header ── */}
        {/* <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-4">
            <OrderHeading
              label={`${t("mealPlanner.order")} #BTL-24-07739`}
              title={t("mealPlanner.heading")}
              subheading={t("mealPlanner.subheading")}
            />

            <Stepper currentIndex={1} />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-sm text-foreground/60 border border-foreground/10 hover:border-foreground/20 px-4 py-2.5 rounded-full transition-all hover:text-foreground/70 cursor-pointer">
              {t("mealPlanner.exportWeek")}
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1v8m-3-3l3 3 3-3M2 11h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold bg-primary hover:bg-primary/80 text-black px-5 py-2.5 rounded-full transition-all cursor-pointer">
              {t("mealPlanner.confirmWeek")}
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7l3 3 5-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div> */}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8 ">
          <StatCard
            value={`${totalMeals}`}
            sub="/21"
            label={t("mealPlanner.statsMealsPlanned")}
            progress={(totalMeals / 21) * 100}
          />
          <StatCard
            value={`${avgKcal}`}
            sub={t("mealPlanner.kcal")}
            label={t("mealPlanner.statsDailyAvg")}
            progress={82}
          />
          <StatCard
            value={`${avgProtein}g`}
            sub={t("mealPlanner.protein")}
            label={t("mealPlanner.statsAvgProtein")}
            progress={76}
          />
          <StatCard
            value={t("mealPlanner.statsFirstDeliveryValue")}
            sub={t("mealPlanner.statsFirstDeliverySub")}
            label={t("mealPlanner.statsFirstDelivery")}
            progress={100}
          />
          <StatCard
            value={t("mealPlanner.statsKitchenLocksValue")}
            sub={t("mealPlanner.statsKitchenLocksSub")}
            label={t("mealPlanner.statsKitchenLocks")}
            progress={40}
          />
        </div>

        {/* ── Week bar ── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground font-mono">
                  {t("mealPlanner.week")}
                </span>
                <span className="text-xl font-bold text-primary font-mono">
                  17
                </span>
              </div>
              <span className="text-sm text-foreground/50 tracking-wide">
                {t("mealPlanner.weekRange")}
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                variant={"outline"}
                className="size-9 flex items-center justify-center rounded-full border border-foreground/8 hover:border-foreground/20 text-foreground/70 hover:text-foreground/60 text-xs transition-all"
              >
                <MdOutlineArrowBackIos className={isRTL ? "rotate-180" : ""} />
              </Button>
              <Button
                variant={"outline"}
                className="size-9 flex items-center justify-center rounded-full border border-foreground/8 hover:border-foreground/20 text-foreground/70 hover:text-foreground/60 text-xs transition-all"
              >
                <MdOutlineArrowForwardIos
                  className={isRTL ? "rotate-180" : ""}
                />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1 border border-foreground/15 rounded-full p-1">
            {(["week", "day", "list"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[11px] uppercase tracking-widest transition-all cursor-pointer",
                  view === v
                    ? "bg-primary-foreground border-foreground/10 text-white font-medium"
                    : "text-foreground/70 hover:text-foreground/80",
                )}
              >
                {t(`mealPlanner.view${v.charAt(0).toUpperCase() + v.slice(1)}`)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Day selector (for day view) ── */}
        {view === "day" && (
          <div className="flex gap-2 mb-6 overflow-x-auto p-y5">
            {DAYS.map((d, i) => (
              <button
                key={d}
                onClick={() => setActiveDay(i)}
                className={cn(
                  "shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl border transition-all",
                  activeDay === i
                    ? "border-primary/30 bg-primary/4 text-primary-foreground dark:text-primary/80"
                    : "border-foreground/8 text-foreground/35 hover:text-foreground/60 hover:border-foreground/15",
                )}
              >
                <span className="text-[10px] uppercase tracking-widest">
                  {" "}
                  {t(`mealPlanner.days.${d}`)}
                </span>
                <span className="text-lg font-bold font-mono mt-0.5">
                  {DATES[i]}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ── Content ── */}
        <div className="bg-foborder-foreground/[0.02] border border-foreground/15 rounded-2xl mb-5">
          {view === "week" && (
            <WeekView
              weekMeals={weekMeals}
              selectedMeal={selectedMeal}
              onSelectMeal={handleSelectMeal}
              totalMeals={totalMeals}
              lang={lang}
              t={t}
            />
          )}
          {view === "day" && (
            <DayView
              day={DAYS[activeDay]}
              dayIdx={activeDay}
              weekMeals={weekMeals}
              onSelectMeal={handleSelectMeal}
              t={t}
            />
          )}
          {view === "list" && (
            <ListView
              lang={lang}
              weekMeals={weekMeals}
              onSelectMeal={handleSelectMeal}
              t={t}
            />
          )}
        </div>

        {/* ── Detail panel ── */}
        {showDetailPanel && (
          <DetailPanel
            meal={selectedMealData}
            day={selectedMeal!.day}
            slot={selectedMeal!.slot}
            lang={lang}
            isAddMode={isAddMode}
            onMealConfirmed={handleMealConfirmed}
            t={t}
          />
        )}
      </div>
    </div>
  );
}
