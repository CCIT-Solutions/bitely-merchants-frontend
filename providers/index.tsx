"use client";
import { ReactNode } from "react";
import LocaleProvider from "./LocaleProvider";
import QueryProvider from "./QueryProvider";
import { ThemeProvider } from "next-themes";

function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <LocaleProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LocaleProvider>
    </QueryProvider>
  );
}
export default Providers;
