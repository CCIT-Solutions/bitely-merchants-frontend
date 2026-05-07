import dynamic from "next/dynamic";

const Hero = dynamic(() => import("@/components/home/hero"));
const Menu = dynamic(() => import("@/components/home/Menu"));
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"));
const Pricing = dynamic(() => import("@/components/home/Plans"));
const FAQ = dynamic(() => import("@/components/home/FAQ"));
const CTA = dynamic(() => import("@/components/home/CTA"));

// const Brands = dynamic(() => import("@/components/home/Brands"));
// const Community = dynamic(() => import("@/components/home/Community"));
// const FindYourPLan = dynamic(() => import("@/components/home/FindYourPLan"));
// const Testimonial = dynamic(() => import("@/components/home/Testimonial"));


function Home() {
  return (
    <div
      className="min-h-screen "
    >
      <Hero /> 
      <Menu/>
      <HowItWorks />
     
      {/* <Testimonial /> */}
      {/* <FindYourPLan />  */}
      <Pricing/>
      <FAQ />
      {/* <Community /> */}
       <CTA />
    </div>
  );
}

export default Home;
