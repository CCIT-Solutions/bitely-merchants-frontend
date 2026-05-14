import { Metadata } from "next";
import dynamic from "next/dynamic";
const Confirm = dynamic(() => import("@/modules/confirm"));

export const metadata: Metadata = {
  title: "Bitely -  Payment Confirm",
};

function page() {
  return <Confirm />;
}
export default page;
