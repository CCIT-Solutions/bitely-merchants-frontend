import Image from "next/image";
import { motion } from "framer-motion";

const partners = [
  { src: "/media/images/partners/stripe.png", alt: "Stripe" },
  { src: "/media/images/partners/clickup.png", alt: "ClickUp" },
  { src: "/media/images/partners/hyper-best.png", alt: "Hyper Best" },
  { src: "/media/images/partners/twilio.png", alt: "Twilio" },
  { src: "/media/images/partners/power.png", alt: "Power Module" },
];

function Partners() {

  return (
    <div className="flex flex-wrap items-center justify-center md:justify-between gap-12 sm:gap-20 lg:gap-16">
      {partners.map((partner, index) => (
        <motion.div
          key={index}
          className="relative flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 1, 0.1] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: index * 0.6,
            ease: "easeInOut",
          }}
        >
          <Image
            src={partner.src}
            alt={partner.alt}
            width={100}
            height={40}
            className="h-auto w-full object-contain max-w-36"
            priority={index < 2}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default Partners;
