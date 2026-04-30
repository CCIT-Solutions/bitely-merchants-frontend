"use client";
import Logo from "@/components/shared/Logo";
import { Metadata } from "next";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Something Wrong!",
};

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full h-svh flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-3">
        <Logo />
        <div className="flex flex-col gap-1 items-center justify-center rounded-2xl z-10 p-4 text-center">
          <p className="text-xl font-bold">Something went wrong!</p>
          <span className="text-sm text-foreground/80">{error.message}</span>
        </div>
      </div>
    </div>
  );
}
