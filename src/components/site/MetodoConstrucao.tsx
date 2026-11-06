import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { METODO_STEPS, stepAt } from "@/lib/obra-timeline";
import { scrollToY } from "@/lib/smooth-scroll";
import type { ObraScene } from "@/lib/obra-scene";

const ease = [0.16, 1, 0.3, 1] as const;
const stepEnd = (i: number) => METODO_STEPS[i + 1]?.start ?? 1;

/**
 * Seção Método: uma maquete 3D se constrói enquanto a pessoa rola a página.
 * Os quatro tempos (Estudo, Projeto, Execução, Entrega) acompanham a obra.
 */
export function MetodoConstrucao() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ObraScene | null>(null);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const lineFill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const hint = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    sceneRef.current?.setProgress(v);
    const s = stepAt(v);
    setStep((prev) => (prev === s ? prev : s));
  });

  // Carrega o three.js só quando a seção se aproxima da tela.
  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    let disposed = false;
    let scene: ObraScene | null = null;
    let ro: ResizeObserver | undefined;
    let visibility: IntersectionObserver | undefined;

    const boot = async () => {
      try {
        const probe = document.createElement("canvas");
        if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) throw new Error("WebGL indisponível");
        const { createObraScene } = await import("@/lib/obra-scene");
        if (disposed) return;
        scene = createObraScene(canvas, { mobile: window.matchMedia("(max-width: 767px)").matches, reducedMotion: !!reduced });
        sceneRef.current = scene;
        scene.setProgress(scrollYProgress.get());
        const fit = () => scene?.resize(host.clientWidth, host.clientHeight);
        ro = new ResizeObserver(fit);
        ro.observe(host);
        fit();
        visibility = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? scene?.start() : scene?.stop()));
        visibility.observe(host);
        setReady(true);
      } catch (error) {
        console.warn("[Método 3D]", error);
        setFailed(true);
      }
    };

    const near = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      near.disconnect();
      void boot();
    }, { rootMargin: "800px 0px" });
    near.observe(host);

    return () => {
      disposed = true;
      near.disconnect();
      ro?.disconnect();
      visibility?.disconnect();
      scene?.dispose();
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    scrollToY(top + travel * Math.min(0.999, METODO_STEPS[i]!.start + 0.06));
  };

  if (failed) return <MetodoGrid />;

  return (
    <div ref={sectionRef} className="relative h-[400svh] bg-background md:h-[460vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          ref={hostRef}
          className="absolute inset-0"
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            sceneRef.current?.setPointer((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
          }}
        >
          <canvas ref={canvasRef} aria-hidden className={`block h-full w-full transition-opacity duration-[1.2s] ${ready ? "opacity-100" : "opacity-0"}`} />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[52%] bg-gradient-to-r from-background via-background/80 to-transparent md:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-background via-background/90 to-transparent md:hidden" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24 md:px-12 md:pb-12 md:pt-32">
          <p className="label-mono mb-4 text-primary md:mb-6">(03) — Método</p>
          <h2 className="display mobile-heading text-[clamp(2.5rem,5vw,5.25rem)] text-primary md:max-w-[11ch]">
            Quatro tempos. <span className="italic text-accent">Nenhum improviso.</span>
          </h2>

          {/* Computador: lista dos tempos com linha de progresso */}
          <div className="relative mt-auto hidden max-w-[30rem] pl-8 md:block">
            <span className="absolute left-0 top-0 h-full w-px bg-border" />
            <motion.span style={{ scaleY: lineFill }} className="absolute left-0 top-0 h-full w-px origin-top bg-primary" />
            <ol>
              {METODO_STEPS.map((s, i) => {
                const active = i === step;
                return (
                  <li key={s.title} className="border-b border-border last:border-b-0">
                    <button type="button" onClick={() => goTo(i)} aria-current={active ? "step" : undefined}
                      className="pointer-events-auto grid w-full grid-cols-[3.25rem_minmax(0,1fr)] items-baseline py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                      <span className={`display text-4xl transition-colors duration-500 ${active ? "text-accent" : "text-outline"}`}>{i + 1}</span>
                      <span>
                        <span className={`display block text-3xl transition-colors duration-500 lg:text-4xl ${active ? "text-primary" : "text-primary/35"}`}>{s.title}</span>
                        <AnimatePresence initial={false}>
                          {active && (
                            <motion.span key="d" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: reduced ? 0 : 0.5, ease }} className="block overflow-hidden">
                              <span className="block max-w-sm pt-3 text-base leading-relaxed text-muted-foreground">{s.text}</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Celular: tempo atual por cima da maquete */}
          <div className="mt-auto pr-16 md:hidden">
            <div className="mb-5 grid grid-cols-4 gap-1.5" aria-hidden>
              {METODO_STEPS.map((s, i) => <Segment key={s.title} progress={scrollYProgress} from={s.start} to={stepEnd(i)} />)}
            </div>
            <div className="relative min-h-[8.5rem]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: reduced ? 0 : 0.35, ease }}>
                  <p className="label-mono mb-2 text-accent">Tempo {step + 1} de 4</p>
                  <h3 className="display text-4xl text-primary">{METODO_STEPS[step]!.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{METODO_STEPS[step]!.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <motion.p style={{ opacity: hint }} className="label-mono pointer-events-none absolute bottom-10 right-12 hidden items-center gap-3 text-muted-foreground md:flex">
          Role para construir
          <span className="relative block h-10 w-px overflow-hidden bg-border">
            <motion.span className="absolute left-0 top-0 h-3 w-px bg-primary" animate={reduced ? { y: 0 } : { y: [-12, 40] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} />
          </span>
        </motion.p>
      </div>
    </div>
  );
}

function Segment({ progress, from, to }: { progress: MotionValue<number>; from: number; to: number }) {
  const scaleX = useTransform(progress, [from, to], [0, 1]);
  return (
    <span className="relative block h-[2px] overflow-hidden bg-border">
      <motion.span style={{ scaleX }} className="absolute inset-0 origin-left bg-primary" />
    </span>
  );
}

/** Versão sem 3D (aparelhos sem WebGL). */
function MetodoGrid() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-32">
      <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-2 md:gap-10">
        <p className="label-mono text-primary">(03) — Método</p>
        <h2 className="display mobile-heading text-[clamp(2.75rem,6vw,6rem)] text-primary">Quatro tempos. <span className="italic text-accent">Nenhum improviso.</span></h2>
      </div>
      <div className="grid grid-cols-2 border-t border-primary md:grid-cols-4">
        {METODO_STEPS.map((s, i) => (
          <div key={s.title} className="min-w-0 border-b border-border py-6 odd:border-r odd:pr-4 even:pl-4 md:border-b-0 md:border-r md:px-8 md:py-12 md:odd:pr-8 md:even:pl-8 md:first:pl-0 md:last:border-r-0">
            <span className="display block text-5xl text-outline md:text-[7rem]">{i + 1}</span>
            <h3 className="display mt-3 text-3xl text-primary md:mt-6 md:text-4xl">{s.title}</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground md:mt-4 md:text-base">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
