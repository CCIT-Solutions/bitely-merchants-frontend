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
import { log } from "console";
import { Language } from "@/types/shared";
import { useLang } from "@/hooks/useLang";

type SlotKey = "breakfast" | "lunch" | "dinner";
type ViewMode = "week" | "day" | "list";

// ─── Data ─────────────────────────────────────────────────────────────────────
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = [20, 21, 22, 23, 24, 25, 26];
const SLOTS: { key: SlotKey; label: string; time: string }[] = [
  { key: "breakfast", label: "Breakfast", time: "7–9 AM" },
  { key: "lunch", label: "Lunch", time: "12–2 PM" },
  { key: "dinner", label: "Dinner", time: "6–8 PM" },
];

const MEAL_COLORS = [
  "bg-emerald-900/60 text-emerald-300",
  "bg-amber-900/60 text-amber-300",
  "bg-sky-900/60 text-sky-300",
  "bg-rose-900/60 text-rose-300",
  "bg-violet-900/60 text-violet-300",
  "bg-teal-900/60 text-teal-300",
  "bg-orange-900/60 text-orange-300",
];

const ACCENT_DOT = [
  "bg-emerald-400",
  "bg-amber-400",
  "bg-sky-400",
  "bg-rose-400",
  "bg-violet-400",
  "bg-teal-400",
  "bg-orange-400",
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

const WEEK_MEALS: Record<SlotKey, (FoodItem | null)[]> = {
  breakfast: padTo7(breakfastMeals.map(mapFoodToMeal)),
  lunch: padTo7(lunchMeals.map(mapFoodToMeal)),
  dinner: padTo7(dinnerMeals.map(mapFoodToMeal)),
};

function getSwapOptions(
  currentMeal: FoodItem,
  slot: SlotKey,
  filter: string,
): FoodItem[] {
  let options = FOOD_ITEMS.map(mapFoodToMeal).filter(
    (m) => m.id !== currentMeal.id,
  ); // exclude current meal

  // Optional: match slot (if you add mealTime later)
  // options = options.filter(m => m.mealTime === slot)

  // Apply filters
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
function MacroPill({
  value,
  unit,
  label,
}: {
  value: string | number;
  unit: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-sm font-semibold text-foreground/90 font-mono tracking-tight">
        {value}
        <span className="text-foreground/60 text-xs ml-0.5">{unit}</span>
      </span>
      <span className="text-[10px] uppercase tracking-widest text-foreground/40">
        {label}
      </span>
    </div>
  );
}

function MealChip({
  meal,
  selected,
  onClick,
  lang,
}: {
  meal: FoodItem | null;
  selected?: boolean;
  onClick?: () => void;
  lang: Language;
}) {
  if (!meal) {
    return (
      <button
        onClick={onClick}
        className="w-full h-full min-h-20 rounded-xl border border-dashed border-foreground/10 hover:border-foreground/25 flex items-center justify-center text-foreground/25 text-xs tracking-widest uppercase transition-all duration-200 hover:bg-foborder-foreground/[0.02] group"
      >
        <span className="group-hover:text-foreground/60 transition-colors">
          + add plate
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-start rounded-xl border transition-all duration-200  group relative overflow-hidden h-full flex flex-col cursor-pointer",
        selected
          ? "border-primary-foreground/40 bg-primary/10 shadow-[0_0_20px_rgba(163,230,53,0.08)]"
          : " bg-fo border-foreground/5 hover:bg-foborder-foreground/[0.06] hover:border-foreground/15",
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
          <div className="shrink-0 size-5 rounded-full text-primary  bg-primary-foreground/60 flex items-center justify-center mt-0.5 absolute z-1 top-2 inset-e-2">
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
    <div className=" border border-foreground/15 rounded-2xl p-5 flex flex-col gap-3 bg-foreground/1">
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
  selectedMeal,
  onSelectMeal,
  totalMeals,
  lang,
}: {
  selectedMeal: { slot: SlotKey; day: number } | null;
  onSelectMeal: (slot: SlotKey, day: number) => void;
  totalMeals: number;
  lang: Language;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-175">
        {/* Header row */}
        <div className="grid grid-cols-[88px_repeat(7,1fr)] border-b border-foreground/10">
          {/* Top-left corner: plates counter */}
          <div className="flex flex-col items-start justify-center px-3 py-3 border-r border-foreground/10 bg-foreground/1.5">
            <span className="text-[18px] font-bold font-mono text-primary leading-none">
              {totalMeals}
              <span className="text-foreground/50 text-[13px] font-normal">
                /21
              </span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-primary-foreground mt-0.5">
              plates
            </span>
          </div>
          {/* Day headers */}
          {DAYS.map((d, i) => (
            <div
              key={d}
              className={cn(
                "text-center py-3 px-1 bg-foreground/1.5",
                i < DAYS.length - 1 ? "border-r border-foreground/10" : "",
              )}
            >
              <div
                className={cn(
                  "text-[10px] uppercase tracking-widest",
                  i === 0 ? "text-primary" : "text-foreground/45",
                )}
              >
                {d}
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
            {/* Row label */}
            <div className="flex flex-col justify-center px-3 py-3 border-r border-foreground/10 bg-foreground/1.5">
              <span className="text-[11px] font-semibold text-foreground/65">
                {slot.label}
              </span>
              <span className="text-[9px] text-foreground/35 mt-0.5 tracking-wide">
                {slot.time}
              </span>
            </div>
            {/* Meal cells */}
            {WEEK_MEALS[slot.key].map((meal, dayIdx) => (
              <div
                key={dayIdx}
                className={cn(
                  "p-2",
                  dayIdx < 6 ? "border-r border-foreground/10" : "",
                )}
              >
                <MealChip
                  meal={meal}
                  selected={
                    selectedMeal?.slot === slot.key &&
                    selectedMeal?.day === dayIdx
                  }
                  onClick={() => meal && onSelectMeal(slot.key, dayIdx)}
                  lang={lang}
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
function DayView({ day, dayIdx }: { day: string; dayIdx: number }) {
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
      <div className="flex gap-4">
        {SLOTS.map((slot) => {
          const meal = WEEK_MEALS[slot.key][dayIdx];

          return (
            <div
              key={slot.key}
              className="bg-foborder-foreground/3] border border-foreground/8 rounded-2xl p-5 min-w-65"
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    "bg-foborder-foreground/15",
                  )}
                />
                <span className="text-[11px] uppercase tracking-widest text-foreground/60">
                  {slot.label}
                </span>
                <span className="text-[10px] text-foreground/40 ml-auto">
                  {slot.time}
                </span>
              </div>
              {meal ? (
                <FoodCard key={slot.key} item={meal} />
              ) : (
                <button className="w-full h-auto py-4 border border-dashed border-foreground/15 rounded-xl text-foreground/40 text-sm hover:border-foreground/40 hover:text-foreground/35 transition-all">
                  + Add plate
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

function ListView({ lang }: { lang: Language }) {
  return (
    <div className="space-y-5 p-5">
      {DAYS.map((day, dayIdx) => (
        <div key={dayIdx} className="px-4">
          {/* Day and Date Header (outside the slots) */}
          <div className="flex items-center gap-4  py-2">
            <div className="w-20 shrink-0">
              <div className="text-[10px] uppercase tracking-widest font-semibold text-foreground">
                {day} {DATES[dayIdx]}
              </div>
            </div>
          </div>

          {/* Slots for the day */}
          {SLOTS.map((slot) => {
            const meal = WEEK_MEALS[slot.key][dayIdx];
            const isBreakfast = slot.key === "breakfast";
            return (
              <div
                key={`${dayIdx}-${slot.key}`}
                className={cn(
                  "flex items-center gap-4  py-3 hover:bg-foreground/2 transition-colors group  border-foreground/10 px-4",
                  isBreakfast ? "" : "border-t",
                )}
              >
                {/* Empty space for alignment */}

                {/* Slot Label (e.g., "Breakfast", "Lunch") */}
                <div className="w-16 shrink-0">
                  <span className="text-[10px] uppercase tracking-widest text-foreground/50">
                    {slot.label}
                  </span>
                </div>

                {/* Meal Details or Empty Slot */}
                {meal ? (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-foreground/10" />
                    {/* Meal Name + Image */}
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
                    {/* Protein & Calories */}
                    <div className="flex gap-4 shrink-0">
                      <span className="text-[11px] font-mono text-foreground/50">
                        {meal.protein}g P
                      </span>
                      <span className="text-[11px] font-mono text-foreground/50">
                        {meal.calories} kcal
                      </span>
                    </div>
                    <button className="text-xs text-primary-foreground hover:text-primary-foreground/90 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                      Swap
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-border-foreground/10" />
                    <span className="flex-1 text-sm text-foreground/15 italic">
                      Empty slot
                    </span>
                    <button className="text-xs text-primary-foreground hover:text-primary-foreground/90 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                      + add
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
}: {
  meal: FoodItem;
  day: number;
  slot: SlotKey;
  lang: Language;
}) {
  const [selectedSwap, setSelectedSwap] = useState<string | null>(null);
  const [swapFilter, setSwapFilter] = useState("all");

  const filters = ["All", "High protein", "< 500 kcal", "Plant-based"];

  const swapOptions = getSwapOptions(meal, slot, swapFilter);

  return (
    <div className="flex gap-5 mt-6">
      {/* Selected plate */}
      <div className="flex flex-col items-center justify">
        <FoodCard item={meal} />

        <div className="grid grid-cols-2 gap-3 w-full max-w-60">
          <button className="bg-primary hover:bg-primary/80 text-black text-sm font-semibold  py-3.5 rounded-xl transition-all duration-200">
            Keep plate
          </button>
          <button className="text-sm text-foreground/60 hover:text-foreground/70 border border-foreground/10 hover:border-foreground/15 px-4 py-3.5 rounded-xl transition-all dark:bg-primary-foreground/20">
            ↻ Chef
          </button>
          <button className="col-span-2 text-sm text-foreground/60 hover:text-foreground/70 transition-colors px-4 border rounded-xl py-3.5 dark:bg-primary-foreground/20 hover:border-foreground/15">
            View recipe →
          </button>
        </div>
      </div>

      {/* Swap panel */}
      <div className=" border border-foreground/10 rounded-2xl p-5 flex-1 min-h-144 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-foreground/70">
            Swap for…
          </h4>
          <span className="text-xs uppercase tracking-widest text-foreground/25 cursor-pointer hover:text-foreground/45">
            Filter ▾
          </span>
        </div>

        <div className="flex gap-1.5 flex-wrap mb-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSwapFilter(f.toLowerCase())}
              className={cn(
                "text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all cursor-pointer",
                swapFilter === f.toLowerCase()
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
            className="max-h-110 overflow-y-auto scrollbar-none grid grid-cols-2 gap-4"
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
                      ? "border-primary bg-primary/5"
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
            <button className="px-6 bg-primary hover:bg-primary/90 border border-primary-foreground/10 text-primary-foreground text-sm font-medium py-2.5 rounded-full transition-all cursor-pointer">
              Confirm swap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MenuMealPlanner() {
  const { lang } = useLang();
  const [view, setView] = useState<ViewMode>("week");
  const [activeDay, setActiveDay] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<{
    slot: SlotKey;
    day: number;
  } | null>({
    slot: "breakfast",
    day: 0,
  });

  const selectedMealData = selectedMeal
    ? WEEK_MEALS[selectedMeal.slot][selectedMeal.day]
    : null;

  const totalMeals = Object.values(WEEK_MEALS).flat().filter(Boolean).length;
  const allMeals = Object.values(WEEK_MEALS)
    .flat()
    .filter((m): m is FoodItem => m !== null);
  const avgKcal = Math.round(
    allMeals.reduce((s, m) => s + (m.calories ? m.calories : 0), 0) / 7,
  );
  const avgProtein = Math.round(
    allMeals.reduce((s, m) => s + (m.protein ? m.protein : 0), 0) /
      allMeals.length,
  );

  return (
    <div className="min-h-screen  pt-20">
      <div className="relative max-w-6xl mx-auto px-6 py-10">
        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                Order #BTL-24-07739
              </span>
            </div>
            <h1 className="text-4xl font-bold text-foreground leading-none tracking-tight">
              Plate your <span className="text-primary">week.</span>
            </h1>
            <p className="text-foreground/35 text-sm mt-2.5 max-w-md">
              Click any plate to swap it — nutrition recalculates live and we
              lock the kitchen on Sunday, 8 PM.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-sm text-foreground/60 border border-foreground/10 hover:border-foreground/20 px-4 py-2.5 rounded-full transition-all hover:text-foreground/70 cursor-pointer">
              Export week
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
              Confirm week
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
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <StatCard
            value={`${totalMeals}`}
            sub="/21"
            label="Meals planned"
            progress={(totalMeals / 21) * 100}
          />
          <StatCard
            value={`${avgKcal}`}
            sub="kcal"
            label="Daily avg."
            progress={82}
          />
          <StatCard
            value={`${avgProtein}g`}
            sub="P"
            label="Avg protein / meal"
            progress={76}
          />
          <StatCard
            value="Mon"
            sub="20"
            label="First Delivery"
            progress={100}
          />
          <StatCard
            value="Sun"
            sub="8 PM"
            label="Kitchen locks"
            progress={40}
          />
        </div>

        {/* ── Week bar ── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground font-mono">
                  Week
                </span>
                <span className="text-xl font-bold text-primary font-mono">
                  17
                </span>
              </div>
              <span className="text-sm text-foreground/50 tracking-wide">
                April 20 — April 26, 2026
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                variant={"outline"}
                className="size-9 flex items-center justify-center rounded-full border border-foreground/8 hover:border-foreground/20 text-foreground/70 hover:text-foreground/60 text-xs transition-all"
              >
                <MdOutlineArrowBackIos />
              </Button>
              <Button
                variant={"outline"}
                className="size-9 flex items-center justify-center rounded-full border border-foreground/8 hover:border-foreground/20 text-foreground/70 hover:text-foreground/60 text-xs transition-all"
              >
                <MdOutlineArrowForwardIos />
              </Button>
            </div>{" "}
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
                {v}
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
                    ? "border-primary bg-primary/4  text-primary-foreground"
                    : "border-foreground/8 text-foreground/35 hover:text-foreground/60 hover:border-foreground/15",
                )}
              >
                <span className="text-[10px] uppercase tracking-widest">
                  {d}
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
              selectedMeal={selectedMeal}
              onSelectMeal={(slot, day) => setSelectedMeal({ slot, day })}
              totalMeals={totalMeals}
              lang={lang}
            />
          )}
          {view === "day" && (
            <DayView day={DAYS[activeDay]} dayIdx={activeDay} />
          )}
          {view === "list" && <ListView lang={lang} />}
        </div>

        {/* ── Detail panel ── */}
        {selectedMealData && view === "week" && (
          <DetailPanel
            meal={selectedMealData}
            day={selectedMeal!.day}
            slot={selectedMeal!.slot}
            lang={lang}
          />
        )}
      </div>
    </div>
  );
}
