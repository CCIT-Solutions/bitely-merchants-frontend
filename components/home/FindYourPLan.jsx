import { MEAL_PLANS } from '@/data';
import React, { useRef, useState } from 'react'
import {
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

export const MacroBar = ({
  protein,
  carbs,
  fat,
  isPercent,
  lang,
}) => {
  const total = protein + carbs + fat;
  const pPct = Math.round((protein / total) * 100);
  const cPct = Math.round((carbs / total) * 100);
  const fPct = 100 - pPct - cPct;

  const labels = {
    protein: { en: "Protein", ar: "بروتين" },
    carbs: { en: "Carbs", ar: "كربوهيدرات" },
    fat: { en: "Fat", ar: "دهون" },
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex w-full h-1.5 gap-0.5 rounded-full overflow-hidden">
        <div
          className="bg-[#987dde] rounded-l-full"
          style={{ width: `${pPct}%` }}
        />
        <div className="bg-[#f4b248]" style={{ width: `${cPct}%` }} />
        <div
          className="bg-[#64acec] rounded-r-full"
          style={{ width: `${fPct}%` }}
        />
      </div>

      <div className="flex justify-between w-full text-[10px] text-[#343b42]">
        <span>
          {isPercent ? `${protein}%` : `${protein}g`} {labels.protein[lang]}
        </span>
        <span>
          {isPercent ? `${carbs}%` : `${carbs}g`} {labels.carbs[lang]}
        </span>
        <span>
          {isPercent ? `${fat}%` : `${fat}g`} {labels.fat[lang]}
        </span>
      </div>
    </div>
  );
};


function FindYourPLan() {
    const [mealPlanIndex, setMealPlanIndex] = useState(0);
     const mealPlanScrollRef = useRef<HTMLDivElement>(null);
     const visibleMealPlans = MEAL_PLANS.slice(mealPlanIndex, mealPlanIndex + 3);

  return (
   <section className="w-full flex flex-col gap-8 items-start">
        <div className="w-full flex flex-col items-center text-center pt-[80px] lg:pt-[120px] px-5 lg:px-0 gap-8">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end w-full max-w-[1200px] gap-6">
            <div className="flex flex-col gap-4 items-center lg:items-start text-center lg:text-start">
              <h2
                className="text-[#343b42] font-black"
                style={{ fontSize: "40px", lineHeight: "44px" }}
              >
                Find your perfect meal plan
              </h2>
              <p className="text-[#697886] text-base">
                Starting at BHD 3/meal and BHD 2/breakfast
              </p>
            </div>
            <div className="flex items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
              <a
                href="/en/plans-and-packages"
                className="inline-flex items-center justify-center h-[52px] w-[145px] bg-[#24a170] text-white font-bold rounded-full hover:bg-[#1c7e57] transition-colors text-sm"
              >
                See plans
              </a>
              <div className="hidden lg:flex gap-3">
                <button
                  onClick={() =>
                    setMealPlanIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={mealPlanIndex === 0}
                  className="w-[52px] h-[52px] flex items-center justify-center rounded-full border border-[#ebedef] bg-white disabled:opacity-40 hover:border-[#24a170] transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setMealPlanIndex((prev) =>
                      Math.min(MEAL_PLANS.length - 3, prev + 1)
                    )
                  }
                  disabled={mealPlanIndex >= MEAL_PLANS.length - 3}
                  className="w-[52px] h-[52px] flex items-center justify-center rounded-full border border-[#ebedef] bg-white disabled:opacity-40 hover:border-[#24a170] transition-colors"
                >
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Meal plan cards */}
        <div
          ref={mealPlanScrollRef}
          className="w-full overflow-x-auto flex gap-6 pb-[80px] lg:pb-[120px] scrollbar-hide"
        >
          <div className="flex gap-6 pl-5 pr-5 lg:pl-[max(20px,calc((100vw-1200px)/2))] lg:pr-[max(20px,calc((100vw-1200px)/2))]">
            {MEAL_PLANS.map((plan) => {
              const card = (
                <div className="relative w-[293px] lg:w-[328px] h-[465px] lg:h-[550px] rounded-[18px] overflow-hidden flex flex-col justify-end flex-shrink-0 group">
                  {plan.href && (
                    <span className="absolute top-4 right-4 z-10 px-3 py-2 bg-white rounded-full text-xs font-bold text-[#24a170] border border-[#ebedef] lg:hidden">
                      Learn More
                    </span>
                  )}
                  <img
                    src={plan.image}
                    alt={`${plan.title} background`}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="relative z-10 p-[18px]">
                    <div className="flex w-full items-center gap-4 bg-white rounded-[16px] px-5 py-3">
                      <div className="flex flex-col gap-2 w-full">
                        <p className="text-[#343b42] text-xs font-bold">
                          {plan.title}
                        </p>
                        {/* <MacroBar
                          protein={plan.protein}
                          carbs={plan.carbs}
                          fat={plan.fat}
                          isPercent={plan.isPercent}
                        /> */}
                      </div>
                    </div>
                  </div>
                </div>
              );
              return plan.href ? (
                <a key={plan.title} href={plan.href} className="block h-full">
                  {card}
                </a>
              ) : (
                <div key={plan.title}>{card}</div>
              );
            })}
          </div>
        </div>
      </section>
  )
}

export default FindYourPLan