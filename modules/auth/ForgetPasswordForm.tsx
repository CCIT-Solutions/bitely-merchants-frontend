"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { CustomField } from "@/components/form/FormField";
import { useLang } from "@/hooks/useLang";
import Email from "@/components/icons/Email";
import Translate from "@/components/shared/Translate";
import { fade } from "@/lib/animation";
import { apiRequest } from "@/lib/api/api";
import AuthApiEndpoints from "@/services/auth/api";
import { notify } from "@/lib/notify";
import Animate from "@/components/animation/Animate";
import SpinnerButton from "@/components/shared/SpinnerButton";
import AuthLayout from "@/layout/AuthLayout";

const ForgetPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nonempty("Email is required"),
});

type ForgetPasswordType = z.infer<typeof ForgetPasswordSchema>;

function ForgetPasswordForm({
  onSuccess,
  onSwitchToLogin,
}: {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}) {
  const { t } = useLang();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgetPasswordType>({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgetPasswordType) => {
    await apiRequest<null, {}, ForgetPasswordType>(
      AuthApiEndpoints.forgetPassword(data),
      {
        t,
        setError: form.setError,
        setLoading: setIsSubmitting,
        showErrorToast: true,
        onSuccess: () => {
          notify(t("auth.resetLinkSent"), { type: "success" });
          form.reset();
          if (typeof onSuccess === "function") onSuccess();
        },
      },
    );
  };

  return (
    <AuthLayout>
      <Animate
        variants={fade}
        className="flex items-center justify-end lg:bg-transparent "
      >
        <div className="flex items-center justify-center w-full">
          <div className="w-full ">
            {/* Header */}
            <div className="mb-10 text-center">
              <h1 className="text-2xl font-medium text-primary-foreground leading-tight mb-2">
                {t("auth.forgotPassword")}
              </h1>
              <p className="text-neutral-500 text-lg max-w-sm">
                {t("auth.enterEmailToReset")}
              </p>
            </div>

            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Email */}
                <CustomField
                  name="email"
                  label={t("auth.email")}
                  icon={<Email className="size-5" />}
                >
                  {(field) => (
                    <Input
                      type="email"
                      placeholder={t("auth.emailPlaceholder")}
                      {...field}
                      className="border-neutral-200"
                    />
                  )}
                </CustomField>

                {/* Submit */}
                <SpinnerButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-7 text-md mt-4"
                  isSubmitting={isSubmitting}
                  text="auth.sendResetLink"
                  isSubmittingText="auth.sendingLink"
                />

                {/* Back to login */}
                <p className="text-center text-base">
                  {t("auth.rememberPassword")}{" "}
                  <Link
                    href="/login"
                    className="text-custom-green font-medium hover:underline"
                  >
                    {t("auth.login")}
                  </Link>
                </p>
              </form>
            </FormProvider>
          </div>
        </div>
      </Animate>
    </AuthLayout>
  );
}

export default ForgetPasswordForm;
