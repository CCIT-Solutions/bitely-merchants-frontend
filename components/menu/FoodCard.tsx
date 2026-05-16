import { FoodItem } from "@/types/menu";
import { useLang } from "@/hooks/useLang";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FaHeart } from "react-icons/fa6";

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

interface FoodCardProps {
  item: FoodItem;
  className?: string;
  isFavourite?: boolean;
  onToggleFavourite?: (id: string) => void;
}

const FoodCard = ({
  item,
  className,
  isFavourite = false,
  onToggleFavourite,
}: FoodCardProps) => {
  const { lang, t } = useLang();

  return (
    <div
      className={cn(
        "flex flex-col gap-3 items-start text-start w-full",
        className
      )}
    >
      {/* Image wrapper */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden group">
        <Image
          src={item.image}
          alt={item.name[lang]}
          fill
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Favourite button */}
        <button
          aria-label={isFavourite ? t("menu.unfavourite") : t("menu.favourite")}
          onClick={() => onToggleFavourite?.(item.id)}
          className={cn(
            "absolute top-2.5 inset-e-2.5 size-7 rounded-full flex items-center justify-center bg-background/10 cursor-pointer",
            "shadow-md backdrop-blur-xs transition-all duration-200",
            isFavourite
              ? " text-red-400 scale-110"
              : " text-foreground/40 hover:text-red-400"
          )}
        >
          <FaHeart
            className={cn("size-4", isFavourite && "fill-red")}
            strokeWidth={isFavourite ? 0 : 2}
          />
        </button>

        {/*.category badge */}
        {item.category && (
          <span className="absolute bottom-2.5 start-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm text-foreground/70 capitalize">
            {t(`menu.${item.category}`)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between gap-0.5 w-full grow">
        <div>
          <h3 className="text-sm font-bold text-foreground/80 line-clamp-1">
            {item.name[lang]}
          </h3>
          <p className="text-xs text-foreground/50 line-clamp-1">
            {item.description?.[lang] || item.name[lang]}
          </p>
        </div>

        {item.customMacros ? (
          <div className="flex flex-col justify-center items-center gap-1.5 my-4 border border-foreground/5 rounded-xl h-full grow py-4">
            <div className="flex gap-2">
              {(["protein", "carbs", "fat", "calories"] as MacroKey[]).map(
                (k) => (
                  <div
                    key={k}
                    className={cn(
                      "w-2 h-2 rounded-full border border-white animate-pulse",
                      macroColors[k]
                    )}
                  />
                )
              )}
            </div>
            <span className="text-xs text-foreground/40">
              {t("menu.customizableMacros")}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 flex-wrap my-3">
            {macrosConfig.map(({ key, labelKey, unit }) => {
              const value = item[key as keyof FoodItem] as number | undefined;
              if (value === undefined) return null;
              return (
                <div
                  key={key}
                  className="flex items-center justify-center gap-1 py-3 border border-foreground/5 rounded-xl dark:bg-primary-foreground/20  px-2"
                  title={`${value} ${unit} ${t(labelKey)}`}
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      macroColors[key]
                    )}
                  />
                  <span className="text-xs text-foreground/80 line-clamp-1">
                    {value}
                    {unit} {t(labelKey)}
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
