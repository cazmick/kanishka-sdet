import { useEffect, useRef } from "react";

/**
 * 3D scroll-reactive starfield.
 * Stars drift downward continuously; scrolling boosts their velocity and
 * pushes them toward the viewer (z decreases) for a warp/parallax effect.
 */
export default function Starfield({ density = 220 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

    type Star = { x: number; y: number; z: number; pz: number; baseSize: number; hue: number };
    let stars: Star[] = [];

    const palette = [195, 320, 95]; // cyan, magenta, amber hues (oklch-ish via hsl)

    const initStars = () => {
      stars = Array.from({ length: density }, () => spawn(true));
    };

    function spawn(initial = false): Star {
      return {
        x: (Math.random() - 0.5) * w,
        y: initial ? (Math.random() - 0.5) * h : -h / 2 - Math.random() * 200,
        z: Math.random() * 0.8 + 0.2, // 0.2..1
        pz: 0,
        baseSize: Math.random() * 1.2 + 0.4,
        hue: palette[Math.floor(Math.random() * palette.length)],
      };
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    };
    resize();
    window.addEventListener("resize", resize);

    let lastScroll = window.scrollY;
    let scrollVel = 0;
    const onScroll = () => {
      const y = window.scrollY;
      scrollVel = (y - lastScroll);
      lastScroll = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // decay scroll velocity
      scrollVel *= 0.9;

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const baseFall = 30; // ambient downward px/s in screen space
      const scrollBoost = scrollVel * 1.5;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.pz = s.z;
        // closer stars (z small) move faster — parallax
        const speed = (baseFall + Math.abs(scrollBoost) * 6) * (1 / s.z);
        s.y += speed * dt * (scrollBoost >= 0 ? 1 : 0.4);
        // warp: z decreases when scrolling down -> stars come toward camera
        s.z -= scrollBoost * 0.0015;
        if (s.z < 0.05) s.z = 0.05;
        if (s.z > 1.2) s.z = 1.2;

        // project — push outward from center based on (1/z)
        const k = 0.6 / s.z;
        const px = cx + s.x * k;
        const py = cy + (s.y) * k;

        if (py > h + 20 || px < -20 || px > w + 20) {
          Object.assign(s, spawn(false));
          s.y = -h / 2 - Math.random() * 100;
          s.x = (Math.random() - 0.5) * w;
          continue;
        }

        const size = s.baseSize * k;
        const alpha = Math.min(1, 0.35 + (1 - s.z) * 0.8);

        // streak when warping
        const warpAmt = Math.min(20, Math.abs(scrollBoost) * 0.8 * k);
        if (warpAmt > 1) {
          const ppx = cx + s.x * (0.6 / s.pz);
          const ppy = cy + s.y * (0.6 / s.pz);
          ctx.strokeStyle = `hsla(${s.hue}, 90%, 70%, ${alpha})`;
          ctx.lineWidth = size;
          ctx.beginPath();
          ctx.moveTo(ppx, ppy);
          ctx.lineTo(px, py);
          ctx.stroke();
        } else {
          ctx.fillStyle = `hsla(${s.hue}, 90%, 75%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
