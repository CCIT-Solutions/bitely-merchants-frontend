"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FoodItem } from "@/types/menu";
import { Language } from "@/types/shared";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RecipeStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

interface RecipeDetails {
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: { name: string; amount: string }[];
  steps: RecipeStep[];
  tags: string[];
  chef: string;
}

// ─── Mock recipe generator (replace with real data fetch) ─────────────────────
function getMockRecipe(meal: FoodItem): RecipeDetails {
  return {
    prepTime: "10 min",
    cookTime: "20 min",
    servings: 1,
    difficulty: "Easy",
    chef: "Chef Marco",
    tags: ["High Protein", "Gluten Free", "Chef's Pick"],
    ingredients: [
      { name: meal.name.en.split(" ")[0] + " base", amount: "200g" },
      { name: "Olive oil", amount: "2 tbsp" },
      { name: "Sea salt", amount: "½ tsp" },
      { name: "Black pepper", amount: "¼ tsp" },
      { name: "Lemon juice", amount: "1 tbsp" },
      { name: "Fresh herbs", amount: "10g" },
      { name: "Garlic cloves", amount: "2 pcs" },
    ],
    steps: [
      {
        step: 1,
        title: "Prep",
        description:
          "Wash and pat dry all fresh ingredients. Mince garlic finely and set aside. Zest the lemon before juicing.",
        duration: "5 min",
      },
      {
        step: 2,
        title: "Season",
        description:
          "Combine olive oil, salt, pepper, and lemon juice in a bowl. Coat the main ingredient evenly and let marinate briefly.",
        duration: "5 min",
      },
      {
        step: 3,
        title: "Cook",
        description:
          "Heat a pan over medium-high heat. Cook until golden on each side, building flavour through controlled heat.",
        duration: "12 min",
      },
      {
        step: 4,
        title: "Finish",
        description:
          "Remove from heat. Rest for 2 minutes, then garnish with fresh herbs and a squeeze of lemon.",
        duration: "3 min",
      },
    ],
  };
}

// ─── Macro Pill ───────────────────────────────────────────────────────────────
function MacroPill({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl border border-foreground/8 bg-foreground/[0.02]">
      <span className={cn("text-base font-bold ", color)}>{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-foreground/40">
        {label}
      </span>
    </div>
  );
}

// ─── Difficulty Badge ─────────────────────────────────────────────────────────
function DifficultyDots({ level }: { level: "Easy" | "Medium" | "Hard" }) {
  const filled = level === "Easy" ? 1 : level === "Medium" ? 2 : 3;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            i <= filled ? "bg-primary" : "bg-foreground/15",
          )}
        />
      ))}
      <span className="text-[10px] text-foreground/45 ml-1 uppercase tracking-widest">
        {level}
      </span>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
interface RecipeModalProps {
  meal: FoodItem;
  lang: Language;
  onClose: () => void;
}

