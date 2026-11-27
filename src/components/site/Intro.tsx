import { useState } from "react";
import { Logo } from "@/components/site/Logo";

/** Abertura: as letras do ZKF sobem, os fios dourados se abrem e a cortina sobe. Só CSS — funciona antes do JS carregar. */
export const INTRO_DELAY = 1.25;

export function Intro() {
  const [gone, setGone] = useState(false);
  if (gone) return null;
  return (
    <div className="intro" aria-hidden="true" onAnimationEnd={(e) => e.animationName === "intro-out" && setGone(true)}>
      <Logo className="w-52 md:w-72" />
    </div>
  );
}
