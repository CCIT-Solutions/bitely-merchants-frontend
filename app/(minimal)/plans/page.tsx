import { Metadata } from "next";
import dynamic from "next/dynamic";
const Plan = dynamic(() => import("@/modules/plans"));

export const metadata: Metadata = {
  title: "Bitely - Plans",
};

function page() {
  return <Plan />;
}
export default page;
