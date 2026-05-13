"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useLang } from "@/hooks/useLang";
import { FoodItem } from "@/types/menu";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Heart,
  Plus,
  Salad,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { DIET_TABS, FOOD_ITEMS } from "@/data/menu";
import FoodCard from "@/components/menu/FoodCard";
import { Checkbox } from "@/components/ui/checkbox";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type Tab = "all" | "breakfast" | "lunch" | "dinner" | "snacks";
type SortKey = "recently_added" | "calories_asc" | "calories_desc" | "name";
type MacroKey = "protein" | "carbs" | "fat" | "calories";

type MacroFilter = {
  min?: number;
  max?: number;
};

type DietTypeFilter = string[];

type AdvancedFilters = {
  macros: Record<MacroKey, MacroFilter>;
  dietTypes: DietTypeFilter;
};

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const TABS: { key: Tab; labelKey: string }[] = [
  { key: "all", labelKey: "menu.allMeals" },
  { key: "breakfast", labelKey: "menu.breakfast" },
  { key: "lunch", labelKey: "menu.lunch" },
  { key: "dinner", labelKey: "menu.dinner" },
  { key: "snacks", labelKey: "menu.snacks" },
];

const SORT_OPTIONS: { key: SortKey; labelKey: string }[] = [
  { key: "recently_added", labelKey: "menu.recentlyAdded" },
  { key: "calories_asc", labelKey: "menu.caloriesAsc" },
  { key: "calories_desc", labelKey: "menu.caloriesDesc" },
  { key: "name", labelKey: "menu.name" },
];

const DIET_TYPES = [
  { id: "vegan", labelKey: "menu.vegan" },
  { id: "keto", labelKey: "menu.keto" },
  { id: "glutenFree", labelKey: "menu.glutenFree" },
  { id: "halal", labelKey: "menu.halal" },
];

const PAGE_SIZE = 9;

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

