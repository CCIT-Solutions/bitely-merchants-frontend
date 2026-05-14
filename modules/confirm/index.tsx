"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Download,
  Package,
  Truck,
  Home,
  Leaf,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import Currency from "@/components/icons/Currency";
import { FOOD_ITEMS } from "@/data/menu";
import { cn } from "@/lib/utils";
import { FaBellConcierge } from "react-icons/fa6";
import { LuShoppingBag } from "react-icons/lu";
import { BiSolidDoorOpen } from "react-icons/bi";
import { CiAlarmOn } from "react-icons/ci";
import Android from "@/components/icons/Android";
import Apple from "@/components/icons/Apple";
import Animate from "@/components/animation/Animate";
import { fadeSlideUp1 } from "@/lib/animation";
import { useLang } from "@/hooks/useLang";

// ─── Types ────────────────────────────────────────────────────────────────────
interface OrderStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  status: "active" | "pending";
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Navbar() {
  const { t } = useLang();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo className="w-20 h-8" />
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {[
            t("confirm.nav.home"),
            t("confirm.nav.menu"),
            t("confirm.nav.howItWork"),
            t("confirm.nav.faq"),
            t("confirm.nav.contact"),
          ].map((item) => (
            <Link
              key={item}
              href="#"
              className="hover:text-foreground transition"
            >
              {item}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground transition">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </button>
          <button className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-full hover:brightness-105 transition">
            {t("confirm.nav.startNow")}
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────
function HeroSection() {
  const { t } = useLang();

  return (
    <section className="pt-28 pb-10 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left */}
        <Animate variants={fadeSlideUp1}>
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className=" text-[10px] tracking-widest uppercase text-primary font-semibold">
              {t("confirm.badge")}
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            {t("confirm.heading")} <em className="not-italic text-primary">Rashed!</em>
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-sm">
            {t("confirm.subheading")}
          </p>

          {/* Payment confirmed chip */}
          <Animate
            variants={fadeSlideUp1}
            className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 max-w-md"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Check size={18} strokeWidth={3} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                {t("confirm.paymentConfirmed")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("confirm.paymentDescription")}{" "}
                <span className="text-primary font-semibold inline-flex items-center gap-0.5">
                  98.00 <Currency className="size-3" />
                </span>{" "}
                {t("confirm.paymentSuccess")}
              </p>
            </div>
          </Animate>
        </Animate>

        {/* Right — hero image */}
        <Animate
          variants={fadeSlideUp1}
          className="flex items-center justify-center relative"
        >
          <motion.div
            animate={{
              rotate: [0, -10, 0],
              y: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="hidden lg:block absolute top-5 -inset-s-30"
          >
            <Image
              src="/media/images/hero/float-4.png"
              alt="healthy meals"
              width={60}
              height={55}
              className="mt-10 ms-20"
            />
          </motion.div>
          <div className="relative w-full max-w-md aspect-square">
            {/* Soft green glow blob */}
            <div className="absolute inset-8 rounded-full bg-primary/10 blur-3xl" />
            <Image
              src="/media/images/checkout/confirm-bag.png"
              alt="Bitely delivery bag with meal"
              fill
              className="object-contain relative z-10"
              priority
            />
          </div>
        </Animate>
      </div>
    </section>
  );
}

// ─── What Happens Next ────────────────────────────────────────────────────────
function WhatHappensNext() {
  const { t } = useLang();

  const ORDER_STEPS: OrderStep[] = [
    {
      id: "preparing",
      icon: <FaBellConcierge size={25} />,
      title: t("confirm.steps.preparing.title"),
      description: t("confirm.steps.preparing.description"),
      time: t("confirm.steps.preparing.time"),
      status: "active",
    },
    {
      id: "ontheway",
      icon: <LuShoppingBag size={25} />,
      title: t("confirm.steps.ontheway.title"),
      description: t("confirm.steps.ontheway.description"),
      time: t("confirm.steps.ontheway.time"),
      status: "pending",
    },
    {
      id: "delivered",
      icon: <BiSolidDoorOpen size={25} />,
      title: t("confirm.steps.delivered.title"),
      description: t("confirm.steps.delivered.description"),
      time: t("confirm.steps.delivered.time"),
      status: "pending",
    },
  ];

  return (
    <Animate
      variants={fadeSlideUp1}
      className="border rounded-2xl p-4 border-border/50"
    >
      <h2 className="font-display text-2xl font-semibold tracking-tight mb-6">
        {t("confirm.whatNext")}
      </h2>

      <div className="flex flex-col gap-0">
        {ORDER_STEPS.map((step, i) => (
          <div key={step.id} className="flex gap-4 relative">
            {/* Connector line */}
            {i < ORDER_STEPS.length - 1 && (
              <div className="absolute inset-s-7.5 top-15 bottom-0 w-px h-full border-s border-dashed" />
            )}

            {/* Icon bubble */}
            <div
              className={cn(
                "size-15 rounded-full border flex items-center justify-center flex-shrink-0 z-10 transition-all",
                step.status === "active"
                  ? "border-primary text-primary"
                  : "border-border bg-background text-muted-foreground",
              )}
            >
              {step.icon}
            </div>

            {/* Content */}
            <div className="pb-12 flex-1">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p
                    className={cn(
                      "font-semibold text-sm",
                      step.status === "active"
                        ? "text-primary"
                        : "text-foreground",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed max-w-45">
                    {step.description}
                  </p>
                </div>
                <span
                  className={cn(
                    " text-[10px] tracking-wider uppercase flex-shrink-0 mt-0.5",
                    step.status === "active"
                      ? "text-primary font-semibold"
                      : "text-muted-foreground",
                  )}
                >
                  {step.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Animate>
  );
}

// ─── Delivery Window Card ─────────────────────────────────────────────────────
function DeliveryWindowCard() {
  const { t } = useLang();

  return (
    <Animate
      variants={fadeSlideUp1}
      className="rounded-2xl border border-primary/10 p-5 bg-primary/3"
    >
      <div className="flex justify-between items-center mb-4">
        <p className="font-display text-lg font-semibold tracking-tight">
          {t("confirm.delivery.title")}{" "}
          <em className="not-italic text-primary">{t("confirm.delivery.titleHighlight")}</em>
        </p>
        <span className=" text-[10px] tracking-widest uppercase bg-primary/5 text-green-500 font-medium px-2.5 py-1 rounded-full">
          {t("confirm.delivery.date")}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center flex-shrink-0">
          <CiAlarmOn className="text-primary size-8" />
        </div>
        <div>
          <p className="font-display text-2xl font-bold tracking-tight">
            {t("confirm.delivery.window")}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("confirm.delivery.notify")}
          </p>
        </div>
      </div>
    </Animate>
  );
}

// ─── Have a Question ──────────────────────────────────────────────────────────
function HaveAQuestion() {
  const { t } = useLang();

  const contacts = [
    {
      icon: <MessageCircle size={16} />,
      label: t("confirm.support.liveChat"),
      sub: t("confirm.support.liveChatSub"),
      href: "#",
    },
    {
      icon: <Mail size={16} />,
      label: t("confirm.support.email"),
      sub: t("confirm.support.emailSub"),
      href: "mailto:hello@bitely.com",
    },
    {
      icon: <Phone size={16} />,
      label: t("confirm.support.phone"),
      sub: t("confirm.support.phoneSub"),
      href: "tel:+97611123 4567",
    },
  ];

  return (
    <Animate
      variants={fadeSlideUp1}
      className="rounded-2xl border border-border/50 p-5 bg-background"
    >
      <p className="font-display text-lg font-semibold tracking-tight mb-1">
        {t("confirm.support.title")}
      </p>
      <p className="text-xs text-muted-foreground mb-5">
        {t("confirm.support.subtitle")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-3">
        {contacts.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="flex items-center gap-2 p-3 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition group"
          >
            <span className="size-8 rounded-md border border-primary/10 bg-primary/3 flex items-center justify-center text-primary group-hover:border-primary/30 group-hover:text-primary transition">
              {c.icon}
            </span>
            <div>
              <p className="font-semibold text-xs text-foreground">{c.label}</p>
              <p className=" text-[9px] text-muted-foreground tracking-wide">
                {c.sub}
              </p>
            </div>
          </a>
        ))}
      </div>
    </Animate>
  );
}

// ─── Order Summary Card ───────────────────────────────────────────────────────
function OrderSummaryCard() {
  const { t } = useLang();
  const orderId = "BT-2S0421";

  return (
    <Animate
      variants={fadeSlideUp1}
      className="rounded-2xl border border-border p-6 bg-background flex flex-col gap-5 lg:sticky lg:top-24"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight">
            {t("confirm.summary.title")}
          </h3>
          <p className=" text-[10px] tracking-widest uppercase text-foreground/70 mt-1">
            {t("confirm.summary.mealsWeekly")}
          </p>
        </div>
        <span className=" text-xs font-medium tracking-wider text-muted-foreground">
          {t("confirm.summary.orderPrefix")}{orderId}
        </span>
      </div>

      {/* Week label */}
      <div>
        <p className=" text-[9px] tracking-widest uppercase text-foreground/70 mb-3">
          {t("confirm.summary.weekLabel")}
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {FOOD_ITEMS.slice(0, 5).map((meal) => (
            <div
              key={meal.id}
              className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0"
            >
              <Image
                src={meal.image}
                alt={meal.name.en}
                fill
                className="object-cover"
              />
            </div>
          ))}
          <div className="w-12 h-12 rounded-lg border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">
            {t("confirm.summary.moreItems")}
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="flex flex-col gap-2.5 text-sm border-t border-border pt-4">
        {[
          {
            l: t("confirm.summary.subtotal"),
            v: (
              <span className="flex items-center gap-1">
                110.00 <Currency className="size-3.5" />
              </span>
            ),
          },
          { l: t("confirm.summary.delivery"), v: t("confirm.summary.deliveryFree") },
          {
            l: t("confirm.summary.taxes"),
            v: (
              <span className="flex items-center gap-1">
                5.50 <Currency className="size-3.5" />
              </span>
            ),
          },
        ].map(({ l, v }) => (
          <div key={l} className="flex justify-between items-center text-sm">
            <span className="text-foreground/70 font-medium">{l}</span>
            <span className="text-foreground">{v}</span>
          </div>
        ))}
        <div className="flex justify-between text-primary">
          <span className="text-sm">
            {t("confirm.summary.promo")} <span className="font-semibold">FIRST12</span>
          </span>
          <span className="flex items-center gap-1 font-bold text-sm">
            -17.50 <Currency className="size-3.5" />
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-2 border-t border-border">
        <span className="font-semibold text-sm text-foreground">
          {t("confirm.summary.totalPaid")}
        </span>
        <div className="flex items-center gap-3">
          <span className="font-display text-3xl font-bold flex items-center gap-1">
            98.00 <Currency className="size-5" />
          </span>
          <span className="text-[10px] font-bold  tracking-widest uppercase bg-primary/5 text-primary-foreground px-2 py-1 rounded-full">
            {t("confirm.summary.paidBadge")}
          </span>
        </div>
      </div>

      {/* Savings callout */}
      <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <Leaf size={16} className="text-primary flex-shrink-0" />
          <div>
            <p className="text-sm text-foreground font-medium">
              {t("confirm.summary.savedTitle")}{" "}
              <span className="text-primary font-bold inline-flex items-center gap-0.5">
                17.50 <Currency className="size-3" />
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {t("confirm.summary.savedSubtitle")}
            </p>
          </div>
        </div>
        <ChevronRight
          size={14}
          className="text-muted-foreground flex-shrink-0"
        />
      </div>

      {/* Payment method */}
      <div className="flex justify-between items-center pt-2 border-t border-border">
        <span className="text-sm text-foreground/80 font-medium">
          {t("confirm.summary.paymentMethod")}
        </span>
        <div className="flex items-center gap-2 border border-border/80 rounded-lg overflow-hidden">
          <span className=" text-sm text-foreground px-3 p-2">
            {t("confirm.summary.cardMask")}
          </span>
          {/* Mastercard icon */}
          <div className="bg-black/5 px-1 h-9 flex items-center">
            <svg width="32" height="20" viewBox="0 0 36 22" fill="none">
              <circle cx="12" cy="11" r="9" fill="#EB001B" />
              <circle cx="24" cy="11" r="9" fill="#F79E1B" fillOpacity="0.9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Download receipt */}
      <button className="w-full flex items-center justify-center gap-2 font-medium border border-border rounded-xl py-3 text-sm text-foreground/80 hover:text-foreground hover:border-foreground/30 transition">
        <Download size={14} />
        {t("confirm.summary.downloadReceipt")}
      </button>
    </Animate>
  );
}

// ─── App Banner ───────────────────────────────────────────────────────────────
function AppBanner() {
  const { t } = useLang();

  return (
    <motion.section
      variants={fadeSlideUp1}
      className="max-w-5xl mx-auto px-4 sm:px-6 pb-16"
    >
      <div className="relative rounded-3xl overflow-hidden bg-[#0d2818] min-h-[240px] flex">
        {/* Right — copy */}
        <div className="flex flex-col justify-center px-8 sm:px-10 py-10 flex-1">
          <span className=" text-[10px] tracking-widest uppercase text-primary mb-3">
            {t("confirm.app.badge")}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
            {t("confirm.app.title")}{" "}
            <em className="not-italic text-primary">{t("confirm.app.titleHighlight")}</em>
          </h2>
          <p className="text-sm text-white/60 leading-relaxed mb-7 max-w-sm">
            {t("confirm.app.description")}
          </p>

          {/* Store buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              className="flex items-center gap-2.5 border border-white/10 rounded-xl px-4 py-2.5 hover:bg-white/5 transition"
            >
              <Apple className="text-white" />
              <div>
                <p className=" text-[8px] text-white/90 tracking-widest uppercase">
                  {t("confirm.app.downloadOn")}
                </p>
                <p className="text-white font-semibold text-sm leading-tight">
                  {t("confirm.app.appStore")}
                </p>
              </div>
            </a>

            <a
              href="#"
              className="flex items-center gap-2.5 border border-white/10 rounded-xl px-4 py-2.5 hover:bg-white/5 transition"
            >
              <Android />
              <div>
                <p className=" text-[8px] text-white/90 tracking-widest uppercase">
                  {t("confirm.app.getItOn")}
                </p>
                <p className="text-white font-semibold text-sm leading-tight">
                  {t("confirm.app.googlePlay")}
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Left — phone mockup */}
        <div className="relative w-100 flex-shrink-0 hidden sm:block">
          <Image
            src="/media/images/checkout/confirm-app.png"
            alt="Bitely app on phone"
            fill
            className="object-contain object-bottom"
          />
        </div>

        {/* Glow */}
        <div className="absolute inset-e-50 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-primary/20 md:bg-primary/40 blur-3xl pointer-events-none" />
      </div>
    </motion.section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
    

      {/* Hero */}
      <HeroSection />

      {/* Main content grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-8 items-start">
          {/* ── Left column ── */}
          <div className="space-y-5">
            <WhatHappensNext />
            <DeliveryWindowCard />
            <HaveAQuestion />
          </div>

          {/* ── Right column ── */}
          <OrderSummaryCard />
        </div>
      </section>

      {/* App banner */}
      <AppBanner />
    </div>
  );
}