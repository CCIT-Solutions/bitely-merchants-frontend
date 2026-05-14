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
  RiCloseLine,
  RiMenuLine,
  RiTimeLine,
  RiCheckLine,
  RiStarFill,
  RiHeartLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiBellLine,
} from "react-icons/ri";

type ViewMode = "grid" | "list";

export default function MenuPage() {
  const { t, lang, isRTL } = useLang();
  const [search, setSearch] = useState("");
  const [selectedDiet, setSelectedDiet] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
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

      const matchesDiet = selectedDiet === "all" || item.dietType === selectedDiet;
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesDiet && matchesCategory;
    });
  }, [search, selectedDiet, selectedCategory, lang]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  // Categories (extracted from FOOD_ITEMS)
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    FOOD_ITEMS.forEach((item) => uniqueCategories.add(item.category));
    return ["all", ...Array.from(uniqueCategories)];
  }, []);

  const ArrowIcon = isRTL ? RiArrowLeftLine : RiArrowRightLine;

  // Static config for sidebar
  const CATEGORIES = [
    { key: "menu.categories.all", value: "all" },
    { key: "menu.categories.breakfast", value: "breakfast" },
    { key: "menu.categories.lunch", value: "lunch" },
    { key: "menu.categories.dinner", value: "dinner" },
    { key: "menu.categories.snacks", value: "snacks" },
  ];

  const DIET_OPTIONS = [
    "high-protein",
    "balanced",
    "vegetarian",
    "low-carb",
    "custom-macros",
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

  const visibleDiets = showAllDiets ? DIET_OPTIONS : DIET_OPTIONS.slice(0, 3);

  const catCount = (c: string) =>
    c === "all" ? FOOD_ITEMS.length : FOOD_ITEMS.filter((m) => m.category === c).length;

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
    <div className="min-h-screen bg-gray-50">
  
 

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-green-50/30 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Text */}
            <div className="flex-1 text-center lg:text-start">
              <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
                {t("menu.hero.title")}{" "}
                <span className="text-[#4CAF50]">{t("menu.hero.titleHighlight")}</span>
              </h1>
              <p className="mt-4 text-lg text-gray-500 font-medium">
                {t("menu.hero.subtitle")}
              </p>
              <p className="text-lg text-gray-400">{t("menu.hero.tagline")}</p>
              <div className="mt-6 hidden lg:flex items-center gap-2">
                <span className="text-3xl">🌿</span>
                <span className="text-3xl opacity-60">🍃</span>
              </div>
            </div>

            {/* Image + Highlight Card */}
            <div className="flex-1 flex justify-center items-center gap-4 w-full max-w-xl lg:max-w-none">
              <div className="relative flex-1">
                <img
                  src={FOOD_ITEMS[0].image}
                  alt={FOOD_ITEMS[0].name[lang]}
                  className="w-full max-w-[320px] lg:max-w-[380px] h-[260px] lg:h-[300px] object-cover rounded-3xl shadow-2xl mx-auto"
                />
                {/* Highlight card */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-[220px] bg-white rounded-2xl p-3 shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-500">
                      {t("menu.hero.thisWeeksHighlights")}
                    </span>
                    <RiHeartLine className="text-gray-300" size={16} />
                  </div>
                  <p className="font-bold text-gray-900 text-sm leading-snug">
                    {FOOD_ITEMS[0].name[lang]}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <RiStarFill className="text-yellow-400" size={13} />
                    <span className="text-xs font-bold text-gray-800">4.8</span>
                    <span className="text-xs text-gray-400">(320)</span>
                    <button className="ms-auto flex items-center gap-1 text-xs text-[#4CAF50] font-semibold">
                      {t("menu.hero.viewRecipe")} <ArrowIcon size={13} />
                    </button>
                  </div>
                </div>
              </div>
              {/* Thumbnails */}
              <div className="flex flex-col gap-3 items-center">
                {[FOOD_ITEMS[1], FOOD_ITEMS[5]].map((m) => (
                  <img
                    key={m.id}
                    src={m.image}
                    alt={m.name[lang]}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-md hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
                <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-md border border-gray-100">
                  <span className="text-xl font-extrabold text-[#4CAF50] leading-none">
                    {FOOD_ITEMS.length}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {t("menu.hero.dishes")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diet Tabs */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 [&::-webkit-scrollbar]:hidden">
            {DIET_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedDiet(tab.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                  selectedDiet === tab.id
                    ? "bg-[#4CAF50] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <img
                  src={tab.icon}
                  alt={tab.label[lang]}
                  className="w-6 h-6 object-contain"
                />
                <span className="text-xs font-medium whitespace-nowrap">
                  {tab.label[lang]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="sticky top-[73px] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <RiSearchLine className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("menu.search.placeholder")}
              className="w-full ps-10 pe-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50] transition placeholder:text-gray-400"
            />
          </div>
          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl bg-white hover:border-[#4CAF50] hover:text-[#4CAF50] transition-all">
              {t("menu.search.allCategories")} <RiArrowDownSLine size={14} />
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl bg-white hover:border-[#4CAF50] hover:text-[#4CAF50] transition-all">
              {t("menu.search.allDiets")} <RiArrowDownSLine size={14} />
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl bg-white hover:border-[#4CAF50] hover:text-[#4CAF50] transition-all">
              {t("menu.search.maxPrepTime")} <RiArrowDownSLine size={14} />
            </button>
            <div className="ms-auto flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium hidden sm:block">
                {t("menu.search.sortBy")}
              </span>
              <select
                className="text-xs font-medium text-gray-700 border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 cursor-pointer"
                defaultValue="popular"
              >
                {[
                  ["popular", t("menu.search.popular")],
                  ["newest", t("menu.search.newest")],
                  ["quickest", t("menu.search.quickest")],
                  ["highestRated", t("menu.search.highestRated")],
                ].map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                {(["grid", "list"] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-2 transition ${
                      viewMode === mode
                        ? "bg-[#4CAF50] text-white"
                        : "bg-white text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {mode === "grid" ? (
                      <RiGridFill size={16} />
                    ) : (
                      <RiListUnordered size={16} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar (Desktop) */}
          <aside className="hidden lg:block w-[210px] flex-shrink-0">
            <div className="space-y-5">
              {/* Categories */}
              <div>
                <button
                  onClick={() => toggleS("cat")}
                  className="flex items-center justify-between w-full py-1"
                >
                  <span className="text-sm font-bold text-gray-800">
                    {t("menu.categories.title")}
                  </span>
                  {sOpen.cat ? (
                    <RiArrowUpSLine size={18} className="text-gray-400" />
                  ) : (
                    <RiArrowDownSLine size={18} className="text-gray-400" />
                  )}
                </button>
                {sOpen.cat && (
                  <ul className="mt-2 space-y-0.5">
                    {CATEGORIES.map((c) => (
                      <li key={c.value}>
                        <button
                          onClick={() => setSelectedCategory(c.value)}
                          className={`flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-sm transition-all ${
                            selectedCategory === c.value
                              ? "bg-green-50 text-[#4CAF50] font-semibold"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {c.value === "breakfast" && "🌅"}
                            {c.value === "lunch" && "☀️"}
                            {c.value === "dinner" && "🌙"}
                            {c.value === "snacks" && "🥜"}
                            {c.value === "all" && "🍽️"}
                            {t(c.key)}
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              selectedCategory === c.value
                                ? "text-[#4CAF50]"
                                : "text-gray-400"
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

              <div className="border-t border-gray-100" />

              {/* Dietary */}
              <div>
                <button
                  onClick={() => toggleS("diet")}
                  className="flex items-center justify-between w-full py-1"
                >
                  <span className="text-sm font-bold text-gray-800">
                    {t("menu.dietary.title")}
                  </span>
                  {sOpen.diet ? (
                    <RiArrowUpSLine size={18} className="text-gray-400" />
                  ) : (
                    <RiArrowDownSLine size={18} className="text-gray-400" />
                  )}
                </button>
                {sOpen.diet && (
                  <div className="mt-2 space-y-2">
                    {visibleDiets.map((d) => (
                      <label key={d} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedDiet === d}
                          onChange={() => setSelectedDiet(d)}
                          className="w-4 h-4 rounded border-gray-300 text-[#4CAF50] focus:ring-[#4CAF50] cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">
                          {t(`menu.dietary.${d}`)}
                        </span>
                      </label>
                    ))}
                    <button
                      onClick={() => setShowAllDiets(!showAllDiets)}
                      className="text-xs font-semibold text-[#4CAF50] hover:underline mt-1"
                    >
                      {showAllDiets ? "↑ " : "↓ "}{t("menu.dietary.showMore")}
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100" />

              {/* Cooking Time */}
              <div>
                <button
                  onClick={() => toggleS("cook")}
                  className="flex items-center justify-between w-full py-1"
                >
                  <span className="text-sm font-bold text-gray-800">
                    {t("menu.cookingTime.title")}
                  </span>
                  {sOpen.cook ? (
                    <RiArrowUpSLine size={18} className="text-gray-400" />
                  ) : (
                    <RiArrowDownSLine size={18} className="text-gray-400" />
                  )}
                </button>
                {sOpen.cook && (
                  <div className="mt-2 space-y-2">
                    {COOK_OPTIONS.map((o) => (
                      <label
                        key={o.value}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="cookTime"
                          className="w-4 h-4 border-gray-300 text-[#4CAF50] focus:ring-[#4CAF50] cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">
                          {t(o.key)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100" />

              {/* Nutrition Goals */}
              <div>
                <button
                  onClick={() => toggleS("nutr")}
                  className="flex items-center justify-between w-full py-1"
                >
                  <span className="text-sm font-bold text-gray-800">
                    {t("menu.nutritionGoals.title")}
                  </span>
                  {sOpen.nutr ? (
                    <RiArrowUpSLine size={18} className="text-gray-400" />
                  ) : (
                    <RiArrowDownSLine size={18} className="text-gray-400" />
                  )}
                </button>
                {sOpen.nutr && (
                  <div className="mt-2 space-y-2">
                    {NUTR_OPTIONS.map((g) => (
                      <label
                        key={g}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-[#4CAF50] focus:ring-[#4CAF50] cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">
                          {t(`menu.nutritionGoals.${g}`)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100" />

              <button
                onClick={resetFilters}
                className="w-full py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:border-[#4CAF50] hover:text-[#4CAF50] transition-all"
              >
                {t("menu.filters.resetFilters")}
              </button>
            </div>
          </aside>

          {/* Meals Area */}
          <div className="flex-1 min-w-0">
            {/* Mobile Category Chips */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-3 [&::-webkit-scrollbar]:hidden">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setSelectedCategory(c.value)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === c.value
                      ? "bg-[#4CAF50] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {c.value === "breakfast" && "🌅"}
                  {c.value === "lunch" && "☀️"}
                  {c.value === "dinner" && "🌙"}
                  {c.value === "snacks" && "🥜"}
                  {c.value === "all" && "🍽️"}
                  {t(c.key)}
                </button>
              ))}
            </div>

            {/* Food Items Grid/List */}
            {visibleItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <span className="text-5xl mb-4">🍽️</span>
                <p className="text-sm font-medium">{t("menu.noResults")}</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {visibleItems.map((item) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    className="w-full"
                    isFavourite={false}
                    onToggleFavourite={(id) => console.log("Toggle favourite:", id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {visibleItems.map((item) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    className="w-full"
                    isFavourite={false}
                    onToggleFavourite={(id) => console.log("Toggle favourite:", id)}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="flex flex-col items-center gap-2 mt-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#4CAF50] hover:bg-[#43A047] text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all text-sm"
                >
                  {t("menu.loadMore")} <RiArrowDownSLine size={16} />
                </button>
                <p className="text-xs text-gray-400">
                  {t("menu.youveSeen")
                    .replace("{{seen}}", String(visibleCount))
                    .replace("{{total}}", String(filteredItems.length))}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Weekly Plan Banner (CTA Section) */}
      <section className="bg-[#F0F9F0] mt-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-center">
            {/* CTA */}
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                {t("menu.banner.line1")}<br />
                {t("menu.banner.line2")}<br />
                <span className="text-[#4CAF50]">{t("menu.banner.line3")}</span>
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t("menu.banner.description")}
              </p>
              <a
                href="/plans"
                className="self-start flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl mt-2"
              >
                {t("menu.banner.viewPlans")} <ArrowIcon size={16} />
              </a>
            </div>

            {/* Weekly Plan Card */}
            <div className="bg-white rounded-3xl shadow-xl p-5 border border-gray-100">
              <div className="mb-3">
                <p className="text-sm font-bold text-gray-900">
                  {t("menu.banner.weeklyPlan")}
                </p>
                <p className="text-xs text-gray-400">{t("menu.banner.weekOf")}</p>
              </div>
              <div className="space-y-2.5">
                {WEEK_PLAN.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition"
                  >
                    <span className="text-xs font-bold text-gray-500 w-8 flex-shrink-0">
                      {t(item.dayKey)}
                    </span>
                    <img
                      src={item.meal.image}
                      alt={item.meal.name[lang]}
                      className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">
                        {item.meal.name[lang]}
                      </p>
                      <p className="text-[10px] text-gray-400 capitalize">
                        {item.meal.category}
                      </p>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <RiCheckLine size={11} className="text-[#4CAF50]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-5">
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
                <div key={i} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl flex-shrink-0 border border-gray-100">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t(f.tKey)}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {t(f.dKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}