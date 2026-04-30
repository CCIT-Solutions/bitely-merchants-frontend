
import dynamic from "next/dynamic";
const MainLayout = dynamic(
  () => import("@/layout/MainLayout")
);

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return <MainLayout>{children}</MainLayout>;
}
