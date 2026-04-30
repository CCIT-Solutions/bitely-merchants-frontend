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
      }
    );
  };

  return (
    <AuthLayout>
      <Animate
        variants={fade}
        className="flex items-center justify-end lg:bg-transparent sm:min-w-md"
      >
        <div className="bg-black/80 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-lg">
          <h2 className="text-white text-2xl font-semibold">
            <Translate text="auth.forgotPassword" />
          </h2>
          <p className="text-neutral-400 text-sm font-semibold mb-6 mt-1">
            <Translate text="auth.enterEmailToReset" />
          </p>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <CustomField
                name="email"
                label={t("auth.email")}
                icon={<Email />}
              >
                {(field) => (
                  <Input
                    placeholder={t("auth.emailPlaceholder")}
                    {...field}
                    type="email"
                  />
                )}
              </CustomField>

              {/* Submit */}
              <SpinnerButton
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 text-base font-semibold bg-white text-neutral-800 rounded-2xl mt-4 cursor-pointer"
                isSubmittingText="auth.sendingLink"
                text="auth.sendResetLink"
                isSubmitting={isSubmitting}
              />

              {/* Back to login */}
              <p className="text-neutral-400 text-sm text-center mt-6">
                <Translate text="auth.rememberPassword" />{" "}
                {onSwitchToLogin ? (
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-white font-medium hover:underline"
                  >
                    <Translate text="auth.signIn" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="text-white font-medium hover:underline"
                  >
                    <Translate text="auth.signIn" />
                  </Link>
                )}
              </p>
            </form>
          </FormProvider>
        </div>
      </Animate>
    </AuthLayout>
  );
}

export default ForgetPasswordForm;
