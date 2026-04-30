import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string, showYear = false) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(showYear ? { year: "numeric" } : {}),
  });
};

export const formatTime = (timeString: string, lang: string) => {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString(lang === "ar" ? "ar-SA" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const convertToEnglishNumbers = (value: string) => {
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  return value.replace(/[٠-٩]/g, (d) => arabic.indexOf(d).toString());
};
