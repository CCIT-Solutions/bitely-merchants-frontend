"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLang } from "@/hooks/useLang";
import {
  CheckCircle2,
  ChefHat,
  Bike,
  PackageCheck,
  ArrowRight,
  Headphones,
  RotateCcw,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order, OrderStatus, OrderTab } from "@/types/orders";
import { orders } from "@/data/orders";
import Currency from "@/components/icons/Currency";

// ─────────────────────────────────────────────
// Status stepper config
// ─────────────────────────────────────────────

const STATUS_STEPS: { key: OrderStatus; labelKey: string; Icon: React.FC<{ className?: string }> }[] = [
  { key: "confirmed",   labelKey: "orders.confirmed",  Icon: ({ className }) => <CheckCircle2 className={className} /> },
  { key: "preparing",   labelKey: "orders.preparing",  Icon: ({ className }) => <ChefHat className={className} /> },
  { key: "on_the_way",  labelKey: "orders.onTheWay",   Icon: ({ className }) => <Bike className={className} /> },
  { key: "delivered",   labelKey: "orders.delivered",  Icon: ({ className }) => <PackageCheck className={className} /> },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  confirmed: 0,
  preparing: 1,
  on_the_way: 2,
  delivered: 3,
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const formatDate = (iso: string, lang: string) =>
  new Date(iso).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatShortDate = (iso: string, lang: string) =>
  new Date(iso).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    month: "short",
    day: "numeric",
  });

// ─────────────────────────────────────────────
// Status Stepper
// ─────────────────────────────────────────────

