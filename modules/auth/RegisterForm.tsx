"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Phone } from "lucide-react";
import { CustomField } from "@/components/form/FormField";
import Email from "@/components/icons/Email";
import { Input } from "@/components/ui/input";
import { useLang } from "@/hooks/useLang";
import SpinnerButton from "@/components/shared/SpinnerButton";
import { CustomFormPassword } from "@/components/form/FormPassword";
import { PhoneField } from "@/components/form/PhoneField";
import Link from "next/link";

export const RegisterSchema = (t: any) =>
  z
    .object({
      name: z.string().min(2, t("auth.validation.nameMin")),
      email: z
        .string()
        .email(t("auth.validation.emailValid"))
        .min(5, t("auth.validation.emailMin")),
      phone_number: z
        .number(t("auth.validation.phoneNumberValid"))
        .min(9, t("auth.validation.phoneNumberMin")),
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

type RegisterFormType = z.infer<ReturnType<typeof RegisterSchema>>;

function RegisterForm() {
  const { t } = useLang();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      phone_number: undefined,
      password: "",
      password_confirmation: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = async (data: RegisterFormType) => {
    setIsSubmitting(true);

    await new Promise((res) => setTimeout(res, 1500));
    console.log("Register Data:", data);

    setIsSubmitting(false);
  };

  return (
    <div className=" flex items-center justify-center p-4 min-h-screen text-black">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[40px] font-bold leading-tight mb-2 ">
            {t("auth.createAccount")}
          </h1>
          <p className="text-neutral-500 text-lg max-w-sm">
            {t("auth.createAccountSub")}
          </p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <CustomField
              name="email"
              label={t("auth.email")}
              icon={<Email className="size-5" />}
            >
              {(field) => (
                <Input
                  placeholder={t("auth.emailPlaceholder")}
                  {...field}
                  className="border-neutral-200"
                />
              )}
            </CustomField>

            {/* Phone Number */}
            <PhoneField
              label={t("auth.phone")}
              name="phone_number"
              register={register}
              error={errors.phone_number}
              className="border-neutral-200"
              dividerClassName="dark:text-neutral-200"
            />

            {/* Password */}
            <CustomFormPassword
              name="password"
              label={t("auth.password")}
              icon={<Lock className="size-5" />}
              placeholder={t("auth.passwordPlaceholder")}
              className="border-neutral-200 text-neutral-900"
            />

            {/* Confirm Password */}
            <CustomFormPassword
              name="password_confirmation"
              label={t("auth.confirmPassword")}
              icon={<Lock className="size-5" />}
              placeholder={t("auth.confirmPasswordPlaceholder")}
              className="border-neutral-200 text-neutral-900"
            />

            {/* Submit Button */}
            <SpinnerButton
              type="submit"
              disabled={isSubmitting}
              className="w-full py-7 text-md mt-4"
              isSubmitting={isSubmitting}
              text="auth.signUp"
              isSubmittingText="auth.signingUp"
            />

            {/* Switch to Login */}
            <p className="text-center text-base  ">
              {t("auth.haveAccount")}{" "}
               <Link
                href="/login"
                type="button"
                className="text-custom-green font-medium hover:underline"
              >
                {t("auth.login")}
              </Link>
            </p>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default RegisterForm;
