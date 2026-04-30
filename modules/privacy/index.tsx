"use client";
import React from "react";
import Container from "@/components/shared/Container";
import PrivacyPolicyAr from "./PrivacyPolicyAr";
import PrivacyPolicyEn from "./PrivacyPolicyEn";
import { useLang } from "@/hooks/useLang";

function PrivacyPolicy() {
  const { isRTL } = useLang();

  return (
    <Container className="pb-10 px-5 pt-32 max-w-[1000px] min-h-[100shv]">
      <div className="rounded-lg p-4 sm:p-8">
        {isRTL ? <PrivacyPolicyAr /> : <PrivacyPolicyEn />}
      </div>
    </Container>
  );
}

export default PrivacyPolicy;
