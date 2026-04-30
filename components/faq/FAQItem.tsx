import React from "react";
import { FiPlus } from "react-icons/fi";
import { LiaTimesSolid } from "react-icons/lia";


interface FAQ {
  question: string;
  answer: string;
}

interface FAQItemProps {
  toggleFAQ: (index: number) => void;
  index: number;
  openIndex: number | null;
  faq: FAQ;
}

function FAQItem({ toggleFAQ, index, openIndex, faq }: FAQItemProps) {
  const isOpen = openIndex === index;

  return (
    <div className="border rounded-2xl border-foreground/10 -mb-px overflow-hidden">
      <button
        onClick={() => toggleFAQ(index)}
        className="w-full px-8 py-6 flex items-center justify-between text-left cursor-pointer"
      >
        <span
          className={`text-[17px] font-medium pr-4 ${
            isOpen ? "text-primary-foreground dark:text-foreground" : ""
          }`}
        >
          {faq.question}
        </span>

        <span
          className={`text-2xl font-light leading-none shrink-0 select-none  border border-foreground/20 rounded-full  size-8 flex justify-center items-center ${
            isOpen ? "bg-foreground/90 text-background dark:bg-primary" : "text-foreground/90"
          }`}
        >
          {isOpen ? <LiaTimesSolid className="size-3.5"/> : <FiPlus className="size-3.5"/>}
        </span>
      </button>

      {isOpen && (
        <div className="px-8 pb-6 pt-0">
          <p className="text-[15px] text-foreground/70  leading-relaxed">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default FAQItem;