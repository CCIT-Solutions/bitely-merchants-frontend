"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Shape {
  id: number;
  type: "circle" | "semicircle" | "rounded-rect" | "custom-rounded-rect";
  size: { width: number; height: number };
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  rotation?: number;
  roundedCorners?: {
    topLeft: boolean;
    topRight: boolean;
    bottomLeft: boolean;
    bottomRight: boolean;
  };
}

const getRandomGradient = () => {
  const angle = Math.floor(Math.random() * 360);
  const opacity = Math.floor(Math.random() * 50 + 40);
  const opacityHex = opacity.toString(16).padStart(2, '0');
  const color1 = `#2e1f52${opacityHex}`;
  const color2 = `#322847${opacityHex}`;
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
};

const circleDiameter = 175;

const initialShapes: Omit<Shape, "vx" | "vy">[] = [
  {
    id: 1,
    type: "circle",
    size: { width: circleDiameter, height: circleDiameter },
    color: getRandomGradient(),
    x: circleDiameter,
    y: 0,
    mass: circleDiameter,
  },
  {
    id: 2,
    type: "rounded-rect",
    size: { width: 2 * circleDiameter, height: circleDiameter },
    color: getRandomGradient(),
    x: 0,
    y: circleDiameter,
    rotation: 0,
    mass: 2 * circleDiameter,
  },
  {
    id: 3,
    type: "circle",
    size: { width: circleDiameter, height: circleDiameter },
    color: getRandomGradient(),
    x: 450,
    y: circleDiameter,
    mass: circleDiameter,
  },
  {
    id: 4,
    type: "custom-rounded-rect",
    size: { width: circleDiameter, height: circleDiameter },
    color: getRandomGradient(),
    x: 0,
    y: 0,
    mass: circleDiameter,
    roundedCorners: {
      topLeft: true,
      topRight: false,
      bottomLeft: true,
      bottomRight: false,
    },
  },
//   {
//     id: 5,
//     type: "custom-rounded-rect",
//     size: { width: circleDiameter, height: circleDiameter },
//     color: getRandomGradient(),
//     x: 0,
//     y: 3 * circleDiameter,
//     mass: circleDiameter,
//     roundedCorners: {
//       topLeft: false,
//       topRight: false,
//       bottomLeft: true,
//       bottomRight: true,
//     },
//   },
  {
    id: 6,
    type: "custom-rounded-rect",
    size: { width: circleDiameter, height: 2 * circleDiameter },
    color: getRandomGradient(),
    x: circleDiameter,
    y: 2 * circleDiameter,
    mass: circleDiameter,
    roundedCorners: {
      topLeft: false,
      topRight: false,
      bottomLeft: true,
      bottomRight: true,
    },
  },
  {
    id: 7,
    type: "custom-rounded-rect",
    size: { width: circleDiameter, height: circleDiameter },
    color: getRandomGradient(),
    x: 2 * circleDiameter,
    y: 3 * circleDiameter,
    mass: circleDiameter,
    roundedCorners: {
      topLeft: false,
      topRight: false,
      bottomLeft: true,
      bottomRight: true,
    },
  },
//   {
//     id: 8,
//     type: "custom-rounded-rect",
//     size: { width: circleDiameter, height: circleDiameter },
//     color: getRandomGradient(),
//     x: 0,
//     y: 4 * circleDiameter,
//     mass: circleDiameter,
//     roundedCorners: {
//       topLeft: true,
//       topRight: true,
//       bottomLeft: true,
//       bottomRight: true,
//     },
//   },
  // {
  //   id: 9,
  //   type: "custom-rounded-rect",
  //   size: { width: 2 * circleDiameter, height: circleDiameter },
  //   color: getRandomGradient(),
  //   x: circleDiameter,
  //   y: 4 * circleDiameter,
  //   mass: circleDiameter,
  //   roundedCorners: {
  //     topLeft: true,
  //     topRight: false,
  //     bottomLeft: true,
  //     bottomRight: false,
  //   },
  // },
  // {
  //   id: 10,
  //   type: "custom-rounded-rect",
  //   size: { width: circleDiameter, height: circleDiameter },
  //   color: getRandomGradient(),
  //   x: 3 * circleDiameter,
  //   y: 4 * circleDiameter,
  //   mass: circleDiameter,
  //   roundedCorners: {
  //     topLeft: true,
  //     topRight: true,
  //     bottomLeft: true,
  //     bottomRight: true,
  //   },
  // },
  // {
  //   id: 11,
  //   type: "custom-rounded-rect",
  //   size: { width: 2 * circleDiameter, height: circleDiameter },
  //   color: getRandomGradient(),
  //   x: 3 * circleDiameter,
  //   y: 3 * circleDiameter,
  //   mass: circleDiameter,
  //   roundedCorners: {
  //     topLeft: false,
  //     topRight: true,
  //     bottomLeft: false,
  //     bottomRight: true,
  //   },
  // },
  {
    id: 12,
    type: "custom-rounded-rect",
    size: { width: circleDiameter, height: 2 * circleDiameter },
    color: getRandomGradient(),
    x: 4 * circleDiameter,
    y: 1 * circleDiameter,
    mass: circleDiameter,
    roundedCorners: {
      topLeft: false,
      topRight: true,
      bottomLeft: true,
      bottomRight: true,
    },
  },
  // {
  //   id: 13,
  //   type: "custom-rounded-rect",
  //   size: { width: 2 * circleDiameter, height: circleDiameter },
  //   color: getRandomGradient(),
  //   x: 4 * circleDiameter,
  //   y: 0,
  //   mass: circleDiameter,
  //   roundedCorners: {
  //     topLeft: true,
  //     topRight: true,
  //     bottomLeft: true,
  //     bottomRight: false,
  //   },
  // },
  {
    id: 18,
    type: "circle",
    size: { width: 12, height: 12 },
    color: "#00D1FF",
    x: 100,
    y: 120,
    mass: 12,
  },
  {
    id: 19,
    type: "circle",
    size: { width: 10, height: 10 },
    color: "#10B981",
    x: 290,
    y: 110,
    mass: 10,
  },
  {
    id: 20,
    type: "circle",
    size: { width: 14, height: 14 },
    color: "#FBBF24",
    x: 530,
    y: 250,
    mass: 14,
  },
  {
    id: 21,
    type: "circle",
    size: { width: 11, height: 11 },
    color: "#F472B6",
    x: 450,
    y: 380,
    mass: 11,
  },
  {
    id: 22,
    type: "circle",
    size: { width: 13, height: 13 },
    color: "#8B5CF6",
    x: 95,
    y: 315,
    mass: 13,
  },
];

