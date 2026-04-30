import { animate } from "@/lib/animation/animate";

const duration = 0.1;
const delay = 0.1;

// Fade
export const fade = animate({ type: "fade" });
export const fadeD1 = animate({ type: "fade", delay });
export const fadeD2 = animate({ type: "fade", delay: delay + 2 * 0.1 });
export const fadeD3 = animate({ type: "fade", delay: delay + 3 * 0.1 });
export const fadeD4 = animate({ type: "fade", delay: delay + 4 * 0.1 });
export const fadeD5 = animate({ type: "fade", delay: delay + 5 * 0.1 });

export const fadeD1NoTransition = animate({
  type: "fade",
  yTo: -5,
  yFrom: 0,
  useVariantsOnly: true,
});

export const fadeDu1 = animate({
  type: "fade",
  duration: duration + 1 * duration,
});
export const fadeDu2 = animate({
  type: "fade",
  duration: duration + 2 * duration,
});
export const fadeDu3 = animate({
  type: "fade",
  duration: duration + 3 * duration,
});
export const fadeDu4 = animate({
  type: "fade",
  duration: duration + 4 * duration,
});
export const fadeDu5 = animate({
  type: "fade",
  duration: duration + 5 * duration,
});

export const fadeDu1D1 = animate({
  type: "fade",
  delay,
  duration: duration + 1 * duration,
});
export const fadeDu1D2 = animate({
  type: "fade",
  delay,
  duration: duration + 2 * duration,
});
export const fadeDu1D3 = animate({
  type: "fade",
  delay,
  duration: duration + 3 * duration,
});
export const fadeDu3D3 = animate({
  type: "fade",
  delay: delay + 3 * delay,
  duration: duration + 3 * duration,
});

// Fade Scale
export const fadeScale = animate({ type: "fadeScale" });
export const fadeScaleD1 = animate({
  type: "fadeScale",
  delay: delay + 1 * 0.1,
});
export const fadeScaleD2 = animate({
  type: "fadeScale",
  delay: delay + 2 * 0.1,
});
export const fadeScaleD3 = animate({
  type: "fadeScale",
  delay: delay + 3 * 0.1,
});
export const fadeScaleD4 = animate({
  type: "fadeScale",
  delay: delay + 4 * 0.1,
});
export const fadeScaleD5 = animate({
  type: "fadeScale",
  delay: delay + 5 * 0.1,
});

// Fade Slide
export const fadeSlideDown = animate({ type: "fadeSlideDown"});
export const fadeSlideDown1 = animate({ type: "fadeSlideDown", delay: .4});
export const fadeSlideDown2 = animate({ type: "fadeSlideDown", delay: .5});
export const fadeSlideDown3 = animate({ type: "fadeSlideDown", delay: .6});

export const fadeSlideUp = animate({ type: "fadeSlideUp" });
export const fadeSlideUp1 = animate({type:"fadeSlideUp" , duration: 1})
export const fadeSlideUp2 = animate({type:"fadeSlideUp" , duration: 1.2})


export const slideUp = animate({ type: "slideUp", yFrom: 150, duration: .2 });
export const slideUpD1 = animate({ type: "slideUp", yFrom: 300, duration: .4, delay: .1 });
export const slideUpD2 = animate({ type: "slideUp", yFrom: 200, duration: .4, delay: .2 });

export const fadeSlideUpNoTransition = animate({
  type: "fadeSlideUp",
  yTo: -5,
  yFrom: 0,
  useVariantsOnly: true,
});

// Infinite Vertical
export const infiniteVertical1 = animate({
  type: "slideTop",
  duration: 8,
  repeat: Infinity,
  repeatType: "reverse",
  yTo: "-77%",
  yFrom: "0%",
});
export const infiniteVertical2 = animate({
  type: "slideTop",
  duration: 8,
  repeat: Infinity,
  repeatType: "reverse",
  yTo: "-59%",
  yFrom: "0%",
});

// Fill
export const fillVerticalFade = animate({
  type: "fillVerticalFade",
  duration: 2.5,
  yFrom: 0,
  yTo: "100%",
});

// Hero Slider
export const heroSliderText = {
  hidden: { opacity: 0, x: 200 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 200 },
};