export default function RecipeDetails({
  meal,
  lang,
  onClose,
}: RecipeModalProps) {
  const recipe = getMockRecipe(meal);
  const [tab, setTab] = useState<"ingredients" | "steps">("ingredients");
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function toggleStep(step: number) {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      next.has(step) ? next.delete(step) : next.add(step);
      return next;
    });
  }

  if (!mounted) return null;

  const modal = (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      style={{ animation: "fadeIn 180ms ease" }}
    >
      {/* ── Sheet ── */}
      <div
        className={cn(
          "relative w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[88vh]",
          "bg-background border border-foreground/10 sm:rounded-2xl rounded-t-2xl",
          "flex flex-col overflow-hidden",
          "shadow-[0_-8px_60px_rgba(0,0,0,0.5)] sm:shadow-[0_8px_60px_rgba(0,0,0,0.6)]",
        )}
        style={{ animation: "slideUp 240ms cubic-bezier(0.32,0.72,0,1)" }}
      >
        {/* ── Hero image ── */}
        <div className="relative w-full h-52 sm:h-64 shrink-0 overflow-hidden">
          <Image
            src={meal.image}
            alt={meal.name[lang]}
            fill
            className="object-cover"
            priority
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 size-8 rounded-full bg-background/70 border border-foreground/15 backdrop-blur-md flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Tags floating on image */}
          <div className="absolute bottom-4 left-5 flex gap-1.5 flex-wrap">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-md border border-foreground/10 text-foreground/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div
          className="flex-1 overflow-y-auto scrollbar-none"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Title + meta */}
          <div className="px-6 pt-5 pb-4 border-b border-foreground/8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground leading-snug">
                  {meal.name[lang]}
                </h2>
                <p className="text-sm text-foreground/45 mt-1 leading-relaxed">
                  {meal.description[lang]}
                </p>
              </div>
            </div>

            {/* Time / difficulty / chef row */}
            <div className="flex items-center gap-5 mt-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-foreground/50">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="opacity-60"
                >
                  <circle
                    cx="7"
                    cy="7"
                    r="5.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M7 4.5V7l1.5 1.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-[11px]  text-foreground/55">
                  {recipe.prepTime} prep · {recipe.cookTime} cook
                </span>
              </div>
              <DifficultyDots level={recipe.difficulty} />
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-[11px] text-foreground/35 uppercase tracking-widest">
                  by
                </span>
                <span className="text-[11px] text-foreground/60 font-medium">
                  {recipe.chef}
                </span>
              </div>
            </div>
          </div>

          {/* ── Macros ── */}
          <div className="px-6 py-4 grid grid-cols-4 gap-2 border-b border-foreground/8">
            <MacroPill
              label="Protein"
              value={`${meal.protein}g`}
              color="text-primary"
            />
            <MacroPill
              label="Carbs"
              value={`${meal.carbs}g`}
              color="text-foreground/70"
            />
            <MacroPill
              label="Fat"
              value={`${meal.fat}g`}
              color="text-foreground/70"
            />
            <MacroPill
              label="Kcal"
              value={`${meal.calories}`}
              color="text-foreground/70"
            />
          </div>

          {/* ── Tabs ── */}
          <div className="px-6 pt-4">
            <div className="flex gap-1 border border-foreground/10 rounded-full p-1 w-fit mb-5">
              {(["ingredients", "steps"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[11px] uppercase tracking-widest transition-all cursor-pointer",
                    tab === t
                      ? "bg-primary-foreground border-foreground/10 text-white font-medium"
                      : "text-foreground/50 hover:text-foreground/70",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Ingredients */}
            {tab === "ingredients" && (
              <ul className="space-y-0 mb-6">
                {recipe.ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className={cn(
                      "flex items-center justify-between py-3 text-sm",
                      i < recipe.ingredients.length - 1
                        ? "border-b border-foreground/6"
                        : "",
                    )}
                  >
                    <span className="text-foreground/70">{ing.name}</span>
                    <span className=" text-[12px] text-foreground/35">
                      {ing.amount}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Steps */}
            {tab === "steps" && (
              <ol className="space-y-3 mb-6">
                {recipe.steps.map((step) => {
                  const done = checkedSteps.has(step.step);
                  return (
                    <li
                      key={step.step}
                      onClick={() => toggleStep(step.step)}
                      className={cn(
                        "flex gap-4 p-4 rounded-xl border transition-all cursor-pointer group",
                        done
                          ? "border-primary/20 bg-primary/[0.04]"
                          : "border-foreground/8 hover:border-foreground/15 hover:bg-foreground/[0.02]",
                      )}
                    >
                      {/* Step number / check */}
                      <div
                        className={cn(
                          "shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all mt-0.5",
                          done
                            ? "bg-primary/20 border-primary/40 text-primary"
                            : "border-foreground/15 text-foreground/30",
                        )}
                      >
                        {done ? (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M2 5l2.5 2.5 3.5-4"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <span className="text-[10px] ">{step.step}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className={cn(
                              "text-[11px] font-semibold uppercase tracking-widest",
                              done ? "text-primary/60" : "text-foreground/55",
                            )}
                          >
                            {step.title}
                          </span>
                          {step.duration && (
                            <span className="text-[10px]  text-foreground/30 shrink-0">
                              {step.duration}
                            </span>
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-sm leading-relaxed transition-colors",
                            done
                              ? "text-foreground/35 line-through"
                              : "text-foreground/60",
                          )}
                        >
                          {step.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div className="px-6 py-4 border-t border-foreground/8 flex gap-2 shrink-0 bg-background">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-foreground/10 text-sm text-foreground/55 hover:text-foreground/70 hover:border-foreground/20 transition-all cursor-pointer"
          >
            ← Back
          </button>
          <button className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/85 text-black text-sm font-semibold transition-all cursor-pointer">
            Keep plate
          </button>
        </div>
      </div>

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );

  return createPortal(modal, document.body);
}
