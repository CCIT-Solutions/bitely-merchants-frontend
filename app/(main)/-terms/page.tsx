import { Metadata } from "next";
import dynamic from "next/dynamic";
const Terms = dynamic(() => import("@/modules/terms"));

export const metadata: Metadata = {
  title: "Bitely - Terms & Conditions",
};

function page() {
  return <Terms />;
}
export default page;
