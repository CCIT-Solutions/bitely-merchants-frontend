"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MdSwapHoriz, MdAdd, MdClose, MdTune } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { FOOD_ITEMS } from "@/data/menu";
import { FoodItem } from "@/types/menu";
import { useLang } from "@/hooks/useLang";
import { TFunction } from "i18next";
import { Language } from "@/types/shared";

// ─── Types ────────────────────────────────────────────────────────────────────

type SlotKey = "breakfast" | "lunch" | "dinner" | "snacks";

interface SlotConfig {
  key: SlotKey;
  tw: {
    text: string;
    bg: string;
    border: string;
    ring: string;
    badge: string;
    badgeText: string;
    dot: string;
    btn: string;
    btnHover: string;
  };
}

interface DayMeals {
  breakfast: FoodItem | null;
  lunch: FoodItem | null;
  dinner: FoodItem | null;
  snacks: FoodItem | null;
}

interface MealsMap {
  [dateKey: string]: DayMeals;
}

interface ModalState {
  dateKey: string;
  slotKey: SlotKey;
  currentMeal: FoodItem | null;
}

type FilterKey = "all" | "high-protein" | "low-cal" | "vegetarian";

// ─── Constants ────────────────────────────────────────────────────────────────

const SLOTS: SlotConfig[] = [
  {
    key: "breakfast",
    tw: {
      text: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      ring: "ring-amber-300",
      badge: "bg-amber-100",
      badgeText: "text-amber-700",
      dot: "bg-amber-400",
      btn: "border-amber-400 text-amber-600",
      btnHover: "hover:bg-amber-50",
    },
  },
  {
    key: "lunch",
    tw: {
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      ring: "ring-emerald-300",
      badge: "bg-emerald-100",
      badgeText: "text-emerald-700",
      dot: "bg-emerald-400",
      btn: "border-emerald-400 text-emerald-600",
      btnHover: "hover:bg-emerald-50",
    },
  },
  {
    key: "dinner",
    tw: {
      text: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      ring: "ring-indigo-300",
      badge: "bg-indigo-100",
      badgeText: "text-indigo-700",
      dot: "bg-indigo-400",
      btn: "border-indigo-400 text-indigo-600",
      btnHover: "hover:bg-indigo-50",
    },
  },
  {
    key: "snacks",
    tw: {
      text: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      ring: "ring-rose-300",
      badge: "bg-rose-100",
      badgeText: "text-rose-700",
      dot: "bg-rose-400",
      btn: "border-rose-400 text-rose-600",
      btnHover: "hover:bg-rose-50",
    },
  },
];

const FILTER_KEYS: FilterKey[] = ["all", "high-protein", "low-cal", "vegetarian"];

const DAYS_SHORT_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
const DAYS_FULL_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;
const MONTHS_KEYS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildDateRange(): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: 23 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i - 7);
    return d;
  });
}

function toKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

function isToday(d: Date): boolean {
  const n = new Date();
  return (
    d.getDate() === n.getDate() &&
    d.getMonth() === n.getMonth() &&
    d.getFullYear() === n.getFullYear()
  );
}

function buildInitialMeals(days: Date[]): MealsMap {
  const bf = FOOD_ITEMS.filter((f) => f.category === "breakfast");
  const lu = FOOD_ITEMS.filter((f) => f.category === "lunch");
  const di = FOOD_ITEMS.filter((f) => f.category === "dinner");
  const sn = FOOD_ITEMS.filter((f) => f.category === "snacks");

  const map: MealsMap = {};
  days.forEach((d, i) => {
    map[toKey(d)] = {
      breakfast: bf.length ? bf[i % bf.length] : null,
      lunch: i % 5 === 3 ? null : lu.length ? lu[i % lu.length] : null,
      dinner: i % 5 === 1 ? null : di.length ? di[i % di.length] : null,
      snacks: sn.length ? sn[i % sn.length] : null,
    };
  });
  return map;
}

function getFilteredOptions(
  currentId: string | null,
  filter: FilterKey,
): FoodItem[] {
  return FOOD_ITEMS.filter((m) => {
    if (m.id === currentId) return false;
    if (filter === "high-protein") return (m.protein ?? 0) >= 30;
    if (filter === "low-cal") return (m.calories ?? 0) < 400;
    if (filter === "vegetarian") return m.dietType === "vegetarian";
    return true;
  });
}

