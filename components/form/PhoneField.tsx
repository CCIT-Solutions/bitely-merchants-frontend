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
}: PhoneFieldProps<TFormValues>) {
  const [dialCode, setDialCode] = useState("966");

  return (
    <div className="space-y-1 relative">
      <Label htmlFor={name} className="font-medium mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-muted-foreground z-10">
            {icon}
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-2 border focus-within:border-primary focus-within:ring-primary/0 focus-within:ring-[3px] rounded-full overflow-hidden transition file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 bg-transparent text-base shadow-xs  outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm  focus-visible:border-primary focus-visible:ring-primary/0 focus-visible:ring-[3px] py-6 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            icon ? "ps-10 pe-6" : "ps-2 pe-2",
            className
          )}
          aria-invalid={!!error}
        >
          {/* Country Code Select */}
          <Select value={dialCode} onValueChange={setDialCode}>
            <SelectTrigger className="w-20 h-7 border-0 shadow-none focus:ring-0 focus:outline-none p-0 justify-center focus-visible:border-transparent focus-visible:ring-transparent">
              <span className="text-sm">+{dialCode}</span>
            </SelectTrigger>

            <SelectContent>
              {countries.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  <div className="flex items-center gap-2">
                    <span>+{item.code}</span>
                    <span className="text-neutral-400">{item.country}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Divider */}
          <span className= {cn("text-neutral-200 dark:text-neutral-600", dividerClassName)}>|</span>

          {/* Phone Input */}
          <input
            {...register(name, { valueAsNumber: true })}
            id={name}
            placeholder="5X XXX XXXX"
            maxLength={13}
            className={cn(
              "flex-1 bg-transparent outline-none text-sm h-full [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white]",
              inputClassName
            )}
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {typeof error === "string" ? error : error?.message}
        </p>
      )}
    </div>
  );
}