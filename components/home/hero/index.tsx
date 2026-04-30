"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Container from "@/components/shared/Container";
import Animate from "@/components/animation/Animate";
import { fade, fadeDu1, fadeDu2 } from "@/lib/animation";
import Image from "next/image";
import { GoArrowRight } from "react-icons/go";
import MealPlanner from "./MealPlanner";
import Ticker from "./Ticker";
import { heroSlides } from "@/data/heroslider";
import { useLang } from "@/hooks/useLang";
import HeroSlider from "./HerotSlider";
import Translate from "@/components/shared/Translate";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const socialLinks = [
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaXTwitter, href: "#", label: "X / Twitter" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
];

const HeroSection = () => {
  const { t, lang, isRTL } = useLang();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1,
      );
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  const float1Style = {
    transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -20}px)`,
    transition: "transform 0.12s ease-out",
  };

  const float3Style = {
    transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 18}px)`,
    transition: "transform 0.18s ease-out",
  };

  return (
    <div
      className="pt-16 relative overflow-hidden"
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
    >
      {/* ── Social sidebar: hidden on mobile/tablet, visible lg+ ── */}
      <div className="hidden lg:flex absolute inset-s-8 xl:inset-s-16 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-1">
        <div className="w-px h-16 bg-foreground/20 mb-2" />
        {socialLinks.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group relative w-9 h-9 flex items-center justify-center rounded-full
              text-foreground/80
              hover:text-primary hover:scale-150
              transition-all duration-300 ease-out
            "
          >
            <Icon size={15} />
          </a>
        ))}
        <div className="w-px h-16 bg-foreground/20 mt-2" />
      </div>

      {/* ── Float 1 — inset-e side ── */}
      <div
        className={`
          absolute pointer-events-none 
  ${isRTL ? "-scale-x-100" : ""}
          /* mobile: smaller, shifted less off-screen */
          w-50 h-50 -inset-e-30 top-[calc(50vh)]
          /* sm: medium */
          sm:w-75 sm:h-75 sm:-inset-e-35 sm:top-[calc(50vh-210px)]
          /* md */
          md:w-100 md:h-100 md:-inset-e-40 md:top-[calc(50vh-230px)]
          /* lg: original */
          lg:w-125 lg:h-125 lg:-inset-e-37.5 lg:top-[calc(50vh-250px)]
        `}
        style={float1Style}
      >
        <Image
          src="/media/images/hero/float-1.png"
          alt="healthy meals"
          fill
          className="object-contain"
        />
      </div>

      {/* ── Float 3 — inset-s side ── */}
      <div
        className={`
          absolute pointer-events-none
     ${isRTL ? "-scale-x-100" : ""}
          /* mobile */
          -inset-s-8 bottom-[32vh]
          /* lg: original */
          lg:-inset-s-10 lg:bottom-12
        `}
        style={float3Style}
      >
        <Image
          src="/media/images/hero/float-3.png"
          alt="healthy meals"
          /* Smaller on mobile/tablet, original on lg */
          width={100}
          height={135}
          className="
            w-30 h-auto
            sm:w-27.5
            md:w-32.5
            lg:w-42.5
          "
        />
      </div>

      <Container className="flex flex-col justify-between gap-8 sm:gap-10 lg:gap-14">
        {/* ── Main content row ── */}
        <div
          className="
            flex flex-col items-center gap-8
            xl:flex-row lg:justify-between lg:items-start lg:gap-20
            pt-6 sm:pt-10 lg:pt-25
          "
        >
          {/* ── Left / text column ── */}
          <div
            className="
              w-full
              flex flex-col items-center justify-center
              space-y-3 sm:space-y-4
              /* lg: original */
              xl:items-start xl:justify-start xl:pt-12
            "
          >
            {/* Heading */}
            <div className="text-center lg:text-start">
              <Animate
                variants={fade}
                element="h2"
                className="
                  font-bold text-foreground
                  text-4xl sm:text-[42px] md:text-[48px] xl:text-[55px]
                  max-w-sm sm:max-w-md lg:max-w-lg
                  leading-tight xl:leading-20
                  mt-10
                "
              >
                <span
                  className={`flex items-center justify-center gap-2  ${isRTL ? "flex-row lg:justify-end" : "flex-row lg:justify-start"}`}
                  dir="ltr"
                >
                  <Image
                    src={`/media/images/hero/healthy${isRTL ? "-ar" : ""}.png`}
                    alt="healthy meals"
                    width={160}
                    height={116}
                    className="
                      w-32 h-auto
                      sm:w-37.5
                      xl:w-50
                    "
                  />
                  <Translate text="home.hero.meals" />
                </span>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="leading-snug mb-3 sm:mb-4"
                  >
                    {slide.title[lang]}
                  </motion.div>
                </AnimatePresence>
              </Animate>
            </div>

            {/* Description */}
            <Animate
              variants={fadeDu1}
              element="p"
              className="
                text-neutral-500 dark:text-neutral-400 leading-relaxed
                text-sm sm:text-base
                max-w-70 sm:max-w-xs lg:max-w-sm
                text-center lg:text-start
              "
            >
              <Translate text="home.hero.description" />
            </Animate>

            {/* CTA */}
            <Animate
              variants={fadeDu2}
              className="flex items-center gap-4 mt-4 sm:mt-6"
            >
              <button
                className="
                  bg-primary hover:bg-primary/80 text-primary-foreground
                  px-5 py-3 sm:px-6 sm:py-4
                  rounded-full font-semibold
                  transition-all shadow-lg hover:shadow-xl
                  flex items-center gap-3 sm:gap-4 group
                  text-sm sm:text-base
                  cursor-pointer
                "
              >
                {t("home.hero.getStarted")}
                <GoArrowRight
                  className={` ${isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"} transition ${isRTL ? "rotate-180" : ""}`}
                />
              </button>
            </Animate>

            {/* Floating leaf / decoration */}
            <motion.div
              animate={{
                rotate: [0, -10, 0], // rotate left then back
                y: [0, 10, 0], // move down 5px then back
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="hidden lg:block"
            >
              <Image
                src="/media/images/hero/float-4.png"
                alt="healthy meals"
                width={90}
                height={86}
                className="mt-10 ms-20"
              />
            </motion.div>
          </div>

          {/* ── Right / slider column ── */}
          <div
            className="
              relative flex flex-col md:flex-row gap-10 justify-center w-full
              /* on mobile give it a max width so it doesn't span edge-to-edge */
            sm:max-w-105 md:max-w-120
              /* lg: original — let it size naturally */
              lg:max-w-none lg:justify-end
              mx-auto lg:mx-0
            "
          >
            <HeroSlider currentSlide={currentSlide} />
            <MealPlanner isRTL={isRTL}/>
          </div>
        </div>
      </Container>

      <Ticker  isRTL={isRTL}/>
    </div>
  );
};

export default HeroSection;
