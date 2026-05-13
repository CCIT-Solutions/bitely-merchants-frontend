"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Animate from "@/components/animation/Animate";
import { fade } from "@/lib/animation";
import { Button } from "@/components/ui/button";
import { CustomFormPassword } from "@/components/form/FormPassword";
import Translate from "@/components/shared/Translate";
import { useLang } from "@/hooks/useLang";
import Lock from "@/components/icons/Lock";
import { apiRequest } from "@/lib/api/api";
import ProfileApiEndpoints from "@/services/profile/api";
import { TFunction } from "i18next";
import { notify } from "@/lib/notify";

//  Validation Schema
const ChangePasswordSchema = (t: TFunction<"translation", undefined>) =>
  z
    .object({
      old_password: z
        .string()
        .min(6, "Current password must be at least 6 characters"),
      password: z
        .string()
        .min(6, t("auth.validation.passwordMin"))
        .regex(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{6,}$/,
          t("auth.validation.passwordStrong")
        ),
      password_confirmation: z
        .string()
        .min(1, t("auth.validation.passwordConfirmRequired")),
    })
    .refine((data) => data.password === data.password_confirmation, {
      path: ["password_confirmation"],
      message: t("auth.validation.passwordsMustMatch"),
    });

type ChangePasswordType = z.infer<ReturnType<typeof ChangePasswordSchema>>;

function ChangePassword() {
  const { t } = useLang();

  const form = useForm<ChangePasswordType>({
    resolver: zodResolver(ChangePasswordSchema(t)),
    defaultValues: {
      old_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: ChangePasswordType) => {
    const response = await apiRequest(
      ProfileApiEndpoints.updatePassword(data),
      {
        t,
        setError: form.setError,
        setLoading: () => form.formState.isSubmitting,
        showErrorToast: true,
        onSuccess: (res) => {
          notify(t("settings.passwordUpdated"));
        },
      }
    );
  };

  return (
    <Animate variants={fade}>
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">
        <Translate text="settings.changePassword" />
      </h1>
      <p className="text-neutral-400 mb-8">
        <Translate text="settings.updatePasswordSubtitle" />
      </p>

      {/* Form */}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Password */}
            <CustomFormPassword
              icon={<Lock />}
              name="old_password"
              label={t("settings.currentPassword")}
              placeholder={t("settings.currentPasswordPlaceholder")}
              className="py-4 bg-neutral-900/80 border border-neutral-800"
            />

            {/* New Password */}
            <CustomFormPassword
              icon={<Lock />}
              name="password"
              label={t("settings.newPassword")}
              placeholder={t("settings.newPasswordPlaceholder")}
              className="py-4 bg-neutral-900/80 border border-neutral-800"
            />

            {/* Password Confirmation */}
            <CustomFormPassword
              name="password_confirmation"
              label={t("auth.passwordConfirm")}
              icon={<Lock />}
              placeholder={t("auth.passwordConfirmPlaceholder")}
            />
          </div>

          {/* Submit */}
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

export default ChangePassword;
