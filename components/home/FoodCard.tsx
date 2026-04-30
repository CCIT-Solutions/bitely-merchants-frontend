import { FoodItem } from "@/types/menu";
import React from "react";
import { useLang } from "@/hooks/useLang";
import Image from "next/image";

type MacroKey = "protein" | "carbs" | "fat" | "calories";

const macroColors = {
  protein: "bg-green-500",
  carbs: "bg-amber-500",
  fat: "bg-blue-500",
  calories: "bg-red-500",
};

const macrosConfig: {
  key: MacroKey;
  labelKey: string;
  unit: string;
}[] = [
  { key: "protein", labelKey: "menu.protein", unit: "g" },
  { key: "carbs", labelKey: "menu.carbs", unit: "g" },
  { key: "fat", labelKey: "menu.fat", unit: "g" },
  { key: "calories", labelKey: "menu.kcal", unit: "" },
];

const FoodCard = ({ item }: { item: FoodItem }) => {
  const { lang, t } = useLang();

  return (
    <div
      className="flex flex-col gap-5 items-start text-start w-67.5 md:w-60 shrink-0"
    >
      <div className="relative w-67.5 h-67.5 md:w-60 md:h-60 rounded-4xl overflow-hidden">
        <Image
          src={item.image}
          alt={item.name[lang]}
          fill
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col gap-0.5 w-full grow">
        <h3 className="text-sm font-bold text-foreground/80">
          {item.name[lang]}
        </h3>
        <p className="text-xs text-foreground/50">
          {item.description?.[lang] || item.name[lang]}
        </p>

        {item.customMacros ? (
          <div className="flex flex-col justify-center items-center gap-1.5 my-4 border border-foreground/5 rounded-xl h-full grow">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 border border-white animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-amber-500 border border-white animate-pulse -ml-0.5" />
              <div className="w-2 h-2 rounded-full bg-blue-500  border border-white animate-pulse -ml-0.5" />
              <div className="w-2 h-2 rounded-full bg-red-500  border border-white animate-pulse -ml-0.5" />
            </div>
            <span className="text-xs text-foreground/40">
              {t("menu.customizableMacros")}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 flex-wrap my-4">
            {macrosConfig.map(({ key, labelKey, unit }) => {
              const value = item[key];
              if (value === undefined) return null;

              return (
                <div
                  key={key}
                  className="flex items-center justify-center gap-1 py-4 border border-foreground/5 rounded-xl"
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${macroColors[key]}`}
                  />
                  <span className="text-xs text-foreground/80">
                    {value}
                    {unit && unit} {t(labelKey)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;