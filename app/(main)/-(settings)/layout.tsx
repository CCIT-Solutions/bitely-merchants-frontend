import SettingsLayout from "@/layout/SettingsLayout";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return <SettingsLayout>{children}</SettingsLayout>;
}
