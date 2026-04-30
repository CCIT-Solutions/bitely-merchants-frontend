import { Metadata } from "next";
import dynamic from "next/dynamic";
const Fail = dynamic(() => import("@/modules/thanks/Fail"));

export const metadata: Metadata = {
  title: "Bitely -  Fail",
};

function page() {
  return <Fail />;
}
export default page;
