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

// ─── Types ────────────────────────────────────────────────────────────────────
interface Meal {
  id: string;
  name: string;
  tag: string;
  protein: number;
  carbs: number;
  fat: number;
  kcal: number;
  color: string;
  image: string;
}

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

function mapFoodToMeal(food: FoodItem, index: number): Meal {
  return {
    id: food.id,
    name: food.name.en,
    tag: "Meal",
    protein: food.protein ?? 0,
    carbs: food.carbs ?? 0,
    fat: food.fat ?? 0,
    kcal: food.calories ?? 0,
    color: String(index % 7),
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

const WEEK_MEALS: Record<SlotKey, (Meal | null)[]> = {
  breakfast: padTo7(breakfastMeals.map(mapFoodToMeal)),
  lunch: padTo7(lunchMeals.map(mapFoodToMeal)),
  dinner: padTo7(dinnerMeals.map(mapFoodToMeal)),
};

function getSwapOptions(
  currentMeal: Meal,
  slot: SlotKey,
  filter: string,
): Meal[] {
  let options = FOOD_ITEMS.map(mapFoodToMeal).filter(
    (m) => m.id !== currentMeal.id,
  ); // exclude current meal

  // Optional: match slot (if you add mealTime later)
  // options = options.filter(m => m.mealTime === slot)

  // Apply filters
  switch (filter) {
    case "high protein":
      options = options.filter((m) => m.protein >= 40);
      break;
    case "< 500 kcal":
      options = options.filter((m) => m.kcal <= 500);
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
}: {
  meal: Meal | null;
  selected?: boolean;
  onClick?: () => void;
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

  const colorIdx = parseInt(meal.color) % MEAL_COLORS.length;
  const dotColor = ACCENT_DOT[colorIdx];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border transition-all duration-200  group relative overflow-hidden h-full",
        selected
          ? "border-primary-foreground bg-lime-400/5 shadow-[0_0_20px_rgba(163,230,53,0.08)]"
          : "border-foreground/[0.07] bg-foborder-foreground/[0.03] hover:bg-foborder-foreground/[0.06] hover:border-foreground/15",
      )}
    >
      <div className="w-full h-14 overflow-hidden relative">
        <Image src={meal.image} alt={meal.name} fill className="object-cover" />
        {selected && (
          <div className="shrink-0 size-5 rounded-full text-primary  bg-primary-foreground/80 flex items-center justify-center mt-0.5 absolute z-1 top-2 inset-e-2">
            <FaCheck className="size-3.5" />
          </div>
        )}
      </div>
      <div className="flex items-start gap-2.5 p-3">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-foreground/80 leading-snug line-clamp-2 group-hover:text-foreground transition-colors">
            {meal.name}
          </p>
          <div className="flex gap-2.5 mt-1.5 flex-wrap">
            <span className="text-[11px] text-foreground/35 font-mono">
              {meal.protein}g P
            </span>
            <span className="text-[11px] text-foreground/35 font-mono">
              {meal.kcal} kcal
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
    <div className=" border border-foreground/15 rounded-2xl p-5 flex flex-col gap-3">
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
}: {
  selectedMeal: { slot: SlotKey; day: number } | null;
  onSelectMeal: (slot: SlotKey, day: number) => void;
  totalMeals: number;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Header row */}
        <div className="grid grid-cols-[88px_repeat(7,1fr)] border-b border-foreground/10">
          {/* Top-left corner: plates counter */}
          <div className="flex flex-col items-start justify-center px-3 py-3 border-r border-foreground/10">
            <span className="text-[18px] font-bold font-mono text-primary leading-none">
              {totalMeals}
              <span className="text-foreground/30 text-[13px] font-normal">
                /21
              </span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-foreground/35 mt-0.5">
              plates
            </span>
          </div>
          {/* Day headers */}
          {DAYS.map((d, i) => (
            <div
              key={d}
              className={cn(
                "text-center py-3 px-1",
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
            <div className="flex flex-col justify-center px-3 py-3 border-r border-foreground/10">
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
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-4xl font-bold font-mono text-foreground">
          {DATES[dayIdx]}
        </span>
        <span className="text-foreground/60 uppercase tracking-widest text-sm">
          {day}, Apr 2026
        </span>
      </div>
      {SLOTS.map((slot) => {
        const meal = WEEK_MEALS[slot.key][dayIdx];
   console.log("meal", meal);
   
        const colorIdx = meal ? parseInt(meal.color) % MEAL_COLORS.length : 0;
        return (
          <div
            key={slot.key}
            className="bg-foborder-foreground/[0.03] border border-foreground/[0.07] rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  meal ? ACCENT_DOT[colorIdx] : "bg-foborder-foreground/10",
                )}
              />
              <span className="text-[11px] uppercase tracking-widest text-foreground/60">
                {slot.label}
              </span>
              <span className="text-[10px] text-foreground/20 ml-auto">
                {slot.time}
              </span>
            </div>
            {meal ? (
             <FoodCard key={slot.key} item={meal} />
            ) : (
              <button className="w-full py-4 border border-dashed border-foreground/10 rounded-xl text-foreground/20 text-sm hover:border-foreground/20 hover:text-foreground/35 transition-all">
                + Add plate
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────
function ListView() {
  return (
    <div className="space-y-1">
      {DAYS.map((day, dayIdx) =>
        SLOTS.map((slot) => {
          const meal = WEEK_MEALS[slot.key][dayIdx];
          const colorIdx = meal ? parseInt(meal.color) % MEAL_COLORS.length : 0;
          return (
            <div
              key={`${dayIdx}-${slot.key}`}
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-foborder-foreground/[0.04] transition-colors group"
            >
              <div className="w-20 shrink-0">
                {slot.key === "breakfast" && (
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-foreground/35">
                      {day} {DATES[dayIdx]}
                    </div>
                  </div>
                )}
              </div>
              <div className="w-16 shrink-0">
                <span className="text-[10px] uppercase tracking-widest text-foreground/25">
                  {slot.label}
                </span>
              </div>
              {meal ? (
                <>
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      ACCENT_DOT[colorIdx],
                    )}
                  />
                  <span className="flex-1 text-sm text-foreground/70 group-hover:text-foreground/90 transition-colors">
                    {meal.name}
                  </span>
                  <div className="flex gap-4 shrink-0">
                    <span className="text-[11px] font-mono text-foreground/40">
                      {meal.protein}g P
                    </span>
                    <span className="text-[11px] font-mono text-foreground/40">
                      {meal.kcal} kcal
                    </span>
                  </div>
                  <button className="text-[10px] text-foreground/20 hover:text-foreground/60 transition-colors opacity-0 group-hover:opacity-100">
                    swap
                  </button>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-foborder-foreground/10" />
                  <span className="flex-1 text-sm text-foreground/15 italic">
                    Empty slot
                  </span>
                  <button className="text-[10px] text-lime-400/50 hover:text-lime-400 transition-colors opacity-0 group-hover:opacity-100">
                    + add
                  </button>
                </>
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({
  meal,
  day,
  slot,
}: {
  meal: Meal;
  day: number;
  slot: SlotKey;
}) {
  const [selectedSwap, setSelectedSwap] = useState<string | null>(null);
  const [swapFilter, setSwapFilter] = useState("all");
  const colorIdx = parseInt(meal.color) % MEAL_COLORS.length;
  const dotColor = ACCENT_DOT[colorIdx];

  const filters = ["All", "High protein", "< 500 kcal", "Plant-based"];

  const swapOptions = getSwapOptions(meal, slot, swapFilter);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 mt-6">
      {/* Selected plate */}
      <div className="bg-foborder-foreground/[0.03] border border-foreground/[0.07] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-full h-60 overflow-hidden relative">
            <Image
              src={meal.image}
              alt={meal.name}
              fill
              className="object-cover"
            />
          </div>

          <div className={cn("w-2 h-2 rounded-full", dotColor)} />
          <span className="text-[10px] uppercase tracking-widest text-foreground/35">
            {DAYS[day]} Apr {DATES[day]} · {meal.tag}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-2 leading-tight">
          {meal.name}
        </h3>
        <p className="text-sm text-foreground/35 leading-relaxed mb-6 max-w-md">
          A chef-curated plate built for performance. Fresh ingredients, precise
          macros, delivered to your door.
        </p>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { v: meal.protein, u: "g", l: "Protein" },
            { v: meal.carbs, u: "g", l: "Carbs" },
            { v: meal.fat, u: "g", l: "Fat" },
            { v: meal.kcal, u: "", l: "Kcal" },
          ].map((m) => (
            <div
              key={m.l}
              className="bg-foborder-foreground/[0.04] rounded-xl p-3 text-center"
            >
              <div className="text-xl font-bold font-mono text-foreground">
                {m.v}
                <span className="text-foreground/40 text-sm">{m.u}</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-foreground/40 mt-1">
                {m.l}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button className="bg-lime-400 hover:bg-primary/80 text-black text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200">
            Keep this plate
          </button>
          <button className="text-sm text-foreground/60 hover:text-foreground/70 border border-foreground/10 hover:border-foreground/20 px-4 py-2.5 rounded-xl transition-all">
            ↻ Chef's pick
          </button>
          <button className="text-sm text-foreground/60 hover:text-foreground/70 transition-colors px-4 py-2.5">
            View recipe →
          </button>
        </div>
      </div>

      {/* Swap panel */}
      <div className="bg-foborder-foreground/[0.03] border border-foreground/[0.07] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-foreground/70">
            Swap for…
          </h4>
          <span className="text-[10px] uppercase tracking-widest text-foreground/25 cursor-pointer hover:text-foreground/45">
            Filter ▾
          </span>
        </div>

        <div className="flex gap-1.5 flex-wrap mb-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSwapFilter(f.toLowerCase())}
              className={cn(
                "text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all",
                swapFilter === f.toLowerCase()
                  ? "bg-lime-400/15 text-lime-400 border border-lime-400/25"
                  : "text-foreground/40 border border-foreground/[0.07] hover:border-foreground/15 hover:text-foreground/60",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 scrollbar-none">
          {swapOptions.slice(0, 6).map((opt) => {
            const oci = parseInt(opt.color) % ACCENT_DOT.length;
            const isSel = selectedSwap === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedSwap(isSel ? null : opt.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all",
                  isSel
                    ? "border-lime-400/30 bg-lime-400/5"
                    : "border-foreground/[0.06] hover:border-foreground/15 hover:bg-foborder-foreground/[0.04]",
                )}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full mt-1 shrink-0",
                      ACCENT_DOT[oci],
                    )}
                  />
                  <img
                    src={opt.image}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground/75">
                      {opt.name}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] font-mono text-foreground/40">
                        {opt.protein}g P
                      </span>
                      <span className="text-[10px] font-mono text-foreground/40">
                        {opt.carbs}g C
                      </span>
                      <span className="text-[10px] font-mono text-foreground/40">
                        {opt.kcal} kcal
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border shrink-0 mt-0.5 transition-all",
                      isSel
                        ? "bg-lime-400/20 border-lime-400/50"
                        : "border-foreground/15",
                    )}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {selectedSwap && (
          <button className="w-full mt-3 bg-lime-400/10 hover:bg-lime-400/20 border border-lime-400/20 text-lime-400 text-sm font-medium py-2.5 rounded-xl transition-all">
            Confirm swap
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MenuMealPlanner() {
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
    .filter((m): m is Meal => m !== null);
  const avgKcal = Math.round(allMeals.reduce((s, m) => s + m.kcal, 0) / 7);
  const avgProtein = Math.round(
    allMeals.reduce((s, m) => s + m.protein, 0) / allMeals.length,
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
          <div className="flex gap-2 mb-6 overflow-x-auto p-5">
            {DAYS.map((d, i) => (
              <button
                key={d}
                onClick={() => setActiveDay(i)}
                className={cn(
                  "shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl border transition-all",
                  activeDay === i
                    ? "border-primary/30 bg-primary/5 text-primary"
                    : "border-foreground/[0.08] text-foreground/35 hover:text-foreground/60 hover:border-foreground/15",
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
            />
          )}
          {view === "day" && (
            <DayView day={DAYS[activeDay]} dayIdx={activeDay} />
          )}
          {view === "list" && <ListView />}
        </div>

        {/* ── Detail panel ── */}
        {selectedMealData && view === "week" && (
          <DetailPanel
            meal={selectedMealData}
            day={selectedMeal!.day}
            slot={selectedMeal!.slot}
          />
        )}

        {/* ── Shopping list ── */}
        <div className="mt-6 bg-[#0d1a0f] border border-primary/10 rounded-2xl p-6">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary/60 mb-2">
                § Auto-generated
              </div>
              <h3 className="text-xl font-bold text-foreground">
                This week's <span className="text-primary">shopping</span> list.
              </h3>
              <p className="text-sm text-foreground/40 mt-1.5 max-w-sm">
                Built from your {totalMeals} plates — sourced fresh from the
                market at dawn on Monday.
              </p>
            </div>
            <button className="bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-sm font-medium px-5 py-2.5 rounded-xl transition-all">
              Open full list
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ["2.4 kg", "Free-range chicken"],
              ["1.1 kg", "Wild salmon"],
              ["800 g", "Jasmine rice"],
              ["600 g", "Steel-cut oats"],
              ["12", "Avocados · ripe"],
              ["500 g", "Pomegranate seeds"],
              ["3 bun.", "Lacinato kale"],
              ["24", "Farm eggs · L"],
            ].map(([qty, name]) => (
              <div
                key={name}
                className="bg-foborder-foreground/[0.03] border border-foreground/[0.05] rounded-xl p-3.5"
              >
                <div className="text-base font-bold font-mono text-primary">
                  {qty}
                </div>
                <div className="text-[11px] text-foreground/60 mt-0.5">
                  {name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
