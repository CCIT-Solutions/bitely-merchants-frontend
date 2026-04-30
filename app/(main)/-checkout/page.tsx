import { Metadata } from "next";
import dynamic from "next/dynamic";
const Checkout = dynamic(() => import("@/modules/checkout"));

export const metadata: Metadata = {
  title: "Bitely -  Checkout",
};

function page() {
  return <Checkout />;
}
export default page;
