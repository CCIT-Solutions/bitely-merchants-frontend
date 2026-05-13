"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useLang } from "@/hooks/useLang";
import {
  Check,
  CreditCard,
  MoreVertical,
  Plus,
  ArrowRight,
  Pencil,
  Settings2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SubscriptionCard from "@/components/account/SubscriptionCard";
import BillingHistory from "@/components/account/BillingHistory";
import PaymentMethods from "@/components/account/PaymentMethods";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type CardBrand = "visa" | "mastercard";

interface PaymentCard {
  id: string;
  brand: CardBrand;
  last4: string;
  expiry: string;
  holder: string;
  isDefault: boolean;
}

interface BillingHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: string;
}

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────

const PLAN_FEATURES = [
  "progress.planFeature1",
  "progress.planFeature2",
  "progress.planFeature3",
  "progress.planFeature4",
  "progress.planFeature5",
] as const;

const PAYMENT_CARDS: PaymentCard[] = [
  {
    id: "card-1",
    brand: "visa",
    last4: "4242",
    expiry: "08/26",
    holder: "Alex Johnson",
    isDefault: true,
  },
  {
    id: "card-2",
    brand: "mastercard",
    last4: "8888",
    expiry: "11/25",
    holder: "Alex Johnson",
    isDefault: false,
  },
];

const BILLING_HISTORY: BillingHistoryItem[] = [
  {
    id: "inv-1",
    date: "May 12, 2024",
    description: "payment.billingDescMonthly",
    amount: "$9.99",
  },
  {
    id: "inv-2",
    date: "Apr 12, 2024",
    description: "payment.billingDescMonthly",
    amount: "$9.99",
  },
  {
    id: "inv-3",
    date: "Mar 12, 2024",
    description: "payment.billingDescMonthly",
    amount: "$9.99",
  },
];

const BILLING_DETAILS = [
  { labelKey: "payment.detailName", value: "Alex Johnson" },
  { labelKey: "payment.detailEmail", value: "alex.johnson@email.com" },
  {
    labelKey: "payment.detailAddress",
    value: "123 Market Street, San Francisco, CA 94103",
  },
  { labelKey: "payment.detailPhone", value: "+1 234 567 8900" },
  { labelKey: "payment.detailTaxId", value: "—" },
] as const;

// ─────────────────────────────────────────────
// Card Brand SVG logos (inline, no external deps)
// ─────────────────────────────────────────────

const VisaLogo = () => (
  <svg viewBox="0 0 60 20" className="h-5 w-auto" aria-label="Visa">
    <text
      x="0"
      y="16"
      fontFamily="Arial, sans-serif"
      fontWeight="700"
      fontSize="18"
      fill="#1A1F71"
      letterSpacing="-0.5"
    >
      VISA
    </text>
  </svg>
);

const MastercardLogo = () => (
  <svg viewBox="0 0 38 24" className="h-6 w-auto" aria-label="Mastercard">
    <circle cx="13" cy="12" r="10" fill="#EB001B" />
    <circle cx="25" cy="12" r="10" fill="#F79E1B" />
    <path d="M19 4.8a10 10 0 0 1 0 14.4A10 10 0 0 1 19 4.8z" fill="#FF5F00" />
  </svg>
);

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

const ReceiptIcon = () => (
  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
    <RefreshCw className="w-3.5 h-3.5 text-primary" />
  </div>
);

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

const PaymentBillingPage = () => {
  const { t } = useLang();
  const [cardMenuOpen, setCardMenuOpen] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-6">
        {/* ── Header ── */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("payment.title")}
          </h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            {t("payment.subtitle")}
          </p>
        </div>

        {/* ── Top Grid: Subscription + Billing History ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Current Subscription */}
          <SubscriptionCard />

          {/* Billing History */}
          <BillingHistory />
        </div>

        {/* ── Bottom Grid: Payment Methods + Billing Details ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Payment Methods */}
          <PaymentMethods />

          {/* Billing Details */}
          <div className="rounded-2xl border border-foreground/8 bg-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                {t("payment.billingDetails")}
              </h2>
              <button className="flex items-center gap-1 text-xs text-foreground/50 hover:text-foreground transition-colors">
                <Pencil className="w-3 h-3" />
                {t("payment.edit")}
              </button>
            </div>

            <ul className="space-y-3 flex-1">
              {BILLING_DETAILS.map(({ labelKey, value }) => (
                <li key={labelKey} className="flex justify-between items-center gap-0.5">
                  <span className="text-xs text-foreground/40">
                    {t(labelKey as any)}
                  </span>
                  <span className="text-sm text-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentBillingPage;
