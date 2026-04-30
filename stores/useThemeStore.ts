import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      setTheme: (theme) => set({ theme, isDark: theme === "dark" }),
      isDark: false,
    }),
    { name: "app-theme" }
  )
);
