import { Button } from "@/components/ui/button";
import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<typeof Button>;

export function PrimaryButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className={`flex-1 cursor-pointer ${props.className ?? ""}`}
    />
  );
}
