"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CustomField } from "@/components/form/FormField";
import SpinnerButton from "@/components/shared/SpinnerButton";
import Translate from "@/components/shared/Translate";
import { useLang } from "@/hooks/useLang";
import { fade } from "@/lib/animation";
import Animate from "@/components/animation/Animate";
import { apiRequest } from "@/lib/api/api";
import { notify } from "@/lib/notify";
import Phone from "@/components/icons/Phone";
import { cn, convertToEnglishNumbers } from "@/lib/utils";
import { TFunction } from "i18next";
import ProfileApiEndpoints from "@/services/profile/api";
import { useQueryClient } from "@tanstack/react-query";

export const CompleteProfileSchema = (t: TFunction<"translation", undefined>) =>
  z.object({
    phone_number: z
      .string()
      .min(8, t("auth.validation.phoneNumberMin"))
      .regex(/^[0-9+\-\s()]{7,20}$/, t("auth.validation.phoneNumberValid")),
  });

type CompleteProfileFormType = z.infer<
  ReturnType<typeof CompleteProfileSchema>
>;

function CompleteProfile({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useLang();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CompleteProfileFormType>({
    resolver: zodResolver(CompleteProfileSchema(t)),
    defaultValues: {
      phone_number: "",
    },
  });

  const onSubmit = async (data: CompleteProfileFormType) => {
    await apiRequest(ProfileApiEndpoints.completeProfile(data), {
      t,
      setError: form.setError,
      setLoading: setIsSubmitting,
      showErrorToast: true,
      onSuccess: async () => {
        notify(t("auth.profileCompleted"));

        queryClient.invalidateQueries({ queryKey: ["user"] });

        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <Animate
      variants={fade}
      className="flex justify-center items-center md:min-w-md min-h-[750px]"
    >
      <div
        className={cn(
          "p-8 rounded-2xl shadow-2xl w-full max-w-lg bg-black/80 sm:p-10"
        )}
      >
        <h2 className="text-white text-2xl font-semibold">
          <Translate text="auth.completeProfile" />
        </h2>
        <p className="text-neutral-500 text-sm font-semibold mb-6 mt-1">
          <Translate text="auth.enterPhoneNumber" />
        </p>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Phone Field */}
            <CustomField
              name="phone_number"
              label={t("auth.phone")}
              icon={<Phone />}
            >
              {(field) => (
                <Input
                  type="tel"
                  inputMode="numeric"
                  pattern="\d*"
                  placeholder={t("auth.phonePlaceholder")}
                  {...field}
                  onChange={(e) => {
                    const englishValue = convertToEnglishNumbers(
                      e.target.value
                    );
                    field.onChange(englishValue);
                  }}
                />
              )}
            </CustomField>

            <SpinnerButton
              type="submit"
              className="w-full py-6 text-base font-semibold bg-white text-neutral-800 rounded-2xl mt-4 cursor-pointer"
              disabled={isSubmitting}
              isSubmitting={isSubmitting}
              isSubmittingText="auth.saving"
              text="auth.save"
            />
          </form>
        </FormProvider>
      </div>
    </Animate>
  );
}

export default CompleteProfile;
