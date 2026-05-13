import { Metadata } from "next";
import dynamic from "next/dynamic";
const MyProfile = dynamic(() => import("@/modules/account/MyProfile"));

export const metadata: Metadata = {
  title: "Bitely - My Profile",
};

function page() {
  return <MyProfile />;
}
export default page;
