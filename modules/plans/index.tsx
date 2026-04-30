"use client";
import React, { useState } from "react";
import Image from "next/image";
import Container from "@/components/shared/Container";
// import PlanTapSwitcher from "@/components/plans/PlanTapSwitcher";
import Plans from "./Plans";
import PlansForm from "./PlansForm";
import { Separator } from "@/components/ui/separator";
import { useLang } from "@/hooks/useLang";
import Animate from "@/components/animation/Animate";
import { fade } from "@/lib/animation";

export default function YachtPlansPage() {
  const [activeTab, setActiveTab] = useState("cars");
  const { t } = useLang();

  return (
    <div className="min-h-screen py-20">
      <Container>
        <Animate variants={fade} className="w-full h-100 relative mb-16">
          <Image
            src={"/media/images/plans/map.png"}
            alt="Globe Map"
            width={600}
            height={400}
            className="w-full h-full object-cover mt-8 rounded-4xl"
          />

          <div className="absolute inset-0 w-full h-full flex justify-center items-center text-5xl md:text-6xl text-center font-bold">
            <h1 className="max-w-175 text-black">{t("plans.pageTitle")}</h1>
          </div>

          {/* <PlanTapSwitcher
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            className="-mt-10 z-10 relative"
            size="md"
          /> */}
        </Animate>

        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold">
            {activeTab === "cars"
              ? t("plans.carsPlans")
              : t("plans.yachtsPlans")}
          </h1>

          <span className="bg-teal-100 text-teal-400 dark:bg-teal-950 px-4 py-1 rounded-full text-sm font-medium">
            {t("plans.totalPlans", { count: 3 })}
          </span>
        </div>

        <Separator className="mt-10 mb-6" />

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <Plans />
          <PlansForm />
        </div>
      </Container>
    </div>
  );
}
