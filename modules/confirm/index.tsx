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

// ─── Types ────────────────────────────────────────────────────────────────────
interface OrderStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  status: "active" | "pending";
}

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Order Steps ─────────────────────────────────────────────────────────────
const ORDER_STEPS: OrderStep[] = [
  {
    id: "preparing",
    icon: <Package size={18} />,
    title: "Preparing your meals",
    description: "Our chefs are cooking your meals with fresh ingredients.",
    time: "Now",
    status: "active",
  },
  {
    id: "ontheway",
    icon: <Truck size={18} />,
    title: "On the way",
    description: "Your box is packed and on its way to you.",
    time: "Today, 9:00 AM",
    status: "pending",
  },
  {
    id: "delivered",
    icon: <Home size={18} />,
    title: "Delivered to your door",
    description: "Your meals will be delivered chilled and ready to enjoy.",
    time: "Today, 10:00 AM",
    status: "pending",
  },
];

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo className="w-20 h-8" />
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {["Home", "Menu", "How It Work", "FAQ", "Contact"].map((item) => (
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </button>
          <button className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-full hover:brightness-105 transition">
            Start Now
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="pt-28 pb-10 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
        >
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-primary font-semibold">
              Payment Successful
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-4">
            Thank you,{" "}
            <em className="not-italic text-primary">Mira!</em>
          </h1>
          {/* Floating leaves */}
          <div className="absolute pointer-events-none select-none" aria-hidden>
            <motion.span
              initial={{ opacity: 0, y: -10, rotate: -20 }}
              animate={{ opacity: 1, y: 0, rotate: -20 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -top-8 left-64 text-2xl"
            >
              🌿
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: -10, rotate: 10 }}
              animate={{ opacity: 1, y: 0, rotate: 10 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -top-2 left-80 text-xl"
            >
              🍃
            </motion.span>
          </div>

          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-sm">
            Your order has been confirmed and we're preparing fresh meals just
            for you.
          </p>

          {/* Payment confirmed chip */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 max-w-sm"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Check size={18} strokeWidth={3} className="text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                Payment Confirmed
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your payment of{" "}
                <span className="text-primary font-semibold inline-flex items-center gap-0.5">
                  98.00 <Currency className="size-3" />
                </span>{" "}
                was successful.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right — hero image */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.5}
          className="flex items-center justify-center"
        >
          <div className="relative w-full max-w-md aspect-square">
            {/* Soft green glow blob */}
            <div className="absolute inset-8 rounded-full bg-primary/10 blur-3xl" />
            <Image
              src="/media/images/confirm/hero-bag.png"
              alt="Bitely delivery bag with meal"
              fill
              className="object-contain relative z-10"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── What Happens Next ────────────────────────────────────────────────────────
function WhatHappensNext() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      custom={0}
    >
      <h2 className="font-display text-2xl font-semibold tracking-tight mb-6">
        What happens next?
      </h2>

      <div className="flex flex-col gap-0">
        {ORDER_STEPS.map((step, i) => (
          <div key={step.id} className="flex gap-4 relative">
            {/* Connector line */}
            {i < ORDER_STEPS.length - 1 && (
              <div className="absolute left-[19px] top-12 bottom-0 w-px bg-border" />
            )}

            {/* Icon bubble */}
            <div
              className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 transition-all",
                step.status === "active"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground",
              )}
            >
              {step.icon}
            </div>

            {/* Content */}
            <div className="pb-8 flex-1">
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
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-wider uppercase flex-shrink-0 mt-0.5",
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
    </motion.div>
  );
}

// ─── Delivery Window Card ─────────────────────────────────────────────────────
function DeliveryWindowCard() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      custom={0.1}
      className="rounded-2xl border border-border p-5 bg-background"
    >
      <div className="flex justify-between items-center mb-4">
        <p className="font-display text-lg font-semibold tracking-tight">
          Delivery{" "}
          <em className="not-italic text-primary">Window</em>
        </p>
        <span className="font-mono text-[10px] tracking-widest uppercase bg-primary/10 text-primary px-2.5 py-1 rounded-full">
          Mon, Apr 21
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center flex-shrink-0">
          <Clock size={18} className="text-primary" />
        </div>
        <div>
          <p className="font-display text-2xl font-bold tracking-tight">
            7:00 AM – 9:00 AM
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            We'll notify you when your box is nearby.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Have a Question ──────────────────────────────────────────────────────────
function HaveAQuestion() {
  const contacts = [
    {
      icon: <MessageCircle size={16} />,
      label: "Live Chat",
      sub: "Chat with us",
      href: "#",
    },
    {
      icon: <Mail size={16} />,
      label: "Email Us",
      sub: "hello@bitely.com",
      href: "mailto:hello@bitely.com",
    },
    {
      icon: <Phone size={16} />,
      label: "Call Us",
      sub: "+966 11 123 4567",
      href: "tel:+96611123 4567",
    },
  ];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      custom={0.2}
      className="rounded-2xl border border-border p-5 bg-background"
    >
      <p className="font-display text-lg font-semibold tracking-tight mb-1">
        Have a question?
      </p>
      <p className="text-xs text-muted-foreground mb-5">
        We're here to help!
      </p>

      <div className="grid grid-cols-3 gap-3">
        {contacts.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition text-center group"
          >
            <span className="w-8 h-8 rounded-full border border-border bg-muted flex items-center justify-center text-muted-foreground group-hover:border-primary/30 group-hover:text-primary transition">
              {c.icon}
            </span>
            <span className="font-semibold text-xs text-foreground">
              {c.label}
            </span>
            <span className="font-mono text-[9px] text-muted-foreground tracking-wide">
              {c.sub}
            </span>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Order Summary Card ───────────────────────────────────────────────────────
function OrderSummaryCard() {
  const orderId = "BT-2S0421";

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      custom={0}
      className="rounded-2xl border border-border p-6 bg-background flex flex-col gap-5 lg:sticky lg:top-24"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight">
            Order Summary
          </h3>
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-1">
            21 Meals · Weekly
          </p>
        </div>
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
          Order #{orderId}
        </span>
      </div>

      {/* Week label */}
      <div>
        <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-3">
          Week of Apr 20 — Apr 26
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {FOOD_ITEMS.slice(0, 5).map((meal) => (
            <div
              key={meal.id}
              className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
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
            +16
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="flex flex-col gap-2.5 text-sm border-t border-border pt-4">
        {[
          {
            l: "Subtotal",
            v: (
              <span className="flex items-center gap-1">
                110.00 <Currency className="size-3.5" />
              </span>
            ),
          },
          { l: "Delivery", v: "Free" },
          {
            l: "Taxes (5%)",
            v: (
              <span className="flex items-center gap-1">
                5.50 <Currency className="size-3.5" />
              </span>
            ),
          },
        ].map(({ l, v }) => (
          <div key={l} className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{l}</span>
            <span className="text-foreground">{v}</span>
          </div>
        ))}
        <div className="flex justify-between text-primary">
          <span className="text-sm">
            Promo · <span className="font-semibold">FIRST12</span>
          </span>
          <span className="flex items-center gap-1 font-bold text-sm">
            -17.50 <Currency className="size-3.5" />
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-2 border-t border-border">
        <span className="font-semibold text-sm text-foreground">
          Total Paid
        </span>
        <div className="flex items-center gap-3">
          <span className="font-display text-3xl font-bold flex items-center gap-1">
            98.00 <Currency className="size-5" />
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase bg-primary/10 text-primary px-2 py-1 rounded-full">
            Paid
          </span>
        </div>
      </div>

      {/* Savings callout */}
      <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <Leaf size={16} className="text-primary flex-shrink-0" />
          <div>
            <p className="text-sm text-foreground">
              You saved{" "}
              <span className="text-primary font-bold inline-flex items-center gap-0.5">
                17.50 <Currency className="size-3" />
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Nice choice! You're eating healthy and saving more.
            </p>
          </div>
        </div>
        <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
      </div>

      {/* Payment method */}
      <div className="flex justify-between items-center pt-2 border-t border-border">
        <span className="text-sm text-muted-foreground">Payment Method</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-foreground">•••• 4242</span>
          {/* Mastercard icon */}
          <svg width="32" height="20" viewBox="0 0 36 22" fill="none">
            <circle cx="12" cy="11" r="9" fill="#EB001B" />
            <circle cx="24" cy="11" r="9" fill="#F79E1B" fillOpacity="0.9" />
          </svg>
        </div>
      </div>

      {/* Download receipt */}
      <button className="w-full flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition">
        <Download size={14} />
        Download Receipt
      </button>
    </motion.div>
  );
}

// ─── App Banner ───────────────────────────────────────────────────────────────
function AppBanner() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      custom={0}
      className="max-w-6xl mx-auto px-4 sm:px-6 pb-16"
    >
      <div className="relative rounded-3xl overflow-hidden bg-[#0d2818] min-h-[240px] flex">
        {/* Left — phone mockup */}
        <div className="relative w-64 flex-shrink-0 hidden sm:block">
          <Image
            src="/media/images/confirm/app-mockup.png"
            alt="Bitely app on phone"
            fill
            className="object-contain object-bottom"
          />
        </div>

        {/* Right — copy */}
        <div className="flex flex-col justify-center px-8 sm:px-10 py-10 flex-1">
          <span className="font-mono text-[10px] tracking-widest uppercase text-primary mb-3">
            Stay Updated
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
            Track your order in{" "}
            <em className="not-italic text-primary">real-time</em>
          </h2>
          <p className="text-sm text-white/60 leading-relaxed mb-7 max-w-sm">
            Get live updates, manage preferences, and reschedule anytime in the
            Bitely app.
          </p>

          {/* Store buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              className="flex items-center gap-2.5 bg-black border border-white/10 rounded-xl px-4 py-2.5 hover:bg-white/5 transition"
            >
              <svg width="18" height="22" viewBox="0 0 814 1000" fill="white">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.3-150.3-119.4C37 440.2 27 315.4 27 269.4c0-60.9 14.5-120.5 43.7-171.6C131.7 50.3 210.4 9.5 291.7 9.5c73.4 0 124.3 47.8 166.6 47.8 40.6 0 104-50.6 185.2-50.6 30.5 0 130 4.5 192 77.1zm-217.9-147.9c30.6-33.9 52.5-81 52.5-128.1 0-6.4-.6-12.9-1.9-18.1-49.6 1.9-108.3 33.1-144.2 71.6-28 30.6-54.5 77.6-54.5 125.4 0 7.1 1.3 14.2 1.9 16.5 3.2.6 8.4 1.3 13.5 1.3 44.5 0 97.8-29.7 132.7-68.6z" />
              </svg>
              <div>
                <p className="font-mono text-[8px] text-white/50 tracking-widest uppercase">
                  Download on the
                </p>
                <p className="text-white font-semibold text-sm leading-tight">
                  App Store
                </p>
              </div>
            </a>

            <a
              href="#"
              className="flex items-center gap-2.5 bg-black border border-white/10 rounded-xl px-4 py-2.5 hover:bg-white/5 transition"
            >
              {/* Google Play "G" mark */}
              <svg width="20" height="22" viewBox="0 0 512 512" fill="none">
                <path d="M48 32L288 256 48 480V32z" fill="#00D8FF" />
                <path d="M48 32l240 136 96-55L48 32z" fill="#FF3D81" />
                <path d="M48 480l240-136 96 55L48 480z" fill="#FFD400" />
                <path d="M288 256l96-55v110l-96-55z" fill="#00F076" />
              </svg>
              <div>
                <p className="font-mono text-[8px] text-white/50 tracking-widest uppercase">
                  Get it on
                </p>
                <p className="text-white font-semibold text-sm leading-tight">
                  Google Play
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Glow */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      </div>
    </motion.section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 sm:col-span-1">
            <Logo className="w-20 h-8 mb-4" />
          </div>

          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-3">
              Links
            </p>
            {["Menu", "How It Work", "FAQ"].map((item) => (
              <Link
                key={item}
                href="#"
                className="block text-sm text-muted-foreground hover:text-foreground transition mb-2"
              >
                {item}
              </Link>
            ))}
          </div>

          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-3">
              Account
            </p>
            {["Account", "Contact", "Privacy Policy"].map((item) => (
              <Link
                key={item}
                href="#"
                className="block text-sm text-muted-foreground hover:text-foreground transition mb-2"
              >
                {item}
              </Link>
            ))}
          </div>

          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-3">
              Follow us
            </p>
            <div className="flex gap-3 mt-1">
              {[
                {
                  label: "Twitter",
                  path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
                },
                {
                  label: "Instagram",
                  path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
                },
                {
                  label: "Facebook",
                  path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                },
                {
                  label: "LinkedIn",
                  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <span>© 2026 Bitely. All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Main content grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 items-start">
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

      {/* Footer */}
      <Footer />
    </div>
  );
}