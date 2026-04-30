"use client"
import dynamic from "next/dynamic";
const Home = dynamic(() => import("@/modules/home"));

function page() {
  return <Home />;
}
export default page;