import dynamic from "next/dynamic";
import { memo, ReactNode } from "react";

const Header = dynamic(() => import("@/layout/Header"), { ssr: true });
const Footer = dynamic(() => import("@/layout/Footer"), { ssr: true });

function SessionLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="relative">
      <Header className="static" />
      {children}
      <Footer minimal={true} />
    </main>
  );
}

export default memo(SessionLayout);
