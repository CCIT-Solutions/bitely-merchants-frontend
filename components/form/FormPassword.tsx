"use client";

import * as React from "react";
import {
  useFormContext,
  Controller,
  FieldValues,
  Path,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface CustomFormPasswordProps<T extends FieldValues> {
  name: Path<T>;
  label: React.ReactNode;
  required?: boolean;
  icon?: React.ReactNode;
  placeholder?: string;
  className?: string
}

export function CustomFormPassword<T extends FieldValues>({
  name,
  label,
  required,
  icon,
  placeholder,
  className
}: CustomFormPasswordProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const [showPassword, setShowPassword] = React.useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1 relative">
      <Label htmlFor={name} className=" font-medium mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            {icon && (
              <div className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-muted-foreground">
                {icon}
              </div>
            )}

            <input
              {...field}
              id={name}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder} 
              className={cn(
                "border focus-visible:border-primary focus-visible:ring-primary/0 py-3 rounded-full w-full text-white placeholder:text-neutral-500",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus:border-primary outline-0",
                icon && "ps-10",
                "pe-10", 
                className
              )}
              aria-invalid={!!error}
            />

            {/* Password visibility toggle */}
            <button
              type="button"
              onClick={togglePassword}
              className="absolute inset-y-0 end-3 flex items-center text-neutral-400 hover:text-primary transition-colors cursor-pointer"
              tabIndex={-1}
              aria-label="visibility toggle"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible className="w-5 h-5" />
              ) : (
                <AiOutlineEye className="w-5 h-5" />
              )}
            </button>
          </div>
        )}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
