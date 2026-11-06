import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SplitWords({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Título que "acende" palavra por palavra conforme a rolagem
 * (o texto já está na página — só a opacidade acompanha o scroll).
 */
export function ScrollWords({ lines }: { lines: { text: string; className?: string }[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const total = lines.reduce((n, l) => n + l.text.split(" ").length, 0);
  let index = 0;
  return (
    <span ref={ref} className="block">
      {lines.map((line, li) => (
        <span key={li} className={line.className}>
          {line.text.split(" ").map((word) => {
            const i = index++;
            return <ScrollWord key={i} progress={scrollYProgress} range={[i / total, (i + 1) / total]}>{word}</ScrollWord>;
          })}
        </span>
      ))}
    </span>
  );
}

function ScrollWord({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }} className="inline-block">{children}&nbsp;</motion.span>;
}
