"use client";

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { TFunction } from "i18next";

import { useLang } from "@/hooks/useLang";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";

import Container from "@/components/shared/Container";
import LangSwitcher from "@/components/shared/LangSwitcher";
import Logo from "@/components/shared/Logo";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/custom/sheet";
import Animate from "@/components/animation/Animate";
import { fade } from "@/lib/animation";

const navItems = (t: TFunction) => [
  { label: t("nav.home"), href: "/" },
  { label: t("nav.menu"), href: "/menu" },
  { label: t("nav.plans"), href: "/plans" },
  { label: t("nav.howItWork"), href: "/#howItWork" },
  // { label: t("nav.features"), href: "/#features" },
  { label: t("nav.faq"), href: "/faq" },
  { label: t("nav.contact"), href: "/contact" },
];

function Header({ className }: { className?: string }) {
  const { t, isRTL } = useLang();
  const { isAuthenticated } = useUser();

  const pathname = usePathname();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("");

  /* Sticky header */
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.9;
      setSticky(window.scrollY >= heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Hash tracking */
  useEffect(() => {
    const updateHash = () => {
      setActiveHash(window.location.hash);
    };

    // Initial update
    updateHash();

    // Listen for hash changes
    window.addEventListener("hashchange", updateHash);
    window.addEventListener("popstate", updateHash);

    // Also update on scroll to detect section changes
    const handleScroll = () => {
      updateHash();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("popstate", updateHash);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return (
    <Animate
      variants={fade}
      element="header"
      viewOnce
      className={cn(
        "w-full z-50 transition-all duration-300",
        sticky
          ? "fixed top-0 inset-x-0 bg-background/80 backdrop-blur-lg shadow-sm py-3"
          : "absolute top-0 bg-transparent py-4",
        className,
      )}
    >
      <Container className="flex items-center justify-between">
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden lg:flex gap-10">
          {navItems(t).map((item) => {
            let isActive = false;

            if (item.href.startsWith("/#")) {
              // For hash links, check exact hash match
              const hash = item.href.replace("/", "");
              isActive = pathname === "/" && activeHash === hash;

              // Special case: if on home page with no hash, activate #home link
              if (item.href === "/#home" && pathname === "/" && !activeHash) {
                isActive = true;
              }
            } else {
              // For regular links, check pathname match
              isActive = pathname === item.href;
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition",
                  isActive
                    ? "text-primary"
                    : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300",
                )}
              >
                {item.label}

                {isActive && (
                  <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 size-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <LangSwitcher />

          <div className="w-10 h-10 rounded-full border border-neutral-200 dark:border-primary/20 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-primary transition">
            <ThemeSwitcher />
          </div>

          {!isAuthenticated && (
            <Link
              href="/login"
              className="hidden sm:block px-6 py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/80 transition"
            >
              {t("auth.login")}
            </Link>
          )}

          {/* Mobile drawer */}
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger
              className="lg:hidden p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              aria-label="Mobile Menu"
            >
              <Menu size={24} />
            </SheetTrigger>

            <SheetContent
              side={isRTL ? "right" : "left"}
              className="w-64"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <SheetHeader>
                <SheetTitle className="hidden">{t("nav.menu")}</SheetTitle>
                <Logo />
              </SheetHeader>

              <div className="flex flex-col mt-4 gap-1 px-4">
                {navItems(t).map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="px-2 py-2 text-sm font-semibold rounded hover:text-primary dark:hover:bg-neutral-900 transition"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}

                {!isAuthenticated && (
                  <SheetClose asChild>
                    <Link
                      href="/login"
                      className="mt-4 px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-center hover:bg-primary/80 transition"
                    >
                      {t("auth.login")}
                    </Link>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </Animate>
  );
}

export default memo(Header);
