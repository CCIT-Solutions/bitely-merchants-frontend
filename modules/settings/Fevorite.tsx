"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useLang } from "@/hooks/useLang";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Heart,
  Salad,
  X,
  Trash2,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DIET_TABS, FOOD_ITEMS } from "@/data/menu";
import FoodCard from "@/components/menu/FoodCard";
import { Checkbox } from "@/components/ui/checkbox";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type SortKey = "recently_added" | "calories_asc" | "calories_desc" | "name";
type MacroKey = "protein" | "carbs" | "fat" | "calories";

type MacroFilter = {
  min?: number;
  max?: number;
};

type AdvancedFilters = {
  macros: Record<MacroKey, MacroFilter>;
  dietTypes: string[];
};

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const SORT_OPTIONS: { key: SortKey; labelKey: string }[] = [
  { key: "recently_added", labelKey: "menu.recentlyAdded" },
  { key: "calories_asc", labelKey: "menu.caloriesAsc" },
  { key: "calories_desc", labelKey: "menu.caloriesDesc" },
  { key: "name", labelKey: "menu.name" },
];

const PAGE_SIZE = 9;

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

const FavouritesPage = ({

}) => {
  const { t, lang } = useLang();
  const isRtl = lang === "ar";

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("recently_added");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    macros: { protein: {}, carbs: {}, fat: {}, calories: {} },
    dietTypes: [],
  });

 const getRandomFavouriteIds = () => {
    const allIds = FOOD_ITEMS.map((item) => item.id);
    const shuffledIds = [...allIds].sort(() => 0.5 - Math.random());
    const randomCount = Math.floor(Math.random() * 3) + 3; // Randomly select 3-5 items
    return shuffledIds.slice(0, randomCount);
  };

  // --- State for favourites (default: random IDs) ---
  const [favouriteIds, setFavouriteIds] = useState<string[]>(getRandomFavouriteIds());

  // --- Toggle favourite ---
  const onToggleFavourite = (id: string) => {
  setFavouriteIds((prev) =>
    prev.includes(id)
      ? prev.filter((itemId) => itemId !== id) // Remove if exists
      : [...prev, id] // Add if not exists
  );
};

const onClearAllFavourites = () => {
  setFavouriteIds([]);
};


  const handleMacroChange = (
    key: MacroKey,
    field: "min" | "max",
    value: number,
  ) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      macros: {
        ...prev.macros,
        [key]: { ...prev.macros[key], [field]: value },
      },
    }));
    setVisibleCount(PAGE_SIZE);
  };

  const handleDietTypeChange = (dietType: string, checked: boolean) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      dietTypes: checked
        ? [...prev.dietTypes, dietType]
        : prev.dietTypes.filter((dt) => dt !== dietType),
    }));
    setVisibleCount(PAGE_SIZE);
  };

  const resetFilters = () => {
    setAdvancedFilters({
      macros: { protein: {}, carbs: {}, fat: {}, calories: {} },
      dietTypes: [],
    });
    setVisibleCount(PAGE_SIZE);
  };

  const filtered = useMemo(() => {
     let list = FOOD_ITEMS.filter((item) => favouriteIds.includes(item.id));

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

    list = list.filter((item) =>
      Object.entries(advancedFilters.macros).every(([key, filter]) => {
        const itemValue = item[key as MacroKey] ?? 0;
        const min = filter.min ?? 0;
        const max = filter.max ?? Infinity;
        return itemValue >= min && itemValue <= max;
      }),
    );

    if (advancedFilters.dietTypes.length > 0) {
      list = list.filter((item) =>
        advancedFilters.dietTypes.includes(item.dietType ?? ""),
      );
    }

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
        break;
    }

    return list;
   }, [FOOD_ITEMS, favouriteIds, search, sortBy, lang, advancedFilters]);

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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary fill-primary" />
              {t("favourites.title")}
            </h1>
            <p className="text-sm text-foreground/50 mt-0.5">
              {t("favourites.subtitle", {
                count: favouriteIds.length,
              })}
            </p>
          </div>

          {/* Clear All */}
          {favouriteIds.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-foreground/50 hover:text-destructive gap-1.5 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {t("favourites.clearAll")}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("favourites.clearAllConfirmTitle")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("favourites.clearAllConfirmDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("shared.cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onClearAllFavourites}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t("favourites.clearAll")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Search + Filters — only shown when there are favourites */}
        {favouriteIds.length > 0 && (
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
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground">
                      {t("menu.macros")}
                    </h3>
                    {(
                      ["protein", "carbs", "fat", "calories"] as MacroKey[]
                    ).map((key) => (
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
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground">
                      {t("menu.dietTypes")}
                    </h3>
                    <div className="space-y-2 grid grid-cols-2 gap-4">
                      {DIET_TABS.filter((tab) => tab.id !== "all").map(
                        (diet) => (
                          <div
                            key={diet.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={`fav-${diet.id}`}
                              checked={advancedFilters.dietTypes.includes(
                                diet.id,
                              )}
                              onCheckedChange={(checked) =>
                                handleDietTypeChange(
                                  diet.id,
                                  checked as boolean,
                                )
                              }
                            />
                            <Label
                              htmlFor={`fav-${diet.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {lang === "ar" ? diet.label.ar : diet.label.en}
                            </Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

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
        )}

        {/* Sort Dropdown */}
        {favouriteIds.length > 0 && (
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
        )}

        {/* Grid */}
        {favouriteIds.length === 0 ? (
          /* Zero-state: no favourites at all */
          <EmptyFavourites t={t} />
        ) : visible.length > 0 ? (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {visible.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                isFavourite={favouriteIds.includes(item.id)}
                  onToggleFavourite={onToggleFavourite}
                />
              ))}
            </div>

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
          /* Zero-state: has favourites but search/filter returned nothing */
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
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Empty Favourites State
// ─────────────────────────────────────────────

const EmptyFavourites = ({ t }: { t: (key: string) => string }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
    {/* Decorative heart stack */}
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 rounded-full bg-primary/8 scale-125" />
      <div className="absolute inset-0 rounded-full bg-primary/5 scale-150" />
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center relative">
        <Heart className="w-9 h-9 text-foreground/20" />
      </div>
    </div>

    <div className="space-y-1.5 max-w-xs">
      <p className="font-semibold text-foreground/70 text-base">
        {t("favourites.emptyTitle")}
      </p>
      <p className="text-sm text-foreground/40 leading-relaxed">
        {t("favourites.emptySubtitle")}
      </p>
    </div>

    {/* Hint card */}
    <div className="flex items-center gap-3 bg-muted/50 border border-foreground/5 rounded-2xl px-5 py-3 text-sm text-foreground/50 max-w-xs">
      <Heart className="w-4 h-4 text-primary shrink-0" />
      <span>{t("favourites.emptyHint")}</span>
    </div>
  </div>
);

export default FavouritesPage;