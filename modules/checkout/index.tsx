"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Lock,
  ChevronRight,
  X,
  Shield,
  RotateCcw,
  BadgeCheck,
} from "lucide-react";
import { CustomField } from "@/components/form/FormField";
import { Input } from "@/components/ui/input";
import { PhoneField } from "@/components/form/PhoneField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/custom/select";
import OrderHeading from "@/components/shared/headings/OrderHeading";
import { useLang } from "@/hooks/useLang";
import Stepper from "@/components/shared/Stepper";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/custom/card";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/components/shared/Logo";
import Image from "next/image";
import { useThemeStore } from "@/stores/useThemeStore";
import { cn } from "@/lib/utils";
import { FOOD_ITEMS } from "@/data/menu";
import Currency from "@/components/icons/Currency";

// ─── Types ────────────────────────────────────────────────────────────────────
type PaymentMethod = "card" | "apple" | "tabby";
type DeliveryWindow = "early" | "breakfast" | "morning";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
  return digits;
}

// ─── Schemas ──────────────────────────────────────────────────────────────────
const ContactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email").min(5, "Email too short"),
  phone_number: z.number().optional(),
  city: z.string().min(1, "Please select a city"),
  streetAddress: z.string().min(5, "Enter a valid street address"),
  apt: z.string().optional(),
  postalCode: z.string().optional(),
});

const CardSchema = z.object({
  cardNumber: z.string().min(19, "Enter a valid card number"),
  cardName: z.string().min(2, "Enter the cardholder name"),
  expiry: z.string().min(7, "Enter a valid expiry"),
  cvv: z.string().min(3, "Enter CVV"),
  zip: z.string().optional(),
});

type ContactFormType = z.infer<typeof ContactSchema>;
type CardFormType = z.infer<typeof CardSchema>;

// ─── Cities ───────────────────────────────────────────────────────────────────
const CITIES = [
  { key: "riyadh", label: { en: "Riyadh", ar: "الرياض" } },
  { key: "dubai", label: { en: "Dubai", ar: "دبي" } },
  { key: "jeddah", label: { en: "Jeddah", ar: "جدة" } },
  { key: "abudhabi", label: { en: "Abu Dhabi", ar: "أبوظبي" } },
] as const;

// ─── Credit Card Visual ───────────────────────────────────────────────────────
function CreditCardVisual({
  num,
  name,
  exp,
}: {
  num: string;
  name: string;
  exp: string;
}) {
  const display = (num + " •••• •••• •••• ••••").slice(0, 19);
  return (
    <div className="relative rounded-2xl overflow-hidden p-4 sm:p-6 mb-5 aspect-[1.586/1] max-w-sm bg-linear-to-br from-primary-foreground to-primary-foreground/80 text-white select-none">
      <div className="absolute inset-0 bg-[radial-gradient(300px_150px_at_100%_0%,rgba(110,248,67,0.18),transparent_60%)] pointer-events-none" />
      <div className="relative z-10 flex justify-between items-start mb-2 sm:mb-5">
        <Logo isAlwaysDark className="w-20 h-8" />
        <svg width="36" height="22" viewBox="0 0 36 22" fill="none">
          <circle cx="12" cy="11" r="9" fill="#EB001B" />
          <circle cx="24" cy="11" r="9" fill="#F79E1B" fillOpacity="0.9" />
        </svg>
      </div>
      <div className="h-6 w-14 relative mb-4">
        <Image
          src="/media/images/checkout/visa-chip.png"
          alt="Card Chip"
          fill
          className="object-contain"
        />
      </div>
      <div className="relative z-10 font-mono text-base tracking-widest mb-4 text-white/90">
        {display}
      </div>
      <div className="relative z-10 flex justify-between items-end">
        <div>
          <span className="font-mono text-[8px] tracking-widest uppercase text-white/50 block">
            Cardholder
          </span>
          <span className="font-mono text-xs tracking-wide text-white/90 uppercase">
            {name || "Your Name"}
          </span>
        </div>
        <div>
          <span className="font-mono text-[8px] tracking-widest uppercase text-white/50 block">
            Expires
          </span>
          <span className="font-mono text-xs tracking-wide text-white/90">
            {exp || "MM / YY"}
          </span>
        </div>
      </div>
    </div>
  );
}