function getVisibleRange(
  activeDayIdx: number,
  total: number,
): [number, number] {
  const start = Math.max(0, Math.min(activeDayIdx - 3, total - 7));
  const end = Math.min(start + 7, total);
  return [start, end];
}

// ─── useDraggableScroll ───────────────────────────────────────────────────────

function useDraggableScroll(ref: React.RefObject<HTMLDivElement | null>) {
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollL = useRef(0);
  const didDrag = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onDown = (e: MouseEvent) => {
      dragging.current = true;
      didDrag.current = false;
      startX.current = e.pageX - el.offsetLeft;
      scrollL.current = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      const walk = (e.pageX - el.offsetLeft - startX.current) * 1.2;
      if (Math.abs(walk) > 4) didDrag.current = true;
      el.scrollLeft = scrollL.current - walk;
    };
    const onUp = () => {
      dragging.current = false;
      el.style.cursor = "grab";
    };

    el.style.cursor = "grab";
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [ref]);

  return didDrag;
}

// ─── SlotCard ─────────────────────────────────────────────────────────────────

interface SlotCardProps {
  slot: SlotConfig;
  meal: FoodItem | null;
  onSwap: () => void;
  onAdd: () => void;
  onRemove: () => void;
  t: TFunction<"translation", undefined>;
}

