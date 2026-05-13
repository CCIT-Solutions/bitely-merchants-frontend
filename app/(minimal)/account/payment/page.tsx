import { Metadata } from "next";
import dynamic from "next/dynamic";
const Payment = dynamic(() => import("@/modules/settings/Payment"));

export const metadata: Metadata = {
  title: "Bitely - Payment",
};

function page() {
  return <Payment />;
}
export default page;
