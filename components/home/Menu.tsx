import { DIET_TABS, FOOD_ITEMS } from "@/data/menu";
import  { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";
import FoodCard from "./FoodCard";
import { useLang } from "@/hooks/useLang";
import Heading from "../shared/Heading";
import Image from "next/image";
import Animate from "../animation/Animate";
import {  fadeDu2 } from "@/lib/animation";

// Normalize scrollLeft across browsers in RTL
function getNormalizedScrollLeft(el: HTMLElement): number {
  const { scrollLeft } = el;
  const isRTL = getComputedStyle(el).direction === "rtl";
  if (!isRTL) return scrollLeft;
  // Firefox: negative values; Chrome/Safari: positive but reversed
  return Math.abs(scrollLeft);
}

function setNormalizedScrollLeft(el: HTMLElement, value: number) {
  const isRTL = getComputedStyle(el).direction === "rtl";
  if (!isRTL) {
    el.scrollLeft = value;
    return;
  }

  // Detect Firefox-style negative RTL scroll
  el.scrollLeft = 0;
  if (el.scrollLeft === 0) {
    // Try setting a negative value — if it sticks, we're in Firefox mode
    el.scrollLeft = -1;
    if (el.scrollLeft < 0) {
      el.scrollLeft = -value;
      return;
    }
  }
  // Chrome/Safari: reversed positive
  const maxScroll = el.scrollWidth - el.clientWidth;
  el.scrollLeft = maxScroll - value;
}



function Menu() {
 const { t, lang } = useLang();
  const [activeDietTab, setActiveDietTab] = useState("all");

  const foodScrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const targetScrollLeft = useRef<number>(0);

  const smoothScrollRef = useRef<() => void>(() => {});

  const filteredFoodItems = useMemo(
    () =>
      activeDietTab === "all"
        ? FOOD_ITEMS
        : FOOD_ITEMS.filter((item) => item.dietType === activeDietTab),
    [activeDietTab]
  );

  const dietTabs = useMemo(() => DIET_TABS, []);

  const resetScroll = useCallback(() => {
    const el = foodScrollRef.current;
    if (!el) return;
    targetScrollLeft.current = 0;
    setNormalizedScrollLeft(el, 0);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  useEffect(() => {
    smoothScrollRef.current = () => {
      const el = foodScrollRef.current;
      if (!el) return;

      const current = getNormalizedScrollLeft(el);
      const diff = targetScrollLeft.current - current;

      if (Math.abs(diff) < 0.5) {
        setNormalizedScrollLeft(el, targetScrollLeft.current);
        animationRef.current = null;
        return;
      }

      setNormalizedScrollLeft(el, current + diff * 0.05);
      animationRef.current = requestAnimationFrame(smoothScrollRef.current);
    };
  });

  const handleWheel = useCallback((e: WheelEvent) => {
    const el = foodScrollRef.current;
    if (!el) return;

    const { scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    const isRTL = getComputedStyle(el).direction === "rtl";
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    // Flip delta in RTL so scrolling feels natural
    const normalizedDelta = isRTL ? -delta : delta;

    const atLeftEdge = targetScrollLeft.current <= 0 && normalizedDelta < 0;
    const atRightEdge = targetScrollLeft.current >= maxScroll && normalizedDelta > 0;

    if (atLeftEdge || atRightEdge) return;

    e.preventDefault();
    e.stopPropagation();

    targetScrollLeft.current = Math.max(
      0,
      Math.min(maxScroll, targetScrollLeft.current + normalizedDelta)
    );

    if (animationRef.current === null) {
      animationRef.current = requestAnimationFrame(smoothScrollRef.current);
    }
  }, []);

  useEffect(() => {
    const el = foodScrollRef.current;
    if (!el) return;

    targetScrollLeft.current = getNormalizedScrollLeft(el);
    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleWheel]);

  useEffect(() => {
    resetScroll();
  }, [activeDietTab, resetScroll]);

  return (
    <Animate variants={fadeDu2}>
      <section id="menu-section" className="w-full">
        <div className="flex flex-col items-center gap-8 pt-12 lg:pt-30">
          {/* Header */}
          <div className="w-full max-w-300 px-5 lg:px-0 flex flex-col items-center gap-6 text-start lg:text-center">
            <Heading
              i18nKey={"menu.title"}
              components={{ custom: <span className="text-primary" /> }}
            />
            <p className="text-foreground/50 text-lg font-normal max-w-lg text-center">
              {t("menu.subtitle")}
            </p>
            <a
              href={`/${lang}/menu`}
              className="inline-flex items-center justify-center h-13 w-36.5 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary transition-colors text-sm"
            >
              {t("menu.seeFullMenu")}
            </a>
          </div>

          {/* Diet tabs */}
          <div className="w-full overflow-x-auto flex items-center gap-2 pb-2 scrollbar-hide lg:justify-center">
            <div className="flex w-screen md:w-full overflow-x-auto justify-center items-center flex-wrap gap-2 px-4 lg:px-0">
              {dietTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDietTab(tab.id)}
                  className={`shrink-0 py-3 px-4 rounded-full text-sm transition-all whitespace-nowrap flex items-center gap-1 font-medium cursor-pointer ${
                    activeDietTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/2 text-foreground hover:bg-foreground/4"
                  }`}
                >
                  <Image
                    src={tab.icon}
                    alt={tab.label[lang]}
                    width={25}
                    height={25}
                    className="object-contain"
                  />
                  {tab.label[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Food items */}
          <div
            ref={foodScrollRef}
            className="w-full flex-wrap overflow-x-auto flex gap-5 lg:gap-7.5 pb-4 scrollbar-hide"
            style={{ cursor: "grab" }}
          >
            <div className="flex gap-5 lg:gap-7.5 px-5">
              {filteredFoodItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </Animate>
  );
}

export default memo(Menu);