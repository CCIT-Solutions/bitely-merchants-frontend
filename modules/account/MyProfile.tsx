"use client";

import { cn } from "@/lib/utils";
import Animate from "@/components/animation/Animate";
import { fade } from "@/lib/animation";
import AccountCard from "@/components/account/AccountCard";
import PlanUsageRing from "@/components/account/PlanUsageRing";
import AccountStatCard from "@/components/account/AccountStatCard";
import { useState } from "react";
import Phone from "@/components/icons/Phone";
import Location from "@/components/icons/Location";
import { useLang } from "@/hooks/useLang";

import { TbEdit } from "react-icons/tb";
import { IoCameraOutline } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
import { GiMeal } from "react-icons/gi";
import { GiHotMeal } from "react-icons/gi";
import { MdOutlineElectricBolt } from "react-icons/md";
import { FaWeight } from "react-icons/fa";
import { IoPulseOutline } from "react-icons/io5";
import SubscriptionCard from "@/components/account/SubscriptionCard";
import PaymentMethods from "@/components/account/PaymentMethods";
import BillingHistory from "@/components/account/BillingHistory";
import PersonalPreferences from "@/components/account/PersonalPreferences";

export default function MyProfilePage() {
  const { t } = useLang();
  const [editMode, setEditMode] = useState(false);

  return (
    <Animate variants={fade} className="space-y-4">
      {/* Profile Header */}
      <Animate
        variants={fade}
        className="rounded-2xl p-4 border border-foreground/5 md:p-5"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-4">
          {/* Avatar and Info Container */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            {/* Avatar */}
            <div className="relative">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-linear-to-br from-foreground/2 to-foreground/3 flex items-center justify-center text-sm font-semibold text-foreground/60 overflow-hidden">
                <div className="w-full h-full bg-linear-to-br from-foreground/20 to-foreground/10 flex items-center justify-center">
                  JA
                </div>
              </div>
              <button className="absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 border border-foreground/2 rounded-full flex items-center justify-center text-foreground/50 hover:bg-foreground/2 bg-background">
                <IoCameraOutline className="size-2.5 md:size-3" />
              </button>
            </div>

            {/* Info */}
            <div className="w-full md:w-auto flex flex-col items-center  md:items-start">
              <div className="flex flex-col md:flex-row md:items-center items-center gap-2">
                <h1 className="text-base md:text-lg font-bold text-neutral-900">
                  Jamal Al Maktoum
                </h1>
                <span className="flex items-center gap-1 bg-primary/3 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full border border-primary/20 ">
                  <FaCircleCheck />
                  {t("profile.proMember")}
                </span>
              </div>
              <p className="text-xs md:text-sm text-foreground/65 mt-0.5">
                jamal.maktoum@email.com
              </p>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-1.5">
                <span className="flex items-center gap-1 text-xs text-foreground/65">
                  <Phone className="size-3" />
                  +97 1234 567 89
                </span>
                <span className="flex items-center gap-1 text-xs text-foreground/65">
                  <Location className="size-3" />
                  Dubai, UAE
                </span>
              </div>
              <p className="text-xs text-foreground/65 mt-1.5">
                {t("profile.joined")} January 2024
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-1.5 text-xs font-medium border border-primary/30 px-3 py-1.5 rounded-xl hover:bg-primary bg-primary/10 transition-colors text-primary-foreground w-full sm:w-fit cursor-pointer text-center justify-center"
          >
            <TbEdit />
            {t("profile.edit")}
          </button>
        </div>
      </Animate>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <AccountStatCard value="47" label={t("profile.mealsCooked")} icon={<GiHotMeal />} />
        <AccountStatCard
          value= {`12 ${t("profile.day")}`}
          label={t("profile.currentStreak")}
          icon={<MdOutlineElectricBolt />}
        />
        <AccountStatCard
          value="-8.6 kg"
          label={t("profile.weightLost")}
          icon={<FaWeight />}
        />
        <AccountStatCard
          value="86%"
          label={t("profile.goalProgress")}
          icon={<IoPulseOutline />}
        />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Subscription */}
        <SubscriptionCard />

        {/* Your Plan Usage */}
        <AccountCard title={t("profile.yourPlanUsage")}>
          <div className="flex items-center justify-around py-2">
            <PlanUsageRing value={24} max={30} label={t("profile.mealsThisMonth")} />
            <PlanUsageRing value={5} max={5} label={t("profile.plansCreated")} />
            <PlanUsageRing value={8} max={10} label={t("profile.customRecipes")} />
          </div>
          <div className="mt-4 p-3">
            <p className="text-xs text-foreground/60">
              {t("profile.needMore")}
            </p>
            <button className="mt-2 text-xs font-semibold text-green-600 border border-green-100 px-4 py-2 bg-primary/3 rounded-xl cursor-pointer flex items-center gap-1 hover:gap-2 transition-all">
              {t("profile.upgradePlan")} <span>→</span>
            </button>
          </div>
        </AccountCard>
      </div>

      {/* Payment + Billing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Methods */}
        <PaymentMethods />

        {/* Billing History */}
        <BillingHistory />
      </div>

      {/* Preferences + Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Preferences */}
        <PersonalPreferences />

        {/* Personal Information */}
        <AccountCard title={t("profile.personalInformation")}>
          <div className="space-y-3">
            {[
              { label: t("profile.fullName"), value: "Jamal Al Maktoum" },
              { label: t("profile.emailAddress"), value: "jamal.maktoum@email.com" },
              { label: t("profile.phoneNumber"), value: "+97 1234 567 89" },
              { label: t("profile.location"), value: "Dubai, UAE" },
              { label: t("profile.password"), value: "••••••••••" },
            ].map((info) => (
              <div
                key={info.label}
                className="flex items-center justify-between py-1.5 border-b border-foreground/2 bg-background last:border-0"
              >
                <span className="text-xs text-foreground/40">{info.label}</span>
                <span className="text-xs font-medium text-foreground/70">
                  {info.value}
                </span>
              </div>
            ))}
            <div className="flex justify-end">
              <button className="text-xs text-green-600 font-semibold hover:underline">
                {t("profile.changePassword")}
              </button>
            </div>
          </div>
        </AccountCard>
      </div>
    </Animate>
  );
}