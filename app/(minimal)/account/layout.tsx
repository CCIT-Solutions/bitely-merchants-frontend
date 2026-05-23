import AccountLayout from "@/layout/AccountLayout";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return <AccountLayout>{children}</AccountLayout>;
}
