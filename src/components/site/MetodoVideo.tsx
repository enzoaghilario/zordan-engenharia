import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import videoDesktop from "@/assets/video/obras-desktop.mp4.asset.json";
import videoMobile from "@/assets/video/obras-mobile.mp4.asset.json";
import videoPoster from "@/assets/video/obras-poster.jpg";
import { Logo } from "@/components/site/Logo";
import { METODO_SCENES, METODO_LOGO_HOLD_MS, METODO_LOGO_FADE_MS, metodoSceneAt } from "@/lib/metodo-timeline";

export function MetodoVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phase, setPhase] = useState<"playing" | "logo" | "fading">("playing");
  const reducedMotion = useReducedMotion();
  const scene = METODO_SCENES[sceneIndex];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setSrc(window.matchMedia("(max-width: 767px)").matches ? videoMobile.url : videoDesktop.url);
      io.disconnect();
    }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (phase === "playing") return;
    const timer = window.setTimeout(() => {
      if (phase === "logo") {
        setPhase("fading");
      } else {
        const video = ref.current;
        if (!video) return;
        video.currentTime = 0;
        setSceneIndex(0);
        setPhase("playing");
        void video.play().catch(() => {});
      }
    }, phase === "logo" ? METODO_LOGO_HOLD_MS : reducedMotion ? 0 : METODO_LOGO_FADE_MS);
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  return (
    <div className="grain relative flex aspect-[4/3] w-full min-w-0 items-center justify-center overflow-hidden bg-forest-deep text-bone md:aspect-auto md:min-h-[85svh]" role="group" aria-label="A história da Zordan Engenharia">
      <video ref={ref} src={src ?? undefined} poster={videoPoster} autoPlay muted playsInline preload="metadata" aria-hidden
        onTimeUpdate={(event) => setSceneIndex(metodoSceneAt(event.currentTarget.currentTime))}
        onEnded={() => setPhase("logo")}
        className="absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-forest-deep/50 to-transparent" />
      <div className="relative z-10 flex w-full min-w-0 items-center justify-center px-6 py-8 md:px-12 md:py-20">
        <AnimatePresence mode="wait" initial={false}>
          {phase === "playing" && src && scene && (
            <motion.p key={sceneIndex} initial={reducedMotion ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.6 }}
              className={`metodo-phrase display min-w-0 max-w-5xl text-center italic ${sceneIndex === 5 ? "metodo-phrase-final" : ""}`}>
              {scene.lines.map((line) => <span className="block" key={line}>{line}</span>)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <motion.div initial={false} animate={{ opacity: phase === "logo" ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : METODO_LOGO_FADE_MS / 1000 }}
        aria-hidden={phase !== "logo"}
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-forest-deep">
        <Logo className="metodo-logo" />
      </motion.div>
    </div>
  );
}