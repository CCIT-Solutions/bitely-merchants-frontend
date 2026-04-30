export const heroSlides = [
  {
    id: 1,
    image: "/media/images/hero/hero-1.jpg",
    title: {
      en: "For Whole Family",
      ar: "لكل أفراد العائلة",
    },
  },
  {
    id: 2,
    image: "/media/images/hero/hero-2.jpg",
    title: {
      en: "To Fuel Your Fitness",
      ar: "تدعم نشاطك الرياضي",
    },
  },
  {
    id: 3,
    image: "/media/images/hero/hero-3.jpg",
    title: {
      en: "For Busy Days",
      ar: "تناسب وقت انشغالك",
    },
  },
];

export const heroSlidesImages = heroSlides.map((slide) => ({
  image: slide.image,
  alt: slide.title.en,
}));