const OrderStepper = ({ status, t }: { status: OrderStatus; t: (k: string) => string }) => {
  const currentIdx = STATUS_INDEX[status];

  return (
    <div className="flex items-start justify-between w-full mt-2 mb-1 relative">
      {STATUS_STEPS.map(({ key, labelKey, Icon }, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <React.Fragment key={key}>
            <div className="flex flex-col items-center gap-1 flex-1 relative z-10">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all",
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : active
                    ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "bg-background border-foreground/15 text-foreground/30"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span
                className={cn(
                  "text-[8px] text-center leading-tight",
                  active ? "font-bold text-foreground" : done ? "text-foreground/60" : "text-foreground/30"
                )}
              >
                {t(labelKey)}
              </span>
            </div>

            {/* Connector line */}
            {idx < STATUS_STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mt-3 relative">
                <div className="absolute inset-0 bg-foreground/10 rounded-full" />
                <div
                  className={cn(
                    "absolute inset-y-0 start-0 bg-primary rounded-full transition-all duration-500",
                    done ? "end-0" : "end-full"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────
// Active Order Card
// ─────────────────────────────────────────────

const ActiveOrderCard = ({
  order,
  lang,
  t,
}: {
  order: Order;
  lang: string;
  t: (k: string) => string;
}) => {
  const statusLabelKey = `orders.${order.status}`;

  return (
    <div className="rounded-xl border border-foreground/8 bg-card overflow-hidden shadow-sm">
      {/* Status bar */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <span className="text-xs font-semibold text-primary capitalize">
          {t(statusLabelKey)}
        </span>
        {order.deliveryDate && (
          <span className="text-xs text-foreground/50">
            {t("orders.deliveryToday")} {formatShortDate(order.deliveryDate, lang)}
          </span>
        )}
      </div>

      {/* Meal info row */}
      <div className="flex items-start gap-2 px-3 py-2">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
          <Image
            src={order.image}
            alt={order.planName[lang as "en" | "ar"]}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground/40 mb-0.5">
            {t("orders.orderNumber")} #{order.orderNumber}
          </p>
          <h3 className="text-sm font-bold text-foreground leading-snug">
            {order.planName[lang as "en" | "ar"]}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-foreground/50 flex-wrap">
            <span>
              {order.meals} {t("orders.meals")}
            </span>
            <span className="w-1 h-1 rounded-full bg-foreground/30 shrink-0" />
            <span>
              {formatShortDate(order.dateFrom, lang)}
              {order.dateTo && ` – ${formatShortDate(order.dateTo, lang)}`}
            </span>
          </div>
        </div>
        <span className="text-sm font-bold text-foreground shrink-0 flex gap-1 items-center">
          {order.price.toFixed(2)} <Currency />
        </span>
      </div>

      {/* Stepper */}
      <div className="px-3">
        <OrderStepper status={order.status} t={t} />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 px-3 py-3 border-t border-foreground/6">
        <Button
          variant="outline"
          className="rounded-lg border-foreground/15 text-xs font-medium h-8"
        >
          {t("orders.viewDetails")}
        </Button>
        <Button className="rounded-lg bg-primary text-primary-foreground text-xs font-medium h-8 gap-1 hover:bg-primary/90">
          <MapPin className="w-3 h-3" />
          {t("orders.trackOrder")}
        </Button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Past Order Row
// ─────────────────────────────────────────────

const PastOrderRow = ({
  order,
  lang,
  t,
}: {
  order: Order;
  lang: string;
  t: (k: string) => string;
}) => (
  <div className="flex items-center gap-2 py-3 border-b border-foreground/6 last:border-0">
    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
      <Image
        src={order.image}
        alt={order.planName[lang as "en" | "ar"]}
        fill
        className="object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      {order.deliveryDate && (
        <p className="text-[10px] text-foreground/40 mb-0.5">
          {t("orders.deliveredOn")} {formatDate(order.deliveryDate, lang)}
        </p>
      )}
      <h3 className="text-sm font-semibold text-foreground leading-snug">
        {order.planName[lang as "en" | "ar"]}
      </h3>
      <p className="text-xs text-foreground/40 mt-0.5">
        {t("orders.orderNumber")} #{order.orderNumber}
      </p>
    </div>
    <div className="flex flex-col items-end gap-1 shrink-0">
      <span className="text-sm font-bold text-foreground flex gap-1 items-center">
        {order.price.toFixed(2)} <Currency />
      </span>
      <Button
        variant="outline"
        size="sm"
        className="rounded-lg border-foreground/15 text-xs h-6 gap-1 px-2"
      >
        <RotateCcw className="w-2.5 h-2.5" />
        {t("orders.reorder")}
      </Button>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Cancelled Order Row
// ─────────────────────────────────────────────

const CancelledOrderRow = ({
  order,
  lang,
  t,
}: {
  order: Order;
  lang: string;
  t: (k: string) => string;
}) => (
  <div className="flex items-center gap-2 py-3 border-b border-foreground/6 last:border-0">
    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 opacity-60">
      <Image
        src={order.image}
        alt={order.planName[lang as "en" | "ar"]}
        fill
        className="object-cover grayscale"
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-foreground/40 mb-0.5">
        {t("orders.cancelledOn")}{" "}
        {order.deliveryDate ? formatDate(order.deliveryDate, lang) : "—"}
      </p>
      <h3 className="text-sm font-semibold text-foreground/60 leading-snug line-through">
        {order.planName[lang as "en" | "ar"]}
      </h3>
      <p className="text-xs text-foreground/40 mt-0.5">
        {t("orders.orderNumber")} #{order.orderNumber}
      </p>
    </div>
    <div className="flex flex-col items-end gap-1 shrink-0">
      <span className="text-sm font-bold text-foreground/50 flex gap-1 items-center">
        {order.price.toFixed(2)} <Currency />
      </span>
      <Badge
        variant="secondary"
        className="text-[10px] bg-destructive/10 text-destructive border-0 px-2 py-0.5"
      >
        {t("orders.cancelled")}
      </Badge>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Support Banner
// ─────────────────────────────────────────────

const SupportBanner = ({ t }: { t: (k: string) => string }) => (
  <div className="relative rounded-2xl overflow-hidden bg-muted/50 border border-foreground/5 px-4 py-4 flex items-center justify-between gap-3">
    <div className="absolute -top-4 -end-4 w-20 h-20 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
    <div className="relative z-10">
      <h2 className="text-sm font-bold text-foreground">
        {t("orders.supportTitle")}
      </h2>
      <p className="text-xs text-foreground/50 mt-0.5">
        {t("orders.supportSubtitle")}
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-3 rounded-full border-foreground/20 text-xs gap-1.5 px-3"
      >
        {t("orders.contactSupport")}
      </Button>
    </div>
    <div className="relative z-10 shrink-0 text-4xl select-none hidden sm:block">
      <Headphones className="w-12 h-12 text-primary/40" strokeWidth={1.5} />
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Tabs config
// ─────────────────────────────────────────────

const TABS: { key: OrderTab; labelKey: string }[] = [
  { key: "active",    labelKey: "orders.activeOrders" },
  { key: "past",      labelKey: "orders.pastOrders" },
  { key: "cancelled", labelKey: "orders.cancelled" },
];

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

const MyOrdersPage = () => {
  const { t, lang } = useLang();
  const isRtl = lang === "ar";

  const [activeTab, setActiveTab] = useState<OrderTab>("active");
  const [showAllPast, setShowAllPast] = useState(false);

  const PAST_PREVIEW = 2;

  const activeOrders = orders.filter((o) => o.tab === "active");
  const pastOrders = orders.filter((o) => o.tab === "past");
  const cancelledOrders = orders.filter((o) => o.tab === "cancelled");

  const visiblePast = showAllPast ? pastOrders : pastOrders.slice(0, PAST_PREVIEW);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-xl mx-auto px-3 sm:px-4 pb-6 space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {t("orders.myOrders")}
          </h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            {t("orders.subtitle")}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-foreground/8 overflow-x-auto pb-1 -mx-3 px-3">
          {TABS.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 -mb-px",
                activeTab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/50 hover:text-foreground"
              )}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>

        {/* Active Orders */}
        {activeTab === "active" && (
          <div className="space-y-3">
            {activeOrders.length === 0 ? (
              <EmptyState message={t("orders.noActiveOrders")} />
            ) : (
              activeOrders.map((order) => (
                <ActiveOrderCard key={order.id} order={order} lang={lang} t={t} />
              ))
            )}

            {/* Past orders preview section */}
            {pastOrders.length > 0 && (
              <div className="pt-2">
                <h2 className="text-base font-bold text-foreground mb-2">
                  {t("orders.pastOrders")}
                </h2>
                <div className="rounded-xl border border-foreground/8 bg-card px-3 divide-y divide-foreground/6 shadow-sm">
                  {visiblePast.map((order) => (
                    <PastOrderRow key={order.id} order={order} lang={lang} t={t} />
                  ))}
                </div>

                {pastOrders.length > PAST_PREVIEW && (
                  <button
                    onClick={() => setShowAllPast((v) => !v)}
                    className="mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {showAllPast
                      ? t("orders.showLess")
                      : t("orders.viewAllPastOrders")}
                    <ArrowRight className={cn("w-4 h-4 transition-transform", isRtl && "rotate-180", showAllPast && "rotate-90")} />
                  </button>
                )}
              </div>
            )}

            <SupportBanner t={t} />
          </div>
        )}

        {/* Past Orders Tab */}
        {activeTab === "past" && (
          <div className="space-y-3">
            {pastOrders.length === 0 ? (
              <EmptyState message={t("orders.noPastOrders")} />
            ) : (
              <div className="rounded-xl border border-foreground/8 bg-card px-3 shadow-sm">
                {pastOrders.map((order) => (
                  <PastOrderRow key={order.id} order={order} lang={lang} t={t} />
                ))}
              </div>
            )}
            <SupportBanner t={t} />
          </div>
        )}

        {/* Cancelled Tab */}
        {activeTab === "cancelled" && (
          <div className="space-y-3">
            {cancelledOrders.length === 0 ? (
              <EmptyState message={t("orders.noCancelledOrders")} />
            ) : (
              <div className="rounded-xl border border-foreground/8 bg-card px-3 shadow-sm">
                {cancelledOrders.map((order) => (
                  <CancelledOrderRow key={order.id} order={order} lang={lang} t={t} />
                ))}
              </div>
            )}
            <SupportBanner t={t} />
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
      <PackageCheck className="w-6 h-6 text-foreground/25" />
    </div>
    <p className="text-sm text-foreground/50">{message}</p>
  </div>
);

export default MyOrdersPage;
export type { Order, OrderStatus, OrderTab };