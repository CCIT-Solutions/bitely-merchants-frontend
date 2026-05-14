"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { FaCheck } from "react-icons/fa6";
import { MdClose, MdAdd, MdSwapHoriz, MdTune } from "react-icons/md";
import Image from "next/image";
import { FOOD_ITEMS } from "@/data/menu";
import { FoodItem } from "@/types/menu";
import { Language } from "@/types/shared";
import { useLang } from "@/hooks/useLang";

// ─── Types ────────────────────────────────────────────────────────────────────

type SlotKey = "breakfast" | "lunch" | "dinner" | "snacks";

interface SlotConfig {
  key: SlotKey;
  labelKey: string;
  time: string;
  color: string;
}

interface DayMeals {
  breakfast: FoodItem | null;
  lunch: FoodItem | null;
  dinner: FoodItem | null;
  snacks: FoodItem | null;
}

interface MealsMap {
  [dateStr: string]: DayMeals;
}

interface ModalState {
  slot: SlotKey;
  meal: FoodItem | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SLOTS: SlotConfig[] = [
  {
    key: "breakfast",
    labelKey: "mealPlanner.slots.breakfast",
    time: "7–9 AM",
    color: "#FAC775",
  },
  {
    key: "lunch",
    labelKey: "mealPlanner.slots.lunch",
    time: "12–2 PM",
    color: "#5DCAA5",
  },
  {
    key: "dinner",
    labelKey: "mealPlanner.slots.dinner",
    time: "6–8 PM",
    color: "#7F77DD",
  },
  {
    key: "snacks",
    labelKey: "mealPlanner.slots.snacks",
    time: "mealPlanner.slots.anytime",
    color: "#F0997B",
  },
];

const FILTER_KEYS = [
  "all",
  "high protein",
  "< 500 kcal",
  "plant-based",
] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

const FILTER_LABEL_KEYS: Record<FilterKey, string> = {
  all: "mealPlanner.filterAll",
  "high protein": "mealPlanner.filterHighProtein",
  "< 500 kcal": "mealPlanner.filterLowCal",
  "plant-based": "mealPlanner.filterPlantBased",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildDateRange(): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: Date[] = [];
  for (let i = -7; i <= 15; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function toDateKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

function isToday(d: Date): boolean {
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

function mapToMeal(food: FoodItem): FoodItem {
  return {
    id: food.id,
    name: { en: food.name.en, ar: food.name.ar },
    description: { en: food.description.en, ar: food.description.ar },

    tag: food.tag,
    protein: food.protein ?? 0,
    carbs: food.carbs ?? 0,
    fat: food.fat ?? 0,
    calories: food.calories ?? 0,
    image: food.image,
    category: food.category,
    dietType: food.dietType,
    customMacros: food.customMacros,
  };
}

function getSwapOptions(
  currentId: string | null,
  filter: FilterKey,
): FoodItem[] {
  let opts = FOOD_ITEMS.map(mapToMeal).filter((m) => m.id !== currentId);
  if (filter === "high protein")
    opts = opts.filter((m) => (m.protein ?? 0) >= 30);
  if (filter === "< 500 kcal")
    opts = opts.filter((m) => (m.calories ?? 0) <= 500);
  if (filter === "plant-based")
    opts = opts.filter(
      (m) => FOOD_ITEMS.find((f) => f.id === m.id)?.dietType === "vegetarian",
    );
  return opts;
}

function buildInitialMeals(days: Date[]): MealsMap {
  const map: MealsMap = {};
  const breakfastPool = FOOD_ITEMS.filter(
    (f) =>
      f.name.en.toLowerCase().includes("salad") ||
      f.name.en.toLowerCase().includes("oat") ||
      f.name.en.toLowerCase().includes("egg") ||
      f.name.en.toLowerCase().includes("toast"),
  ).map(mapToMeal);
  const lunchPool = FOOD_ITEMS.slice(0, 7).map(mapToMeal);
  const dinnerPool = FOOD_ITEMS.slice(7, 14).map(mapToMeal);

  days.forEach((d, idx) => {
    map[toDateKey(d)] = {
      breakfast: breakfastPool[idx % breakfastPool.length] ?? lunchPool[0],
      lunch: lunchPool[idx % lunchPool.length],
      dinner: dinnerPool[idx % dinnerPool.length],
      snacks:
        idx % 3 === 0
          ? FOOD_ITEMS[12]
            ? mapToMeal(FOOD_ITEMS[12])
            : null
          : null,
    };
  });
  return map;
}

// ─── Draggable Strip Hook ─────────────────────────────────────────────────────

function useDraggableScroll(ref: React.RefObject<HTMLDivElement | null>) {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const didDrag = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      didDrag.current = false;
      startX.current = e.pageX - el.offsetLeft;
      scrollLeft.current = el.scrollLeft;
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX.current) * 1.2;
      if (Math.abs(walk) > 4) didDrag.current = true;
      el.scrollLeft = scrollLeft.current - walk;
    };

    const onMouseUp = () => {
      isDragging.current = false;
      el.style.cursor = "grab";
      el.style.userSelect = "";
    };

    const onTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].pageX - el.offsetLeft;
      scrollLeft.current = el.scrollLeft;
      didDrag.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      const x = e.touches[0].pageX - el.offsetLeft;
      const walk = (x - startX.current) * 1.2;
      if (Math.abs(walk) > 4) didDrag.current = true;
      el.scrollLeft = scrollLeft.current - walk;
    };

