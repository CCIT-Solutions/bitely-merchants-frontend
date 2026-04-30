"use client";

import React, { useRef, useState, useEffect } from "react";
import { SparklesCore } from "@/components/shared/sparkles";
import { cn } from "@/lib/utils";

interface DecorativeParticlesProps {
  className?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  rootMargin?: string;
  unrenderOnExit?: boolean;
}

const DecorativeParticles: React.FC<DecorativeParticlesProps> = ({
  className,
  minSize = 3,
  maxSize = 4,
  particleDensity = 3,
  rootMargin = "100px",
  unrenderOnExit = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasBeenInView(true);
        }
      },
      {
        rootMargin,
        threshold: 0,
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin]);

  const shouldRender = unrenderOnExit ? isInView : hasBeenInView;

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute -top-10 start-0 w-full h-full lg:-start-20 -z-1",
        className
      )}
    >
      <div className="relative w-full h-full dark:opacity-50">
        {shouldRender && (
          <SparklesCore
            background="transparent"
            minSize={minSize}
            maxSize={maxSize}
            particleDensity={particleDensity}
            className="w-full h-full"
            particleColors={[
              "rgba(74, 222, 128, 0.4)",
              "rgba(34, 211, 238, 0.4)",
              "rgba(96, 165, 250, 0.4)",
            ]}
          />
        )}

        {/* TOP fade */}
        <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-background to-transparent pointer-events-none" />

        {/* BOTTOM fade */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-background to-transparent pointer-events-none" />

        {/* LEFT fade */}
        <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-background to-transparent pointer-events-none" />

        {/* RIGHT fade */}
        <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-background to-transparent pointer-events-none" />

        {/* Radial center glow */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div
            className="
              size-100 rounded-full pointer-events-none
              bg-[radial-gradient(circle,rgba(225,225,150,0.1),rgba(0,0,0,0))]
              dark:bg-[radial-gradient(circle,rgba(50,50,200,0.1),rgba(0,0,0,0))]
            "
          />
        </div>
      </div>
    </div>
  );
};

export default DecorativeParticles;