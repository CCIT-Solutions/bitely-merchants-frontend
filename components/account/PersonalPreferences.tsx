import React from "react";
import AccountCard from "./AccountCard";
import { useLang } from "@/hooks/useLang";

function PersonalPreferences() {
  const { t } = useLang();

  return (
    <AccountCard title={t("preferences.personalPreferences")}>
      <div className="space-y-3">
        {[
          {
            icon: "🥗",
            label: t("preferences.dietaryPreference"),
            value: t("preferences.highProtein"),
          },
          { icon: "⚠️", label: t("preferences.allergies"), value: t("preferences.nutsDairy") },
          { icon: "⏱", label: t("preferences.cookingTime"), value: t("preferences.thirtyToFortyFiveMin") },
          { icon: "🌶", label: t("preferences.spiceLevel"), value: t("preferences.mild") },
          { icon: "📏", label: t("preferences.units"), value: t("preferences.metric") },
        ].map((p) => (
          <div
            key={p.label}
            className="flex items-center justify-between py-1.5 border-b border-foreground/2 bg-background last:border-0"
          >
            <span className="flex items-center gap-2 text-xs">
              <span>{p.icon}</span>
              <span className="text-foreground/80">
                {p.label}
              </span>
            </span>
            <span className="text-xs font-medium">
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </AccountCard>
  );
}

export default PersonalPreferences;