    el.style.cursor = "grab";
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [ref]);

  return didDrag;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface MealCardProps {
  meal: FoodItem;
  lang: Language;
  onSwap: () => void;
  t: (k: string) => string;
}

function MealCard({ meal, lang, onSwap, t }: MealCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 group w-full">
      {/* Image: Shrink on small screens */}
      <div className="relative size-14 sm:size-18 rounded-2xl overflow-hidden shrink-0 bg-foreground/5">
        <Image
          src={meal.image}
          alt={meal.name[lang]}
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>

      {/* Info: Stack on small screens */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] sm:text-[14px] font-semibold text-foreground/80 truncate leading-snug mb-1">
          {meal.name[lang]}
        </p>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px]  text-foreground/45">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400/70" />
            {meal.protein}g {t("menu.protein")}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px]  text-foreground/45">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70" />
            {meal.carbs}g {t("menu.carbs")}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px]  text-foreground/45">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
            {meal.fat}g {t("menu.fat")}
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold  text-foreground/60 ms-auto">
            {meal.calories} {t("menu.kcal")}
          </span>
        </div>
      </div>

      {/* Swap Button: Always visible on small screens */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSwap();
        }}
        aria-label={t("mealPlanner.swapFor")}
        className={cn(
          "shrink-0 flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-foreground/10",
          "text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-foreground/40",
          "hover:border-primary-foreground/20 hover:text-primary-foreground hover:bg-primary",
          "transition-all duration-150 cursor-pointer",
          "group-hover:opacity-100 focus:opacity-100 opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
        )}
      >
        <MdSwapHoriz className="size-3 sm:size-4" />
        <span className="hidden sm:inline">{t("mealPlanner.swap")}</span>
      </button>
    </div>
  );
}
interface EmptySlotProps {
  onAdd: () => void;
  t: (k: string) => string;
}

function EmptySlot({ onAdd, t }: EmptySlotProps) {
  return (
    <button
      onClick={onAdd}
      className={cn(
        "w-full flex items-center justify-center gap-2 py-5",
        "border border-dashed border-foreground/10 rounded-2xl",
        "text-[11px] uppercase tracking-widest text-foreground/25",
        "hover:border-foreground/25 hover:text-foreground/45 hover:bg-foreground/[0.01]",
        "transition-all duration-150 cursor-pointer",
      )}
    >
      <MdAdd className="size-4" />
      {t("mealPlanner.addPlate")}
    </button>
  );
}

interface SlotCardProps {
  slot: SlotConfig;
  meal: FoodItem | null;
  lang: Language;
  onSwap: () => void;
  onAdd: () => void;
  t: (k: string) => string;
  isRTL: boolean;
}

