"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FiUser,
  FiBell,
  FiLock,
  FiSettings,
  FiSliders,
  FiLink,
  FiTrash2,
  FiEdit2,
  FiCamera,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiChevronRight,
  FiShield,
  FiEye,
  FiEyeOff,
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiPlus,
  FiGlobe,
  FiSun,
  FiMoon,
  FiSmartphone,
} from "react-icons/fi";
import { useLang } from "@/hooks/useLang"; // adjust path if needed
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SidebarItem {
  id: string;
  labelKey: string;
  descKey: string;
  icon: React.ElementType;
}

// ─── Sidebar items ────────────────────────────────────────────────────────────

const sidebarItems: SidebarItem[] = [
  {
    id: "account",
    labelKey: "settings.tabs.account",
    descKey: "settings.tabs.accountDesc",
    icon: FiUser,
  },
  {
    id: "notifications",
    labelKey: "settings.tabs.notifications",
    descKey: "settings.tabs.notificationsDesc",
    icon: FiBell,
  },
  {
    id: "privacy",
    labelKey: "settings.tabs.privacy",
    descKey: "settings.tabs.privacyDesc",
    icon: FiShield,
  },
  {
    id: "preferences",
    labelKey: "settings.tabs.preferences",
    descKey: "settings.tabs.preferencesDesc",
    icon: FiSliders,
  },
  {
    id: "dietary",
    labelKey: "settings.tabs.dietary",
    descKey: "settings.tabs.dietaryDesc",
    icon: FiSettings,
  },
  {
    id: "delete",
    labelKey: "settings.tabs.delete",
    descKey: "settings.tabs.deleteDesc",
    icon: FiTrash2,
  },
];

// ─── Fallback translations ────────────────────────────────────────────────────

