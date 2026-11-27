import { ZKF_LETTERS, ZKF_LOCKUPS } from "@/components/site/zkf-paths";

type Tone = "dark" | "light";
type Variant = keyof typeof ZKF_LOCKUPS;

/**
 * Logotipo ZKF — opção 01 · Clássica. "construtora" é a marca do site; "grupo" é a do Grupo ZKF (faixas).
 * dark: versão negativa (ouro sobre fundo escuro). light: principal (marinho sobre fundo claro).
 * As três letras sempre com a mesma cor; os fios são sempre dourados.
 */
export function Logo({ className = "", tone = "dark", variant = "construtora" }: { className?: string; tone?: Tone; variant?: Variant }) {
  const lockup = ZKF_LOCKUPS[variant];
  const letters = tone === "dark" ? "var(--zkf-gold)" : "var(--zkf-navy)";
  const word = tone === "dark" ? "var(--zkf-ivory)" : "var(--zkf-navy)";
  return (
    <svg viewBox={lockup.viewBox} className={`zkf-logo block h-auto overflow-visible ${className}`} role="img" aria-label={variant === "grupo" ? "Grupo ZKF" : "ZKF Construtora"}>
      <g className="zkf-letters" fill={letters}>
        {ZKF_LETTERS.map((d, i) => <path key={i} className="zkf-letter" d={d} style={{ ["--i" as string]: i }} />)}
      </g>
      <g className="zkf-lines" fill="var(--zkf-gold)">
        {lockup.lines.map(([x, y, w, h], i) => <rect key={i} className="zkf-line" x={x} y={y} width={w} height={h} />)}
      </g>
      <g className="zkf-word" fill={word}>
        {lockup.word.map((d, i) => <path key={i} d={d} />)}
      </g>
    </svg>
  );
}
