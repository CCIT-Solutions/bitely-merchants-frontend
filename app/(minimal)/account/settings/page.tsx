import { Metadata } from "next";
import dynamic from "next/dynamic";
const Settings = dynamic(() => import("@/modules/account/Settings"));

export const metadata: Metadata = {
  title: "Bitely -  Settings",
};

function page() {
  return <Settings />;
}
export default page;
