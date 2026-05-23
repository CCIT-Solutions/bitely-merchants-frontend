"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/shared/Container";
import Logo from "@/components/shared/Logo";
import { useLang } from "@/hooks/useLang";
import Translate from "@/components/shared/Translate";
import { FaInstagram } from "react-icons/fa";
import { FaSnapchat } from "react-icons/fa6";
import { AiOutlineYoutube } from "react-icons/ai";
import { LuArrowRight } from "react-icons/lu";

import { FaXTwitter } from "react-icons/fa6";
import { fadeDu1D3, fadeDu2, fadeDu4 } from "@/lib/animation";
import Animate from "@/components/animation/Animate";
import { useThemeStore } from "@/stores/useThemeStore";
import { Separator } from "@/components/ui/separator";

export default function Footer({
  minimal,
  preventLinks,
}: {
  minimal?: boolean;
  preventLinks?: boolean;
}) {
  const { t, isRTL } = useLang();
  const { isDark } = useThemeStore();

  const MaybeLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) =>
    preventLinks ? (
      <span className="text-neutral-500 dark:text-[#888E9E] hover:text-primary dark:hover:text-primary cursor-default text-sm">
        {children}
      </span>
    ) : (
      <Link
        href={href}
        className=" transition-colors text-neutral-500 dark:text-[#888E9E] hover:text-primary dark:hover:text-primary"
      >
        {children}
      </Link>
    );

  return (
    <footer className="w-full bg-neutral-50 dark:bg-primary-foreground py-4 border-t border-border">
      <Animate element="div" variants={fadeDu4}>
        <Container>
          {!minimal && (
            <div className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16 py-10">
                {/* Left Section */}
                <div className="flex flex-col gap-2">
                  <Logo className="w-20" />
                  <p className="text-neutral-500 text-sm  mb-4">
                    <Translate text="footer.tagline" />
                  </p>

                  {/* Social Icons */}
                  <div className="flex gap-4 ">
                    {[
                      FaInstagram,
                      FaXTwitter,
                      FaSnapchat,
                      AiOutlineYoutube,
                    ].map((Icon, i) => (
                      <div
                        key={i}
                        className="size-10 border border-neutral-200 dark:border-primary/10 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <Icon className="size-4.5 text-neutral-800 dark:text-white" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Middle Navigation */}
                <div className="flex flex-col font-semibold text-lg gap-6 h-full w-full">
                  <div className="flex flex-wrap sm:flex-nowrap justify-between items-center h-full w-full">
                    <div className="flex flex-col gap-8">
                      <MaybeLink href="/#home">
                        <Translate text="footer.links.home" />
                      </MaybeLink>
                      <MaybeLink href="/faq">
                        <Translate text="footer.links.faq" />
                      </MaybeLink>
                    </div>

                    <div className="flex flex-col gap-8">
                      <MaybeLink href="/plans">
                        <Translate text="footer.links.plans" />
                      </MaybeLink>
                      <MaybeLink href="/account">
                        <Translate text="footer.links.account" />
                      </MaybeLink>
                    </div>

                    <div className="flex flex-col gap-8">
                      <MaybeLink href="/menu">
                        <Translate text="footer.links.menu" />
                      </MaybeLink>

                      <MaybeLink href="/contact">
                        <Translate text="footer.links.contact" />
                      </MaybeLink>
                    </div>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="flex flex-col justify-center sm:max-w-100">
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                    <Translate text="footer.newsletter.title" />
                  </p>

                  <p className="text-neutral-500 text-sm mt-2 mb-6">
                    <Translate text="footer.newsletter.description" />
                  </p>
                  <div className=" w-full rounded-full border border-neutral-300 dark:border-primary/10 bg-white dark:bg-transparent items-center relative">
                    <input
                      type="email"
                      placeholder={t("footer.newsletter.email")}
                      className=" ps-5 py-3 text-neutral-700 dark:text-neutral-100 outline-none text-sm w-full pe-12"
                    />
                    <button
                      className="absolute top-1.5 inset-e-0 size-8 bg-custom-green flex items-center justify-center text-white rounded-full shrink-0 me-2 cursor-pointer"
                      aria-label="Newsleteer"
                    >
                      <LuArrowRight
                        className={`size-4 ${isRTL ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <Animate
                variants={fadeDu1D3}
                className="
           text-[20vw] 
           xl:text-[280px]  xl:ms-[-5vw]  2xl:ms-[-12vw]  mb-10 lg:mb-14 xl:leading-75
           
           font-bold text-primary/40 dark:text-primary/15 "
              >
                Bitely.
              </Animate>
              <Separator className="mb-4"/>
            </div>
          )}

          {/* Bottom Section */}
          <div className=" flex flex-col lg:flex-row justify-between items-center gap-4 text-neutral-900 dark:text-neutral-100 text-sm">
            <span>
              <Translate text="footer.copyright" />
            </span>

            {/* Payment Icons */}
            <div className="flex items-center gap-4">
              <Image
                src={`/payments${isDark ? "-light" : ""}.png`}
                width={232}
                height={26}
                alt="Payments"
              />
            </div>
          </div>
        </Container>
      </Animate>
    </footer>
  );
}
