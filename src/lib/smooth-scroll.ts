import type Lenis from "lenis";

/**
 * Rolagem suave (Lenis) só em computador com mouse e sem "reduzir movimento".
 * No celular a rolagem nativa continua — é mais rápida e não briga com o dedo.
 */
let lenis: Lenis | null = null;
let locks = 0;

export async function startSmoothScroll() {
  if (typeof window === "undefined" || lenis) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (reduce || !finePointer) return () => {};
  const { default: LenisCtor } = await import("lenis");
  lenis = new LenisCtor({ lerp: 0.09, wheelMultiplier: 0.95, autoRaf: true, anchors: { offset: -40 } });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

/** Trava/destrava a rolagem da página (modal, menu). Aceita chamadas aninhadas. */
export function lockScroll(lock: boolean) {
  if (typeof document === "undefined") return;
  locks = Math.max(0, locks + (lock ? 1 : -1));
  const locked = locks > 0;
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: "smooth" });
}
