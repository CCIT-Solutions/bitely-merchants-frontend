"use client";

import { useLang } from "@/hooks/useLang";

type LoadingProps = {
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses: Record<NonNullable<LoadingProps["size"]>, string> = {
  sm: "h-4 w-4 border-b-2 text-sm",
  md: "h-8 w-8 border-b-2 text-base",
  lg: "h-12 w-12 border-b-3 text-lg",
  xl: "h-16 w-16 border-b-4 text-xl",
};

function Loading({ showText = false, size = "md" }: LoadingProps) {
  const { t } = useLang();

  return (
    <div
      className="flex justify-center items-center w-full py-4 gap-3"
      role="status"
      aria-label={t("shared.loading")}
    >
      <div
        className={`animate-spin rounded-full border-primary ${sizeClasses[size]}`}
      />
      {showText && (
        <span className={`animate-pulse ${sizeClasses[size].split(" ").pop()}`}>
          {t("shared.loading")}
        </span>
      )}
      <span className="sr-only">{t("shared.loading")}</span>
    </div>
  );
}

export default Loading;
