import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import React, { ReactElement } from "react";
import { Trans } from "react-i18next";

function Heading({
  i18nKey,
  components,
  className
}: {
  i18nKey: string;
  components?: Record<string, ReactElement>;
  className? : string
}) {
  const {isRTL} = useLang()
  return (
    <h1 className={cn("mb-4 text-4xl sm:text-7xl  leading-[1.1] tracking-tight text-center", className, isRTL ? "font-bold" : "font-extrabold")}>
      <Trans i18nKey={i18nKey} components={components} />
    </h1>
  );
}

export default Heading;