function SlotCard({ slot, meal, onSwap, onAdd, onRemove, t }: SlotCardProps) {
  const tw = slot.tw;

  return (
    <div className={cn("rounded-2xl border overflow-hidden bg-background")}>
      {/* header */}
      <div className={cn("flex items-center gap-2.5 px-4 py-2.5 border-b")}>
        <div className="size-10 relative">
          <Image
            src={`/media/images/diet/${slot.key}.png`}
            alt={t(`myPlan.slots.${slot.key}.label`)}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest leading-none text-primary-foreground">
            {t(`myPlan.slots.${slot.key}.label`)}
          </p>
          <p className="text-[9px] mt-0.5 opacity-60">
            {t(`myPlan.slots.${slot.key}.time`)}
          </p>
        </div>
        {meal && (
          <div className="flex gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] text-foreground/50 bg-foreground/1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <strong className="text-foreground/70 font-semibold">
                {meal.calories}
              </strong>{" "}
              {t("menu.kcal")}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] text-foreground/50 bg-foreground/1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <strong className="text-foreground/70 font-semibold">
                {meal.protein}g
              </strong>{" "}
              {t("menu.protein")}
            </span>
          </div>
        )}
      </div>

      {/* body */}
      <div className="p-3">
        {meal ? (
          <div className="flex gap-3 items-center">
            <div className="relative size-16 rounded-xl overflow-hidden shrink-0">
              <Image
                src={meal.image}
                alt={meal.name.en}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-foreground/80 truncate mb-1">
                {meal.name.en}
              </p>
              <div className="flex gap-4 flex-wrap mb-2">
                <span className="flex items-center gap-1.5 rounded-md text-[11px] text-foreground/50 bg-foreground/1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <strong className="text-foreground/70 font-semibold">
                    {meal.calories}
                  </strong>{" "}
                  {t("menu.kcal")}
                </span>
                <span className="flex items-center gap-1.5 rounded-md text-[11px] text-foreground/50 bg-foreground/1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <strong className="text-foreground/70 font-semibold">
                    {meal.protein}g
                  </strong>{" "}
                  {t("menu.protein")}
                </span>
                <span className="flex items-center gap-1.5 rounded-md text-[11px] text-foreground/50 bg-foreground/1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <strong className="text-foreground/70 font-semibold">
                    {meal.carbs}g
                  </strong>{" "}
                  {t("menu.carbs")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onSwap}
                  className={cn(
                    "border-green-200 text-green-500 hover:bg-green-50 flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer",
                  )}
                >
                  <MdSwapHoriz className="size-3.5" /> {t("myPlan.actions.swap")}
                </button>
                <button
                  onClick={onRemove}
                  className="border-rose-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer"
                >
                  <MdClose className="size-3.5" /> {t("myPlan.actions.remove")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onAdd}
            className={cn(
              "w-full flex items-center justify-center gap-1.5 py-6 rounded-xl border-2 border-dashed transition-all cursor-pointer group h-full text-foreground/70",
            )}
          >
            <MdAdd className={cn("size-5")} />
            <span className={cn("text-[10px] font-black uppercase tracking-widest")}>
              {t("myPlan.actions.addSlot", { slot: t(`myPlan.slots.${slot.key}.label`) })}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── CalendarCell ─────────────────────────────────────────────────────────────

interface CalendarCellProps {
  meal: FoodItem | null;
  slot: SlotConfig;
  isActiveCol: boolean;
  onAdd: () => void;
  onSwap: () => void;
  lang: Language;
  t: TFunction<"translation", undefined>;
}

function CalendarCell({
  meal,
  slot,
  isActiveCol,
  onAdd,
  onSwap,
  lang,
  t,
}: CalendarCellProps) {
  const tw = slot.tw;

  if (!meal) {
    return (
      <button
        onClick={onAdd}
        className={cn(
          "w-full min-h-22 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1",
          "transition-all cursor-pointer group",
          isActiveCol
            ? cn(tw.border, tw.bg)
            : "border-foreground/10 bg-foreground/1 hover:border-foreground/20 hover:bg-foreground/3",
        )}
      >
        <span
          className={cn(
            "text-sm font-black leading-none",
            isActiveCol ? tw.text : "text-foreground/20",
          )}
        >
          +
        </span>
        <span
          className={cn(
            "text-[8px] font-bold uppercase tracking-widest",
            isActiveCol ? tw.text : "text-foreground/20",
          )}
        >
          {t("myPlan.actions.add")}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onSwap}
      className={cn(
        "w-full min-h-22 rounded-xl border overflow-hidden transition-all cursor-pointer text-start group flex flex-col",
        isActiveCol
          ? cn("border", tw.border, tw.bg)
          : "bg-background hover:border-foreground/20",
      )}
    >
      <div className="relative w-full h-13 overflow-hidden">
        <Image
          src={meal.image}
          alt={meal.name[lang]}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="150px"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-1">
          <span className="text-[8px] text-background font-black uppercase tracking-wider bg-card-foreground/40 px-1.5 py-0.5 rounded">
            {t("myPlan.actions.swap")}
          </span>
        </div>
      </div>
      <div className="px-1.5 py-1">
        <p className="text-[10px] font-bold text-foreground/80 leading-snug line-clamp-1">
          {meal.name[lang]}
        </p>
        <div className="flex gap-1.5 mt-0.5">
          <div className="text-[9px] text-foreground/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            {meal.calories}
          </div>
          <div className="text-[9px] text-foreground/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />{" "}
            {meal.protein}g
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── MealModal ────────────────────────────────────────────────────────────────

interface MealModalProps {
  modal: ModalState;
  onConfirm: (meal: FoodItem) => void;
  onClose: () => void;
  t: TFunction<"translation", undefined>;
}

function MealModal({ modal, onConfirm, onClose, t }: MealModalProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const slot = SLOTS.find((s) => s.key === modal.slotKey)!;
  const isAdd = !modal.currentMeal;
  const options = getFilteredOptions(
    modal.currentMeal?.id ?? null,
    filter,
  ).filter((m) => m.name.en.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleConfirm = () => {
    const chosen = options.find((o) => o.id === selected);
    if (chosen) onConfirm(chosen);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "bg-background flex flex-col w-full max-w-lg",
          "rounded-t-2xl border-t border-x border-foreground/10 max-h-[85vh]",
          "sm:rounded-2xl sm:border sm:shadow-2xl sm:shadow-black/20",
          "animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200",
        )}
      >
        {/* drag handle – mobile */}
        <div className="flex justify-center pt-3 pb-1 shrink-0 sm:hidden">
          <div className="w-9 h-1 rounded-full bg-foreground/15" />
        </div>

        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "size-9 rounded-xl flex items-center justify-center text-lg",
                slot.tw.bg,
              )}
            >
              {/* emoji removed from SlotConfig – keep for visual flair via img */}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground/80">
                {isAdd ? t("myPlan.modal.titleAdd") : t("myPlan.modal.titleSwap")}
              </h3>
              <p className="text-[11px] text-foreground/40 mt-0.5">
                {t(`myPlan.slots.${slot.key}.label`)} · {t(`myPlan.slots.${slot.key}.time`)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t("myPlan.modal.close")}
            className="size-8 rounded-full flex items-center justify-center border border-foreground/10 text-foreground/40 hover:text-foreground/70 hover:border-foreground/25 transition-all cursor-pointer"
          >
            <MdClose className="size-4" />
          </button>
        </div>

        {/* current meal preview – swap mode */}
        {modal.currentMeal && (
          <div className="px-5 py-3 border-b shrink-0 flex items-center gap-3 bg-foreground/[0.02]">
            <div className="relative size-11 rounded-xl overflow-hidden shrink-0">
              <Image
                src={modal.currentMeal.image}
                alt={modal.currentMeal.name.en}
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-foreground/35 uppercase tracking-widest mb-0.5">
                {t("myPlan.modal.replacing")}
              </p>
              <p className="text-[13px] font-semibold text-foreground/65 truncate">
                {modal.currentMeal.name.en}
              </p>
            </div>
          </div>
        )}

        {/* search */}
        <div className="px-5 pt-3.5 pb-2 shrink-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30 text-sm pointer-events-none">
              🔍
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("myPlan.modal.searchPlaceholder")}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-foreground/10 bg-foreground/[0.02] text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* filter chips */}
        <div className="flex gap-2 px-5 pb-3.5 overflow-x-auto scrollbar-none shrink-0">
          <MdTune className="size-4 text-foreground/30 shrink-0 self-center" />
          {FILTER_KEYS.map((fk) => (
            <button
              key={fk}
              onClick={() => {
                setFilter(fk);
                setSelected(null);
              }}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border",
                filter === fk
                  ? cn("text-white border-transparent", slot.tw.dot)
                  : "border-foreground/10 text-foreground/45 hover:border-foreground/20",
              )}
            >
              {t(`myPlan.filters.${fk}`)}
            </button>
          ))}
        </div>

        {/* border */}
        <div className="border-t shrink-0" />

        {/* grid */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {options.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-foreground/30 gap-2">
              <span className="text-3xl">🍽️</span>
              <p className="text-sm">{t("myPlan.modal.noDishes")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {options.map((opt) => {
                const isSel = selected === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() =>
                      setSelected((p) => (p === opt.id ? null : opt.id))
                    }
                    className={cn(
                      "rounded-xl border overflow-hidden text-start transition-all duration-150 cursor-pointer flex flex-col",
                      isSel
                        ? cn("border-2 ring-1", slot.tw.border, slot.tw.ring, slot.tw.bg)
                        : "border bg-white hover:border-foreground/20",
                    )}
                  >
                    <div className="relative w-full aspect-video bg-foreground/5">
                      <Image
                        src={opt.image}
                        alt={opt.name.en}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="180px"
                        loading="lazy"
                      />
                      {isSel && (
                        <div
                          className={cn(
                            "absolute top-1.5 right-1.5 size-5 rounded-full flex items-center justify-center",
                            slot.tw.dot,
                          )}
                        >
                          <FaCheck className="size-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 flex flex-col gap-1 flex-1">
                      <p className="text-[12px] font-bold text-foreground/75 line-clamp-2 leading-snug">
                        {opt.name.en}
                      </p>
                      <div className="flex gap-2 flex-wrap mt-auto">
                        <span className="text-[10px] text-foreground/35">
                          {opt.protein}g {t("myPlan.nutrients.proteinShort")}
                        </span>
                        <span className="text-[10px] text-foreground/35">
                          {opt.carbs}g {t("myPlan.nutrients.carbsShort")}
                        </span>
                        <span className="text-[10px] text-foreground/45 font-semibold">
                          {opt.calories} {t("menu.kcal")}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="px-5 py-4 border-t shrink-0">
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={cn(
              "w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-150",
              selected
                ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                : "bg-foreground/5 text-foreground/25 cursor-not-allowed",
            )}
          >
            {isAdd ? t("myPlan.modal.confirmAdd") : t("myPlan.modal.confirmSwap")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MenuMealPlanner() {
  const { t, lang } = useLang();

  const DAYS = buildDateRange();
  const todayIdx = DAYS.findIndex(isToday);

  const [activeDayIdx, setActiveDayIdx] = useState<number>(
    todayIdx >= 0 ? todayIdx : 7,
  );
  const [meals, setMeals] = useState<MealsMap>(() => buildInitialMeals(DAYS));
  const [modal, setModal] = useState<ModalState | null>(null);

  const stripRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);
  const didDrag = useDraggableScroll(stripRef);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    el.querySelector<HTMLButtonElement>(
      `[data-idx="${activeDayIdx}"]`,
    )?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeDayIdx]);

  useEffect(() => {
    const el = calRef.current;
    if (!el) return;
    el.querySelector<HTMLElement>(
      `[data-col="${activeDayIdx}"]`,
    )?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeDayIdx]);

  const activeDay = DAYS[activeDayIdx];
  const activeDateKey = toKey(activeDay);
  const dayMeals: DayMeals = meals[activeDateKey] ?? {
    breakfast: null,
    lunch: null,
    dinner: null,
    snacks: null,
  };

  const activeMeals = Object.values(dayMeals).filter(
    (m): m is FoodItem => m !== null,
  );
  const totalKcal = activeMeals.reduce((s, m) => s + (m.calories ?? 0), 0);
  const totalProtein = activeMeals.reduce((s, m) => s + (m.protein ?? 0), 0);
  const totalCarbs = activeMeals.reduce((s, m) => s + (m.carbs ?? 0), 0);
  const filledCount = activeMeals.length;

  function openModal(dateKey: string, slotKey: SlotKey, currentMeal: FoodItem | null) {
    setModal({ dateKey, slotKey, currentMeal });
  }
  function closeModal() {
    setModal(null);
  }

  const handleConfirm = useCallback(
    (chosen: FoodItem) => {
      if (!modal) return;
      setMeals((prev) => ({
        ...prev,
        [modal.dateKey]: { ...prev[modal.dateKey], [modal.slotKey]: chosen },
      }));
      closeModal();
    },
    [modal],
  );

  function removeMeal(dateKey: string, slotKey: SlotKey) {
    setMeals((prev) => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], [slotKey]: null },
    }));
  }

  const [visStart, visEnd] = getVisibleRange(activeDayIdx, DAYS.length);
  const visibleDays = DAYS.slice(visStart, visEnd);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto sm:px-6 py-5 space-y-6">

        {/* ── Day strip ── */}
        <section>
          <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
            <div>
              <h2 className="text-xl font-black text-foreground/85">
                {t(`myPlan.days.full.${DAYS_FULL_KEYS[activeDay.getDay()]}`)},{" "}
                <span>{activeDay.getDate()}</span>{" "}
                {t(`myPlan.months.${MONTHS_KEYS[activeDay.getMonth()]}`)}{" "}
                <span className="text-foreground/30 font-normal text-lg">
                  {activeDay.getFullYear()}
                </span>
              </h2>
              {isToday(activeDay) && (
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">
                  {t("myPlan.today")}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] text-foreground/50 bg-foreground/1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <strong className="text-foreground/70 font-semibold">{totalKcal}</strong>{" "}
                {t("menu.kcal")}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] text-foreground/50 bg-foreground/1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <strong className="text-foreground/70 font-semibold">{totalProtein}g</strong>{" "}
                {t("menu.protein")}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] text-foreground/50 bg-foreground/1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <strong className="text-foreground/70 font-semibold">{totalCarbs}g</strong>{" "}
                {t("menu.carbs")}
              </span>
            </div>
          </div>

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
                  onMouseUp={() => { if (!didDrag.current) setActiveDayIdx(i); }}
                  onTouchEnd={() => { if (!didDrag.current) setActiveDayIdx(i); }}
                  className={cn(
                    "shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer min-w-[52px]",
                    active
                      ? "bg-primary border-primary text-primary-foreground"
                      : today
                        ? "border-primary/30 bg-primary/4 text-primary dark:text-primary/80"
                        : "text-foreground/35 hover:text-foreground/60 hover:border-foreground/18",
                  )}
                >
                  <span className="text-[9px] font-bold uppercase tracking-widest leading-none pointer-events-none">
                    {t(`myPlan.days.short.${DAYS_SHORT_KEYS[d.getDay()]}`)}
                  </span>
                  <span className="text-base font-bold mt-1 leading-none pointer-events-none">
                    {d.getDate()}
                  </span>
                  {today && !active && (
                    <span className="w-1 h-1 rounded-full bg-primary mt-1 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── 4 Slot cards ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SLOTS.map((slot) => (
            <SlotCard
              key={slot.key}
              slot={slot}
              meal={dayMeals[slot.key]}
              onSwap={() => openModal(activeDateKey, slot.key, dayMeals[slot.key])}
              onAdd={() => openModal(activeDateKey, slot.key, null)}
              onRemove={() => removeMeal(activeDateKey, slot.key)}
              t={t}
            />
          ))}
        </section>

        {/* ── Weekly Calendar ── */}
        <section className="bg-background rounded-2xl border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div>
              <h3 className="text-base font-black text-foreground/85">
                {t("myPlan.weeklyOverview.title")}
              </h3>
              <p className="text-[11px] text-foreground/40 mt-0.5">
                {t("myPlan.weeklyOverview.hint")}
              </p>
            </div>
            <div className="hidden sm:flex gap-3 flex-wrap">
              {SLOTS.map((s) => (
                <div key={s.key} className="flex items-center gap-1.5">
                  <div className={cn("size-2 rounded-full", s.tw.dot)} />
                  <span className="text-[10px] text-foreground/40 font-semibold">
                    {t(`myPlan.slots.${s.key}.label`)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={calRef}
            className="overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="min-w-[640px]">
              {/* day header row */}
              <div className="grid grid-cols-[80px_repeat(7,90px)] sm:grid-cols-[80px_repeat(7,1fr)] bg-foreground/1.5 border-b">
                <div className="px-3 py-2.5 flex items-center text-[9px] font-black uppercase tracking-widest text-foreground/30">
                  {t("myPlan.weeklyOverview.mealLabel")}
                </div>
                {visibleDays.map((d, i) => {
                  const gIdx = visStart + i;
                  const active = gIdx === activeDayIdx;
                  const today = isToday(d);
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex flex-col items-center py-2.5 px-1 border-l border-foreground/6",
                        today ? "bg-primary/10" : active ? "bg-foreground/5" : "",
                      )}
                    >
                      <button
                        onClick={() => setActiveDayIdx(gIdx)}
                        className="w-full flex flex-col items-center"
                      >
                        <span
                          className={cn(
                            "text-[8px] font-black uppercase tracking-widest",
                            active
                              ? "text-primary-foreground"
                              : today
                                ? "text-green-600"
                                : "text-foreground/35",
                          )}
                        >
                          {t(`myPlan.days.short.${DAYS_SHORT_KEYS[d.getDay()]}`)}
                        </span>
                        <span
                          className={cn(
                            "text-[15px] font-black leading-snug",
                            active
                              ? "text-primary-foreground"
                              : today
                                ? "text-green-600"
                                : "text-foreground/70",
                          )}
                        >
                          {d.getDate()}
                        </span>
                        <div className="flex gap-0.5 mt-1">
                          {SLOTS.map((s) => {
                            const hasMeal = (meals[toKey(d)] ?? {})[s.key];
                            if (!hasMeal) return null;
                            return (
                              <div
                                key={s.key}
                                className={cn("size-1.25 rounded-full", s.tw.dot)}
                              />
                            );
                          })}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* meal rows */}
              {SLOTS.map((slot) => (
                <div
                  key={slot.key}
                  className="grid grid-cols-[80px_repeat(7,90px)] sm:grid-cols-[80px_repeat(7,1fr)] border-b border-foreground/6 last:border-0"
                >
                  <div className="flex flex-col justify-center px-3 py-2 border-r border-foreground/6">
                    <div className="size-10 relative">
                      <Image
                        src={`/media/images/diet/${slot.key}.png`}
                        alt={t(`myPlan.slots.${slot.key}.label`)}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest mt-1 leading-none">
                      {t(`myPlan.slots.${slot.key}.label`)}
                    </span>
                    <span className="text-[8px] mt-0.5 opacity-60">
                      {t(`myPlan.slots.${slot.key}.time`)}
                    </span>
                  </div>

                  {visibleDays.map((d, i) => {
                    const gIdx = visStart + i;
                    const active = gIdx === activeDayIdx;
                    const meal = (meals[toKey(d)] ?? {})[slot.key] ?? null;
                    return (
                      <div
                        key={i}
                        className={cn(
                          "sm:p-1 p-1.5 border-l border-foreground/6 max-w-25",
                          active ? "bg-primary/2" : "",
                        )}
                      >
                        <CalendarCell
                          meal={meal}
                          slot={slot}
                          isActiveCol={active}
                          onAdd={() => openModal(toKey(d), slot.key, null)}
                          onSwap={() => openModal(toKey(d), slot.key, meal)}
                          lang={lang}
                          t={t}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* totals row */}
              <div className="grid grid-cols-[80px_repeat(7,90px)] sm:grid-cols-[80px_repeat(7,1fr)] bg-foreground/1.5 border-t">
                <div className="px-3 py-2 flex items-center text-[9px] font-black uppercase tracking-widest text-foreground/30">
                  {t("myPlan.weeklyOverview.totalLabel")}
                </div>
                {visibleDays.map((d, i) => {
                  const gIdx = visStart + i;
                  const active = gIdx === activeDayIdx;
                  const today = isToday(d);
                  const ms = Object.values(meals[toKey(d)] ?? {}).filter(
                    (m): m is FoodItem => m !== null,
                  );
                  const kcal = ms.reduce((s, m) => s + (m.calories ?? 0), 0);
                  const prot = ms.reduce((s, m) => s + (m.protein ?? 0), 0);
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex flex-col items-center justify-center py-2 px-1 border-l border-foreground/6",
                        today ? "bg-primary/10" : active ? "bg-foreground/5" : "",
                      )}
                    >
                      <span
                        className={cn(
                          "text-[11px] font-black flex items-center gap-1",
                          today ? "text-green-600" : "text-foreground/70",
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />{" "}
                        {kcal}
                        <span className="font-normal text-foreground/50"> {t("menu.kcal")}</span>
                      </span>
                      <span
                        className={cn(
                          "text-[11px] font-black flex items-center gap-1",
                          today ? "text-green-600" : "text-foreground/70",
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />{" "}
                        {prot}
                        <span className="font-normal text-foreground/50"> {t("myPlan.weeklyOverview.protLabel")}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Progress bar ── */}
        <section className="bg-background rounded-2xl border px-5 py-4 flex items-center gap-6 flex-wrap">
          <div className="flex-1 min-w-45">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] text-foreground/40 font-semibold">
                {t("myPlan.progress.label")}
              </p>
              <p className="text-[11px] font-black text-foreground/70">
                {t("myPlan.progress.count", { filled: filledCount, total: 4 })}
              </p>
            </div>
            <div className="h-2 rounded-full bg-foreground/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(filledCount / 4) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex gap-5 shrink-0">
            {[
              { labelKey: "myPlan.progress.calories", val: totalKcal, unit: t("menu.kcal"), cls: "bg-red-500" },
              { labelKey: "myPlan.progress.protein",  val: totalProtein, unit: "g", cls: "bg-green-500" },
              { labelKey: "myPlan.progress.carbs",    val: totalCarbs, unit: "g", cls: "bg-amber-500" },
            ].map((s) => (
              <div key={s.labelKey} className="text-[11px] font-black flex items-center gap-1">
                <span className={cn("w-1.5 h-1.5 rounded-full", s.cls)} />{" "}
                {s.val}{" "}
                <span className="font-normal text-foreground/50"> {s.unit}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <MealModal
          modal={modal}
          onConfirm={handleConfirm}
          onClose={closeModal}
          t={t}
        />
      )}
    </div>
  );
}