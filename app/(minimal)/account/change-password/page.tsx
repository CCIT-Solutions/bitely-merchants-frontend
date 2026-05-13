import { Metadata } from "next";
import dynamic from "next/dynamic";
const ChangePassword = dynamic(
  () => import("@/modules/settings/ChangePassword"),
);

export const metadata: Metadata = {
  title: "Bitely - Change Password",
};

function page() {
  return <ChangePassword />;
}
export default page;
