"use client";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/useThemeStore";
import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  preventLinks?: boolean;
  isAlwaysDark?: boolean;
};

function Logo({ className, preventLinks, isAlwaysDark }: Readonly<LogoProps>) {
  const { isDark } = useThemeStore();

  const imageElement = (
    <Image
      src={`/logo${isDark || isAlwaysDark ? "-light" : ""}.png`}
      alt="Logo"
      fill
      className="w-full h-full object-contain"
      priority
      fetchPriority="high"
      decoding="async"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );

  if (preventLinks) {
    return (
      <div className={cn("w-28 h-12 relative", className)}>{imageElement}</div>
    );
  }

  return (
    <Link
      href="/"
      className={cn("w-28 h-12 relative block cursor-pointer", className)}
    >
      {imageElement}
    </Link>
  );
}

export default Logo;