export default function SettingsPage() {
  const { t, isRTL } = useLang();
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground/90 tracking-tight">
            {t("settings.title")}
          </h1>
          <p className="text-sm text-foreground/50 mt-1">
            {t("settings.subtitle")}
          </p>
        </div>

        {/* Layout: sidebar + content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* ── Sidebar (desktop) / Tabs (mobile) ── */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            orientation="vertical"
            className="flex flex-col lg:flex-row w-full gap-6"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Sidebar */}
            <TabsList
              className="
              grid! grid-cols-3 gap-3 w-full lg:w-fit
              lg:flex! lg:overflow-x-auto lg:flex-col lg:overflow-visible
              bg-background rounded-2xl shadow-sm border border-foreground/3 p-2
              lg:gap-1 justify-start
            "
            >
              {sidebarItems.map(({ id, labelKey, descKey, icon: Icon }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className={`
                   group w-auto lg:w-full flex items-center gap-3 px-3 py-2.5 rounded-xl 
                   justify-center! text-center md:text-start text-sm transition-all duration-150
                    data-[state=active]:bg-custom-green/10 data-[state=active]:text-custom-green 
                    data-[state=inactive]:text-foreground/70 data-[state=inactive]:hover:bg-foreground/3
                    group shrink-0
                  `}
                  dir={isRTL ? "rtl" : "ltr"}
                  title={t(labelKey)}
                >
                  <span
                    className={`
                    size-8 rounded-lg flex items-center justify-center shrink-0
                    transition-colors
                    group-data-[state=active]:bg-custom-green group-data-[state=active]:text-white
                    group-data-[state=inactive]:bg-foreground/2 group-data-[state=inactive]:text-foreground/50
                    group-hover:group-data-[state=inactive]:bg-foreground/5 
                  `}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="hidden sm:flex flex-col items-start min-w-0">
                    <span className="font-medium text-sm leading-tight">
                      {t(labelKey)}
                    </span>
                    <span className="text-xs text-foreground/50 truncate w-full">
                      {t(descKey)}
                    </span>
                  </span>
                  <FiChevronRight
                    className={cn(
                      "ms-auto w-4 h-4 text-gray-300 hidden lg:block group-data-[state=active]:text-custom-green",
                      isRTL ? "rotate-180" : "",
                    )}
                  />
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ── Content panels ── */}
            <div className="flex-1 min-w-0">
              {/* ── ACCOUNT ── */}
              <TabsContent value="account" className="mt-0 space-y-4">
                <AccountTab t={t} isRTL={isRTL} />
              </TabsContent>

              {/* ── NOTIFICATIONS ── */}
              <TabsContent value="notifications" className="mt-0 space-y-4">
                <NotificationsTab t={t} />
              </TabsContent>

              {/* ── PRIVACY ── */}
              <TabsContent value="privacy" className="mt-0 space-y-4">
                <PrivacyTab t={t} />
              </TabsContent>

              {/* ── PREFERENCES ── */}
              <TabsContent value="preferences" className="mt-0 space-y-4">
                <PreferencesTab t={t} />
              </TabsContent>

              {/* ── DIETARY ── */}
              <TabsContent value="dietary" className="mt-0 space-y-4">
                <DietaryTab t={t} isRTL={isRTL} />
              </TabsContent>

              {/* ── DELETE ── */}
              <TabsContent value="delete" className="mt-0 space-y-4">
                <DeleteTab t={t} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Card ────────────────────────────────────────────────────────────

function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-background rounded-2xl border border-foreground/3 shadow-sm p-6 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h2 className="text-base font-semibold text-foreground/90">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function EditBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm font-medium text-custom-green hover:text-[#388e3c] transition-colors"
    >
      <FiEdit2 className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-fobg-foreground/2 last:border-0">
      <span className="text-sm text-foreground/50 w-36 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-800 text-end">
        {value}
      </span>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  const { isRTL } = useLang();
  return (
    <div className="flex items-center justify-between py-3 border-b border-fobg-foreground/2 last:border-0">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        {description && (
          <span className="text-xs text-foreground/50 mt-0.5">
            {description}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="data-[state=checked]:bg-custom-green"
          dir={"ltr"}
        />
        <span
          className={`text-xs font-medium w-6 ${checked ? "text-custom-green" : "text-foreground/50"}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {checked ? "On" : "Off"}
        </span>
      </div>
    </div>
  );
}

// ─── ACCOUNT TAB ─────────────────────────────────────────────────────────────

function AccountTab({
  t,
  isRTL,
}: {
  t: (k: string) => string;
  isRTL: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [editingPw, setEditingPw] = useState(false);

  return (
    <>
      {/* Avatar */}
      <Card>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-custom-green to-custom-green/70 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              AJ
            </div>
            <button className="absolute -bottom-1 -inset-e-1 w-7 h-7 bg-white border border-foreground/20 rounded-full flex items-center justify-center text-foreground/70 hover:bg-foreground/2 shadow-sm">
              <FiCamera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-foreground/90 text-lg">
              Rashed Ahmed
            </p>
            <p className="text-sm text-foreground/50">rashedahmed.gmail.com</p>
            <Badge className="mt-1.5 bg-custom-green/10 text-custom-green text-xs border-0 font-medium">
              Signature Plan
            </Badge>
          </div>
        </div>
      </Card>

      {/* Profile Information */}
      <Card
        title={t("settings.profileInfo")}
        action={
          editing ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditing(false)}
                className="text-foreground/50 h-8 text-xs"
              >
                <FiX className="w-3.5 h-3.5 mr-1" />
                {t("settings.cancel")}
              </Button>
              <Button
                size="sm"
                onClick={() => setEditing(false)}
                className="bg-custom-green hover:bg-[#388e3c] text-white h-8 text-xs"
              >
                <FiCheck className="w-3.5 h-3.5 mr-1" />
                {t("settings.save")}
              </Button>
            </div>
          ) : (
            <EditBtn
              label={t("settings.edit")}
              onClick={() => setEditing(true)}
            />
          )
        }
      >
        {editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/50">
                {t("settings.fullName")}
              </Label>
              <Input
                defaultValue="Rashed Ahmed"
                className="h-9 text-sm border-foreground/20 focus-visible:ring-custom-green"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/50">
                {t("settings.email")}
              </Label>
              <div className="relative">
                <FiMail className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-foreground/50 w-3.5 h-3.5" />
                <Input
                  defaultValue="rashedahmed.gmail.com"
                  className="h-9 text-sm ps-9 border-foreground/20 focus-visible:ring-custom-green"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/50">
                {t("settings.phone")}
              </Label>
              <div className="relative">
                <FiPhone className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-foreground/50 w-3.5 h-3.5" />
                <Input
                  defaultValue="+97 565 123 789"
                  className={cn(
                    "h-9 text-sm  border-foreground/20 focus-visible:ring-custom-green",
                    isRTL ? "text-right pe-9" : "ps-9",
                  )}
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/50">
                {t("settings.location")}
              </Label>
              <div className="relative">
                <FiMapPin className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-foreground/50 w-3.5 h-3.5" />
                <Input
                  defaultValue="Dubai, UAE"
                  className="h-9 text-sm ps-9 border-foreground/20 focus-visible:ring-custom-green"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/50">
                {t("settings.dob")}
              </Label>
              <div className="relative">
                <FiCalendar className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-foreground/50 w-3.5 h-3.5" />
                <Input
                  defaultValue="April 12, 1990"
                  className="h-9 text-sm ps-9 border-foreground/20 focus-visible:ring-custom-green"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/50">
                {t("settings.gender")}
              </Label>
              <Select defaultValue="male">
                <SelectTrigger className="h-9 text-sm border-foreground/20 focus:ring-custom-green">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t("settings.male")}</SelectItem>
                  <SelectItem value="female">{t("settings.female")}</SelectItem>
                  <SelectItem value="other">{t("settings.other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div>
            <InfoRow label={t("settings.fullName")} value="Rashed Ahmed" />
            <InfoRow
              label={t("settings.email")}
              value="rashedahmed.gmail.com"
            />
            <InfoRow label={t("settings.phone")} value="+97 565 123 789" />
            <InfoRow label={t("settings.location")} value="Dubai, UAE" />
            <InfoRow label={t("settings.dob")} value="April 12, 1990" />
            <InfoRow label={t("settings.gender")} value={t("settings.male")} />
          </div>
        )}
      </Card>

      {/* Password */}
      <Card
        title={t("settings.password")}
        action={
          <EditBtn
            label={t("settings.edit")}
            onClick={() => setEditingPw(!editingPw)}
          />
        }
      >
        {editingPw ? (
          <div className="space-y-3">
            {[
              ["Current Password", ""],
              ["New Password", ""],
              ["Confirm Password", ""],
            ].map(([label]) => (
              <div key={label} className="space-y-1.5">
                <Label className="text-xs text-foreground/50">{label}</Label>
                <div className="relative">
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="h-9 text-sm pr-9 border-foreground/20 focus-visible:ring-custom-green"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground/70"
                  >
                    {showPw ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingPw(false)}
                className="text-foreground/50 h-8 text-xs"
              >
                {t("settings.cancel")}
              </Button>
              <Button
                size="sm"
                onClick={() => setEditingPw(false)}
                className="bg-custom-green hover:bg-[#388e3c] text-white h-8 text-xs"
              >
                {t("settings.save")}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-800 text-sm font-medium tracking-widest">
              ••••••••••••••
            </p>
            <p className="text-xs text-foreground/50 mt-1">
              {t("settings.lastChanged")}
            </p>
          </div>
        )}
      </Card>
    </>
  );
}

// ─── NOTIFICATIONS TAB ────────────────────────────────────────────────────────

function NotificationsTab({ t }: { t: (k: string) => string }) {
  const [prefs, setPrefs] = useState({
    mealReminders: true,
    planUpdates: true,
    promotions: false,
    weeklySummary: true,
    orderStatus: true,
    newRecipes: false,
    newsletter: true,
    sms: false,
    email: true,
    push: true,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <Card
        title={t("settings.notifPrefs")}
        action={<EditBtn label={t("settings.edit")} />}
      >
        <ToggleRow
          label={t("settings.mealReminders")}
          checked={prefs.mealReminders}
          onCheckedChange={() => toggle("mealReminders")}
        />
        <ToggleRow
          label={t("settings.planUpdates")}
          checked={prefs.planUpdates}
          onCheckedChange={() => toggle("planUpdates")}
        />
        <ToggleRow
          label={t("settings.promotions")}
          checked={prefs.promotions}
          onCheckedChange={() => toggle("promotions")}
        />
        <ToggleRow
          label={t("settings.weeklySummary")}
          checked={prefs.weeklySummary}
          onCheckedChange={() => toggle("weeklySummary")}
        />
        <ToggleRow
          label={t("settings.orderStatus")}
          checked={prefs.orderStatus}
          onCheckedChange={() => toggle("orderStatus")}
        />
        <ToggleRow
          label={t("settings.newRecipes")}
          checked={prefs.newRecipes}
          onCheckedChange={() => toggle("newRecipes")}
        />
      </Card>

      <Card title={t("settings.notificationChannels")}>
        <ToggleRow
          label={t("settings.emailNotifications")}
          description={t("settings.emailNotificationsDesc")}
          checked={prefs.email}
          onCheckedChange={() => toggle("email")}
        />
        <ToggleRow
          label={t("settings.pushNotifications")}
          description={t("settings.pushNotificationsDesc")}
          checked={prefs.push}
          onCheckedChange={() => toggle("push")}
        />
        <ToggleRow
          label={t("settings.smsNotifications")}
          description={t("settings.smsNotificationsDesc")}
          checked={prefs.sms}
          onCheckedChange={() => toggle("sms")}
        />
        <ToggleRow
          label={t("settings.newsletter")}
          description={t("settings.newsletterDesc")}
          checked={prefs.newsletter}
          onCheckedChange={() => toggle("newsletter")}
        />
      </Card>
    </>
  );
}

// ─── PRIVACY TAB ─────────────────────────────────────────────────────────────

function PrivacyTab({ t }: { t: (k: string) => string }) {
  const [prefs, setPrefs] = useState({
    dataCollection: true,
    locationTracking: false,
    thirdParty: false,
    analytics: true,
    twoFactor: false,
    loginAlerts: true,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <Card title={t("settings.privacy.dataPrivacy")}>
        <ToggleRow
          label={t("settings.privacy.dataCollection")}
          description={t("settings.privacy.dataCollectionDesc")}
          checked={prefs.dataCollection}
          onCheckedChange={() => toggle("dataCollection")}
        />
        <ToggleRow
          label={t("settings.privacy.locationTracking")}
          description={t("settings.privacy.locationTrackingDesc")}
          checked={prefs.locationTracking}
          onCheckedChange={() => toggle("locationTracking")}
        />
        <ToggleRow
          label={t("settings.privacy.thirdParty")}
          description={t("settings.privacy.thirdPartyDesc")}
          checked={prefs.thirdParty}
          onCheckedChange={() => toggle("thirdParty")}
        />
        <ToggleRow
          label={t("settings.privacy.analytics")}
          description={t("settings.privacy.analyticsDesc")}
          checked={prefs.analytics}
          onCheckedChange={() => toggle("analytics")}
        />
      </Card>

      <Card title={t("settings.privacy.security")}>
        <ToggleRow
          label={t("settings.privacy.twoFactor")}
          description={t("settings.privacy.twoFactorDesc")}
          checked={prefs.twoFactor}
          onCheckedChange={() => toggle("twoFactor")}
        />
        <ToggleRow
          label={t("settings.privacy.loginAlerts")}
          description={t("settings.privacy.loginAlertsDesc")}
          checked={prefs.loginAlerts}
          onCheckedChange={() => toggle("loginAlerts")}
        />
      </Card>

      <Card title={t("settings.privacy.yourData")}>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-gray-800">
              {t("settings.privacy.downloadData")}
            </p>
            <p className="text-xs text-foreground/50 mt-0.5">
              {t("settings.privacy.downloadDataDesc")}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-custom-green text-custom-green hover:bg-custom-green/10 h-8 text-xs shrink-0 ml-4"
          >
            {t("settings.privacy.download")}
          </Button>
        </div>
      </Card>
    </>
  );
}

// ─── PREFERENCES TAB ─────────────────────────────────────────────────────────

function PreferencesTab({ t }: { t: (k: string) => string }) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [autoRenew, setAutoRenew] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  return (
    <>
      <Card title={t("settings.prefs.preferences")}>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-fobg-foreground/2">
            <div>
              <p className="text-sm font-medium text-gray-800">
                {t("settings.prefs.language")}
              </p>
            </div>
            <Select defaultValue="en">
              <SelectTrigger className="w-44 h-9 text-sm border-foreground/20 focus:ring-custom-green">
                <FiGlobe className="w-3.5 h-3.5 text-foreground/50 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-fobg-foreground/2">
            <p className="text-sm font-medium text-gray-800">
              {t("settings.prefs.theme")}
            </p>
            <div className="flex items-center gap-1 bg-foreground/3 rounded-lg p-1">
              {(["light", "dark", "system"] as const).map((opt) => {
                const icons = {
                  light: FiSun,
                  dark: FiMoon,
                  system: FiSmartphone,
                };
                const Icon = icons[opt];
                return (
                  <button
                    key={opt}
                    onClick={() => setTheme(opt)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                      ${theme === opt ? "bg-white text-foreground/90 shadow-sm" : "text-foreground/50 hover:text-gray-700"}
                    `}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t(`settings.prefs.${opt}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-fobg-foreground/2">
            <p className="text-sm font-medium text-gray-800">
              {t("settings.prefs.units")}
            </p>
            <div className="flex items-center gap-1 bg-foreground/3 rounded-lg p-1">
              {(["metric", "imperial"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setUnits(opt)}
                  className={`
                    px-3 py-1.5 rounded-md text-xs font-medium transition-all
                    ${units === opt ? "bg-white text-foreground/90 shadow-sm" : "text-foreground/50 hover:text-gray-700"}
                  `}
                >
                  {t(`settings.prefs.${opt}`)}
                </button>
              ))}
            </div>
          </div> */}

          {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-fobg-foreground/2">
            <p className="text-sm font-medium text-gray-800">
              {t("settings.prefs.currency")}
            </p>
            <Select defaultValue="usd">
              <SelectTrigger className="w-44 h-9 text-sm border-foreground/20 focus:ring-custom-green">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
                <SelectItem value="egp">EGP (£E)</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-fobg-foreground/2">
            <p className="text-sm font-medium text-gray-800">
              {t("settings.prefs.timeFormat")}
            </p>
            <Select defaultValue="12h">
              <SelectTrigger className="w-44 h-9 text-sm border-foreground/20 focus:ring-custom-green">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">{t("settings.prefs.12h")}</SelectItem>
                <SelectItem value="24h">{t("settings.prefs.24h")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card title={t("settings.prefs.subscription")}>
        <ToggleRow
          label={t("settings.prefs.autoRenew")}
          description={t("settings.prefs.autoRenewDesc")}
          checked={autoRenew}
          onCheckedChange={setAutoRenew}
        />
        <ToggleRow
          label={t("settings.prefs.pushNotifs")}
          description={t("settings.prefs.pushNotifsDesc")}
          checked={pushNotifs}
          onCheckedChange={setPushNotifs}
        />
      </Card>
    </>
  );
}

// ─── DIETARY TAB ─────────────────────────────────────────────────────────────

const DIETARY_OPTIONS = [
  "vegetarian",
  "glutenFree",
  "dairyFree",
  "nutFree",
  "lowCarb",
  "highProtein",
] as const;

function DietaryTab({
  t,
  isRTL,
}: {
  t: (k: string) => string;
  isRTL: boolean;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(["lowCarb"]));
  const [allergies, setAllergies] = useState(["Shellfish", "Peanuts"]);
  const [newAllergy, setNewAllergy] = useState("");
  const [calories, setCalories] = useState(2000);

  const toggleDiet = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <>
      <Card title={t("settings.dietary.title")}>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((key) => {
            const active = selected.has(key);
            return (
              <button
                key={key}
                onClick={() => toggleDiet(key)}
                className={`
                  px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all
                  ${
                    active
                      ? "bg-custom-green border-custom-green text-white"
                      : "bg-white border-foreground/20 text-foreground/70 hover:border-custom-green hover:text-custom-green"
                  }
                `}
              >
                {active && <FiCheck className="inline w-3 h-3 me-1" />}
                {t(`settings.dietary.${key}`)}
              </button>
            );
          })}
        </div>
      </Card>

      <Card title={t("settings.dietary.allergies")}>
        <div className="flex flex-wrap gap-2 mb-3">
          {allergies.map((allergy) => (
            <span
              key={allergy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 rounded-full text-sm font-medium"
            >
              {allergy}
              <button
                onClick={() =>
                  setAllergies((a) => a.filter((x) => x !== allergy))
                }
                className="hover:text-red-900"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            placeholder={t("settings.dietary.addAllergy")}
            className="h-9 text-sm border-foreground/20 focus-visible:ring-custom-green"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newAllergy.trim()) {
                setAllergies((a) => [...a, newAllergy.trim()]);
                setNewAllergy("");
              }
            }}
          />
          <Button
            size="sm"
            className="bg-custom-green hover:bg-[#388e3c] text-white h-9 px-3"
            onClick={() => {
              if (newAllergy.trim()) {
                setAllergies((a) => [...a, newAllergy.trim()]);
                setNewAllergy("");
              }
            }}
          >
            <FiPlus className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      <Card title={t("settings.dietary.calorieGoal")}>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Slider
              min={1200}
              max={4000}
              step={50}
              value={[calories]}
              onValueChange={(value) => setCalories(value[0])}
              className="w-full"
              dir={isRTL ? "rtl" : "ltr"}
            />
            <div className="flex justify-between text-xs text-foreground/50 mt-1">
              <span>1200</span>
              <span>4000</span>
            </div>
          </div>
          <div className="shrink-0 text-start">
            <span className="text-2xl font-bold text-custom-green">
              {calories.toLocaleString()}
            </span>
            <span className="text-xs text-foreground/50 block">
              {t("settings.dietary.calories")}
            </span>
          </div>
        </div>
      </Card>
    </>
  );
}

// ─── CONNECTED APPS TAB ───────────────────────────────────────────────────────

// ─── DELETE ACCOUNT TAB ───────────────────────────────────────────────────────

function DeleteTab({ t }: { t: (k: string) => string }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <>
      <Card className="border-red-100">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <FiAlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground/90 mb-1">
              {t("settings.delete.title")}
            </h2>
            <p className="text-sm text-red-600 font-medium mb-2">
              {t("settings.delete.warning")}
            </p>
            <p className="text-sm text-foreground/50">
              {t("settings.delete.desc")}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <FiAlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />

            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">
                {t("settings.delete.beforeYouGo")}
              </p>

              <p className="text-xs text-amber-700">
                {t("settings.delete.exportHint")}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-custom-green text-custom-green hover:bg-custom-green/10 h-10"
          >
            {t("settings.delete.export")}
          </Button>

          <Separator />

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-red-600 rounded"
            />
            <span className="text-sm text-foreground/70 group-hover:text-gray-800">
              {t("settings.delete.confirm")}
            </span>
          </label>

          <Button
            disabled={!confirmed}
            className="w-full bg-red-600 hover:bg-red-700 text-white h-10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiTrash2 className="w-4 h-4 mr-2" />
            {t("settings.delete.button")}
          </Button>
        </div>
      </Card>
    </>
  );
}
