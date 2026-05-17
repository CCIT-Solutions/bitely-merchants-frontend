"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useLang } from "@/hooks/useLang";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import {
  TrendingDown,
  Flame,
  Target,
  ChefHat,
  ChevronDown,
  ChevronRight,
  Check,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AccountStatCard from "@/components/account/AccountStatCard";
import { GiHotMeal } from "react-icons/gi";
import { MdOutlineElectricBolt } from "react-icons/md";
import { FaWeight } from "react-icons/fa";
import { IoPulseOutline } from "react-icons/io5";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type ProgressTab = "overview" | "weight" | "nutrition" | "activity";
type InsightRange = "1month" | "3months" | "6months" | "1year";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const TABS: { key: ProgressTab; labelKey: string }[] = [
  { key: "overview", labelKey: "progress.overview" },
  { key: "weight", labelKey: "progress.weight" },
  { key: "nutrition", labelKey: "progress.nutrition" },
  { key: "activity", labelKey: "progress.activity" },
];

const INSIGHT_RANGES: { key: InsightRange; labelKey: string }[] = [
  { key: "1month", labelKey: "progress.range1Month" },
  { key: "3months", labelKey: "progress.range3Months" },
  { key: "6months", labelKey: "progress.range6Months" },
  { key: "1year", labelKey: "progress.range1Year" },
];

const PROGRESS_PHOTOS = [
  { date: "Jan 12", kg: 82, emoji: "🧍" },
  { date: "Feb 12", kg: 79, emoji: "🧍" },
  { date: "Mar 12", kg: 84, emoji: "🧍" },
  { date: "Apr 12", kg: 89, emoji: "🧍" },
  { date: "May 12", kg: 73.4, emoji: "🧍" },
];

const MILESTONES = [
  {
    key: "firstWeek",
    labelKey: "progress.milestoneFirstWeek",
    date: "Jan 19, 2026",
    done: true,
  },
  {
    key: "5kgLoss",
    labelKey: "progress.milestone5kg",
    date: "Feb 22, 2026",
    done: true,
  },
  {
    key: "10meals",
    labelKey: "progress.milestone10Meals",
    date: "Mar 15, 2026",
    done: true,
  },
  {
    key: "7dayStreak",
    labelKey: "progress.milestone7Day",
    date: "Apr 10, 2026",
    done: false,
  },
];

// Mock weight data (6 months)
const WEIGHT_DATA = [
  { month: "Jan", kg: 88.6 },
  { month: "Feb", kg: 93},
  { month: "Mar", kg: 87 },
  { month: "Apr", kg: 88 },
  { month: "May", kg: 81.5 },
  { month: "Jun", kg: 80.0 },
];

// Custom Tooltip (matches your reference image)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const weightLoss = (88.6 - payload[0].value).toFixed(1);
    return (
      <div
        className="bg-white p-2 rounded-lg shadow-lg border border-gray-200"
        style={{
          fontSize: "12px",
          color: "#333",
        }}
      >
        <p className="font-bold text-green-600">{`-${weightLoss} kg`}</p>
        <p className="text-gray-500">{`${label} 12, 2026`}</p>
      </div>
    );
  }
  return null;
};