function SlotCard({
  slot,
  meal,
  lang,
  onSwap,
  onAdd,
  t,
  isRTL,
}: SlotCardProps) {
  const timeLabel = slot.key === "snacks" ? t(slot.time) : slot.time;

  return (
    <div className="flex flex-col border border-primary/50 rounded-2xl overflow-hidden transition-shadow hover:shadow-sm">
      {/* header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3 border-b border-primary/50"
        // style={{ backgroundColor: `${slot.color}12` }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 bg-primary"
          // style={{ backgroundColor: slot.color }}
        />
        <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/60 flex-1">
          {t(slot.labelKey)}
        </span>
        <span className="text-[10px] tracking-wide px-2 py-0.5 rounded-full font-medium bg-primary text-white">
          {timeLabel}
        </span>
      </div>

      {/* content */}
      <div className="flex flex-col p-4 gap-3">
        {meal ? (
          <>
            <MealCard meal={meal} lang={lang} onSwap={onSwap} t={t} />
            <button
              onClick={onAdd}
              className={cn(
                "w-full flex items-center justify-center gap-1.5 py-2.5",
                "border border-dashed border-foreground/20 rounded-xl",
                "text-[10px] uppercase tracking-widest text-foreground/60",
                "hover:border-foreground/20 hover:text-foreground/70",
                "transition-all duration-150 cursor-pointer",
              )}
            >
              <MdAdd className="size-3.5" />
              {t("mealPlanner.addPlate")}
            </button>
          </>
        ) : (
          <EmptySlot onAdd={onAdd} t={t} />
        )}
      </div>
    </div>
  );
}

// ─── Swap Modal ───────────────────────────────────────────────────────────────

