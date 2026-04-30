import { toast } from "sonner";
import { ApiResponse } from "@/types/apiResponse";
import { cn } from "./utils";
import { X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface NotifyOptions {
  type?: ToastType;
  message?: string;
  duration?: number;
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
  closeButton?: boolean;
}

export function notify(
  resOrMessage: ApiResponse | string,
  options?: NotifyOptions
) {
  const type = options?.type ?? "success";
  const position = options?.position ?? "top-center";
  const duration = options?.duration ?? 4000;

  const message: string | undefined =
    typeof resOrMessage === "string" ? resOrMessage : resOrMessage?.message;

  if (!message) return;

  const typeStyles: Record<ToastType, string> = {
    success: " !border-green-600/30 !text-green-400",
    error: " !border-red-600/30 !text-red-400",
    warning: " !border-yellow-600/30 !text-yellow-400",
    info: " !border-blue-600/30 !text-blue-400",
  };

  const toastOptions = {
    position,
    duration,
    className: cn(
      "!rounded-xl !border bg-background/70!  !backdrop-blur-[3px] !shadow-lg",
      "!flex items-center justify-between gap-3",
      typeStyles[type]
    ),

   cancel: {
  label: (
    <X
      className={cn(
        "h-4 w-4 cursor-pointer opacity-70 hover:opacity-100 transition text-current !bg-transparent",
        typeStyles[type]
      )}
    />
  ),
  onClick: () => toast.dismiss(),
},
  };

  switch (type) {
    case "info":
      return toast.info(message, toastOptions);
    case "error":
      return toast.error(message, toastOptions);
    case "warning":
      return toast.warning(message, toastOptions);
    case "success":
    default:
      return toast.success(message, toastOptions);
  }
}
