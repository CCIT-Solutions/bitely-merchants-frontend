"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomField } from "@/components/form/FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/hooks/useLang";
import SpinnerButton from "@/components/shared/SpinnerButton";
import { PhoneField } from "@/components/form/PhoneField";
import Container from "@/components/shared/Container";
import Animate from "@/components/animation/Animate";
import { fade, fadeD1 } from "@/lib/animation";
import Heading from "@/components/shared/Heading";
import WaveLines from "@/components/animation/WaveLines";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/custom/select";
import LocationMap from "@/components/contact/LocationMap";
import { IoArrowForward } from "react-icons/io5";
import Email from "@/components/icons/Email";
import Phone from "@/components/icons/Phone";
import Location from "@/components/icons/Location";


// ─── Icons (inline SVG to avoid extra deps) ─────────────────────────────────

const ChatIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-5 h-5"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);



// ─── Schema ──────────────────────────────────────────────────────────────────
export const ContactSchema = (t: any) =>
  z.object({
    fullName: z.string().min(2, t("contact.validation.firstNameMin")),
    email: z
      .string()
      .email(t("contact.validation.emailValid"))
      .min(5, t("contact.validation.emailMin")),
    phone_number: z.number(t("contact.validation.phoneNumberValid")).optional(),
    plan: z.string().optional(),
    message: z.string().min(10, t("contact.validation.messageMin")),
  });

type ContactFormType = z.infer<ReturnType<typeof ContactSchema>>;

// ─── Topic Selector ───────────────────────────────────────────────────────────
const TOPICS = [
  {
    key: "delivery",
    name: {
      en: "Delivery",
      ar: "التوصيل",
    },
    label: {
      en: "Delivery & account",
      ar: "التوصيل والحساب",
    },
    subtitle: {
      en: "Fastest — avg. 3 min",
      ar: "الأسرع — متوسط 3 دقائق",
    },
  },
  {
    key: "nutrition",
    name: {
      en: "Nutrition",
      ar: "التغذية",
    },
    label: {
      en: "Nutrition question",
      ar: "سؤال غذائي",
    },
    subtitle: {
      en: "Routed to our dietitians",
      ar: "يتم تحويله إلى أخصائيي التغذية",
    },
  },
  {
    key: "corporate",
    name: {
      en: "Corporate",
      ar: "الشركات",
    },
    label: {
      en: "Corporate & events",
      ar: "الشركات والفعاليات",
    },
    subtitle: {
      en: "Teams of 10+",
      ar: "للفرق من 10 أشخاص أو أكثر",
    },
  },
  {
    key: "press",
    name: {
      en: "Press",
      ar: "الصحافة",
    },
    label: {
      en: "Press & partnerships",
      ar: "الصحافة والشراكات",
    },
    subtitle: {
      en: "Media kit available",
      ar: "ملف إعلامي متاح",
    },
  },
] as const;
const plans = [
  {
    key: "plan.notMember",
    label: {
      en: "Not a member",
      ar: "لست مشتركًا",
    },
  },
  {
    key: "plan.starter",
    label: {
      en: "Starter",
      ar: "الباقة الأساسية",
    },
  },
  {
    key: "plan.pro",
    label: {
      en: "Pro",
      ar: "الاحترافية",
    },
  },
  {
    key: "plan.enterprise",
    label: {
      en: "Enterprise",
      ar: "المؤسسات",
    },
  },
] as const;

