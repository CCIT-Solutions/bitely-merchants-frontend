import { Metadata } from "next";
import dynamic from "next/dynamic";
const MyInfo = dynamic(() => import("@/modules/settings/MyInfo"));

export const metadata: Metadata = {
  title: "Bitely - My Info",
};

function page() {
  return <MyInfo />;
}
export default page;
