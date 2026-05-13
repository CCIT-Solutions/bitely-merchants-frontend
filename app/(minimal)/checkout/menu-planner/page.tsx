import { Metadata } from "next";
import dynamic from "next/dynamic";
const Menu = dynamic(() => import("@/modules/settings/MyMeals"));

export const metadata: Metadata = {
  title: "Bitely - Menu",
};

function page() {
  return <Menu />;
}
export default page;
