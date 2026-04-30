import { ArrowRight } from "lucide-react";
import Translate from "@/components/shared/Translate";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import Animate from "../animation/Animate";
import { fadeDu1D3 } from "@/lib/animation";

export default function CTASection() {
  const {isRTL} = useLang()
  return (
    <section className="relative w-full bg-primary py-15 flex items-center overflow-hidden text-center sm:text-start">
      <Animate variants={fadeDu1D3} className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 lg:gap-5">

        {/* Left: Heading */}
        <div className="flex-1 w-full lg:w-3/5">
          <h1 className={`text-primary-foreground  tracking-[-0.02em] font-bold text-4xl sm:text-6xl ${isRTL ? "xl:text-[6.8rem] leading-[1.06]" : "md:text-7xl lg:text-8xl xl:text-9xl leading-[.9]"} `}>
            <Translate text="home.cta.title.part1" />
            <em className="italic">
              <Translate text="home.cta.title.em" />
            </em>{" "}
            <Translate text="home.cta.title.part2" />
          </h1>
        </div>

        {/* Right: Copy + CTA */}
        <div className="flex flex-col items-center sm:items-start justify-end gap-6 w-full lg:w-2/5">
          <p className="text-primary-foreground font-medium max-w-105 text-sm sm:text-base leading-relaxed">
            <Translate text="home.cta.description" />
          </p>

          <button className="group flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-primary-foreground text-white transition-all duration-200 hover:bg-primary-foreground/90 active:scale-[0.98]">
            <Translate text="home.cta.button" />
            <ArrowRight
              className={cn("w-4 h-4 transition-transform duration-200 ", isRTL? "rotate-180 group-hover:-translate-x-1": "group-hover:translate-x-1")}
              strokeWidth={2.5}
            />
          </button>
        </div>
      </Animate>
    </section>
  );
}