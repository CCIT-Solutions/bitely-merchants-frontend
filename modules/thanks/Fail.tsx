"use client";

import Image from "next/image";
import Container from "@/components/shared/Container";
import Animate from "@/components/animation/Animate";
import { fade } from "@/lib/animation";
import { useLang } from "@/hooks/useLang";
import { useSearchParams, useRouter } from "next/navigation";
import DecorativeParticles from "@/components/animation/DecorativeParticles";

export default function FailPage() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get failure message from URL or fallback to default translation
  const failedMessage = searchParams.get("message") || t("fail.description");

  const handleRetry = () => {
    // router.reload(); // Reload page to retry
  };

  return (
    <Animate variants={fade} className="min-h-[750px] py-8 w-full h-full flex justify-center items-center">
      <Container>
        {/* Fail Icon and Title */}
        <Animate
          variants={fade}
          viewOnce
          className="flex flex-col items-center relative"
        >
          {/* Decorative dots */}
         <DecorativeParticles className="w-full h-full inset-0 lg:start-0"/>
          <div className="w-[210px] h-[140px] rounded-full flex items-center justify-center mb-6 relative">
            <Image
              src="/media/icons/fail-card.png"
              alt={t("fail.title")}
              fill
              sizes="298px"
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-red-600">
            {t("fail.title")}
          </h1>
          <p className="text-neutral-400 mt-4 text-center max-w-sm">
            {failedMessage}
          </p>
          {/* Retry Button */}
          <button
            onClick={handleRetry}
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all transform hover:scale-105 active:scale-9 cursor-pointer"
          >
            {t("fail.button")}
          </button>
        </Animate>
      </Container>
    </Animate>
  );
}
