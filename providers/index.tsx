"use client";
import { ReactNode } from "react";
import LocaleProvider from "./LocaleProvider";
import QueryProvider from "./QueryProvider";

function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
        <LocaleProvider>{children}</LocaleProvider>
    </QueryProvider>
  );
}
export default Providers;
