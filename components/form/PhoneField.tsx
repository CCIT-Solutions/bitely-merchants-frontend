"use client";

import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/custom/select";
import { useState } from "react";
import { countries } from "@/constants/countries";

interface PhoneFieldProps<TFormValues extends FieldValues> {
  label: string;
  name: Path<TFormValues>;
  error?: string | FieldError;
  register: UseFormRegister<TFormValues>;
  className?: string;
  dividerClassName?: string;
  inputClassName?: string;
  selectTriggerClassName?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export function PhoneField<TFormValues extends FieldValues>({
  label,
  name,
  error,
  register,
  className,
  inputClassName,
  dividerClassName,
  required,
  icon,
  selectTriggerClassName
}: PhoneFieldProps<TFormValues>) {
  const [dialCode, setDialCode] = useState("966");

  return (
    <div className="space-y-1">
      {/* Label */}
      <Label htmlFor={name} className="font-medium mb-4 block">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {/* Field Wrapper */}
      <div
        className={cn(
          "flex items-center rounded-full border border-input px-2 py-1 shadow-xs bg-input/30 ",
          "focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/20 transition",
          error && "border-destructive",
          className
        )}
         dir="ltr"
      >
        {/* Optional Icon */}
        {icon && (
          <div className="mr-2 text-muted-foreground shrink-0">
            {icon}
          </div>
        )}

        {/* Country Code */}
        <Select value={dialCode} onValueChange={setDialCode}>
          <SelectTrigger
            className={cn("w-22 shrink-0 shadow-none p-0 h-auto focus:ring-0 focus:outline-none text-foreground/50 px-3 border border-input/50 ", selectTriggerClassName)}
          >
            <span className="text-sm">+{dialCode}</span>
          </SelectTrigger>

          <SelectContent>
            {countries.map((item) => (
              <SelectItem key={item.code} value={item.code}>
                <div className="flex items-center gap-2">
                  <span>+{item.code}</span>
                  <span className="text-neutral-400 text-xs">
                    {item.country}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Divider */}
        <span
          className={cn(
            "mx-2 text-neutral-300 dark:text-neutral-600 select-none",
            dividerClassName
          )}
        >
          |
        </span>

        {/* Phone Input */}
        <input
          {...register(name)} 
          id={name}
          type="tel"
          inputMode="numeric"
          placeholder="5X XXX XXXX"
          className={cn(
            "flex-1 min-w-0 bg-transparent outline-none text-sm",
            "placeholder:text-muted-foreground",
            "relative z-10",
            inputClassName
          )}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 mt-1">
          {typeof error === "string" ? error : error?.message}
        </p>
      )}
    </div>
  );
}