const WeightChart = ({ data, isRTL }: { data: typeof WEIGHT_DATA; isRTL: boolean }) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#88e274" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#88e274" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            tickMargin={10}
            reversed={isRTL} // Reverse X-axis for RTL
          />
          <YAxis
            dataKey="kg"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            tickMargin={isRTL ? 50: 5}
            domain={["dataMin - 2", "dataMax + 2"]}
            tickFormatter={(value) => `${value} kg`}
            orientation={isRTL ? "right" : "left"} // Move Y-axis labels to the right in RTL
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#88e274",
              strokeWidth: 1,
              strokeDasharray: "5 5",
            }}
          />
          <Area
            type="monotone"
            dataKey="kg"
            stroke="none"
            fill="url(#weightGradient)"
          />
          <Line
            type="monotone"
            dataKey="kg"
            stroke="#88e274"
            strokeWidth={3}
            dot={{
              fill: "#88e274",
              stroke: "#fff",
              strokeWidth: 2,
              r: 6,
            }}
            activeDot={{
              fill: "#88e274",
              stroke: "#fff",
              strokeWidth: 2,
              r: 8,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

const MyProgressPage = () => {
  const { t, lang, isRTL } = useLang();
  const [activeTab, setActiveTab] = useState<ProgressTab>("overview");
  const [insightRange, setInsightRange] = useState<InsightRange>("6months");
  const [rangeOpen, setRangeOpen] = useState(false);

  const currentRangeLabel = INSIGHT_RANGES.find(
    (r) => r.key === insightRange,
  )?.labelKey;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-6">
        {/* ── Header ── */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("progress.title")}
          </h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            {t("progress.subtitle")}
          </p>
        </div>

        {/* ── Tabs ── */}
        {/* <div className="flex gap-1 border-b border-foreground/8">
          {TABS.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 -mb-px",
                activeTab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/50 hover:text-foreground",
              )}
            >
              {t(labelKey)}
            </button>
          ))}
        </div> */}

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AccountStatCard
            value="47"
            label={t("profile.mealsCooked")}
            icon={<GiHotMeal />}
          />
          <AccountStatCard
            value={`12 ${t("profile.day")}`}
            label={t("profile.currentStreak")}
            icon={<MdOutlineElectricBolt />}
          />
          <AccountStatCard
            value="-8.6 kg"
            label={t("profile.weightLost")}
            icon={<FaWeight />}
          />
          <AccountStatCard
            value="86%"
            label={t("profile.goalProgress")}
            icon={<IoPulseOutline />}
          />
        </div>

        {/* ── Weight Progress + Insights ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Chart */}
          <div className="lg:col-span-3 rounded-2xl border border-foreground/8 bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              {t("progress.weightProgress")}
            </h2>
            <div className="h-50 w-full">
              <WeightChart data={WEIGHT_DATA} isRTL={isRTL} />
            </div>
          </div>

          {/* Insights */}
          <div className="lg:col-span-2 rounded-2xl border border-foreground/8 bg-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                {t("progress.insights")}
              </h2>
              {/* Range dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRangeOpen((o) => !o)}
                  className="flex items-center gap-1 text-xs text-foreground/50 hover:text-foreground transition-colors"
                >
                  {currentRangeLabel ? t(currentRangeLabel) : ""}
                  <ChevronDown className={"w-3 h-3"} />
                </button>
                {rangeOpen && (
                  <div className="absolute end-0 top-full mt-1 z-10 bg-popover border border-foreground/10 rounded-xl shadow-lg min-w-32 py-1">
                    {INSIGHT_RANGES.map(({ key, labelKey }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setInsightRange(key);
                          setRangeOpen(false);
                        }}
                        className={cn(
                          "w-full text-start px-3 py-1.5 text-xs hover:bg-muted transition-colors",
                          insightRange === key
                            ? "text-primary font-semibold"
                            : "text-foreground/70",
                        )}
                      >
                        {t(labelKey)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <ul className="space-y-3 flex-1">
              {(
                [
                  "progress.insight1",
                  "progress.insight2",
                  "progress.insight3",
                ] as const
              ).map((key) => (
                <li key={key} className="flex items-start gap-2.5">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </span>
                  <span className="text-sm text-foreground/70 leading-snug">
                    {t(key)}
                  </span>
                </li>
              ))}
            </ul>

            <Button className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 justify-between cursor-pointer">
              {t("progress.viewFullReport")}
              <ArrowRight className= {cn("w-4 h-4",  isRTL ? "rotate-180" : "")} />
            </Button>
          </div>
        </div>

        {/* ── Progress Photos + Milestones ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Photos */}
          <div className="lg:col-span-3 rounded-2xl border border-foreground/8 bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              {t("progress.progressPhotos")}
            </h2>
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {PROGRESS_PHOTOS.map((photo) => (
                  <div key={photo.date} className="shrink-0 text-center">
                    <div className="w-[88px] h-[108px] rounded-xl bg-muted/60 border border-foreground/8 flex items-center justify-center text-4xl select-none">
                      {photo.emoji}
                    </div>
                    <p className="text-xs text-foreground/50 mt-1.5">
                      {photo.date}
                    </p>
                    <p className="text-xs font-medium text-foreground">
                      {photo.kg} kg
                    </p>
                  </div>
                ))}
              </div>
              {/* Arrow hint */}
              <div className="absolute end-0 top-1/3 -translate-y-1/2 w-7 h-7 rounded-full bg-background border border-foreground/10 shadow-sm flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-foreground/40" />
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="lg:col-span-2 rounded-2xl border border-foreground/8 bg-card p-5 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">
              {t("progress.milestones")}
            </h2>

            <ul className="space-y-3 flex-1">
              {MILESTONES.map((m) => (
                <li key={m.key} className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                      m.done
                        ? "bg-primary/10 border-primary/30"
                        : "bg-muted border-foreground/15",
                    )}
                  >
                    {m.done ? (
                      <Check className="w-3 h-3 text-primary" />
                    ) : (
                      <Clock className="w-3 h-3 text-foreground/30" />
                    )}
                  </span>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium leading-snug",
                        m.done ? "text-foreground" : "text-foreground/40",
                      )}
                    >
                      {t(m.labelKey)}
                    </p>
                    <p className="text-xs text-foreground/35 mt-0.5">
                      {m.date}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <button className="flex items-center gap-1 text-sm text-primary font-medium hover:opacity-80 transition-opacity mt-1">
              {t("progress.viewAllMilestones")}
              <ArrowRight className={cn("w-3.5 h-3.5", isRTL ? "rotate-180" : "")} />
            </button>
          </div>
        </div>

        {/* ── Coach Banner ── */}
        <CoachBanner t={t} isRTL={isRTL}/>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────

const StatCard = ({
  icon,
  value,
  labelKey,
  t,
}: {
  icon: React.ReactNode;
  value: string;
  labelKey: string;
  t: (key: string) => string;
}) => (
  <div className="rounded-2xl border border-foreground/8 bg-card p-4 flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-lg font-bold text-foreground leading-none">{value}</p>
      <p className="text-xs text-foreground/45 mt-1">{t(labelKey)}</p>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Coach Banner
// ─────────────────────────────────────────────

const CoachBanner = ({ t , isRTL}: { t: (key: string) => string; isRTL: boolean }) => (
  <div className="relative rounded-3xl overflow-hidden bg-muted/50 border border-foreground/5 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
    <div className="absolute -top-8 -end-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
    <div className="absolute bottom-0 start-1/3 w-20 h-20 rounded-full bg-primary/5 blur-xl pointer-events-none" />

    <div className="relative z-10 space-y-1.5">
      <h2 className="text-base font-bold text-foreground">
        {t("progress.coachTitle")}
      </h2>
      <p className="text-sm text-foreground/50 max-w-xs">
        {t("progress.coachSubtitle")}
      </p>
      <Button
        variant="outline"
        className="rounded-full mt-3 border-foreground/15 text-foreground/70 hover:text-foreground gap-2 px-5"
      >
        {t("progress.chatWithCoach")}
        <ArrowRight className={cn("w-3.5 h-3.5",  isRTL ? "rotate-180" : "")} />
      </Button>
    </div>

    <div className="relative z-10 hidden sm:flex w-20 h-20 rounded-full bg-primary/10 items-center justify-center text-4xl select-none shrink-0">
      👩‍💼
    </div>
  </div>
);

export default MyProgressPage;
