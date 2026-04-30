"use client";
import React from "react";
import Container from "@/components/shared/Container";
import TermsAndConditionsAr from "./TermsAndConditionsAr";
import TermsAndConditionsEn from "./TermsAndConditionsEn";
import { useLang } from "@/hooks/useLang";


function TermsAndConditions() {
  const { isRTL } = useLang();

  return (
    <Container className="pb-10 px-5 pt-32 max-w-[1000px] min-h-[100shv]">
      <div className="rounded-lg p-4 sm:p-8">
        {isRTL ? <TermsAndConditionsAr /> : <TermsAndConditionsEn />}
    </div>
     
    </Container>
  );
}

export default TermsAndConditions;
