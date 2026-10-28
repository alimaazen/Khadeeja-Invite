import React, { useEffect, useRef, useState } from "react";

interface GlitterRevealProps {
  children: React.ReactNode;
  className?: string;
  pathVariant?: "s-curve" | "loop" | "arc-right" | "arc-left" | "diagonal";
  duration?: number; // duration of glitter flight in seconds
  delay?: number; // delay before flight in seconds
  enabled?: boolean; // if false, waits until true before triggering
  fadeDuration?: number; // duration of the slow component reveal in seconds
  revealThreshold?: number; // point in flight [0, 1] when component fades in (default 0.5 halfway point)
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  maxLife: number;
  life: number;
  isStar: boolean;
  twinklePhase: number;
  twinkleSpeed: number;
}

// Cubic bezier point evaluation
function getCubicBezierPoint(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
): [number, number] {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0];
  const y = uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1];
  return [x, y];
}

// First derivative of cubic bezier for tangent and normal vectors
function getCubicBezierDerivative(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
): [number, number] {
  const u = 1 - t;
  const dx =
    3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
  const dy =
    3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
  return [dx, dy];
}

// 4-point diamond sparkle star
function drawSparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  alpha: number,
  color: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.fillStyle = color;

  ctx.beginPath();
  // 4-point star with sharp arms
  const outer = size;
  const inner = size * 0.22;

  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const nextAngle = angle + Math.PI / 4;
    if (i === 0) {
      ctx.moveTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    } else {
      ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    }
    ctx.lineTo(Math.cos(nextAngle) * inner, Math.sin(nextAngle) * inner);
  }
  ctx.closePath();
  ctx.fill();

  // Gentle center glow dot
  ctx.beginPath();
  ctx.arc(0, 0, inner * 0.9, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  ctx.restore();
}

// Pure ethereal white, diamond silver, and subtle translucent stardust colors
const SHIMMER_COLORS = [
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#F8FAFC",
  "#F1F5F9",
  "#E2E8F0",
  "#FFFFFF",
  "#EDF2F7",
  "#F0F9FF",
];