interface SwapModalProps {
  modal: ModalState;
  lang: Language;
  filter: FilterKey;
  selectedSwap: string | null;
  onFilterChange: (f: FilterKey) => void;
  onSelectSwap: (id: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  t: (k: string) => string;
  isRTL: boolean;
}

function SwapModal({
  modal,
  lang,
  filter,
  selectedSwap,
  onFilterChange,
  onSelectSwap,
  onConfirm,
  onClose,
  t,
  isRTL,
}: SwapModalProps) {
  const opts = getSwapOptions(modal.meal?.id ?? null, filter);
  const slotInfo = SLOTS.find((s) => s.key === modal.slot)!;
  const isAddMode = modal.meal === null;

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        // Mobile: bottom sheet | Desktop: centered
        "flex items-end justify-center",
        "sm:items-center sm:justify-center sm:p-6",
      )}
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={
        isAddMode ? t("mealPlanner.choosePlate") : t("mealPlanner.swapFor")
      }
    >
      <div
        className={cn(
          "bg-background flex flex-col",
          "w-full max-w-2xl",
          // Mobile: bottom sheet shape
          "rounded-t-2xl border-t border-x border-foreground/15",
          "max-h-[82vh]",
          // Desktop: centered card shape
          "sm:rounded-2xl sm:border sm:border-foreground/15",
          "sm:max-h-[85vh] sm:shadow-2xl sm:shadow-black/20",
          "animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 shrink-0 sm:hidden">
          <div className="w-9 h-1 rounded-full bg-foreground/15" />
        </div>

        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/8 shrink-0">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: slotInfo.color }}
            />
            <div>
              <h3 className="text-sm font-semibold text-foreground/80">
                {isAddMode
                  ? t("mealPlanner.choosePlate")
                  : t("mealPlanner.swapFor")}
              </h3>
              <p className="text-[11px] text-foreground/40 mt-0.5">
                {t(slotInfo.labelKey)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center border border-foreground/10 text-foreground/40 hover:text-foreground/70 hover:border-foreground/25 hover:bg-foreground/[0.03] transition-all cursor-pointer"
            aria-label={t("common.close") ?? "Close"}
          >
            <MdClose className="size-4.5" />
          </button>
        </div>

        {/* current meal preview (swap mode only) */}
        {!isAddMode && modal.meal && (
          <div className="px-5 py-3.5 border-b border-foreground/8 shrink-0 flex items-center gap-3.5 bg-foreground/[0.02]">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
              <Image
                src={modal.meal.image}
                alt={modal.meal.name[lang]}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-foreground/35 uppercase tracking-widest mb-0.5">
                {t("mealPlanner.replacing")}
              </p>
              <p className="text-[13px] font-semibold text-foreground/65 truncate">
                {modal.meal.name[lang]}
              </p>
            </div>
          </div>
        )}

        {/* filters */}
        <div className="flex gap-2 px-5 py-3.5 border-b border-foreground/8 overflow-x-auto scrollbar-none shrink-0">
          <MdTune className="size-4 text-foreground/30 shrink-0 self-center" />
          {FILTER_KEYS.map((fk) => (
            <button
              key={fk}
              onClick={() => onFilterChange(fk)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer",
                filter === fk
                  ? "bg-primary text-primary-foreground border border-primary-foreground/10"
                  : "border border-foreground/10 text-foreground/45 hover:border-foreground/20 hover:text-foreground/65",
              )}
            >
              {t(FILTER_LABEL_KEYS[fk])}
            </button>
          ))}
        </div>

        {/* grid */}
        <div
          className="flex-1 overflow-y-auto scrollbar-none px-5 py-4"
          onWheel={(e) => e.stopPropagation()}
        >
          {opts.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-foreground/30">
              {t("mealPlanner.noResults")}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {opts.map((opt) => {
                const isSel = selectedSwap === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onSelectSwap(opt.id)}
                    className={cn(
                      "text-start rounded-xl border overflow-hidden transition-all duration-150 cursor-pointer flex flex-col",
                      isSel
                        ? "border-primary/50 ring-1 ring-primary/20 bg-primary/[0.04]"
                        : "border-foreground/8 hover:border-foreground/20 dark:bg-primary-foreground/10",
                    )}
                  >
                    <div className="relative w-full aspect-video overflow-hidden bg-foreground/5">
                      <Image
                        src={opt.image}
                        alt={opt.name[lang]}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                      {isSel && (
                        <div className="absolute top-1.5 inset-e-1.5 size-5 rounded-full bg-primary flex items-center justify-center">
                          <FaCheck className="size-2.5 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 flex flex-col gap-1 flex-1">
                      <p className="text-[12px] font-semibold text-foreground/75 line-clamp-2 leading-snug">
                        {opt.name[lang]}
                      </p>
                      {!opt.customMacros ? (
                        <div className="flex gap-2 flex-wrap mt-auto">
                          <span className="text-[10px]  text-foreground/35">
                            {opt.protein}g P
                          </span>
                          <span className="text-[10px]  text-foreground/35">
                            {opt.carbs}g C
                          </span>
                          <span className="text-[10px]  text-foreground/45 font-semibold">
                            {opt.calories} {t("menu.kcal")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-foreground/35">
                          {t("menu.customizableMacros")}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="px-5 py-4 border-t border-foreground/8 shrink-0">
          <button
            onClick={onConfirm}
            disabled={!selectedSwap}
            className={cn(
              "w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-150",
              selectedSwap
                ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                : "bg-foreground/5 text-foreground/25 cursor-not-allowed",
            )}
          >
            {isAddMode
              ? t("mealPlanner.confirmAdd")
              : t("mealPlanner.confirmSwap")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MenuMealPlanner() {
  const { lang, t, isRTL } = useLang();

  const DAYS = buildDateRange();
  const todayIdx = DAYS.findIndex((d) => isToday(d));

  const [activeDayIdx, setActiveDayIdx] = useState<number>(todayIdx);
  const [meals, setMeals] = useState<MealsMap>(() => buildInitialMeals(DAYS));
  const [modal, setModal] = useState<ModalState | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedSwap, setSelectedSwap] = useState<string | null>(null);

  const stripRef = useRef<HTMLDivElement>(null);
  const didDrag = useDraggableScroll(stripRef);

  // Scroll active day into view on mount and on change
  useEffect(() => {
    if (!stripRef.current) return;
    const btn = stripRef.current.querySelector<HTMLButtonElement>(
      `[data-day-idx="${activeDayIdx}"]`,
    );
    btn?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeDayIdx]);

  const activeDay = DAYS[activeDayIdx];
  const activeDateKey = toDateKey(activeDay);
  const dayMeals: DayMeals = meals[activeDateKey] ?? {
    breakfast: null,
    lunch: null,
    dinner: null,
    snacks: null,
  };

  const allDayMeals = Object.values(dayMeals).filter(
    (m): m is FoodItem => m !== null,
  );
  const dailyKcal = allDayMeals.reduce((s, m) => s + (m.calories ?? 0), 0);
  const dailyProtein = allDayMeals.reduce((s, m) => s + (m.protein ?? 0), 0);
  const dailyCarbs = allDayMeals.reduce((s, m) => s + (m.carbs ?? 0), 0);

  function openModal(slot: SlotKey, meal: FoodItem | null) {
    setModal({ slot, meal });
    setFilter("all");
    setSelectedSwap(null);
  }

  function closeModal() {
    setModal(null);
    setSelectedSwap(null);
  }

  const handleConfirm = useCallback(() => {
    if (!selectedSwap || !modal) return;
    const opts = getSwapOptions(modal.meal?.id ?? null, filter);
    const chosen = opts.find((o) => o.id === selectedSwap);
    if (!chosen) return;

    setMeals((prev) => ({
      ...prev,
      [activeDateKey]: {
        ...prev[activeDateKey],
        [modal.slot]: chosen,
      },
    }));
    closeModal();
  }, [selectedSwap, modal, filter, activeDateKey]);

  function getDayLabel(d: Date): string {
    const keys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return t(`mealPlanner.days.${keys[d.getDay()]}`);
  }

  function getMonthLabel(d: Date): string {
    const keys = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    return (
      t(`mealPlanner.months.${keys[d.getMonth()]}`) ||
      d.toLocaleString("default", { month: "short" })
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative max-w-2xl mx-auto  sm:px-6 py-6">
        {/* ── Day strip (draggable) ── */}
        <div
          ref={stripRef}
          className="flex gap-2 overflow-x-auto scrollbar-none pb-4 mb-2 select-none"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {DAYS.map((d, i) => {
            const today = isToday(d);
            const active = i === activeDayIdx;
            return (
              <button
                key={i}
                data-day-idx={i}
                onMouseUp={() => {
                  if (!didDrag.current) setActiveDayIdx(i);
                }}
                onTouchEnd={() => {
                  if (!didDrag.current) setActiveDayIdx(i);
                }}
                className={cn(
                  "shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer min-w-[52px]",
                  active
                    ? "bg-primary border-primary text-primary-foreground"
                    : today
                      ? "border-primary/30 bg-primary/[0.04] text-primary dark:text-primary/80"
                      : "border-foreground/8 text-foreground/35 hover:text-foreground/60 hover:border-foreground/18",
                )}
              >
                <span className="text-[9px] font-bold uppercase tracking-widest leading-none pointer-events-none">
                  {getDayLabel(d)}
                </span>
                <span className="text-base font-bold  mt-1 leading-none pointer-events-none">
                  {d.getDate()}
                </span>
                {today && !active && (
                  <span className="w-1 h-1 rounded-full bg-primary mt-1 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Day header ── */}
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground/80">
              {getDayLabel(activeDay)},{" "}
              <span className="">{activeDay.getDate()}</span>{" "}
              {getMonthLabel(activeDay)}{" "}
              <span className="text-foreground/30 font-normal text-lg">
                {activeDay.getFullYear()}
              </span>
            </h2>
            {isToday(activeDay) && (
              <p className="text-xs text-primary mt-0.5 font-semibold uppercase tracking-widest">
                {t("mealPlanner.today")}
              </p>
            )}
          </div>

          {/* daily stats */}
          <div className="flex gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-foreground/8 text-[11px] text-foreground/50 bg-foreground/[0.01]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <strong className="text-foreground/70 font-semibold">
                {dailyKcal}
              </strong>{" "}
              {t("menu.kcal")}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-foreground/8 text-[11px] text-foreground/50 bg-foreground/[0.01]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <strong className="text-foreground/70 font-semibold">
                {dailyProtein}g
              </strong>{" "}
              {t("menu.protein")}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-foreground/8 text-[11px] text-foreground/50 bg-foreground/[0.01]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <strong className="text-foreground/70 font-semibold">
                {dailyCarbs}g
              </strong>{" "}
              {t("menu.carbs")}
            </span>
          </div>
        </div>

        {/* ── Slots — single column ── */}
        <div className="flex flex-col gap-3">
          {SLOTS.map((slot) => (
            <SlotCard
              key={slot.key}
              slot={slot}
              meal={dayMeals[slot.key]}
              lang={lang}
              isRTL={isRTL}
              onSwap={() => openModal(slot.key, dayMeals[slot.key])}
              onAdd={() => openModal(slot.key, null)}
              t={t}
            />
          ))}
        </div>
      </div>

      {/* ── Swap / Add Modal ── */}
      {modal && (
        <SwapModal
          modal={modal}
          lang={lang}
          filter={filter}
          selectedSwap={selectedSwap}
          onFilterChange={(f) => {
            setFilter(f);
            setSelectedSwap(null);
          }}
          onSelectSwap={(id) =>
            setSelectedSwap((prev) => (prev === id ? null : id))
          }
          onConfirm={handleConfirm}
          onClose={closeModal}
          t={t}
          isRTL={isRTL}
        />
      )}
    </div>
  );
}
