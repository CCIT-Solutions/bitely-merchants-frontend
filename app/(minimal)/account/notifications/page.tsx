import { Metadata } from "next";
import dynamic from "next/dynamic";
const MyPlan = dynamic(() => import("@/modules/settings/MyMeals"));

export const metadata: Metadata = {
  title: "Bitely My Plan",
};

function page() {
  return <MyPlan />;
}
export default page;
