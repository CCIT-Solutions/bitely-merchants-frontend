"use client";

import Image from "next/image";
import React from "react";
import Heading from "../shared/headings/Heading";
import Translate from "../shared/Translate";
import { useLang } from "@/hooks/useLang";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

/* ─── Vertical Connector SVGs ───────────────────────────────── */
function ConnectorDown({ toRight = true }) {
  return toRight ? (
    // Arc curves from left-side step down and to the right
    <svg
      viewBox="0 0 80 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        bottom: -16,
        left: "calc(50% - 40px)",
        width: 80,
        height: 64,
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <path
        d="M 40 0 C 40 32, 80 32, 80 64"
        stroke="#6ef843"
        strokeWidth="1.6"
        strokeDasharray="5 4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 72 56 L 80 64 L 87 55"
        stroke="#6ef843"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ) : (
    // Arc curves from right-side step down and to the left
    <svg
      viewBox="0 0 80 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        bottom: -16,
        left: "calc(50% - 40px)",
        width: 80,
        height: 64,
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <path
        d="M 40 0 C 40 32, 0 32, 0 64"
        stroke="#6ef843"
        strokeWidth="1.6"
        strokeDasharray="5 4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M -7 55 L 0 64 L 8 56"
        stroke="#93C5FD"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ─── Steps ──────────────────────────────────────────────────── */
const steps = [
  {
    id: 1,
    label: {
      en: "Tell us who you are",
      ar: "أخبرنا من أنت",
    },
    description: {
      en: "A two-minute quiz maps your body, goals, and kitchen vocabulary. No scales, no guesswork, just you, on paper.",
      ar: "اختبار لمدة دقيقتين يحدد جسمك وأهدافك ومفاهيمك الغذائية. بدون موازين أو تخمين، بكل بساطة",
    },
    image: "/media/images/how-it-works/how-1.jpg",
    side: "left",
  },
  {
    id: 2,
    label: {
      en: "The chefs plot your week",
      ar: "يخطط الطهاة أسبوعك بكل عناية واهتمام",
    },
    description: {
      en: "Seventeen seasonal dishes, rotated every Sunday. Swap any plate, pause any day. Your preferences learn with you.",
      ar: "سبعة عشر طبقًا تتغير كل يوم أحد. يمكنك تبديل أي وجبة أو إيقاف أي يوم، تفضيلاتك أولوية دائما .",
    },
    image: "/media/images/how-it-works/how-2.jpg",
    side: "right",
  },
  {
    id: 3,
    label: {
      en: "We cook. You sleep.",
      ar: " نطبخ لك ، وأنت ترتاح",
    },
    description: {
      en: "Made fresh overnight in our own kitchens. Nothing frozen, nothing shipped. By sunrise it's already on the way.",
      ar: "يتم تحضير وجبتك طازجة خلال المساء. لا شيء مجمد ولا يتم شحنه. مع شروق الشمس تكون في طريقها إليك طازجة.",
    },
    image: "/media/images/how-it-works/how-3.jpg",
    side: "left",
  },
  {
    id: 4,
    label: {
      en: "Breakfast knocks.",
      ar: "يطرق الإفطار بابك في الصباح",
    },
    description: {
      en: "Between 6 and 9 am, a cooled box arrives at your door. Open. Warm if you like. Log it with a tap. Repeat.",
      ar: "بين الساعة 6 و9 صباحًا، تصلك وجبتك إلى بابك. افتحها، سخنها إن أردت، واستمتع بإفطار شهي وصحي.",
    },
    image: "/media/images/how-it-works/how-4.jpg",
    side: "right",
  },
];

/* ─── Main Component ─────────────────────────────────────────── */
export default function HowItWorks() {
  const { lang, isRTL } = useLang();

  return (
    <section className="w-full py-16 px-6 ">
      {/* Heading */}
      <div className="text-center mb-12">
        <Heading
          title={"home.howItWorks.title"}
        />

        <p className="text-foreground/50 text-base max-w-2xl mx-auto leading-relaxed">
          <Translate text="home.howItWorks.subtitle" />
        </p>
      </div>

      {/* Steps — single column on mobile, zigzag on md+ */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="flex-col mx-auto sm:px-6 lg:px-8 max-w-[90vw] lg:w-300 flex items-center justify-between"
      >
        {steps.map((step, index) => {
          const toRight = step.side === "right";
          const connectorSide = isRTL ? toRight : !toRight;
          return (
            <div
              key={step.id}
              className={`relative flex pb-16 last:pb-0 w-full ${
                step.side === "left"
                  ? "justify-start md:justify-start"
                  : "justify-start md:justify-end"
              }`}
            >
              {/* Card — full width on mobile, half width on md+ */}
              <div className="w-full md:w-1/2 flex flex-col">
                {/* Image card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  whileHover={{ scale: 1.02 }}
                  className="w-full aspect-video relative overflow-hidden border border-dashed border-primary rounded-2xl"
                >
                  <Image
                    src={step.image}
                    alt={step.label[lang]}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Label and Description */}
                <div className="mt-4">
                  <p className="text-xs font-bold text-primary tracking-widest mb-1">
                    {String(step.id).padStart(2, "0")}
                  </p>
                  <p className="text-2xl font-bold text-foreground/80 mb-1">
                    {step.label[lang]}
                  </p>
                  <p className="text-sm text-foreground/50 leading-relaxed">
                    {step.description[lang]}
                  </p>
                </div>
              </div>

              {/* Connector arc — only on md+ and not on last step */}
              {index < steps.length - 1 && (
                <div className="hidden md:block">
                  <ConnectorDown toRight={connectorSide} />
                </div>
              )}
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