function ApplePayPane({
  onClose,
  total,
}: {
  onClose: () => void;
  total: string;
}) {
  return (
    <motion.div
      key="apple"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative rounded-2xl overflow-hidden p-6 mb-5  max-w-sm bg-linear-to-br from-primary-foreground to-primary-foreground/80 text-white select-none">
        <div className="absolute inset-0 bg-[radial-gradient(300px_150px_at_100%_0%,rgba(110,248,67,0.18),transparent_60%)] pointer-events-none" />
        <div className="flex justify-between items-center mb-5">
          <span className="font-semibold text-base tracking-tight">
            Apple Pay
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
        {[
          ["Pay to", "Bitely Foods Co."],
          ["Card", "•••• 4929 · Visa"],
          ["Contact", "mira@example.com"],
          ["Shipping", "Riyadh · 11564"],
        ].map(([l, v]) => (
          <div
            key={l}
            className="flex justify-between py-3 border-b border-white/10 text-sm"
          >
            <span className="text-white/55 text-xs font-mono tracking-wider uppercase">
              {l}
            </span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
        <div className="flex justify-between pt-4 text-lg font-bold">
          <span>Total</span>
          <span>{total}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
        Apple Pay uses the card in your default Wallet. We receive only a
        one-time token — your card number stays on your device.
      </p>
    </motion.div>
  );
}

function TabbyPane() {
  return (
    <motion.div
      key="tabby"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="border border-border rounded-xl p-5 bg-background">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-semibold text-sm text-foreground">
              4 interest-free payments
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              No fees · No interest · Shariah-compliant
            </p>
          </div>
          <div className="h-6 w-14 relative mb-4">
            <Image
              src="/media/images/checkout/tabby.png"
              alt="Card Chip"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {["TODAY", "+2 WKS", "+4 WKS", "+6 WKS"].map((label) => (
            <div
              key={label}
              className="bg-muted/50 dark:bg-primary-foreground/40 dark:border-primary-foreground border rounded-xl p-3 text-center"
            >
              <div className="font-mono text-[9px] text-muted-foreground tracking-wider mb-1">
                {label}
              </div>
              <div className="font-display text-xl font-medium text-foreground flex items-center justify-center gap-1">
                24.50 <Currency className="size-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function OrderSummary({
  method,
  onPay,
  loading,
}: {
  method: PaymentMethod;
  onPay: () => void;
  loading: boolean;
}) {
  const [promo, setPromo] = useState("FIRST12");
  const [promoApplied, setPromoApplied] = useState(true);

  return (
    <aside className="rounded-2xl p-6 md:p-8 flex flex-col gap-5 lg:sticky lg:top-6 border dark:bg-primary-foreground/20">
      <div className="flex justify-between items-start pb-5 border-b border-background/10">
        <div>
          <h4 className="font-display text-xl font-medium tracking-tight">
            Signature <em className="not-italic text-primary">plan</em>
          </h4>
          <p className=" text-[10px] tracking-widest uppercase text-primary-forground/50 mt-1">
            21 meals · weekly
          </p>
        </div>
        <button className="text-primary text-xs underline underline-offset-2 hover:no-underline transition">
          Edit
        </button>
      </div>

      <div>
        <p className=" text-[9px] tracking-widest uppercase text-primary-forground/40 mb-3">
          Week of Apr 20 — Apr 26
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {FOOD_ITEMS.slice(0, 5).map((meal) => (
            <div
              key={meal.id}
              className="relative w-15 h-17 md:w-10 md:h-12 rounded-lg overflow-hidden flex-shrink-0"
            >
              <Image
                src={meal.image}
                alt={meal.name.en}
                fill
                className="object-cover"
              />
            </div>
          ))}

          <div className="w-15 h-17 md:w-10 md:h-12 rounded-lg border border-primary-forground/20 flex items-center justify-center text-sm sm:text-[10px] text-primary-forground/60">
            +16
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 text-sm">
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
          <div key={l} className="flex justify-between items-center">
            <span className="text-primary-forground/60">{l}</span>
            <span>{v}</span>
          </div>
        ))}
        {promoApplied && (
          <div className="flex justify-between text-primary ">
            <span>
              Promo · <span>FIRST12</span>
            </span>
            <span className=" flex items-center gap-1 font-bold">
              17.50 <Currency className="size-4" />
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={promo}
          onChange={(e) => setPromo(e.target.value)}
          className="flex-1 border border-primary-forground/15 rounded-xl px-3 py-2.5 text-sm text-primary-forground placeholder:text-primary-forground/30 outline-none focus:border-primary transition"
          placeholder="Promo code"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />
        <button
          onClick={() => setPromoApplied(true)}
          className="dark:text-primary border border-primary/30 px-4 py-2.5 rounded-xl text-sm hover:bg-primary/10 transition"
        >
          Apply
        </button>
      </div>

      <div className="flex justify-between items-end pt-4 border-t border-primary-forground/15">
        <span className=" text-[10px] tracking-widest uppercase text-primary-forground/50">
          Total today
        </span>
        <div className="text-right">
          <span className="line-through text-primary-forground/30 text-xs mr-1 flex items-center gap-1">
            115.50 <Currency className="size-3" />
          </span>
          <span className="font-display text-3xl font-medium flex items-center gap-1">
            98.00 <Currency className="size-4" />
            <span className=" text-[10px] text-primary-forground/50 ml-1">
              /wk
            </span>
          </span>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onPay}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70
          ${method === "apple" ? "bg-white text-black hover:bg-gray-100" : "bg-primary text-primary-foreground hover:brightness-105"}`}
      >
        {loading ? (
          <svg
            className="animate-spin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="40"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <Lock size={13} />
        )}
        {loading
          ? "Processing…"
          : method === "apple"
            ? "Pay with Apple Pay"
            : method === "tabby"
              ? "Pay with Tabby"
              : "Confirm & pay $98.00"}
      </motion.button>

      <div className="flex items-center justify-center gap-1.5  text-[9px] tracking-widest uppercase text-primary-forground/40">
        <Shield size={9} />
        256-bit · PCI DSS · 3-D Secure
      </div>

      <div className="flex justify-between  text-[9px] tracking-widest uppercase text-primary-forground/40 pt-1 flex-wrap gap-2">
        <span className="flex items-center gap-1">
          <BadgeCheck size={9} /> Cancel anytime
        </span>
        <span className="flex items-center gap-1">
          <RotateCcw size={9} /> Pause any week
        </span>
        <span className="flex items-center gap-1">
          <Check size={9} /> 7-day refund
        </span>
      </div>
    </aside>
  );
}

// ─── Success Modal ────────────────────────────────────────────────────────────
function SuccessModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  const orderId = "BTL-24-07739";
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="bg-background rounded-3xl p-10 max-w-md w-full text-center shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 18,
                delay: 0.1,
              }}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-5"
            >
              <Check
                size={28}
                strokeWidth={3}
                className="text-primary-foreground"
              />
            </motion.div>
            <h3 className="font-display text-3xl font-medium tracking-tight text-foreground mb-2 leading-tight">
              That&apos;s{" "}
              <em className="not-italic text-muted-foreground">it.</em>
              <br />
              Your first box is cooking.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 mt-2">
              We&apos;ve charged{" "}
              <span className="inline-flex gap-1 items-center me-1">
                98.00 <Currency className="size-3" />
              </span>{" "}
              and scheduled Monday&apos;s delivery between 7 and 9 AM. A
              confirmation just landed in your inbox.
            </p>
            <div className="font-mono text-xs bg-muted dark:bg-primary-foreground border border-border dark:border-primary/10 rounded-xl py-3 px-4 tracking-wider text-muted-foreground mb-5">
              ORDER · #{orderId}
            </div>
            <button
              onClick={onClose}
              className="w-full bg-foreground text-background py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              Pick this week&apos;s meals <ChevronRight size={14} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [deliveryWindow, setDeliveryWindow] =
    useState<DeliveryWindow>("breakfast");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t, lang, isRTL } = useLang();
  const { isDark } = useThemeStore();

  // ── Contact & delivery form ──
  const contactForm = useForm<ContactFormType>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      fullName: "Mira Lahoud",
      email: "mira@example.com",
      phone_number: undefined,
      city: "",
      streetAddress: "",
      apt: "",
      postalCode: "",
    },
  });

  // ── Card payment form ──
  const cardForm = useForm<CardFormType>({
    resolver: zodResolver(CardSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
      zip: "",
    },
  });

  // Watch card fields to drive the live card visual
  const watchedCardNum = cardForm.watch("cardNumber");
  const watchedCardName = cardForm.watch("cardName");
  const watchedExpiry = cardForm.watch("expiry");

  // Sync formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    cardForm.setValue("cardNumber", formatCardNumber(e.target.value));
  };
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    cardForm.setValue("expiry", formatExpiry(e.target.value));
  };

  const selectedCity = contactForm.watch("city");

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  const deliveryOptions: { id: DeliveryWindow; time: string; label: string }[] =
    [
      { id: "early", time: "6 — 7 AM", label: "Early / pre-gym" },
      { id: "breakfast", time: "7 — 9 AM", label: "With breakfast" },
      { id: "morning", time: "9 — 11 AM", label: "After school run" },
    ];

  const paymentOptions = (
    isdark: boolean,
  ): {
    id: PaymentMethod;
    image: string;
    label: string;
    sub: string;
  }[] => [
    {
      id: "card",
      image: "visa",
      label: "Credit / Debit",
      sub: "Visa · Mastercard · Mada",
    },
    {
      id: "apple",
      image: `apply-pay${isdark ? "-dark" : ""}`,
      label: "Apple Pay",
      sub: "Fastest — Touch ID",
    },
    {
      id: "tabby",
      image: "tabby",
      label: "Split in 4",
      sub: "No fees · Tabby",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="space-y-4 mb-4">
          <OrderHeading
            label={`${t("checkout.title")} `}
            title={t("checkout.heading")}
            subheading={t("checkout.subheading")}
          />
          <Stepper currentIndex={2} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
          {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* 01 · Contact & Delivery ───────────────────────────────────── */}
            <Card className="rounded-2xl border-border">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="font-display text-xl tracking-tight">
                    Contact <em className=" italic text-primary">& delivery</em>
                  </CardTitle>
                  <CardDescription>
                    So we know where to leave the chilled box.
                  </CardDescription>
                </div>

                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/60">
                  01
                </span>
              </CardHeader>

              <CardContent>
                <FormProvider {...contactForm}>
                  <div className="space-y-3">
                    {/* Row 1: Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <CustomField name="fullName" label="Full name">
                        {(field) => (
                          <Input placeholder="Mira Lahoud" {...field} />
                        )}
                      </CustomField>

                      <CustomField name="email" label="Email">
                        {(field) => (
                          <Input
                            placeholder="mira@example.com"
                            type="email"
                            {...field}
                          />
                        )}
                      </CustomField>
                    </div>

                    {/* Row 2: Phone + City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">
                      <PhoneField
                        label="Phone"
                        name="phone_number"
                        register={contactForm.register}
                        error={contactForm.formState.errors.phone_number}
                      />

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium uppercase tracking-wide">
                          City
                        </label>
                        <Select
                          value={selectedCity}
                          onValueChange={(value) =>
                            contactForm.setValue("city", value)
                          }
                        >
                          <SelectTrigger className="h-20 rounded-full w-full min-h-12 text-sm mt-2">
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {CITIES.map((city) => (
                              <SelectItem key={city.key} value={city.key}>
                                {city.label[lang]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {contactForm.formState.errors.city && (
                          <p className="text-xs text-destructive mt-1">
                            {contactForm.formState.errors.city.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 3: Street address */}
                    <CustomField name="streetAddress" label="Street address">
                      {(field) => (
                        <Input
                          placeholder="Building, street, district"
                          {...field}
                        />
                      )}
                    </CustomField>

                    {/* Row 4: Apt + Postal code */}
                    <div className="grid grid-cols-2 gap-3">
                      <CustomField name="apt" label="Apt / floor">
                        {(field) => <Input placeholder="Apt 21B" {...field} />}
                      </CustomField>

                      <CustomField name="postalCode" label="Postal code">
                        {(field) => <Input placeholder="11564" {...field} />}
                      </CustomField>
                    </div>
                  </div>
                </FormProvider>
              </CardContent>
            </Card>

            {/* 02 · Delivery Window ──────────────────────────────────────── */}
            <Card className="rounded-2xl border-border">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="font-display text-xl tracking-tight">
                    Delivery <em className=" italic text-primary">Window</em>
                  </CardTitle>
                  <CardDescription>
                    Your first box arrives Monday morning, chilled to 4°C.
                  </CardDescription>
                </div>

                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/60">
                  02
                </span>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2  sm:grid-cols-3 gap-2.5">
                  {deliveryOptions.map((o) => (
                    <motion.button
                      key={o.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setDeliveryWindow(o.id)}
                      className={`rounded-xl p-4 border text-left flex flex-col gap-1.5 transition-all duration-200 cursor-pointer dark:hover:border-primary/20
                      ${
                        deliveryWindow === o.id
                          ? "bg-background border-foreground dark:border-primary/10"
                          : "bg-background border-border hover:border-foreground/50 "
                      }`}
                    >
                      <span className="font-display text-lg font-medium leading-tight">
                        {o.time}
                      </span>
                      <span className="font-mono text-[9px] tracking-wider uppercase opacity-60">
                        {o.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 03 · Payment ───────────────────────────────────────────────── */}
            <Card className="rounded-2xl border-border">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="font-display text-xl tracking-tight">
                    Payment
                  </CardTitle>
                  <CardDescription>
                    Encrypted end-to-end. We never see your card number.
                  </CardDescription>
                </div>

                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/60">
                  03
                </span>
              </CardHeader>
              <CardContent>
                {/* Method selector */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
                  {paymentOptions(isDark).map((o) => (
                    <motion.button
                      key={o.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setPaymentMethod(o.id)}
                      className={`rounded-xl border p-3.5 text-left flex flex-col gap-2 relative transition-all duration-200 cursor-pointer
                      ${
                        paymentMethod === o.id
                          ? "border-foreground dark:border-primary/10 bg-card dark:bg-primary-foreground shadow-sm"
                          : "border-border bg-background hover:border-foreground/20"
                      }`}
                    >
                      <div
                        className={`absolute top-3 inset-e-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                        ${paymentMethod === o.id ? "border-foreground dark:border-primary/20 bg-foreground dark:bg-primary-foreground" : "border-border"}`}
                      >
                        {paymentMethod === o.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="h-6 w-18 relative ">
                        <Image
                          src={`/media/images/checkout/${o.image}.png`}
                          alt="Card Chip"
                          fill
                          className={cn(
                            "object-contain ",
                            isRTL ? "object-right" : "object-left",
                          )}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground pr-4">
                        {o.label}
                      </span>
                      <span className="font-mono text-[9px] tracking-wider uppercase text-muted-foreground">
                        {o.sub}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Payment panes — card pane wrapped in its own FormProvider */}
                <AnimatePresence mode="wait">
                  {paymentMethod === "card" && (
                    <FormProvider {...cardForm}>
                      <motion.div
                        key="card-wrapper"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CreditCardVisual
                          num={watchedCardNum}
                          name={watchedCardName}
                          exp={watchedExpiry}
                        />
                        <div className="grid grid-cols-1 gap-3">
                          <CustomField name="cardNumber" label="Card number">
                            {(field) => (
                              <Input
                                {...field}
                                placeholder="4242 4242 4242 4242"
                                maxLength={19}
                                inputMode="numeric"
                                onChange={handleCardNumberChange}
                              />
                            )}
                          </CustomField>

                          <CustomField name="cardName" label="Cardholder name">
                            {(field) => (
                              <Input
                                {...field}
                                placeholder="As printed on card"
                              />
                            )}
                          </CustomField>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <CustomField name="expiry" label="Expiry">
                              {(field) => (
                                <Input
                                  {...field}
                                  placeholder="MM / YY"
                                  maxLength={7}
                                  onChange={handleExpiryChange}
                                />
                              )}
                            </CustomField>

                            <CustomField name="cvv" label="CVV">
                              {(field) => (
                                <Input
                                  {...field}
                                  placeholder="•••"
                                  maxLength={4}
                                  inputMode="numeric"
                                />
                              )}
                            </CustomField>

                            <CustomField name="zip" label="ZIP">
                              {(field) => (
                                <Input {...field} placeholder="11564" />
                              )}
                            </CustomField>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                            // checked={rememberMe}
                            // onCheckedChange={(value) => setRememberMe(Boolean(value))}
                            />

                            <span className=" text-base">
                              {" "}
                              Save card for next week
                            </span>
                          </label>
                        </div>
                      </motion.div>
                    </FormProvider>
                  )}

                  {paymentMethod === "apple" && (
                    <ApplePayPane
                      onClose={() => setPaymentMethod("card")}
                      total="$98.00"
                    />
                  )}

                  {paymentMethod === "tabby" && <TabbyPane />}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* ── RIGHT COLUMN: Order Summary ──────────────────────────────── */}
          <OrderSummary
            method={paymentMethod}
            onPay={handlePay}
            loading={loading}
          />
        </div>
      </main>

      <SuccessModal show={success} onClose={() => setSuccess(false)} />
    </div>
  );
}
