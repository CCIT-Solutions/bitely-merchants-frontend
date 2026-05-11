import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import React, { ReactElement } from "react";
import { Trans } from "react-i18next";

function Heading({
  title,
  components,
  className
}: {
  title: string;
  components?: Record<string, ReactElement>;
  className? : string
}) {
  const {isRTL} = useLang()
  return (
    <h1 className={cn("mb-4 text-4xl sm:text-7xl  leading-[1.1] tracking-tight text-center", isRTL ? "font-bold" : "font-extrabold", className)}>
      <Trans i18nKey={title} components={{ custom: <span className="text-primary" /> }} />
    </h1>
  );
}

export default Heading;
