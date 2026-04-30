import Logo from "@/components/shared/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 Page",
};

export default function NotFound() {
  return (
    <div className="w-full h-[100svh] flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-3">
        <Logo />
        <div className="flex flex-col gap-1 items-center justify-center rounded-2xl z-10 p-4 text-center">
          <p className="text-xl font-bold">Not Found!</p>
          <span className="text-sm text-neutral-600">That page doesn&apos;t exist!</span>
        </div>
      </div>
    </div>
  );
}
