"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
const items = [
  { en: "Weekly menu", ar: "قائمة أسبوعية" },
  { en: "Chef-crafted", ar: "من إعداد الشيف" },
  { en: "Nutritionist-tuned", ar: "مصمم من قبل أخصائي تغذية" },
  { en: "Delivered fresh", ar: "توصيل طازج" },
  { en: "Real food, measured", ar: "طعام صحي محسوب بدقة" },
  { en: "Pause anytime", ar: "إيقاف الاشتراك في أي وقت" },
  { en: "Balanced nutrition", ar: "تغذية متوازنة" },
  { en: "High-protein meals", ar: "وجبات عالية البروتين" },
  { en: "Clean ingredients", ar: "مكونات نظيفة وطبيعية" },
  { en: "No processed junk", ar: "بدون أطعمة مُصنّعة" },
  { en: "Macro-friendly plans", ar: "خطط مناسبة للماكروز" },
  { en: "Seasonal recipes", ar: "وصفات موسمية" },
  { en: "Portion controlled", ar: "وجبات غذائية محسوبة" },
  { en: "Every calorie counts", ar: "كل سعرة حرارية محسوبة" },
  { en: "Freshly prepared daily", ar: "تحضير طازج يوميًا" },
  { en: "Tailored to goals", ar: "مصممة حسب أهدافك" },
  { en: "Healthy made easy", ar: "الصحة أصبحت أسهل" },
  { en: "Family-sized portions", ar: "وجبات بحجم عائلي" },
  { en: "Kid-friendly options", ar: "خيارات مناسبة للأطفال" },
  { en: "Meals everyone loves", ar: "وجبات يحبها الجميع" },
  { en: "Balanced for all ages", ar: "متوازن لجميع الأعمار" },
  { en: "Wholesome family dinners", ar: "عشاء عائلي متكامل" },
  { en: "Nutrition for the whole family", ar: "تغذية متكاملة لكل العائلة" },
  { en: "Made to share", ar: "مصممة للمشاركة" },
  { en: "Together at the table", ar: "معًا على مائدة واحدة" }
];

export default function Ticker({ isRTL }: { isRTL: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    setDistance(el.scrollWidth / 2);
  }, []);

  const displayItems = isRTL
    ? [...items].reverse().map((i) => i.ar)
    : items.map((i) => i.en);

  return (
    <div
      className="overflow-hidden w-full border-y py-3 border-primary mt-10 md:mt-70 xl:mt-35"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        className="flex w-max"
        animate={{
          x: isRTL ? distance : -distance,
        }}
        transition={{
          ease: "linear",
          duration: 20,
          repeat: Infinity,
        }}
      >
        {/* FIRST COPY */}
        <div ref={containerRef} className="flex">
          {displayItems.map((text, i) => (
            <div key={`a-${i}`} className="flex items-center shrink-0 px-6">
              <span className="text-sm font-medium text-primary-foreground dark:text-foreground">
                {text}
              </span>
              <span className="text-primary ms-6">✦</span>
            </div>
          ))}
        </div>

        {/* SECOND COPY */}
        <div className="flex">
          {displayItems.map((text, i) => (
            <div key={`b-${i}`} className="flex items-center shrink-0 px-6">
              <span className="text-sm font-medium text-primary-foreground dark:text-foreground">
                {text}
              </span>
              <span className="text-primary ms-6">✦</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}