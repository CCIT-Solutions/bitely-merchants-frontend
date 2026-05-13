import Currency from "../icons/Currency";
import AccountCard from "./AccountCard";
import { FaCheck } from "react-icons/fa6";
import { FaCircleDot } from "react-icons/fa6";
import { useLang } from "@/hooks/useLang";

function SubscriptionCard() {
  const { t } = useLang();

  return (
    <AccountCard title={t("account.currentSubscription")}>
      <div className="border border-foreground/5 rounded-xl p-4 bg-foreground/2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-foreground/90">
            {t("account.bitelySignature")}
          </p>
          <span className="bg-primary/5 text-green-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-primary/40">
            {t("account.active")}
          </span>
        </div>
        <p className="text-xs text-foreground/40 mb-3 leading-relaxed">
          {t("account.perfectBalanceDescription")}
        </p>
        <div className="space-y-1.5 mb-3">
          {[
            t("account.personalizedMealPlans"),
            t("account.newDishesEveryWeek"),
            t("account.advancedNutritionInsights"),
            t("account.groceryListAndSmartShopping"),
            t("account.prioritySupport"),
          ].map((f) => (
            <div
              key={f}
              className="flex items-center gap-2 text-xs text-foreground/60"
            >
              <FaCheck className="text-green-600" />
              {f}
            </div>
          ))}
        </div>
        <div>
          <div className="text-lg font-bold text-neutral-900">
            <div className="flex gap-1 items-center">
              750 <Currency /> <span className="text-xs font-normal text-foreground/40">
                {t("account.perMonth")}
              </span>
            </div>
          </div>
          <p className="text-xs text-foreground/40">
            {t("account.renewsOn")} June 12, 2026
          </p>
        </div>
      </div>
      <button className="w-full mt-3 text-xs font-medium border border-foreground/2 py-2 rounded-xl hover:bg-foreground/2 bg-background transition-colors text-foreground/60 flex items-center justify-center gap-2">
        <FaCircleDot className="size-3"/>
        {t("account.manageSubscription")}
      </button>
    </AccountCard>
  );
}

export default SubscriptionCard;