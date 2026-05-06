"use client";

import { useThemeStore } from "@/stores/useThemeStore";
import { useEffect } from "react";

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return children;
}