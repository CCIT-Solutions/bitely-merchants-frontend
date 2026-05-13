import { Metadata } from "next";
import dynamic from "next/dynamic";
const MyOrders = dynamic(() => import("@/modules/account/MyOrders"));

export const metadata: Metadata = {
  title: "Bitely My Orders",
};

function page() {
  return <MyOrders />;
}
export default page;