const GlitterReveal: React.FC<GlitterRevealProps> = ({
  children,
  className = "w-full flex flex-col items-center justify-center py-8 px-4",
  pathVariant = "s-curve",
  duration = 2.4,
  delay = 0.1,
  enabled = true,
  fadeDuration = 1.6,
  revealThreshold = 0.5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [hasStarted, enabled]);

  useEffect(() => {
    if (!hasStarted) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CANVAS_PAD = 70;
    let width = container.clientWidth;
    let height = container.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      const totalW = width + CANVAS_PAD * 2;
      const totalH = height + CANVAS_PAD * 2;
      canvas.width = totalW * dpr;
      canvas.height = totalH * dpr;
      canvas.style.width = `${totalW}px`;
      canvas.style.height = `${totalH}px`;
      canvas.style.left = `-${CANVAS_PAD}px`;
      canvas.style.top = `-${CANVAS_PAD}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Define flight bezier path: All paths start deep at bottom-left corner (under flowers)
    // and soar across to exit deep at top-right corner (under flowers)
    let p0: [number, number];
    let p1: [number, number];
    let p2: [number, number];
    let p3: [number, number];

    // Origin: absolute bottom-left most corner point (emerging under meadow & bottom-left stems)
    const startX = -12;
    const startY = height + 18;
    // Destination: absolute top-right most corner point (disappearing under top-right rose & peony bouquet)
    const endX = width + 12;
    const endY = -18;

    switch (pathVariant) {
      case "arc-right":
        p0 = [startX, startY];
        p1 = [0.35 * width, 0.7 * height];
        p2 = [0.78 * width, 0.38 * height];
        p3 = [endX, endY];
        break;
      case "arc-left":
        p0 = [startX, startY];
        p1 = [0.18 * width, 0.58 * height];
        p2 = [0.65 * width, 0.25 * height];
        p3 = [endX, endY];
        break;
      case "loop":
      case "s-curve":
      case "diagonal":
      default:
        // Gentle, flowing celestial curve that passes through center at t=0.5
        p0 = [startX, startY];
        p1 = [0.18 * width, 0.58 * height];
        p2 = [0.82 * width, 0.42 * height];
        p3 = [endX, endY];
        break;
    }

    const particles: Particle[] = [];
    let startTime: number | null = null;
    const flightDurationMs = duration * 1000;
    const delayMs = delay * 1000;
    let revealTriggered = false;

    const totalW = width + CANVAS_PAD * 2;
    const totalH = height + CANVAS_PAD * 2;

    const render = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      ctx.clearRect(0, 0, totalW, totalH);

      // Handle flight time
      const flightElapsed = elapsed - delayMs;
      const t = Math.max(0, Math.min(1, flightElapsed / flightDurationMs));

      // Trigger component reveal when stardust reaches the halfway point (t >= revealThreshold)
      if (t >= revealThreshold && !revealTriggered) {
        revealTriggered = true;
        setIsRevealed(true);
      }

      // If the flight is active (0 < t <= 1)
      if (flightElapsed > 0 && t <= 1) {
        const [bx, by] = getCubicBezierPoint(t, p0, p1, p2, p3);
        const [dx, dy] = getCubicBezierDerivative(t, p0, p1, p2, p3);
        const len = Math.hypot(dx, dy) || 1;
        // Normal vector perpendicular to the flight trajectory
        const nx = -dy / len;
        const ny = dx / len;

        // Dramatic, organic fluid wave with rich looping curls:
        // Envelope Math.sin(t * Math.PI) guarantees zero offset at t=0 (bottom-left) and t=1 (top-right).
        const naturalSwoop =
          Math.sin(t * Math.PI) * Math.sin(t * Math.PI * 3) * 52 +
          Math.sin(t * Math.PI) * Math.cos(t * Math.PI * 5) * 28;

        const currX = bx + nx * naturalSwoop;
        const currY = by + ny * naturalSwoop;

        const headX = currX + CANVAS_PAD;
        const headY = currY + CANVAS_PAD;

        // Head alpha fades in smoothly as it emerges from under bottom-left flowers
        // and fades out smoothly as it dives under top-right flowers
        let headAlpha = 1;
        if (t < 0.12) {
          headAlpha = t / 0.12;
        } else if (t > 0.88) {
          headAlpha = Math.max(0, (1 - t) / 0.12);
        }

        // Spawn stream particles (stardust ribbon)
        const spawnCount = Math.floor(Math.random() * 3) + 4; // 4-6 particles per frame
        for (let i = 0; i < spawnCount; i++) {
          // Normal distribution-like offset across ribbon
          const offsetAngle = Math.random() * Math.PI * 2;
          const offsetDist = Math.pow(Math.random(), 1.5) * 16; // concentrated near center
          const px = headX + Math.cos(offsetAngle) * offsetDist;
          const py = headY + Math.sin(offsetAngle) * offsetDist;

          const isStar = Math.random() < 0.2; // 20% diamond sparkle stars
          const size = isStar ? 3.5 + Math.random() * 4.5 : 0.8 + Math.random() * 2.4;

          particles.push({
            x: px,
            y: py,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.3) * 0.8, // gentle downward drift
            size,
            color: SHIMMER_COLORS[Math.floor(Math.random() * SHIMMER_COLORS.length)],
            maxLife: 45 + Math.random() * 55, // 0.7s - 1.6s
            life: 0,
            isStar,
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.12 + Math.random() * 0.18,
          });
        }

        // Draw the glowing comet head / glitter orb
        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // 1. Soft pure white radial aura
        const glowRadius = 26;
        const radialGrad = ctx.createRadialGradient(headX, headY, 0, headX, headY, glowRadius);
        radialGrad.addColorStop(0, `rgba(255, 255, 255, ${0.98 * headAlpha})`);
        radialGrad.addColorStop(0.25, `rgba(255, 255, 255, ${0.8 * headAlpha})`);
        radialGrad.addColorStop(0.55, `rgba(240, 245, 255, ${0.3 * headAlpha})`);
        radialGrad.addColorStop(0.85, `rgba(230, 240, 255, ${0.1 * headAlpha})`);
        radialGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(headX, headY, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // 2. Bright diamond white core sparkles at the head
        const headRotation = (now / 350) % (Math.PI * 2);
        drawSparkle(ctx, headX, headY, 9.5, headRotation, headAlpha, "#FFFFFF");
        drawSparkle(ctx, headX, headY, 6, headRotation + Math.PI / 4, 0.9 * headAlpha, "#F1F5F9");

        ctx.restore();
      }

      // Update and draw trailing particles
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.twinklePhase += p.twinkleSpeed;

        const progress = p.life / p.maxLife;
        if (progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        // Smooth fade-in then fade-out with twinkling pulsation
        let alpha = Math.sin(progress * Math.PI);
        const twinkle = 0.65 + 0.35 * Math.sin(p.twinklePhase);
        alpha *= twinkle;

        if (p.isStar) {
          drawSparkle(ctx, p.x, p.y, p.size, p.twinklePhase * 0.4, alpha, p.color);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
          ctx.fill();
        }
      }
      ctx.restore();

      // Continue animating as long as the flight is active or particles still exist
      if (t < 1 || particles.length > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        // Animation complete: clear canvas to release memory
        ctx.clearRect(0, 0, totalW, totalH);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [hasStarted, duration, delay, pathVariant, revealThreshold]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Floating Canvas for the glittering stardust entity */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-30 overflow-visible"
        aria-hidden="true"
      />

      {/* The component content: starts invisible and smoothly reveals as glitter sweeps across */}
      <div
        style={{ transitionDuration: `${fadeDuration}s` }}
        className={`relative z-10 w-full transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isRevealed
            ? "opacity-100 blur-0 scale-100 translate-y-0"
            : "opacity-0 blur-[8px] scale-[0.96] translate-y-3 pointer-events-none"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default GlitterReveal;
