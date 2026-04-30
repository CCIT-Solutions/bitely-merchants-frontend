"use client";

import * as React from "react";
import {
  useFormContext,
  Controller,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CustomFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: React.ReactNode;
  children: (
    field: ControllerRenderProps<T, Path<T>>
  ) => React.ReactElement<unknown>;
  required?: boolean;
  icon?: React.ReactNode;
}

export function CustomField<T extends FieldValues>({
  name,
  label,
  children,
  required,
  icon,
}: CustomFieldProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1 relative">
      <Label htmlFor={name} className=" font-medium mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const child = children(field);

          if (!React.isValidElement(child)) return child;

          const clonedChild = React.cloneElement(
            child as React.ReactElement<{ className?: string }>,
            {
              className: cn(
                " border focus-visible:border-primary focus-visible:ring-primary/0 focus-visible:ring-[3px] py-6 rounded-full",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ps-6",
                icon && "ps-10",
                (child as React.ReactElement<{ className?: string }>).props
                  .className
              ),
            }
          );

          return (
            <div className="relative">
              {icon && (
                <div className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-muted-foreground">
                  {icon}
                </div>
              )}
              {clonedChild}
            </div>
          );
        }}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
