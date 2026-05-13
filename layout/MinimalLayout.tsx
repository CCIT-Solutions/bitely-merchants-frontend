import dynamic from "next/dynamic";
import { memo, ReactNode } from "react";

const Header = dynamic(() => import("@/layout/Header"), { ssr: true });
const Footer = dynamic(() => import("@/layout/Footer"), { ssr: true });

function MinimalLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <Header />
      {children}
      <Footer minimal />
    </main>
  );
}

export default memo(MinimalLayout);
