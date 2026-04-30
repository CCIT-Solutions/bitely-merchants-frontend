import type { FC } from "react";
import { formatCurrency } from "@/lib/formatCurrency"; 
import Image from "next/image";
import { cn } from "@/lib/utils";

const CurrencyDisplay: FC<{ amount: number | string; size?: "sm" | "md"; className?: string; invertIcon?: boolean }> = ({
  amount,
  size = "sm",
  className, invertIcon
}) => {
  const textSize = size === "md" ? "text-sm" : "text-xs"; 
  
  return (
    <span className={cn(`font-medium ${textSize} inline-flex items-center gap-1`, className)}>
      {formatCurrency(Number(amount))}
      <Image
        src="/media/images/SR.svg"
        alt="SAR"
        width={12}
        height={12}
        loading="lazy"
        className={cn("inline-block", invertIcon && "invert-100")}
      />
    </span>
  );
};

export default CurrencyDisplay;
