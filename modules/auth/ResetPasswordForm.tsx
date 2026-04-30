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
            <Translate text="auth.resetPassword" />
          </h2>
          <p className="text-neutral-400 text-sm font-semibold mb-6 mt-1">
            <Translate text="auth.enterNewPassword" />
          </p>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* New Password */}
              <CustomField
                name="password"
                label={t("auth.newPassword")}
                icon={<Lock />}
              >
                {(field) => (
                  <Input
                    placeholder={t("auth.newPasswordPlaceholder")}
                    {...field}
                    type="password"
                  />
                )}
              </CustomField>

              {/* Confirm Password */}
              <CustomField
                name="password_confirmation"
                label={t("auth.password_confirmation")}
                icon={<Lock />}
              >
                {(field) => (
                  <Input
                    placeholder={t("auth.confirmPasswordPlaceholder")}
                    {...field}
                    type="password"
                  />
                )}
              </CustomField>

              {/* Submit */}
              <SpinnerButton
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 text-base font-semibold bg-white text-neutral-800 rounded-2xl mt-4 cursor-pointer"
                isSubmittingText="auth.resetingPassword"
                text="auth.resetPasswordButton"
                isSubmitting={isSubmitting}
              />

              {/* Back to login */}
              <p className="text-neutral-400 text-sm text-center mt-6">
                <Translate text="auth.rememberPassword" />{" "}
                <Link
                  href="/login"
                  className="text-white font-medium hover:underline"
                >
                  <Translate text="auth.signIn" />
                </Link>
              </p>
            </form>
          </FormProvider>
        </div>
      </Animate>
    </AuthLayout>
  );
}
