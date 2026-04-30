import dynamic from "next/dynamic";
const MainLayout = dynamic(() => import("@/layout/MainLayout"));

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout minimal={true}>{children}</MainLayout>;
}
