"use client";

import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/useThemeStore";
import Sun from "../icons/Sun";
import { IoMoonOutline } from "react-icons/io5";
import { useEffect, useState } from "react";

function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme as "light" | "dark");
    
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [setTheme]);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
    
    localStorage.setItem("theme", nextTheme);
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        disabled
         aria-label="Theme Switcher"
      >
        <IoMoonOutline className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative w-10 h-10 rounded-full border border-neutral-200 dark:border-primary/20 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-primary dark:hover:text-primary-foreground! transition"
      onClick={toggleTheme}
      aria-label="Theme Switcher"
    >
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <IoMoonOutline className="h-[1.2rem] w-[1.2rem] " />
      )}
    </Button>
  );
}

export default ThemeSwitcher;