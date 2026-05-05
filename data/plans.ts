export interface Plan {
  id: string;
  name: { en: string; ar: string };
  tagline: { en: string; ar: string };
  badge?: { en: string; ar: string };
  price_weekly: number;
  price_monthly: number;
  cta: { en: string; ar: string };
  featured: boolean;
  features: { en: string; ar: string }[];
}

export const plans: Plan[] = [
  {
    id: "starter",
    name: { en: "Starter", ar: "الأساسي" },
    tagline: { en: "For dipping in", ar: "للبداية" },
    price_weekly: 42,
    price_monthly: 148,
    cta: { en: "Start weekly", ar: "ابدأ أسبوعياً" },
    featured: false,
    features: [
      { en: "7 meals per week", ar: "7 وجبات في الأسبوع" },
      { en: "3 menu swaps / week", ar: "3 تبديلات للقائمة / أسبوع" },
      { en: "Basic macro tracking", ar: "تتبع المغذيات الأساسية" },
      { en: "Morning delivery", ar: "توصيل صباحي" },
    ],
  },
  {
    id: "signature",
    name: { en: "Signature", ar: "المميز" },
    tagline: { en: "For a full reset", ar: "لإعادة ضبط كاملة" },
    badge: { en: "Most chosen", ar: "الأكثر اختياراً" },
    price_weekly: 98,
    price_monthly: 345,
    cta: { en: "Start signature", ar: "ابدأ المميز" },
    featured: true,
    features: [
      { en: "21 meals & snacks / week", ar: "21 وجبة وسناك / أسبوع" },
      { en: "Unlimited swaps, pause anytime", ar: "تبديلات غير محدودة، توقف متى شئت" },
      { en: "Dedicated nutritionist, 24/7 chat", ar: "أخصائي تغذية مخصص، دردشة 24/7" },
      { en: "Biweekly check-in call", ar: "مكالمة متابعة كل أسبوعين" },
      { en: "Access to chef's table events", ar: "الوصول إلى فعاليات طاولة الشيف" },
    ],
  },
  {
    id: "performance",
    name: { en: "Performance", ar: "الأداء" },
    tagline: { en: "For the committed", ar: "للجادين" },
    price_weekly: 142,
    price_monthly: 499,
    cta: { en: "Start performance", ar: "ابدأ الأداء" },
    featured: false,
    features: [
      { en: "28 high-protein meals / week", ar: "28 وجبة غنية بالبروتين / أسبوع" },
      { en: "Pre & post-workout pairings", ar: "وجبات ما قبل وبعد التمرين" },
      { en: "InBody check-in, every 4 weeks", ar: "فحص InBody كل 4 أسابيع" },
      { en: "Coach DM access", ar: "وصول مباشر للمدرب" },
    ],
  },
];