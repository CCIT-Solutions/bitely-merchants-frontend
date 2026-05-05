import { Metadata } from "next";
import dynamic from "next/dynamic";
const ForgetPassword = dynamic(
  () => import("@/modules/auth/ForgetPasswordForm"),
);

export const metadata: Metadata = {
  title: "Bitely -  Forget Password",
};

function page() {
  return <ForgetPassword />;
}
export default page;
