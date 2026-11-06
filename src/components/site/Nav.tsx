import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/site/Logo";
import { WhatsAppIcon, WHATSAPP_URL } from "@/components/site/Icons";
import { useMagnetic } from "@/components/site/Magnetic";
import { lockScroll } from "@/lib/smooth-scroll";
import { INSTAGRAM_URL } from "@/lib/instagram";

const ease = [0.16, 1, 0.3, 1] as const;
const LINKS = [
  ["01", "Manifesto", "#manifesto"],
  ["02", "Obras", "#obras"],
  ["03", "Método", "#metodo"],
  ["04", "Novidades", "#novidades"],
] as const;

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const magnetic = useMagnetic(0.25);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 80);
    setPastHero(y > window.innerHeight * 0.8);
    if (Math.abs(y - prev) > 4) setHidden(y > prev && y > window.innerHeight * 0.6);
  });

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const t = window.setTimeout(() => firstLink.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const showBar = open || !hidden;

  return (
    <>
      <motion.div aria-hidden style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent" />
      <motion.header
        initial={false}
        animate={{ y: showBar ? "0%" : "-110%" }}
        transition={{ duration: reduced ? 0 : 0.6, ease }}
        className={`fixed inset-x-0 top-0 z-50 text-bone transition-[background-color,padding,border-color] duration-700 ${solid && !open ? "border-b border-forest-line bg-forest-deep/80 py-3 backdrop-blur-xl md:py-4" : "border-b border-transparent py-5 md:py-7"}`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 md:px-12">
          <a href="#topo" aria-label="Zordan Engenharia — início" onClick={() => setOpen(false)} className="min-h-11 min-w-0 content-center">
            <Logo className="nav-logo" />
          </a>
          <nav className="label-mono hidden gap-10 md:flex" aria-label="Seções">
            {LINKS.map(([, l, h]) => (
              <a key={h} href={h} className="group relative py-1">
                {l}
                <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <motion.a {...magnetic} href={WHATSAPP_URL} target="_blank" rel="noreferrer"
              className="label-mono hidden min-h-11 items-center whitespace-nowrap border-b border-accent pb-1 text-accent transition-colors hover:text-bone sm:flex">
              Fale conosco ↗
            </motion.a>
            <button ref={toggleRef} type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="menu-celular"
              aria-label={open ? "Fechar menu" : "Abrir menu"} className="relative -mr-2 grid h-11 w-11 place-items-center md:hidden">
              <span className={`absolute h-px w-6 bg-current transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span className={`absolute h-px w-6 bg-current transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-celular"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: reduced ? 0 : 0.7, ease }}
            className="grain fixed inset-0 z-40 flex flex-col bg-forest-deep px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 text-bone md:hidden"
          >
            <nav aria-label="Seções" className="flex flex-col">
              {LINKS.map(([n, l, h], i) => (
                <span key={h} className="block overflow-hidden border-b border-forest-line">
                  <motion.a
                    ref={i === 0 ? firstLink : undefined}
                    href={h}
                    onClick={() => setOpen(false)}
                    initial={reduced ? false : { y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.07, ease }}
                    className="flex items-baseline gap-5 py-4"
                  >
                    <span className="label-mono text-accent">{n}</span>
                    <span className="display text-[2.75rem] leading-none">{l}</span>
                  </motion.a>
                </span>
              ))}
            </nav>
            <motion.div initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7, ease }} className="mt-auto grid gap-5">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-between gap-4 bg-accent px-5 text-forest-deep">
                <span className="flex items-center gap-3 font-medium"><WhatsAppIcon /> Falar no WhatsApp</span>
                <span aria-hidden>↗</span>
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="label-mono flex min-h-11 items-center justify-between border-b border-forest-line text-bone/70">
                @zordanengenharia <span aria-hidden>↗</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Atalho de contato no celular, depois do topo */}
      <AnimatePresence>
        {pastHero && !open && (
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Falar no WhatsApp"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: reduced ? 0 : 0.35, ease }}
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 grid h-14 w-14 place-items-center bg-accent text-forest-deep shadow-[0_18px_40px_-12px_oklch(0.12_0.025_162/0.6)] active:scale-95 sm:hidden"
          >
            <WhatsAppIcon className="h-6 w-6" />
          </motion.a>
        )}
      </AnimatePresence>
    </>
  );
}
