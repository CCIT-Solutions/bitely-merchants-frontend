import { Metadata } from "next";
import dynamic from "next/dynamic";
const Contact = dynamic(() => import("@/modules/contact"));

export const metadata: Metadata = {
  title: "Bitely - Contact Us",
};

function page() {
  return <Contact />;
}
export default page;
