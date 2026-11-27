import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { useRef } from "react";
import { Logo } from "@/components/site/Logo";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/** Faixa do Grupo ZKF: desliza sozinha e acelera / inverte conforme a rolagem. */
export function ParceriaMarquee({ light = false }: { light?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (!inView || reduced) return;
    const f = factor.get();
    if (f < 0) dir.current = 1;
    else if (f > 0) dir.current = -1;
    const dt = Math.min(delta, 50) / 1000;
    const move = dir.current * 1.25 * dt;
    baseX.set(baseX.get() + move + move * Math.min(Math.abs(f), 8));
  });

  return (
    <div ref={ref} className={`w-full min-w-0 overflow-hidden border-y py-5 md:py-7 ${light ? "border-border bg-background text-primary" : "border-forest-line bg-forest-deep text-bone"}`} aria-label="Grupo ZKF">
      <motion.div style={{ x }} className="parceria-track flex w-max items-center whitespace-nowrap will-change-transform" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="flex items-center gap-10 pr-10 md:gap-16 md:pr-16">
            <Logo tone={light ? "light" : "dark"} className="w-24 shrink-0 md:w-32" />
            <span className="text-[var(--zkf-gold)]">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
