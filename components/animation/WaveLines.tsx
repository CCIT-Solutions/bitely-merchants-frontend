import { cn } from "@/lib/utils";
import { memo, useEffect, useState } from "react";

const generateWavePath = (
  index: number,
  phase: number,
  width = 1200,
  height = 200,
) => {
  const points = 120;

  let path = `M 0 ${height / 2}`;

  for (let i = 0; i <= points; i++) {
    const x = (i / points) * width;

    // 🧠 Combine multiple waves (this breaks repetition)
    const y =
      height / 2 +
      Math.sin(x * 0.01 + phase + index * 0.4) * (20 + index * 3) + // main wave
      Math.sin(x * 0.02 + phase * 0.7) * 10 + // secondary
      Math.cos(x * 0.015 - phase * 0.5) * 8; // distortion

    path += ` L ${x} ${y}`;
  }

  return path;
};

const WaveLines = ({
  className,
  svgClassName,
}: {
  className?: string;
  svgClassName?: string;
}) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let frame: number;

    const animate = () => {
      setPhase((prev) => prev + 0.02);
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const lines = Array.from({ length: 4 });

  return (
    <div className={cn("absolute inset-0 -z-10", className)}>
      <svg
        viewBox="0 0 1000 200"
        className={svgClassName}
        preserveAspectRatio="none"
      >
        {lines.map((_, i) => (
          <path
            key={i}
            d={generateWavePath(i, phase)}
            stroke="#6ef843"
            strokeWidth={0.5}
            fill="none"
            opacity={0.5 + i * 0.03}
          />
        ))}
      </svg>
    </div>
  );
};

export default memo(WaveLines);
