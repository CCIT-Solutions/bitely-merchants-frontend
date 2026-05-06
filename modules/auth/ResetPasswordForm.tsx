"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { CustomField } from "@/components/form/FormField";
import { useLang } from "@/hooks/useLang";
import Lock from "@/components/icons/Lock";
import Translate from "@/components/shared/Translate";
import { apiRequest } from "@/lib/api/api";
import AuthApiEndpoints from "@/services/auth/api";
import { notify } from "@/lib/notify";
import Animate from "@/components/animation/Animate";
import SpinnerButton from "@/components/shared/SpinnerButton";
import AuthLayout from "@/layout/AuthLayout";
import { fade } from "@/lib/animation";
import Link from "next/link";

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .nonempty("Password is required"),
    password_confirmation: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });

type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordPage() {
  const { t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", password_confirmation: "" },
  });

  const onSubmit = async (data: ResetPasswordType) => {
    if (!token || !email) {
      notify("Invalid or missing token.", { type: "error" });
      return;
    }

    await apiRequest<null, {}, ResetPasswordType>(
      AuthApiEndpoints.resetPassword({ ...data, token, email }),
      {
        t,
        setError: form.setError,
        setLoading: setIsSubmitting,
        showErrorToast: true,
        onSuccess: () => {
          notify(t("auth.passwordResetSuccess"), { type: "success" });
          form.reset();
          router.push("/login");
        },
      },
    );
  };

  return (
    <AuthLayout>
      <Animate
        variants={fade}
        className="flex items-center justify-end w-full"
      >
        <div className="flex items-center justify-center w-full">
          <div className="w-full">
            {/* Header */}
            <div className="mb-10 text-center">
              <h1 className="text-2xl font-medium text-primary-foreground leading-tight mb-2">
                {t("auth.resetPassword")}
              </h1>
              <p className="text-neutral-500 text-lg max-w-sm">
                {t("auth.enterNewPassword")}
              </p>
            </div>

            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Password */}
                <CustomField
                  name="password"
                  label={t("auth.newPassword")}
                  icon={<Lock className="size-5" />}
                >
                  {(field) => (
                    <Input
                      type="password"
                      placeholder={t("auth.newPasswordPlaceholder")}
                      {...field}
                      className="border-neutral-200"
                    />
                  )}
                </CustomField>

                {/* Confirm Password */}
                <CustomField
                  name="password_confirmation"
                  label={t("auth.confirmPassword")}
                  icon={<Lock className="size-5" />}
                >
                  {(field) => (
                    <Input
                      type="password"
                      placeholder={t("auth.confirmPasswordPlaceholder")}
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
                  text="auth.resetPasswordButton"
                  isSubmittingText="auth.resetingPassword"
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
