import AuthLayout from "@/layout/AuthLayout";
import { Metadata } from "next";
import dynamic from "next/dynamic";
const Register = dynamic(() => import("@/modules/auth/RegisterForm"));

export const metadata: Metadata = {
  title: "Bitely - Register",
};

function page() {
  return (
    <AuthLayout>
      <Register />
    </AuthLayout>
  );
}
export default page;
