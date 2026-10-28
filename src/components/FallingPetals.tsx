import { useState, useEffect } from "react";

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
  drift: number;
}

const FallingPetals = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // 6 gentle petals are visually plenty and keep mobile frame rate at a solid 60/120fps
    setPetals(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        left: 5 + Math.random() * 90,
        delay: Math.random() * 4,
        duration: 9 + Math.random() * 6,
        size: 16 + Math.random() * 16,
        rotate: 180 + Math.random() * 360,
        drift: (Math.random() * 2 - 1) * 45,
      })),
    );
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 w-full h-full">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal-particle"
          style={
            {
              left: `${petal.left}%`,
              animationDuration: `${petal.duration}s`,
              animationDelay: `${petal.delay}s`,
              "--petal-drift": `${petal.drift}px`,
              "--petal-rotate": `${petal.rotate}deg`,
            } as React.CSSProperties
          }
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2Z"
              fill="#FDF5F2"
              opacity="0.85"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default FallingPetals;
