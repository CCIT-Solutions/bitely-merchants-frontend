import { Metadata } from "next";
import dynamic from "next/dynamic";
const MyProgress = dynamic(() => import("@/modules/account/MyProgress"));

export const metadata: Metadata = {
  title: "Bitely -  My Progress",
};

function page() {
  return <MyProgress />;
}
export default page;