// ─── Main Component ───────────────────────────────────────────────────────────
function ContactPage() {
  const { t, lang, isRTL } = useLang();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("delivery");
  const [charCount, setCharCount] = useState(0);

  const form = useForm<ContactFormType>({
    resolver: zodResolver(ContactSchema(t)),
    defaultValues: {
      fullName: "",
      email: "",
      phone_number: undefined,
      plan: "",
      message: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = form;

  const selectedPlan = watch("plan");

  const onSubmit = async (data: ContactFormType) => {
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 1500));
    console.log("Contact Data:", data);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-20 px-4 relative overflow-hidden">
      <Container className="pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <WaveLines
            className="absolute -z-10 opacity-60 rotate-45 -inset-s-250 top-200 
                 sm:rotate-30 sm:-inset-s-200 sm:top-150 
                 xl:-rotate-20 xl:-inset-s-100 xl:top-150"
            svgClassName="w-[130%] h-100 xl:w-[130%] xl:h-full"
          />
        </div>

        <div className="mb-14 text-center">
          <Heading
            i18nKey={"contact.title"}
            components={{
              custom: <span className="text-primary" />,
            }}
          />
          <p className="mx-auto max-w-lg text-foreground/60 text-base leading-relaxed">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* ── LEFT: Write Us Form ──────────────────────────────────────── */}
          <Animate variants={fade} className="w-full sm:max-w-lg mx-auto ">
            <div className="bg-background/50 backdrop-blur-xs rounded-3xl p-8 border">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-[42px] font-bold leading-tight mb-2">
                  {t("contact.writeUs.title")}{" "}
                  <em className="italic font-bold">
                    {t("contact.writeUs.titleItalic")}
                  </em>
                </h1>
                <p className="text-foreground/50 text-sm">
                  {t("contact.writeUs.subtitle")}
                </p>
              </div>

              {/* Topic Selector */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {TOPICS.map((topic) => (
                  <button
                    key={topic.key}
                    type="button"
                    onClick={() => setSelectedTopic(topic.key)}
                    className={`
                      text-start p-4 rounded-2xl  transition-all border duration-200 cursor-pointer
                      ${
                        selectedTopic === topic.key
                          ? "bg-primary text-primary-foreground border-primary/5 "
                          : "bg-background/20"
                      }
                    `}
                  >
                    <p className="font-semibold text-sm mb-0.5 capitalize">
                      {t(topic.name[lang])}
                    </p>
                    <p
                      className={`text-xs ${selectedTopic === topic.key ? "text-primary-foreground/90" : "text-foreground/50"}`}
                    >
                      {t(topic.label[lang])}
                    </p>
                  </button>
                ))}
              </div>

              <FormProvider {...form}>
                <div className="space-y-5">
                  {/* Full Name & Email */}
                  <div className="grid grid-cols-2 gap-4">
                    <CustomField
                      name="fullName"
                      label={t("contact.fields.fullName")}
                    >
                      {(field) => (
                        <Input
                          placeholder={t("contact.fields.fullNamePlaceholder")}
                          {...field}
                          className=""
                        />
                      )}
                    </CustomField>

                    <CustomField name="email" label={t("contact.fields.email")}>
                      {(field) => (
                        <Input
                          placeholder={t("contact.fields.emailPlaceholder")}
                          {...field}
                          className=""
                        />
                      )}
                    </CustomField>
                  </div>

                  {/* Phone & Plan */}
                  <div className="grid grid-cols-2 gap-4">
                    <PhoneField
                      label={t("contact.fields.phoneOptional")}
                      name="phone_number"
                      register={register}
                      error={errors.phone_number}
                    />

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium uppercase tracking-wide ">
                        {t("contact.fields.plan")}
                      </label>

                      <Select
                        value={selectedPlan}
                        onValueChange={(value) => form.setValue("plan", value)}
                      >
                        <SelectTrigger className="h-20 rounded-full w-full min-h-12 text-sm mt-2">
                          <SelectValue placeholder={t("contact.fields.plan")} />
                        </SelectTrigger>

                        <SelectContent>
                          {plans.map((plan) => (
                            <SelectItem key={plan.key} value={plan.key}>
                              {plan.label[lang]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Message */}
                  <CustomField
                    name="message"
                    label={t("contact.fields.message")}
                  >
                    {(field) => (
                      <Textarea
                        placeholder={t("contact.fields.messagePlaceholder")}
                        {...field}
                        className="min-h-35 resize-none rounded-3xl bg-background/20! backdrop-blur-xs"
                      />
                    )}
                  </CustomField>

                  {/* Footer row */}
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-foreground/50 max-w-50 leading-relaxed">
                      {t("contact.feedback.replyNote")}
                    </p>
                    <SpinnerButton
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className="py-5 px-7 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium"
                      isSubmitting={isSubmitting}
                      text={t("contact.feedback.sendMessage")}
                      isSubmittingText="contact.feedback.sending"
                    />
                  </div>
                </div>
              </FormProvider>
            </div>
          </Animate>

          {/* ── RIGHT: Info Cards ─────────────────────────────────────────── */}
          <Animate
            variants={fadeD1}
            className="flex flex-col gap-4 h-full w-full sm:max-w-lg mx-auto  "
          >
            {/* Chat Now Card */}
            <div className="border rounded-3xl p-8 bg-background/50 backdrop-blur-xs">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary-foreground">
                  {t("contact.chat.agentsOnline")}
                </span>
              </div>
              <h2 className="text-3xl font-bold leading-tight mb-2">
                {t("contact.chat.title")}{" "}
                <em className="italic text-primary">
                  {t("contact.chat.titleItalic")}
                </em>
              </h2>
              <p className=" text-sm mb-6 leading-relaxed">
                {t("contact.chat.subtitle")}
              </p>
              <button className="w-full flex items-center justify-between bg-primary hover:bg-primary/90 transition-colors text-primary-foreground font-semibold rounded-full py-4 px-7 text-sm">
                <span>{t("contact.chat.openChat")}</span>
                <IoArrowForward className={isRTL? "rotate-180": ""}/>
              </button>
            </div>

            {/* Direct Lines Card */}
            <div className="bg-background/50 backdrop-blur-xs rounded-3xl p-8 border">
              <h2 className="text-[28px] font-bold  mb-6">
                {t("contact.direct.title")}{" "}
                <em className="italic text-primary">
                  {t("contact.direct.titleItalic")}
                </em>
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full  flex items-center justify-center shrink-0 text-foreground/50">
                    <Email />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">hello@bitely.com</p>
                    <p className="text-xs text-foreground/50 mt-0.5">
                      {t("contact.direct.emailSub")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full  flex items-center justify-center shrink-0 text-foreground/50">
                    <Phone />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">+971 800 BITELY</p>
                    <p className="text-xs text-foreground/50 mt-0.5">
                      {t("contact.direct.phoneSub")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full  flex items-center justify-center shrink-0 text-foreground/50">
                    <Location />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {t("contact.direct.address")}
                    </p>
                    <p className="text-xs text-foreground/50 mt-0.5">
                      {t("contact.direct.addressSub")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-primary rounded-3xl overflow-hidden flex-1 relative min-h-80 lg:min-h-40">
              <LocationMap lat={24.7136} lng={46.6753} />
            </div>
          </Animate>
        </div>
      </Container>
    </div>
  );
}

export default ContactPage;
