"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { CustomField } from "@/components/form/FormField";
import { CustomFormPassword } from "@/components/form/FormPassword";
import Email from "@/components/icons/Email";
import Lock from "@/components/icons/Lock";
import SpinnerButton from "@/components/shared/SpinnerButton";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Apple from "@/components/icons/Apple";
import Link from "next/link";

const LoginSchema = (t: any) =>
  z.object({
    email: z
      .string()
      .email(t("auth.validation.emailValid"))
      .min(5, t("auth.validation.emailMin")),
    password: z
      .string()
      .min(6, t("auth.validation.passwordMin"))
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{6,}$/,
        t("auth.validation.passwordStrong")
      ),
  });

type LoginFormType = z.infer<ReturnType<typeof LoginSchema>>;

function LoginForm() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormType) => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Login data:", { ...data, rememberMe });

    setIsSubmitting(false);
    form.reset();
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleAppleLogin = () => {
    console.log("Apple login clicked");
  };

  return (
    <div className=" flex items-center justify-center p-4 text-black">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10">
          <h1 className=" text-4xl font-bold leading-tight mb-2">
            {t("auth.login")}
          </h1>
          <p className="text-neutral-500 text-base">{t("auth.subtitle")}</p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-4 bg-white border border-neutral-200 rounded-full flex items-center justify-center gap-2 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <FcGoogle className="size-5" />
                <span className="text-sm font-medium">
                  {t("auth.signInWithGoogle")}
                </span>
              </button>

              <button
                type="button"
                onClick={handleAppleLogin}
                className="w-full p-4 bg-white border border-neutral-200  rounded-full flex items-center justify-center gap-2 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <Apple className="size-5" />
                <span className="text-sm font-medium">
                  {t("auth.signInWithApple")}
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-neutral-200"></div>
              <span className="text-neutral-500] text-sm">
                {t("auth.orLoginWith")}
              </span>
              <div className="flex-1 h-px bg-neutral-200"></div>
            </div>

            {/* Email Field */}
            <CustomField
              name="email"
              label={t("auth.email")}
              icon={<Email className="size-5" />}
            >
              {(field) => (
                <Input placeholder={t("auth.emailPlaceholder")} {...field}  className="border-neutral-100"/>
              )}
            </CustomField>

            {/* Password */}
            <CustomFormPassword
              name="password"
              label="Password"
              icon={<Lock className="size-5" />}
              className="border-neutral-100 text-neutral-900"
              placeholder={t("auth.passwordPlaceholder")}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(value) => setRememberMe(Boolean(value))}
                />

                <span className=" text-base">{t("auth.rememberMe")}</span>
              </label>
              <button
                type="button"
                className="text-custom-green text-base font-medium hover:underline"
              >
                {t("auth.forgotPassword")}
              </button>
            </div>

            {/* Submit */}
            <SpinnerButton
              type={"submit"}
              disabled={isSubmitting}
              className="w-full py-7 text-md  mt-4"
              isSubmittingText="auth.signingIn"
              text="auth.signIn"
              isSubmitting={isSubmitting}
            />

            {/* Sign Up Link */}
            <p className="text-center  text-base">
              {t("auth.notRegistered")}{" "}
              <Link
                href="/register"
                type="button"
                className="text-custom-green font-medium hover:underline"
              >
                {t("auth.createAccount")}
              </Link>
            </p>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default LoginForm;
