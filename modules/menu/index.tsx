"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/hooks/useLang";
import FoodCard from "@/components/menu/FoodCard";
import { FOOD_ITEMS, DIET_TABS } from "@/data/menu";
import { FoodItem } from "@/types/menu";
import {
  RiSearchLine,
  RiGridFill,
  RiListUnordered,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCheckLine,
  RiStarFill,
  RiHeartLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCloseLine,
} from "react-icons/ri";
import Container from "@/components/shared/Container";
import { motion } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/custom/dropdown-menu";
import { Badge } from "@/components/custom/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/custom/select";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function MenuPage() {
  const { t, lang, isRTL } = useLang();
  const [search, setSearch] = useState("");
  const [selectedDiet, setSelectedDiet] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCookingTime, setSelectedCookingTime] = useState<string>("all");
  const [selectedNutritionGoal, setSelectedNutritionGoal] =
    useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [visibleCount, setVisibleCount] = useState(8);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sidebar filter states
  const [showAllDiets, setShowAllDiets] = useState(false);
  const [sOpen, setSOpen] = useState({
    cat: true,
    diet: true,
    cook: true,
    nutr: true,
  });
  const toggleS = (k: keyof typeof sOpen) =>
    setSOpen((p) => ({ ...p, [k]: !p[k] }));

  // Filtered items
  const filteredItems = useMemo(() => {
    return FOOD_ITEMS.filter((item) => {
      const matchesSearch =
        search === "" ||
        item.name[lang].toLowerCase().includes(search.toLowerCase()) ||
        item.description?.[lang]?.toLowerCase().includes(search.toLowerCase());

      const matchesDiet =
        selectedDiet === "all" || item.dietType === selectedDiet;
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesCookingTime =
        selectedCookingTime === "all" ||
        (item.cookingTime && item.cookingTime <= parseInt(selectedCookingTime));
      const matchesNutritionGoal =
        selectedNutritionGoal === "all" ||
        (item.nutritionGoals &&
          item.nutritionGoals.includes(selectedNutritionGoal));

      return (
        matchesSearch &&
        matchesDiet &&
        matchesCategory &&
        matchesCookingTime &&
        matchesNutritionGoal
      );
    });
  }, [
    search,
    selectedDiet,
    selectedCategory,
    selectedCookingTime,
    selectedNutritionGoal,
    lang,
  ]);

  // --- Add clear filters function ---
  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedDiet("all");
    setSelectedCookingTime("all");
    setSelectedNutritionGoal("all");
    setSearch("");
  };

  // --- Add remove filter function ---
  const removeFilter = (
    filterType: "category" | "diet" | "cookingTime" | "nutritionGoal",
  ) => {
    switch (filterType) {
      case "category":
        setSelectedCategory("all");
        break;
      case "diet":
        setSelectedDiet("all");
        break;
      case "cookingTime":
        setSelectedCookingTime("all");
        break;
      case "nutritionGoal":
        setSelectedNutritionGoal("all");
        break;
    }
  };

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  // Categories (extracted from FOOD_ITEMS)
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    FOOD_ITEMS.forEach((item) => uniqueCategories.add(item.category));
    return ["all", ...Array.from(uniqueCategories)];
  }, []);

  const ArrowIcon = isRTL ? RiArrowLeftLine : RiArrowRightLine;

  const COOKING_TIME_OPTIONS = [
    { key: "menu.cookingTime.all", value: "all" },
    { key: "menu.cookingTime.under15", value: "15" },
    { key: "menu.cookingTime.15to30", value: "30" },
    { key: "menu.cookingTime.30to45", value: "45" },
    { key: "menu.cookingTime.45plus", value: "60" },
  ];

  const NUTRITION_GOAL_OPTIONS = [
    { key: "menu.nutritionGoals.all", value: "all" },
    { key: "menu.nutritionGoals.weightLoss", value: "weightLoss" },
    { key: "menu.nutritionGoals.muscleGain", value: "muscleGain" },
    { key: "menu.nutritionGoals.maintenance", value: "maintenance" },
    { key: "menu.nutritionGoals.heartHealthy", value: "heartHealthy" },
    { key: "menu.nutritionGoals.lowSugar", value: "lowSugar" },
  ];

  // Static config for sidebar
  const CATEGORIES = [
    { key: "menu.categories.all", value: "all" },
    { key: "menu.categories.breakfast", value: "breakfast" },
    { key: "menu.categories.lunch", value: "lunch" },
    { key: "menu.categories.dinner", value: "dinner" },
    { key: "menu.categories.snacks", value: "snacks" },
  ];

  const DIET_OPTIONS = [
    { key: "menu.dietary.high-protein", value: "high-protein" },
    { key: "menu.dietary.balanced", value: "balanced" },
    { key: "menu.dietary.vegetarian", value: "vegetarian" },
    { key: "menu.dietary.low-carb", value: "low-carb" },
    { key: "menu.dietary.custom-macros", value: "custom-macros" },
  ];

  const COOK_OPTIONS = [
    { key: "menu.cookingTime.under15", value: "under15" },
    { key: "menu.cookingTime.15to30", value: "15to30" },
    { key: "menu.cookingTime.30to45", value: "30to45" },
    { key: "menu.cookingTime.45plus", value: "45plus" },
  ];

  const NUTR_OPTIONS = [
    "weightLoss",
    "muscleGain",
    "maintenance",
    "heartHealthy",
    "lowSugar",
  ];

  const catCount = (c: string) =>
    c === "all"
      ? FOOD_ITEMS.length
      : FOOD_ITEMS.filter((m) => m.category === c).length;

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedDiet("all");
  };

  // Weekly plan data (mock)
  const WEEK_PLAN = [
    { dayKey: "menu.banner.monday", meal: FOOD_ITEMS[1] },
    { dayKey: "menu.banner.tuesday", meal: FOOD_ITEMS[0] },
    { dayKey: "menu.banner.wednesday", meal: FOOD_ITEMS[3] },
    { dayKey: "menu.banner.thursday", meal: FOOD_ITEMS[4] },
  ];

  return (
    <div className="min-h-screen bg-foreground/1 pt-24">
      <Container>
        {/* Hero Section */}
        <section className="bg-linear-to-b from-transparent to-foreground/2 overflow-hidden px-4 sm:px-6 lg:px-8 py-10 lg:py-20 rounded-2xl mb-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Text */}
            <div className="flex-1 text-center lg:text-start">
              <h1 className="text-5xl sm:text-6xl font-extrabold text-foreground/90 leading-tight">
                {t("menu.hero.title")}{" "}
                <span className="text-primary">
                  {t("menu.hero.titleHighlight")}
                </span>
              </h1>
              <p className="mt-4 text-lg text-foreground/50 font-medium">
                {t("menu.hero.subtitle")}
              </p>
              <p className="text-lg text-foreground/40">
                {t("menu.hero.tagline")}
              </p>
              <motion.div
                animate={{
                  rotate: [0, -2, 0],
                  y: [0, 2, 0],
                }}
                transition={{
                  duration: 8,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                className="hidden lg:block"
              >
                <Image
                  src="/media/images/hero/float-4.png"
                  alt="healthy meals"
                  width={40}
                  height={35}
                  className="mt-10 ms-20"
                />
              </motion.div>
            </div>

            {/* Image + Highlight Card */}
            <div className="flex-1 flex justify-center items-center gap-4 w-full max-w-xl lg:max-w-none h-full">
              <div className="relative flex-1 h-full">
                <div className="w-[80vw] h-[90vw] sm:h-120 sm:w-120 md:w-150 md:h-150  absolute -top-40 sm:-top-60 md:-top-65 lg:inset-e-0 -z-1">
                  <Image
                    src="/media/images/menu/menu-hero.png"
                    alt="healthy meals"
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Highlight card */}
                <div className="absolute -bottom-20 lg:-bottom-40 inset-s-4 lg:-inset-s-20 right-4 sm:left-6 sm:right-auto sm:w-55 bg-background/70 backdrop-blur-xs rounded-2xl p-3 shadow-lg mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-foreground/50">
                      {t("menu.hero.thisWeeksHighlights")}
                    </span>
                    <RiHeartLine
                      className="text-foreground/60 hover:text-green-600 cursor-pointer"
                      size={16}
                    />
                  </div>
                  <p className="font-bold text-foreground/90 text-sm leading-snug my-3">
                    {FOOD_ITEMS[0].name[lang]}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <RiStarFill className="text-yellow-400" size={13} />
                    <span className="text-xs font-bold text-foreground/80">
                      4.8
                    </span>
                    <span className="text-xs text-foreground/40">(320)</span>
                    <button className="ms-auto flex items-center gap-1 text-xs text-primary font-semibold">
                      {t("menu.hero.viewRecipe")} <ArrowIcon size={13} />
                    </button>
                  </div>
                </div>
              </div>
              {/* Thumbnails */}
              <div className="flex flex-col gap-3 items-center min-h-48">
                {[FOOD_ITEMS[1], FOOD_ITEMS[5]].map((m) => (
                  <img
                    key={m.id}
                    src={m.image}
                    alt={m.name[lang]}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-md hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
                <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-background/50 backdrop-blur-xs rounded-2xl shadow-xs border border-foreground/8">
                  <span className="text-xl font-extrabold text-primary leading-none">
                    {FOOD_ITEMS.length}
                  </span>
                  <span className="text-[10px] text-foreground/50 font-medium">
                    {t("menu.hero.dishes")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters Bar */}
        <div className="relative -mt-12 lg:-mt-20 px-4">
          <div className="sticky -top-18 z-30 bg-background/70 backdrop-blur-xs border border-foreground/6 p-4 space-y-4 rounded-2xl ">
            {/* Search */}
            <div className="relative">
              <RiSearchLine
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
                size={18}
              />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("menu.search.placeholder")}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-foreground/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition placeholder:text-foreground/40"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2 justify-between w-full">
              <div className="grid grid-cols-2 sm:flex flex-wrap items-center gap-2 w-full sm:w-fit ">
                {/* Category Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium border-foreground/5 hover:border-primary transition-all"
                    >
                      {t("menu.search.allCategories")}
                      <RiArrowDownSLine size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {CATEGORIES.map((c) => (
                      <DropdownMenuItem
                        key={c.value}
                        onClick={() => setSelectedCategory(c.value)}
                        className="text-sm cursor-pointer"
                      >
                        {t(c.key)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Diet Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium border-foreground/5 hover:border-primary transition-all"
                    >
                      {t("menu.search.allDiets")}
                      <RiArrowDownSLine size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {DIET_OPTIONS.map((d) => (
                      <DropdownMenuItem
                        key={d.value}
                        onClick={() => setSelectedDiet(d.value)}
                        className="text-sm cursor-pointer"
                      >
                        {t(d.key)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Cooking Time Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium border-foreground/5 hover:border-primary transition-all"
                    >
                      {t("menu.search.cookingTime")}
                      <RiArrowDownSLine size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {COOKING_TIME_OPTIONS.map((o) => (
                      <DropdownMenuItem
                        key={o.value}
                        onClick={() => setSelectedCookingTime(o.value)}
                        className="text-sm cursor-pointer"
                      >
                        {t(o.key)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Nutrition Goals Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium border-foreground/5 hover:border-primary transition-all"
                    >
                      {t("menu.search.nutritionGoals")}
                      <RiArrowDownSLine size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {NUTRITION_GOAL_OPTIONS.map((g) => (
                      <DropdownMenuItem
                        key={g.value}
                        onClick={() => setSelectedNutritionGoal(g.value)}
                        className="text-sm cursor-pointer"
                      >
                        {t(g.key)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 sm:flex gap-4 items-center w-full sm:w-fit">
                {/* Sort By Select */}

                {/* Sort By Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium border-foreground/5 hover:border-primary transition-all w-full sm:w-32 justify-between"
                    >
                      {t("menu.search.sortBy")}
                      <RiArrowDownSLine size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem
                      onClick={() => console.log("Sort by popular")}
                      className="text-sm cursor-pointer"
                    >
                      {t("menu.search.popular")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => console.log("Sort by newest")}
                      className="text-sm cursor-pointer"
                    >
                      {t("menu.search.newest")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => console.log("Sort by quickest")}
                      className="text-sm cursor-pointer"
                    >
                      {t("menu.search.quickest")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => console.log("Sort by highest rated")}
                      className="text-sm cursor-pointer"
                    >
                      {t("menu.search.highestRated")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {(selectedCategory !== "all" ||
                  selectedDiet !== "all" ||
                  selectedCookingTime !== "all" ||
                  selectedNutritionGoal !== "all") && (
                  <Button
                    variant="default"
                    size="sm"
                    className="text-xs text-foreground/80  hover:text-primary-foreground"
                    onClick={clearAllFilters}
                  >
                    {t("menu.filters.clearAll")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="px-4 py-6">
          <div className="flex gap-6">
            {/* Left Sidebar (Desktop) */}
            <aside className="hidden lg:block w-52 shrink-0 bg-background p-4 border rounded-2xl shadow-[0px_0px_10px_5px_#f5f5f5] max-h-fit sticky top-20">
              <div className="space-y-5">
                {/* Categories */}
                <div>
                  <button
                    onClick={() => toggleS("cat")}
                    className="flex items-center justify-between w-full py-1"
                  >
                    <span className="text-sm font-bold text-foreground/80">
                      {t("menu.categories.title")}
                    </span>
                    {sOpen.cat ? (
                      <RiArrowUpSLine
                        size={18}
                        className="text-foreground/40"
                      />
                    ) : (
                      <RiArrowDownSLine
                        size={18}
                        className="text-foreground/40"
                      />
                    )}
                  </button>
                  {sOpen.cat && (
                    <ul className="mt-2 space-y-0.5">
                      {CATEGORIES.map((c) => (
                        <li key={c.value}>
                          <button
                            onClick={() => setSelectedCategory(c.value)}
                            className={`flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                              selectedCategory === c.value
                                ? "bg-primary/5 text-primary font-semibold"
                                : "text-foreground/60 hover:bg-foreground/3"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <div className="relative size-6">
                                <Image
                                  src={`/media/images/diet/${c.value}.png`}
                                  alt={c.value}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              {t(c.key)}
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                selectedCategory === c.value
                                  ? "text-primary"
                                  : "text-foreground/40"
                              }`}
                            >
                              {catCount(c.value)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="border-t border-foreground/8" />

                {/* Dietary */}
                <div>
                  <button
                    onClick={() => toggleS("diet")}
                    className="flex items-center justify-between w-full py-1"
                  >
                    <span className="text-sm font-bold text-foreground/80">
                      {t("menu.dietary.title")}
                    </span>
                    {sOpen.diet ? (
                      <RiArrowUpSLine
                        size={18}
                        className="text-foreground/40"
                      />
                    ) : (
                      <RiArrowDownSLine
                        size={18}
                        className="text-foreground/40"
                      />
                    )}
                  </button>
                  {sOpen.diet && (
                    <div className="mt-2 space-y-2">
                      {DIET_OPTIONS.map((d) => (
                        <div
                          key={d.value}
                          className="flex items-center gap-2.5"
                        >
                          <Checkbox
                            id={`diet-${d.value}`}
                            checked={selectedDiet === d.value}
                            onCheckedChange={() => setSelectedDiet(d.value)}
                            className="w-4 h-4 rounded border-foreground/35 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <Label
                            htmlFor={`diet-${d.value}`}
                            className="text-sm text-foreground/60 cursor-pointer hover:text-foreground/90 transition"
                          >
                            {t(d.key)}
                          </Label>
                        </div>
                      ))}
                      <button
                        onClick={() => setShowAllDiets(!showAllDiets)}
                        className="text-xs font-semibold text-primary hover:underline mt-1"
                      >
                        {showAllDiets ? "↑ " : "↓ "}
                        {t("menu.dietary.showMore")}
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-foreground/8" />

                {/* Cooking Time */}
                <div>
                  <button
                    onClick={() => toggleS("cook")}
                    className="flex items-center justify-between w-full py-1"
                  >
                    <span className="text-sm font-bold text-foreground/80">
                      {t("menu.cookingTime.title")}
                    </span>
                    {sOpen.cook ? (
                      <RiArrowUpSLine
                        size={18}
                        className="text-foreground/40"
                      />
                    ) : (
                      <RiArrowDownSLine
                        size={18}
                        className="text-foreground/40"
                      />
                    )}
                  </button>
                  {sOpen.cook && (
                    <RadioGroup
                      value={selectedCookingTime}
                      onValueChange={setSelectedCookingTime}
                      className="mt-2 space-y-2"
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {COOK_OPTIONS.map((o) => (
                        <div
                          key={o.value}
                          className="flex items-center gap-2.5"
                        >
                          <RadioGroupItem
                            value={o.value}
                            id={`cook-${o.value}`}
                            className="w-4 h-4 border-foreground/35 text-primary focus:ring-primary"
                          />
                          <Label
                            htmlFor={`cook-${o.value}`}
                            className="text-sm text-foreground/60 cursor-pointer hover:text-foreground/90 transition"
                          >
                            {t(o.key)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>

                <div className="border-t border-foreground/8" />

                <button
                  onClick={resetFilters}
                  className="w-full py-2.5 border border-ftext-foreground/35 rounded-xl text-sm font-medium text-gray-700 hover:border-prtext-primary hover:text-primary transition-all"
                >
                  {t("menu.filters.resetFilters")}
                </button>
              </div>
            </aside>

            {/* Meals Area */}
            <div className="flex-1 min-w-0">
              {/* Diet Tabs */}
              <div className="md:sticky top-20 z-40 bg-background/50 backdrop-blur-xs border md:w-fit mx-auto rounded-2xl">
                <div className="px-4">
                  <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 flex-wrap py-3 justify-center">
                    {DIET_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedDiet(tab.id)}
                        className={`shrink-0 flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                          selectedDiet === tab.id
                            ? "bg-primary/5 text-primary-foreground border border-primary/30"
                            : "bg-foborder-foreground/8 text-foreground/60 hover:bg-fborder-foreground/5"
                        }`}
                      >
                        <img
                          src={tab.icon}
                          alt={tab.label[lang]}
                          className="w-6 h-6 object-contain"
                        />
                        <span className="text-xs font-medium line-clamp-1">
                          {tab.label[lang]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Food Items Grid/List */}
              {visibleItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-foreground/40">
                  <span className="text-5xl mb-4">🍽️</span>
                  <p className="text-sm font-medium">{t("menu.noResults")}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                  {visibleItems.map((item) => (
                    <FoodCard
                      key={item.id}
                      item={item}
                      className="w-full"
                      isFavourite={false}
                      onToggleFavourite={(id) =>
                        console.log("Toggle favourite:", id)
                      }
                    />
                  ))}
                </div>
              )}

              {/* Load More */}
              {hasMore && (
                <div className="flex flex-col items-center gap-2 mt-8">
                  <Button
                    onClick={() => setVisibleCount((prev) => prev + 8)}
                    className="px-4"
                  >
                    {t("menu.loadMore")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Weekly Plan Banner (CTA Section) */}
        <section className="bg-primary/5 border border-primary/30 rounded-2xl my-8 relative -z-2 overflow-hidden">
          {/* Weekly Plan Card */}
          <div className="hidden md:flex absolute top-5 inset-e-10 lg:inset-e-20 xl:inset-e-75 h-full w-[500] -z-1">
            <Image
              src={`/media/images/menu/cta-banner.png`}
              alt="Menu CTA"
              fill
              className="object-contain"
            />
          </div>

          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            {/* CTA */}
            <div className="flex flex-col gap-4 ">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground/90 leading-tight">
                {t("menu.banner.line1")}
                <br />
                {t("menu.banner.line2")}
                <br />
                <span className="text-primary">{t("menu.banner.line3")}</span>
              </h2>
              <p className="text-foreground/50 text-sm leading-relaxed">
                {t("menu.banner.description")}
              </p>
              <a
                href="/plans"
                className="self-start flex items-center gap-2 bg-primary text-foreground/90 hover:bg-fotext-foreground/80 font-semibold text-sm px-6 py-3 rounded-full transition-all mt-2"
              >
                {t("menu.banner.viewPlans")} <ArrowIcon size={16} />
              </a>
            </div>

            {/* Features */}
            <div className="space-y-5 hidden md:block">
              {[
                {
                  icon: "🎯",
                  tKey: "menu.banner.feature1Title",
                  dKey: "menu.banner.feature1Desc",
                },
                {
                  icon: "🛒",
                  tKey: "menu.banner.feature2Title",
                  dKey: "menu.banner.feature2Desc",
                },
                {
                  icon: "🍽️",
                  tKey: "menu.banner.feature3Title",
                  dKey: "menu.banner.feature3Desc",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-background/40 p-4 backdrop-blur-xs border rounded-2xl"
                >
                  <div className="w-11 h-11 rounded-2xl bg-background shadow-sm flex items-center justify-center text-xl shrink-0 border border-foreground/8">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground/90">
                      {t(f.tKey)}
                    </p>
                    <p className="text-xs text-foreground/50 mt-0.5 leading-relaxed">
                      {t(f.dKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
