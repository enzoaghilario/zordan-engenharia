import { useState } from "react";

/** Abertura: as camadas da marca se empilham como uma obra subindo, e a cortina abre. Só CSS — funciona antes do JS carregar. */
export const INTRO_DELAY = 1.25;

export function Intro() {
  const [gone, setGone] = useState(false);
  if (gone) return null;
  return (
    <div className="intro" aria-hidden="true" onAnimationEnd={(e) => e.animationName === "intro-out" && setGone(true)}>
      <div className="intro-mark">
        <svg viewBox="0 0 48 48" fill="none" className="h-16 w-16 md:h-20 md:w-20">
          <path className="intro-hex" pathLength={1} d="M24 3 44 13v22L24 45 4 35V13Z" stroke="currentColor" strokeWidth="1.2" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} className="intro-layer" pathLength={1} style={{ animationDelay: `${0.15 + (5 - i) * 0.09}s` }}
              d={`M8 ${17 + i * 3.6} 24 ${25 + i * 3.6} 40 ${17 + i * 3.6}`} stroke="currentColor" strokeWidth="1.6" />
          ))}
        </svg>
        <span className="intro-word">Zordan</span>
      </div>
    </div>
  );
}
