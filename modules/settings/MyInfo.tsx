"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomField } from "@/components/form/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/custom/select";
import Animate from "@/components/animation/Animate";
import { fade } from "@/lib/animation";
import { useLang } from "@/hooks/useLang";
import Translate from "@/components/shared/Translate";
import User from "@/components/icons/User";
import Email from "@/components/icons/Email";
import Phone from "@/components/icons/Phone";
import { Label } from "@/components/ui/label";
import { useGetUser } from "@/services/profile/query";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/api";
import ProfileApiEndpoints from "@/services/profile/api";
import { notify } from "@/lib/notify";
import AvatarUpload from "./AvatarUpload";
import { useQueryClient } from "@tanstack/react-query";

function MyInfo() {
  const { t, isRTL } = useLang();
  const { data, refetch } = useGetUser();
  const user = data?.data;

  const queryClient = useQueryClient();

  const MyInfoSchema = z.object({
    name: z.string().min(2, t("settings.firstNameShort")),
    email: z.string().email(t("settings.invalidEmail")),
    phone_number: z.string().min(8, t("settings.invalidPhone")),
    birthday: z.string().optional(),
  });

  type MyInfoType = z.infer<typeof MyInfoSchema>;

  // Initialize form
  const form = useForm<MyInfoType>({
    resolver: zodResolver(MyInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      birthday: "",
    },
  });

  // State for birthday selects
  const [birthdayDay, setBirthdayDay] = useState("");
  const [birthdayMonth, setBirthdayMonth] = useState("");
  const [birthdayYear, setBirthdayYear] = useState("");

  // Update form when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        birthday: user.birthday || "",
      });

      // Parse birthday if exists (assuming format: YYYY-MM-DD)
      if (user.birthday) {
        const [year, month, day] = user.birthday.split("-");
        setBirthdayYear(year || "");
        setBirthdayMonth(month || "");
        setBirthdayDay(day || "");
      }
    }
  }, [user, form]);

  // Update birthday field when selects change
  useEffect(() => {
    if (birthdayYear && birthdayMonth && birthdayDay) {
      const birthday = `${birthdayYear}-${birthdayMonth}-${birthdayDay}`;
      form.setValue("birthday", birthday);
    }
  }, [birthdayYear, birthdayMonth, birthdayDay, form]);

  // Handle Submit
  const onSubmit = async (data: MyInfoType) => {
    await apiRequest(ProfileApiEndpoints.updateProfile(data), {
      t,
      setError: form.setError,
      showErrorToast: true,
      onSuccess: (res) => {
        notify(t("settings.profileUpdated") || "Profile updated successfully");
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },
    });
  };

  return (
    <Animate variants={fade}>
      <h1 className="text-3xl font-bold mb-2">
        <Translate text="settings.myInfo" />
      </h1>
      <p className="text-neutral-400 mb-8">
        <Translate text="settings.updatePersonalInfo" />
      </p>

      {/* Avatar Upload Component */}
      <AvatarUpload currentAvatar={user?.avatar} />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomField
              name="name"
              label={t("settings.name") || "Name"}
              icon={<User className="text-neutral-400" />}
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder={
                    t("settings.namePlaceholder") || "Enter your name"
                  }
                  className="py-7 bg-neutral-900/80 border border-neutral-800"
                />
              )}
            </CustomField>

            <CustomField
              name="phone_number"
              label={t("settings.phoneNumber")}
              icon={<Phone className="text-neutral-400" />}
            >
              {(field) => (
                <Input
                  type="text"
                  {...field}
                  placeholder={t("settings.phonePlaceholder")}
                  className="py-7 bg-neutral-900/80 border border-neutral-800"
                />
              )}
            </CustomField>
          </div>

          {/* Email (Read-only) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomField
              name="email"
              label={t("settings.email")}
              icon={<Email className="text-neutral-400" />}
            >
              {(field) => (
                <Input
                  type="email"
                  {...field}
                  disabled
                  placeholder={t("settings.emailPlaceholder")}
                  className="py-7 bg-neutral-900/80 border border-neutral-800 opacity-60 cursor-not-allowed"
                />
              )}
            </CustomField>

            {/* Birthday */}
            <div className="space-y-2">
              <Label className="text-neutral-400 font-medium mb-3">
                <Translate text="settings.birthday" />
              </Label>
              <div className="grid grid-cols-3 gap-4">
                <Select
                  value={birthdayDay}
                  onValueChange={setBirthdayDay}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <SelectTrigger className="bg-neutral-900/80 border-neutral-800 py-7 px-4 w-full">
                    <SelectValue placeholder={t("settings.day")} />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800 max-h-[300px] overflow-y-auto">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <SelectItem
                        key={day}
                        value={String(day).padStart(2, "0")}
                      >
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={birthdayMonth}
                  onValueChange={setBirthdayMonth}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <SelectTrigger className="bg-neutral-900/80 border-neutral-800 py-7 px-4 w-full">
                    <SelectValue placeholder={t("settings.month")} />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800 max-h-[350px]">
                    {[
                      t("settings.january"),
                      t("settings.february"),
                      t("settings.march"),
                      t("settings.april"),
                      t("settings.may"),
                      t("settings.june"),
                      t("settings.july"),
                      t("settings.august"),
                      t("settings.september"),
                      t("settings.october"),
                      t("settings.november"),
                      t("settings.december"),
                    ].map((month, index) => (
                      <SelectItem
                        key={month}
                        value={String(index + 1).padStart(2, "0")}
                      >
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={birthdayYear}
                  onValueChange={setBirthdayYear}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <SelectTrigger className="bg-neutral-900/80 border-neutral-800 py-7 px-4 w-full">
                    <SelectValue placeholder={t("settings.year")} />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800 max-h-[350px]">
                    {Array.from(
                      { length: 100 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {/* Save Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-neutral-200 hover:bg-white hover:text-black text-black transition-all py-6 rounded-2xl min-w-48 cursor-pointer font-semibold tracking-widest w-full sm:w-auto"
            >
              {form.formState.isSubmitting ? (
                <Translate text="settings.saving" />
              ) : (
                <Translate text="settings.saveChanges" />
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Animate>
  );
}

export default MyInfo;
