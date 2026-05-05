import { Metadata } from "next";
import dynamic from "next/dynamic";
const ResetPassword = dynamic(() => import("@/modules/auth/ResetPasswordForm"));

export const metadata: Metadata = {
  title: "Bitely -  Reset Password",
};

function page() {
  return <ResetPassword />;
}
export default page;