const MyMealsPage = () => {
  const { t, lang } = useLang();
  const isRtl = lang === "ar";

  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("recently_added");
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    macros: {
      protein: {},
      carbs: {},
      fat: {},
      calories: {},
    },
    dietTypes: [],
  });

  // Toggle favourite
  const toggleFavourite = (id: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Handle macro filter changes
  const handleMacroChange = (
    key: MacroKey,
    field: "min" | "max",
    value: number,
  ) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      macros: {
        ...prev.macros,
        [key]: {
          ...prev.macros[key],
          [field]: value,
        },
      },
    }));
    setVisibleCount(PAGE_SIZE);
  };

  // Handle diet type filter changes
  const handleDietTypeChange = (dietType: string, checked: boolean) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      dietTypes: checked
        ? [...prev.dietTypes, dietType]
        : prev.dietTypes.filter((dt) => dt !== dietType),
    }));
    setVisibleCount(PAGE_SIZE);
  };

  // Reset filters
  const resetFilters = () => {
    setAdvancedFilters({
      macros: {
        protein: {},
        carbs: {},
        fat: {},
        calories: {},
      },
      dietTypes: [],
    });
    setVisibleCount(PAGE_SIZE);
  };

  // Filtered and sorted list
  const filtered = useMemo(() => {
    let list = [...FOOD_ITEMS];

    // Tab filter
    if (activeTab !== "all") {
      list = list.filter((m) => m.category === activeTab);
    }

    // Search
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (m) =>
          m.name.en?.toLowerCase().includes(q) ||
          m.name.ar?.toLowerCase().includes(q) ||
          m.description?.en?.toLowerCase().includes(q) ||
          m.description?.ar?.toLowerCase().includes(q),
      );
    }

    // Macro filters
    list = list.filter((item) => {
      return Object.entries(advancedFilters.macros).every(([key, filter]) => {
        const itemValue = item[key as MacroKey] ?? 0;
        const min = filter.min ?? 0;
        const max = filter.max ?? Infinity;
        return itemValue >= min && itemValue <= max;
      });
    });

    // Diet type filter
    if (advancedFilters.dietTypes.length > 0) {
      list = list.filter((item) =>
        advancedFilters.dietTypes.includes(item.dietType ?? ""),
      );
    }

    // Sort
    switch (sortBy) {
      case "calories_asc":
        list.sort((a, b) => (a.calories ?? 0) - (b.calories ?? 0));
        break;
      case "calories_desc":
        list.sort((a, b) => (b.calories ?? 0) - (a.calories ?? 0));
        break;
      case "name":
        list.sort((a, b) =>
          (a.name[lang] ?? "").localeCompare(b.name[lang] ?? ""),
        );
        break;
      default:
        // recently_added — keep original order
        break;
    }

    return list;
  }, [FOOD_ITEMS, activeTab, search, sortBy, lang, advancedFilters]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const currentSortLabel = SORT_OPTIONS.find((o) => o.key === sortBy)?.labelKey;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-background text-foreground"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("menu.myMeals")}
          </h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            {t("menu.myMealsSubtitle")}
          </p>
        </div>

        {/* Search + Filters row */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder={t("menu.searchPlaceholder")}
              className="ps-9 rounded-xl border-foreground/10 bg-muted/40 focus-visible:ring-primary/30"
            />
          </div>

          {/* Advanced Filters Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="rounded-xl border-foreground/10 gap-2 shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">{t("menu.filters")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side={isRtl ? "left" : "right"}
              className="w-full sm:w-100 p-6"
            >
              <SheetHeader>
                <SheetTitle>{t("menu.advancedFilters")}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Macro Filters */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">
                    {t("menu.macros")}
                  </h3>
                  {(["protein", "carbs", "fat", "calories"] as MacroKey[]).map(
                    (key) => (
                      <div key={key} className="space-y-2">
                        <Label className="text-sm font-medium">
                          {t(`menu.${key}`)}
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder={t("menu.min")}
                            value={advancedFilters.macros[key].min ?? ""}
                            onChange={(e) =>
                              handleMacroChange(
                                key,
                                "min",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full rounded-lg border-foreground/10"
                          />
                          <Input
                            type="number"
                            placeholder={t("menu.max")}
                            value={advancedFilters.macros[key].max ?? ""}
                            onChange={(e) =>
                              handleMacroChange(
                                key,
                                "max",
                                parseFloat(e.target.value) || Infinity,
                              )
                            }
                            className="w-full rounded-lg border-foreground/10"
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>

                {/* Diet Type Filters (Updated) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">
                    {t("menu.dietTypes")}
                  </h3>
                  <div className="space-y-2 grid grid-cols-2 gap-4">
                    {DIET_TABS.filter((tab) => tab.id !== "all").map((diet) => (
                      <div key={diet.id} className="flex items-center gap-2">
                        <Checkbox
                          id={diet.id}
                          checked={advancedFilters.dietTypes.includes(diet.id)}
                          onCheckedChange={(checked) =>
                            handleDietTypeChange(diet.id, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={diet.id}
                          className="text-sm cursor-pointer"
                        >
                          {lang === "ar" ? diet.label.ar : diet.label.en}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reset Button */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="gap-1 text-foreground/60 hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                    {t("menu.resetFilters")}
                  </Button>
                  <SheetClose asChild>
                    <Button className="rounded-lg">
                      {t("menu.applyFilters")}
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
          {TABS.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setVisibleCount(PAGE_SIZE);
              }}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0",
                activeTab === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/50 hover:text-foreground hover:bg-muted",
              )}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-foreground/60 gap-1 hover:text-foreground"
              >
                {t("menu.sortBy")}:{" "}
                <span className="font-medium text-foreground">
                  {currentSortLabel ? t(currentSortLabel) : ""}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRtl ? "start" : "end"}>
              {SORT_OPTIONS.map(({ key, labelKey }) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => {
                    setSortBy(key);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={cn(
                    "text-sm cursor-pointer",
                    sortBy === key && "font-semibold text-primary",
                  )}
                >
                  {t(labelKey)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Grid */}
        {visible.length > 0 ? (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {visible.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  isFavourite={favourites.has(item.id)}
                  onToggleFavourite={toggleFavourite}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="rounded-full border-primary/40 text-primary hover:bg-primary/5 gap-2 px-8"
                >
                  {t("menu.loadMore")}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Salad className="w-8 h-8 text-foreground/30" />
            </div>
            <div>
              <p className="font-semibold text-foreground/70">
                {t("menu.noMealsFound")}
              </p>
              <p className="text-sm text-foreground/40 mt-1">
                {t("menu.noMealsFoundSubtitle")}
              </p>
            </div>
          </div>
        )}

        {/* Create Meal Banner */}
        <CreateMealBanner t={t} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Create Your Own Meal Banner
// ─────────────────────────────────────────────

const CreateMealBanner = ({ t }: { t: (key: string) => string }) => (
  <div className="relative rounded-3xl overflow-hidden bg-muted/50 border border-foreground/5 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
    <div className="absolute -top-8 -end-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
    <div className="absolute bottom-0 start-1/3 w-20 h-20 rounded-full bg-green-400/10 blur-xl pointer-events-none" />

    <div className="relative z-10 space-y-1">
      <h2 className="text-base font-bold text-foreground">
        {t("menu.createMealTitle")}
      </h2>
      <p className="text-sm text-foreground/50 max-w-xs">
        {t("menu.createMealSubtitle")}
      </p>
    </div>

    <div className="relative z-10 flex items-center gap-4">
      <div className="hidden sm:flex w-16 h-16 rounded-full bg-white shadow-md items-center justify-center text-2xl select-none">
        🥗
      </div>
      <Button className="rounded-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 shadow-sm">
        <Plus className="w-4 h-4" />
        {t("menu.createMeal")}
      </Button>
    </div>
  </div>
);

export default MyMealsPage;
