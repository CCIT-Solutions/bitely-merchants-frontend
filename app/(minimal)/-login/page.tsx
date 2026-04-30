import AuthLayout from "@/layout/AuthLayout";
import { Metadata } from "next";
import dynamic from "next/dynamic";
const Login = dynamic(() => import("@/modules/auth/LoginForm"));

export const metadata: Metadata = {
  title: "Bitely -  Login",
};

function page() {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
}
export default page;
