"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Currency from "@/components/icons/Currency";
import { motion } from "framer-motion";
import Translate from "@/components/shared/Translate";

export default function MealPlanner({isRTL}: {isRTL: boolean}) {

  const [goal, setGoal] = useState("lean");
  const [kcal, setKcal] = useState(1800);
  const [meals, setMeals] = useState(2);

  const goals = [
    {
      id: "lean",
      title: <Translate text="home.mealPlanner.goals.lean.title" />,
      sub: <Translate text="home.mealPlanner.goals.lean.sub" />,
      kcalOffset: -400,
      meals: 2,
      mult: 1,
    },
    {
      id: "balance",
      title: <Translate text="home.mealPlanner.goals.balance.title" />,
      sub: <Translate text="home.mealPlanner.goals.balance.sub" />,
      kcalOffset: 0,
      meals: 3,
      mult: 1.08,
    },
    {
      id: "build",
      title: <Translate text="home.mealPlanner.goals.build.title" />,
      sub: <Translate text="home.mealPlanner.goals.build.sub" />,
      kcalOffset: 400,
      meals: 4,
      mult: 1.18,
    },
  ];

  const selectedGoal = goals.find((g) => g.id === goal);

  const price = (
    14 *
    (kcal / 2000) *
    (selectedGoal?.mult || 1) *
    (meals / 2)
  ).toFixed(2);

  return (
    <motion.div
      whileHover={{
        x: -8,
        y: -14,
        transition: {
          type: "spring",
          stiffness: 120,
          damping: 14,
        },
      }}
      className="md:absolute -bottom-[50%] -inset-e-10 md:inset-e-[15%] xl:-inset-s-20 z-1 w-full md:w-fit h-fit"
    >
      <div className="rounded-2xl shadow-sm border border-dashed border-primary bg-background/50 backdrop-blur-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-foreground/60">
              <Translate text="home.mealPlanner.header.title" />
            </p>
          </div>
          <span className="text-xs text-green-500">
            <span className="animate-pulse">●</span> <Translate text="home.mealPlanner.header.live" />
          </span>
        </div>

        <div className="px-4 py-3 border-t border-dashed border-primary rounded-xl space-y-3">
          {/* Goals */}
          <div>
            <p className="text-sm mb-2">
              <Translate text="home.mealPlanner.goals.title" />
            </p>
            <div className="grid grid-cols-3 gap-2">
              {goals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setGoal(g.id);
                    const baseKcal = 1800;
                    setKcal(baseKcal + g.kcalOffset);
                    setMeals(g.meals);
                  }}
                  className={`p-3 rounded-xl border text-start text-sm transition cursor-pointer ${
                    goal === g.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-foreground/10 text-foreground"
                  }`}
                >
                  <div className={`font-medium ${isRTL ? "text-xs" :""}`}>{g.title}</div>
                  <div className="text-xs text-foreground/80">{g.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Calories */}
          <div>
            <p className="text-sm mb-2">
              <Translate text="home.mealPlanner.calories.title" />
            </p>
            <Slider
              min={1200}
              max={3200}
              step={50}
              value={[kcal]}
              onValueChange={(val) => setKcal(val[0])}
              className="mx-auto w-full max-w-xs"
            />
            <p className="text-sm mt-1">
              {kcal} <Translate text="home.mealPlanner.calories.unit" />
            </p>
          </div>

          {/* Meals */}
          <div>
            <p className="text-sm mb-2">
              <Translate text="home.mealPlanner.meals.title" />
            </p>
            <div className="flex gap-2">
              {[2, 3, 4].map((m) => (
                <button
                  key={m}
                  onClick={() => setMeals(m)}
                  className={`flex-1 py-2 rounded-lg border text-sm cursor-pointer border-dashed ${
                    meals === m
                      ? " border-primary/50 bg-primary/10 text-primary-foreground dark:text-primary"
                      : "border-solid border-neutral-200 dark:border-primary/20"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t dark:border-primary/10">
            <div>
              <p className="text-xs text-muted-foreground">
                <Translate text="home.mealPlanner.footer.perMeal" />
              </p>
              <p className="text-lg font-semibold flex items-center gap-1">
                {price} <Currency className="size-4" />
              </p>
            </div>
            <Button className="rounded-xl">
              <Translate text="home.mealPlanner.footer.claim" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}