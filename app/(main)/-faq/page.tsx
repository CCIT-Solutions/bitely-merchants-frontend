import { Metadata } from "next";
import dynamic from "next/dynamic";
const Faq = dynamic(() => import("@/modules/faq"));

export const metadata: Metadata = {
  title: "Bitely -  FAQ",
};

function page() {
  return <Faq />;
}
export default page;
