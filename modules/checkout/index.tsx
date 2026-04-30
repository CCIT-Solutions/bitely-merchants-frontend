"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useLang } from "@/hooks/useLang";
import Container from "@/components/shared/Container";
import CheckoutForm from "./CheckoutForm";
import OrderSummery from "./OrderSummery";
import { cn } from "@/lib/utils";
import DecorativeParticles from "@/components/animation/DecorativeParticles";
import Animate from "@/components/animation/Animate";
import { fade } from "@/lib/animation";

const CheckoutPage = () => {
  const { t, isRTL } = useLang();

  return (
    <div className="min-h-screen p-6 pb-12 pt-30 sm:pt-40">
      <Container>
        {/* Header */}
        <Animate
          variants={fade}
          className="flex items-center gap-4 mb-8 relative"
        >
          <button className="w-12 h-12 rounded-full border shadow-sm flex items-center justify-center hover:shadow-md transition-shadow">
            <ArrowLeft
              className={cn("size-5 cursor-pointer", isRTL ? "rotate-180" : "")}
            />
          </button>
          <h1 className="text-4xl font-bold">{t("checkout.title")}</h1>

          {/* Decorative dots */}
          <DecorativeParticles
            className="-top-10 start-0 w-100 h-100  lg:-start-20 "
            minSize={3}
            maxSize={4}
            particleDensity={15}
          />
        </Animate>

        <div className="grid lg:grid-cols-2 gap-8">
          <CheckoutForm />
          <OrderSummery />
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPage;
