import { Metadata } from "next";
import dynamic from "next/dynamic";
const Success = dynamic(() => import("@/modules/thanks/Success"));

export const metadata: Metadata = {
  title: "Bitely -  Success",
};

function page() {
  return <Success />;
}
export default page;
