import { Variants } from "framer-motion";

export type AnimateOptions = {
  type?:
    | "fade"
    | "fadeScale"
    | "slideTop"
    | "slideDown"
    | "fadeSlideUp"
    | "fadeSlideDown"
    | "bounce"
    | "fillHorizontal"
    | "horizontalSlideExit"
    | "fillVerticalFade"
    |"slideUp"
    | "fillVertical";
  delay?: number;
  duration?: number;
  scaleFrom?: number;
  scaleTo?: number;
  opacityFrom?: number;
  opacityTo?: number;
  yFrom?: number | string;
  yTo?: number | string | number[];
  xFrom?: number | string;
  xTo?: number | string;
  repeat?: number;
  repeatType?: "loop" | "reverse" | "mirror";
  ease?:
    | "linear"
    | "easeIn"
    | "easeOut"
    | "easeInOut"
    | "circIn"
    | "circOut"
    | "circInOut"
    | "backIn"
    | "backOut"
    | "backInOut"
    | "anticipate";
  useVariantsOnly?: boolean; // 👈 NEW FLAG
};

export function animate({
  type = "fade",
  delay = 0,
  duration = 0.3,
  scaleFrom = 0.8,
  scaleTo = 1,
  opacityFrom = 0,
  opacityTo = 1,
  yFrom = 20,
  yTo = 0,
  xFrom = 0,
  xTo = "100%",
  repeat = 0,
  repeatType = "reverse",
  ease = "easeInOut",
  useVariantsOnly = false,
}: AnimateOptions): Variants {
  const transition = {
    duration,
    delay,
    repeat,
    repeatType,
    ease,
  };

  const addTransition = <T extends object>(visible: T) =>
    useVariantsOnly ? visible : { ...visible, transition };

  switch (type) {
    case "fade":
      return {
        hidden: { opacity: opacityFrom },
        visible: addTransition({ opacity: opacityTo }),
      };

    case "fadeScale":
      return {
        hidden: { opacity: opacityFrom, scale: scaleFrom },
        visible: addTransition({ opacity: opacityTo, scale: scaleTo }),
      };

    case "slideTop":
      return {
        hidden: { y: yFrom },
        visible: addTransition({ y: yTo }),
      };

    case "slideDown":
      return {
        hidden: { y: -Number(yFrom) },
        visible: addTransition({ y: yTo }),
      };

    case "fadeSlideUp":
      return {
        hidden: { opacity: opacityFrom, y: Number(yFrom) },
        visible: addTransition({ opacity: opacityTo, y: yTo }),
      };

      case "slideUp":
      return {
        hidden: { y: Number(yFrom) },
        visible: addTransition({ y: yTo }),
      };

    case "fadeSlideDown":
      return {
        hidden: { opacity: opacityFrom, y: -Number(yFrom) },
        visible: addTransition({ opacity: opacityTo, y: yTo }),
      };

    case "bounce":
      return {
        hidden: { y: yFrom },
        visible: useVariantsOnly
          ? { y: yTo }
          : {
              y: yTo,
              transition: {
                ...transition,
                repeatType: "mirror",
                repeat: repeat || 1,
              },
            },
      };

    case "fillHorizontal":
      return {
        hidden: { width: xFrom },
        visible: addTransition({ width: xTo }),
      };

    case "fillVertical":
      return {
        hidden: { scaleY: yFrom, opacity: 0 },
        visible: addTransition({ scaleY: yTo, opacity: 1 }),
      };

    case "fillVerticalFade":
      return {
        hidden: { height: yFrom, opacity: opacityFrom },
        visible: addTransition({ height: yTo, opacity: opacityTo }),
      };

    case "horizontalSlideExit":
      return {
        hidden: { opacity: opacityFrom, x: xTo },
        visible: useVariantsOnly
          ? { opacity: opacityTo, x: xTo }
          : {
              opacity: opacityTo,
              x: xTo,
              transition: { ...transition, ease: [0.4, 0, 0.2, 1] },
            },
        exit: { opacity: opacityFrom, x: xTo },
      };

    default:
      return {
        hidden: { opacity: opacityFrom },
        visible: addTransition({ opacity: opacityTo }),
      };
  }
}
