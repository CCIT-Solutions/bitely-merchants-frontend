import { Metadata } from "next";
import dynamic from "next/dynamic";
const Fevorite = dynamic(() => import("@/modules/settings/Fevorite"));

export const metadata: Metadata = {
  title: "Bitely - My Favorites",
};

function page() {
  return <Fevorite />;
}
export default page;