export default function FloatingDraggable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [visibleShapes, setVisibleShapes] = useState<Shape[]>([]);
  const animationRef = useRef<number | null>(null);
  const draggedShape = useRef<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });
  const mouseVelocity = useRef({ vx: 0, vy: 0 });

  // Initialize shapes with random velocities
  useEffect(() => {
    setShapes(
      initialShapes.map((shape) => ({
        ...shape,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
      }))
    );
  }, []);

  // Handle responsive visibility
  useEffect(() => {
    const updateVisibleShapes = () => {
      const width = window.innerWidth;
      
      if (width >= 1280) {
        // xl screens: show all shapes
        setVisibleShapes(shapes);
      } else if (width >= 1024) {
        // lg screens: show half of the shapes
        const halfCount = Math.ceil(shapes.length / 4);
        setVisibleShapes(shapes.slice(0, halfCount));
      } else {
        // md and smaller: hide all shapes
        setVisibleShapes([]);
      }
    };

    updateVisibleShapes();
    window.addEventListener('resize', updateVisibleShapes);
    
    return () => window.removeEventListener('resize', updateVisibleShapes);
  }, [shapes]);

  // Check collision between two shapes
  const checkCollision = (s1: Shape, s2: Shape): boolean => {
    if (s1.type === "circle" && s2.type === "circle") {
      const r1 = s1.size.width / 2;
      const r2 = s2.size.width / 2;
      const dx = s1.x + r1 - (s2.x + r2);
      const dy = s1.y + r1 - (s2.y + r2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < r1 + r2;
    } else {
      const padding = 1;
      return !(
        s1.x + s1.size.width + padding < s2.x ||
        s2.x + s2.size.width + padding < s1.x ||
        s1.y + s1.size.height + padding < s2.y ||
        s2.y + s2.size.height + padding < s1.y
      );
    }
  };

  // Resolve collision between two shapes with realistic momentum transfer
  const resolveCollision = (s1: Shape, s2: Shape) => {
    const centerX1 = s1.x + s1.size.width / 2;
    const centerY1 = s1.y + s1.size.height / 2;
    const centerX2 = s2.x + s2.size.width / 2;
    const centerY2 = s2.y + s2.size.height / 2;

    const dx = centerX2 - centerX1;
    const dy = centerY2 - centerY1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    const nx = dx / distance;
    const ny = dy / distance;

    const minDist = (s1.size.width + s2.size.width) / 2;
    const overlap = minDist - distance;

    if (overlap > 0) {
      const totalMass = s1.mass + s2.mass;
      const ratio1 = s2.mass / totalMass;
      const ratio2 = s1.mass / totalMass;

      const separationX = (overlap / 2 + 0.5) * nx;
      const separationY = (overlap / 2 + 0.5) * ny;

      s1.x -= separationX * ratio1;
      s1.y -= separationY * ratio1;
      s2.x += separationX * ratio2;
      s2.y += separationY * ratio2;
    }

    const dvx = s2.vx - s1.vx;
    const dvy = s2.vy - s1.vy;
    const dvn = dvx * nx + dvy * ny;

    if (dvn > 0) return;

    const restitution = 0.9;
    const impulse = (-(1 + restitution) * dvn) / (1 / s1.mass + 1 / s2.mass);

    s1.vx -= (impulse * nx) / s1.mass;
    s1.vy -= (impulse * ny) / s1.mass;
    s2.vx += (impulse * nx) / s2.mass;
    s2.vy += (impulse * ny) / s2.mass;
  };

  // Physics update loop
  useEffect(() => {
    if (visibleShapes.length === 0 || !containerRef.current) return;

    const animate = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const airResistance = 0.985;
      const minVelocity = 0.05;
      const maxSpeed = 7;

      setShapes((prevShapes) => {
        const newShapes = prevShapes.map((shape) => {
          if (draggedShape.current === shape.id) {
            return shape;
          }

          let { x, y, vx, vy } = shape;

          vx *= airResistance;
          vy *= airResistance;

          if (Math.abs(vx) < minVelocity) vx = 0;
          if (Math.abs(vy) < minVelocity) vy = 0;

          const speed = Math.sqrt(vx * vx + vy * vy);
          if (speed > maxSpeed) {
            const scale = maxSpeed / speed;
            vx *= scale;
            vy *= scale;
          }

          x += vx;
          y += vy;

          const wallRestitution = 0.8;

          if (x <= 0) {
            x = 0;
            vx = Math.abs(vx) * wallRestitution;
          }
          if (x + shape.size.width >= containerWidth) {
            x = containerWidth - shape.size.width;
            vx = -Math.abs(vx) * wallRestitution;
          }
          if (y <= 0) {
            y = 0;
            vy = Math.abs(vy) * wallRestitution;
          }
          if (y + shape.size.height >= containerHeight) {
            y = containerHeight - shape.size.height;
            vy = -Math.abs(vy) * wallRestitution;
          }

          return { ...shape, x, y, vx, vy };
        });

        for (let iteration = 0; iteration < 4; iteration++) {
          for (let i = 0; i < newShapes.length; i++) {
            for (let j = i + 1; j < newShapes.length; j++) {
              if (checkCollision(newShapes[i], newShapes[j])) {
                resolveCollision(newShapes[i], newShapes[j]);
              }
            }
          }
        }

        for (let i = 0; i < newShapes.length; i++) {
          const speed = Math.sqrt(newShapes[i].vx ** 2 + newShapes[i].vy ** 2);
          if (speed > maxSpeed) {
            const scale = maxSpeed / speed;
            newShapes[i].vx *= scale;
            newShapes[i].vy *= scale;
          }
        }

        return newShapes;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [visibleShapes.length]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent, shapeId: number) => {
    e.preventDefault();
    const shape = shapes.find((s) => s.id === shapeId);
    if (!shape) return;

    draggedShape.current = shapeId;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: e.clientX - rect.left - shape.x,
        y: e.clientY - rect.top - shape.y,
      };
      lastMousePos.current = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
      };
    }

    setShapes((prev) =>
      prev.map((s) => (s.id === shapeId ? { ...s, vx: 0, vy: 0 } : s))
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedShape.current === null || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const shape = shapes.find((s) => s.id === draggedShape.current);
    if (!shape) return;

    const currentTime = Date.now();
    const timeDelta = (currentTime - lastMousePos.current.time) / 1000;

    if (timeDelta > 0 && timeDelta < 0.1) {
      const rawVx = (e.clientX - lastMousePos.current.x) / timeDelta;
      const rawVy = (e.clientY - lastMousePos.current.y) / timeDelta;

      const smoothing = 0.3;
      mouseVelocity.current = {
        vx: mouseVelocity.current.vx * (1 - smoothing) + rawVx * smoothing * 0.05,
        vy: mouseVelocity.current.vy * (1 - smoothing) + rawVy * smoothing * 0.05,
      };
    }

    lastMousePos.current = {
      x: e.clientX,
      y: e.clientY,
      time: currentTime,
    };

    let newX = e.clientX - container.left - dragOffset.current.x;
    let newY = e.clientY - container.top - dragOffset.current.y;

    newX = Math.max(0, Math.min(newX, container.width - shape.size.width));
    newY = Math.max(0, Math.min(newY, container.height - shape.size.height));

    setShapes((prev) =>
      prev.map((s) => {
        if (s.id === draggedShape.current) {
          return {
            ...s,
            x: newX,
            y: newY,
            vx: mouseVelocity.current.vx,
            vy: mouseVelocity.current.vy,
          };
        }
        return s;
      })
    );
  };

  const handleMouseUp = () => {
    if (draggedShape.current !== null) {
      const maxThrowSpeed = 20;
      setShapes((prev) =>
        prev.map((s) =>
          s.id === draggedShape.current
            ? {
                ...s,
                vx: Math.max(
                  -maxThrowSpeed,
                  Math.min(maxThrowSpeed, mouseVelocity.current.vx)
                ),
                vy: Math.max(
                  -maxThrowSpeed,
                  Math.min(maxThrowSpeed, mouseVelocity.current.vy)
                ),
              }
            : s
        )
      );

      draggedShape.current = null;
      mouseVelocity.current = { vx: 0, vy: 0 };
    }
  };

  const getShapeClass = (type: string) => {
    const baseClass =
      "cursor-grab active:cursor-grabbing absolute shadow-lg backdrop-blur-sm transition-transform hover:scale-110";
    switch (type) {
      case "circle":
        return `${baseClass} rounded-full`;
      case "semicircle":
        return `${baseClass}`;
      case "rounded-rect":
        return `${baseClass}`;
      case "custom-rounded-rect":
        return `${baseClass}`;
      default:
        return baseClass;
    }
  };

  const getShapeStyle = (shape: Shape) => {
    const baseStyle: React.CSSProperties = {
      width: shape.size.width,
      height: shape.size.height,
      background: shape.color,
      left: shape.x,
      top: shape.y,
    };

    if (shape.type === "semicircle") {
      return {
        ...baseStyle,
        borderRadius: `${shape.size.width / 2}px ${shape.size.width / 2}px 0 0`,
        transform: `rotate(${shape.rotation || 0}deg)`,
      };
    }

    if (shape.type === "rounded-rect") {
      return {
        ...baseStyle,
        borderRadius: `${shape.size.height / 2}px 0 0 ${shape.size.height / 2}px`,
      };
    }

    if (shape.type === "custom-rounded-rect" && shape.roundedCorners) {
      const { topLeft, topRight, bottomLeft, bottomRight } = shape.roundedCorners;
      const radius = `${shape.size.height / 2}px`;
      return {
        ...baseStyle,
        borderRadius: `
          ${topLeft ? radius : "0"}
          ${topRight ? radius : "0"}
          ${bottomRight ? radius : "0"}
          ${bottomLeft ? radius : "0"}
        `,
      };
    }

    return baseStyle;
  };

return (
  <div
    ref={containerRef}
    className="relative w-full h-screen overflow-hidden hidden xl:block z-0"
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    onMouseLeave={handleMouseUp}
  >
    {visibleShapes.map((shape) => (
      <motion.div
        key={shape.id}
        className={getShapeClass(shape.type)}
        style={getShapeStyle(shape)}
        onMouseDown={(e) => {
          e.stopPropagation(); 
          handleMouseDown(e, shape.id);
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 0.5, delay: shape.id * 0.1 }}
      />
    ))}
  </div>
);
}