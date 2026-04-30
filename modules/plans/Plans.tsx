import { Separator } from "@/components/ui/separator";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

export interface PlanFeature {
  id: string;
  en: string;
  ar: string;
}

export interface PlanItem {
  id: string;
  title: { en: string; ar: string };
  price: number;
  monthly: string;
  features: PlanFeature[];
  recommended?: boolean;
}

export const planFeatures: PlanFeature[] = [
  { id: "branches", en: "Branch Numbers", ar: "عدد الفروع" },
  { id: "website", en: "website", ar: "موقع الكتروني" },
  { id: "contracts", en: "contracts", ar: "العقود" },
  { id: "booking", en: "Booking Number Per Month", ar: "عدد الحجوزات الشهرية" },
  { id: "cars", en: "Car Number", ar: "عدد السيارات" },
  { id: "employees", en: "Employees", ar: "الموظفين" },
  { id: "live", en: "Live notifications", ar: "الإشعارات الفورية" },
  { id: "email", en: "Email notifications", ar: "إشعارات البريد الإلكتروني" },
  { id: "report", en: "Report", ar: "التقارير" },
  { id: "domain", en: "Private Domain", ar: "دومين خاص" },
  { id: "sms", en: "Sms", ar: "رسايل SMS" },
  { id: "coupons", en: "Coupons", ar: "الكبونات" },
  { id: "payment", en: "Online Payment", ar: "الدفع الإلكتروني" },
];

export const plans: PlanItem[] = [
  {
    id: "basic",
    title: { en: "Basic", ar: "الاساسية" },
    price: 181,
    monthly: "/month",
    features: planFeatures,
    recommended: true,
  },
  {
    id: "starter",
    title: { en: "Starter", ar: "الابتدائية" },
    price: 192,
    monthly: "/month",
    features: planFeatures,
  },
  {
    id: "default",
    title: { en: "Default Plan", ar: "الباقة الافتراضية" },
    price: 0,
    monthly: "/month",
    features: planFeatures,
  },
];

interface Props {
  plan: PlanItem;
  lang: "en" | "ar";
  isRTL: boolean;
  index: number;
}

export const PlanCard: React.FC<Props> = ({ plan, lang, isRTL, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`rounded-3xl px-10 py-6 mb-6 shadow-lg ${
        plan.recommended
          ? " bg-primary text-primary-foreground"
          : "border bg-white dark:bg-slate-950"
      } ${isRTL ? "text-right" : ""}`}
    >
      <div className="flex items-end justify-between mb-1">
        <div>
          {plan.recommended && (
            <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-bold inline-block mb-2">
              {isRTL ? "موصي به" : "Recommended"}
            </span>
          )}

          <h2 className=" text-2xl font-bold">{plan.title[lang]}</h2>
        </div>

        <div className="text-right flex gap-1 items-end">
          <div className=" text-4xl sm:text-5xl font-bold">
            {" "}
            <span className="me-1">SR</span>
            {plan.price}{" "}
          </div>
          <div
            className={cn(
              "text-sm",
              plan.recommended ? " text-neutral-100" : "text-neutral-500 dark:text-neutral-300"
            )}
          >
            {isRTL ? "/شهر" : plan.monthly}
          </div>
        </div>
      </div>

      <Separator
        className={cn(
          "my-6",
          plan.recommended ? " bg-neutral-500" : "text-neutral-200"
        )}
      />

      {/* Features */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        {plan.features.map((feature, featureIndex) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.3,
              delay: index * 0.05 + featureIndex * 0.05,
            }}
            className="flex items-center gap-2"
          >
            <div className="w-5 h-5 bg-teal-400 text-white rounded-full flex items-center justify-center">
              <Check className="size-3" />
            </div>
            <span className=" text-xs">{feature[lang]}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between items-center gap-4">
        <div
          className={cn(
            plan.recommended ? "text-neutral-200" : "text-neutral-500",
            " text-xs"
          )}
        >
          {isRTL
            ? "جميع الأسعار بالريال السعودي شاملة ضريبة القيمة المضافة والرسوم."
            : "All prices in SAR, including VAT & Fees."}
        </div>

        <button
          className={cn(
            "   text-black py-3 px-10 rounded-full font-semibold  transition-colors cursor-pointer text-xs shrink-0",
            plan.recommended
              ? "bg-white hover:bg-neutral-100"
              : "bg-neutral-200/50 hover:bg-neutral-200 dark:bg-neutral-100 dark:hover:bg-white"
          )}
        >
          {isRTL ? "اختر الباقة" : "Choose Plan"}
        </button>
      </div>
    </motion.div>
  );
};

export default function Plans() {
  const { t, lang, isRTL } = useLang();
  return (
    <div>
      {plans.map((p, index) => (
        <PlanCard key={p.id} plan={p} lang={lang} isRTL={isRTL} index={index} />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: plans.length * 0.05 }}
        className="flex justify-center"
      >
        <button className="text-neutral-600 font-medium hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-50 transition-colors rounded-full border px-6 py-2 text-sm cursor-pointer mt-8">
          {t("shared.learnMore")}
        </button>
      </motion.div>
    </div>
  );
}