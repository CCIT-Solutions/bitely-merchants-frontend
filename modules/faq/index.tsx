"use client";
import React, { useState } from "react";
import { faq } from "@/data/FAQ";
import FAQItem from "@/components/faq/FAQItem";
import { useLang } from "@/hooks/useLang";
import Link from "next/link";
import DecorativeParticles from "@/components/animation/DecorativeParticles";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Animate from "@/components/animation/Animate";
import { fade } from "@/lib/animation";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: index * 0.2 },
  }),
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1);
  const { t, lang } = useLang();

  const faqData = faq[lang];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-30 pb-20">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <Animate variants={fade} className="text-center my-16 relative flex flex-col items-center">
          <DecorativeParticles minSize={3} maxSize={4} particleDensity={15} />
          <div className="text-5xl sm:text-6xl font-semibold mb-3 tracking-tight leading-tight max-w-lg">
            {t("faq.title")}
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-xl mt-4 max-w-md">
            {t("faq.description")}
          </p>
        </Animate>

        {/* FAQ Items */}
        <div className="space-y-3 mb-14">
          <AnimatePresence>
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                custom={index}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <FAQItem
                  faq={faq}
                  index={index}
                  openIndex={openIndex}
                  toggleFAQ={toggleFAQ}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Section */}
        <Animate variants={fade}  className="text-center flex flex-col items-center">
          <p className="text-3xl mb-5">{t("faq.stillHaveQuestions")}</p>
          <p className="text-neutral-500 text-sm mb-5 max-w-lg">
            {t("faq.contactDescription")}
          </p>
          <Link
            href="/contact"
            className="bg-primary hover:bg-primary/80 cursor-pointer text-white font-medium text-sm px-8 py-3.5 rounded-full transition-colors duration-200 shadow-sm"
          >
            {t("faq.contactButton")}
          </Link>
        </Animate>
      </div>
    </div>
  );
}
