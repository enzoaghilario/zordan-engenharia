import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform, useMotionValue, useSpring, useVelocity, useReducedMotion, type MotionValue } from "motion/react";
import { useRef, useState, useEffect } from "react";
import hero from "@/assets/hero-residencia.jpg";
import detalhe from "@/assets/detalhe-fachada.jpg";
import { MetodoVideo } from "@/components/site/MetodoVideo";
import { MetodoConstrucao } from "@/components/site/MetodoConstrucao";
import { Logo } from "@/components/site/Logo";
import { Nav } from "@/components/site/Nav";
import { Intro, INTRO_DELAY } from "@/components/site/Intro";
import { ParceriaMarquee } from "@/components/site/ParceriaMarquee";
import { WhatsAppIcon, WHATSAPP_URL } from "@/components/site/Icons";
import { useMagnetic } from "@/components/site/Magnetic";
import { Reveal, ScrollWords } from "@/components/site/Reveal";
import { lockScroll, startSmoothScroll } from "@/lib/smooth-scroll";
import { INSTAGRAM_URL, obras, patrocinio, datas, type Post } from "@/lib/instagram";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zordan Engenharia — Construção de alto padrão" },
      { name: "description", content: "Engenharia, infraestrutura e residências de alto padrão. Projetos executados com precisão, do terreno à última pedra." },
      { property: "og:title", content: "Zordan Engenharia — Construção de alto padrão" },
      { property: "og:description", content: "Engenharia, infraestrutura e residências de alto padrão, do terreno à última pedra." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ease = [0.16, 1, 0.3, 1] as const;

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.35]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  // Profundidade: a foto e o texto se movem em sentidos opostos com o mouse.
  const mx = useSpring(0, { stiffness: 60, damping: 20 });
  const my = useSpring(0, { stiffness: 60, damping: 20 });
  const imgX = useTransform(mx, (v) => v * -26);
  const imgY = useTransform(my, (v) => v * -18);
  const titleX = useTransform(mx, (v) => v * 14);
  const titleY = useTransform(my, (v) => v * 8);
  const d = INTRO_DELAY;
  return (
    <section
      id="topo"
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
      className="grain relative min-h-svh overflow-hidden bg-forest-deep text-bone"
    >
      <motion.div
        initial={{ clipPath: "inset(12% 10% 12% 10%)", opacity: 0.4 }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
        transition={{ duration: 1.6, delay: d - 0.35, ease }}
        style={{ x: imgX, y: imgY }}
        className="absolute -inset-8"
      >
        <motion.img
          src={hero}
          alt="Residência de alto padrão ao entardecer"
          width={1920}
          height={1088}
          style={{ scale, y }}
          className="h-full w-full object-cover opacity-80"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-transparent to-forest-deep/50" />

      <motion.div style={{ y: textY, opacity: fade }} className="relative mx-auto flex min-h-svh max-w-[1600px] flex-col justify-end px-6 pb-[max(3rem,env(safe-area-inset-bottom))] pt-36 md:px-12 md:pb-14">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d + 0.3, duration: 1 }} className="label-mono mb-6 flex items-center gap-4 text-accent">
          <span className="h-px w-8 shrink-0 bg-accent md:w-16" /> Engenharia de alto padrão
        </motion.p>
        <motion.h1 style={{ x: titleX, y: titleY }} className="display hero-title max-w-6xl">
          {["Construímos", "o que", "permanece."].map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className={`block ${i === 1 ? "pl-[12vw] italic text-accent" : ""}`}
                initial={{ y: "105%", rotate: 4 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1.4, delay: d + 0.15 + i * 0.13, ease }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d + 0.9, duration: 1, ease }} className="mt-8 grid gap-6 border-t border-forest-line pt-6 md:grid-cols-[1fr_auto]">
          <p className="max-w-md text-base font-light leading-relaxed text-bone/75 md:text-lg">
            Do movimento de terra à última pedra do acabamento — projetos executados com rigor técnico e a calma de quem constrói para gerações.
          </p>
          <a href="#obras" className="label-mono flex min-h-11 items-center gap-4 self-end">
            Ver obras
            <span className="relative block h-12 w-px overflow-hidden bg-forest-line">
              <motion.span className="absolute left-0 top-0 h-4 w-px bg-accent" animate={{ y: [-16, 48] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} />
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const frameY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  // A foto "abre" como uma janela enquanto entra na tela.
  const clip = useTransform(scrollYProgress, [0.05, 0.4], ["inset(22% 16% 22% 16%)", "inset(0% 0% 0% 0%)"]);
  const imgScale = useTransform(scrollYProgress, [0.05, 0.4], [1.5, 1.22]);
  return (
    <section id="manifesto" ref={ref} className="relative overflow-hidden bg-background py-20 md:py-48">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 md:grid-cols-12 md:gap-20 md:px-12">
        <div className="md:col-span-7">
          <p className="label-mono mb-10 text-muted-foreground">(01) — Manifesto</p>
          <h2 className="display mobile-heading text-[clamp(2.5rem,6vw,6rem)] text-primary">
            <ScrollWords
              lines={[
                { text: "Engenharia é a arte de transformar" },
                { text: "ideias em obras", className: "italic text-accent" },
                { text: "que atravessam o tempo." },
              ]}
            />
          </h2>
          <div className="mt-12 grid border-t border-border sm:grid-cols-3 md:mt-20">
            {[
              ["Precisão", "Cada etapa medida, verificada e documentada."],
              ["Solidez", "Bases sólidas — no concreto e nas relações."],
              ["Permanência", "Obras pensadas para gerações, não para estações."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.12} className="min-w-0 border-b border-border py-8 sm:border-b-0 sm:border-r sm:pr-5 sm:last:border-r-0 sm:[&:not(:first-child)]:pl-5 xl:pr-8 xl:[&:not(:first-child)]:pl-8">
                <p className="label-mono mb-4 text-accent">0{i + 1}</p>
                <h3 className="display mb-3 text-2xl text-primary [overflow-wrap:anywhere] lg:text-[1.65rem] xl:text-3xl">{t}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="relative md:col-span-5">
          <motion.div style={{ y: frameY }} className="absolute -left-6 top-16 hidden h-[80%] w-[85%] border border-accent md:block" />
          <motion.div style={{ clipPath: clip }} className="relative aspect-[3/4] overflow-hidden">
            <motion.img src={detalhe} alt="Detalhe de fachada em travertino e madeira" loading="lazy" width={1024} height={1344} style={{ y: imgY, scale: imgScale }} className="h-full w-full object-cover" />
          </motion.div>
          <p className="label-mono mt-6 text-muted-foreground">Travertino · Madeira · Concreto aparente</p>
        </div>
      </div>
    </section>
  );
}

function reelEmbed(url: string) {
  const id = url.match(/\/reel\/([^/?]+)/)?.[1];
  return id ? `https://www.instagram.com/reel/${id}/embed/` : null;
}

function ReelModal({ p, onClose }: { p: Post; onClose: () => void }) {
  const src = reelEmbed(p.url);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    lockScroll(true);
    return () => { window.removeEventListener("keydown", onKey); lockScroll(false); };
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      role="dialog" aria-modal="true" aria-label={p.title}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-deep/95 p-4 backdrop-blur-sm">
      <motion.div initial={{ y: 40, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.98 }} transition={{ duration: 0.5, ease }}
        onClick={(e) => e.stopPropagation()} className="relative flex h-[min(88svh,820px)] w-[min(92vw,420px)] flex-col">
        <div className="mb-3 flex items-center justify-between gap-4 text-bone">
          <p className="label-mono min-w-0 truncate text-accent">{p.tag} — {p.title}</p>
          <button type="button" onClick={onClose} aria-label="Fechar vídeo" className="label-mono shrink-0 border border-bone/40 px-3 py-1.5 transition-colors hover:border-accent hover:text-accent">Fechar ✕</button>
        </div>
        {p.videoSrc ? (
          <video src={p.videoSrc} poster={p.videoPoster} controls autoPlay playsInline preload="auto" className="min-h-0 w-full flex-1 bg-black object-contain" />
        ) : src && <iframe src={src} title={p.title} allow="autoplay; encrypted-media; picture-in-picture; clipboard-write" allowFullScreen className="min-h-0 w-full flex-1 border-0 bg-bone" />}
      </motion.div>
    </motion.div>
  );
}

function ObraCard({ p, i, mobile = false, onOpen, onHover }: { p: Post; i: number; mobile?: boolean; onOpen: (p: Post) => void; onHover?: (on: boolean) => void }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 18 });
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(p)}
      aria-label={`Assistir: ${p.title}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => { mx.set(0); my.set(0); onHover?.(false); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className={mobile ? "group relative block w-full cursor-pointer text-left" : `group relative block cursor-pointer text-left w-[min(36vw,40svh)] shrink-0 ${i % 2 ? "mt-10" : ""}`}
    >
      <div className={mobile ? "relative aspect-[4/5] overflow-hidden bg-forest" : "relative h-[32svh] overflow-hidden bg-forest"}>
        <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-transparent" />
        {p.video && <span className="label-mono absolute right-5 top-5 border border-bone/40 px-3 py-1.5 text-bone backdrop-blur-sm md:[@media(pointer:fine)]:hidden">▶ Assistir</span>}
        <span className="display absolute -bottom-6 left-4 text-[9rem] text-outline opacity-60">{String(i + 1).padStart(2, "0")}</span>
      </div>
      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-t border-forest-line pt-5">
        <div className="min-w-0">
          <p className="label-mono mb-2 text-accent">{p.tag}</p>
          <h3 className={mobile ? "display text-2xl leading-tight [overflow-wrap:anywhere]" : "display text-2xl"}>{p.title}</h3>
        </div>
        <span className="label-mono whitespace-nowrap text-bone/50">{p.date}</span>
      </div>
    </motion.button>
  );
}

function ObrasMobile({ onOpen }: { onOpen: (p: Post) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const total = obras.length + 1;
  return (
    <div className="md:hidden">
      <div
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          const card = el.firstElementChild as HTMLElement | null;
          if (!card) return;
          setActive(Math.min(total - 1, Math.round(el.scrollLeft / (card.offsetWidth + 20))));
        }}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-4"
      >
        {obras.map((p, i) => (
          <div key={p.url} className={`w-[82vw] shrink-0 snap-start origin-left transition-[opacity,transform] duration-500 ${i === active ? "opacity-100" : "scale-[0.94] opacity-45"}`}>
            <ObraCard p={p} i={i} mobile onOpen={onOpen} />
          </div>
        ))}
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`flex w-[82vw] shrink-0 snap-start flex-col justify-center border-l border-forest-line pl-8 transition-opacity duration-500 ${active === obras.length ? "opacity-100" : "opacity-45"}`}>
          <span className="label-mono mb-6 text-accent">Acompanhe</span>
          <span className="display text-4xl leading-tight">Todas as obras no Instagram ↗</span>
        </a>
      </div>
      <div className="mt-6 flex justify-center gap-2" aria-hidden>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={`h-px transition-all duration-500 ${i === active ? "w-8 bg-accent" : "w-3 bg-bone/30"}`} />
        ))}
      </div>
    </div>
  );
}

function Obras() {
  const ref = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [open, setOpen] = useState<Post | null>(null);
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const measure = () => setTravel(Math.max(0, track.scrollWidth - viewport.clientWidth));
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    measure();
    return () => observer.disconnect();
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  // Os cards "inclinam" com a velocidade da rolagem, como se tivessem peso.
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const skew = useSpring(useTransform(useVelocity(scrollY), [-2500, 2500], reduced ? [0, 0] : [5, -5]), { stiffness: 300, damping: 45 });
  // Cursor "Assistir" que acompanha o mouse sobre os cards.
  const [hot, setHot] = useState(false);
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const csx = useSpring(cx, { stiffness: 500, damping: 40 });
  const csy = useSpring(cy, { stiffness: 500, damping: 40 });
  const header = (
    <div className="mx-auto mb-12 flex w-full max-w-[1600px] items-end justify-between px-6 md:px-12">
      <div>
        <p className="label-mono mb-6 text-accent">(02) — Canteiro</p>
        <h2 className="display mobile-heading text-[clamp(3rem,7vw,7rem)]">Obras <span className="italic text-accent">em curso</span></h2>
      </div>
      <div className="hidden w-64 md:block">
        <p className="label-mono mb-3 text-bone/50">Direto do @zordanengenharia</p>
        <div className="h-px w-full bg-forest-line"><motion.div style={{ width: progress }} className="h-px bg-accent" /></div>
      </div>
    </div>
  );
  return (
    <section id="obras" className="relative bg-forest text-bone">
      <AnimatePresence>{open && <ReelModal key={open.url} p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
      {/* Mobile: carrossel nativo, sem travar a rolagem */}
      <div className="grain py-20 md:hidden">
        {header}
        <ObrasMobile onOpen={setOpen} />
      </div>
      {/* Desktop: rolagem vertical vira movimento horizontal (sem bloquear a página) */}
      <div ref={ref} className="hidden h-[300vh] md:block" onPointerMove={(e) => { cx.set(e.clientX); cy.set(e.clientY); }}>
        <div ref={viewportRef} className="grain sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-24 pb-8">
          {header}
          <motion.div ref={trackRef} style={{ x, skewX: skew }} className="flex w-max shrink-0 gap-16 px-12 will-change-transform">
            {obras.map((p, i) => <ObraCard key={p.url} p={p} i={i} onOpen={setOpen} onHover={(on) => setHot(on && !!p.video)} />)}
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="group flex w-[30vw] shrink-0 flex-col justify-center border-l border-forest-line pl-12">
              <span className="label-mono mb-6 text-accent">Acompanhe</span>
              <span className="display text-6xl transition-colors group-hover:text-accent">Todas as obras no Instagram ↗</span>
            </a>
          </motion.div>
        </div>
        <motion.div aria-hidden style={{ left: csx, top: csy }} initial={false}
          animate={{ scale: hot && !open ? 1 : 0, opacity: hot && !open ? 1 : 0 }} transition={{ duration: 0.3, ease }}
          className="label-mono pointer-events-none fixed z-[70] grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center bg-accent text-center text-forest-deep [@media(pointer:coarse)]:hidden">
          ▶<br />Assistir
        </motion.div>
      </div>
    </section>
  );
}

function Metodo() {
  return (
    <section id="metodo" className="bg-background">
      <MetodoVideo />
      <ParceriaMarquee />
      <MetodoConstrucao />
    </section>
  );
}

function Patrocinio() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [110, -110]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const y3 = useTransform(scrollYProgress, [0, 1], [140, -140]);
  const big = useTransform(scrollYProgress, [0, 1], ["10%", "-30%"]);
  return (
    <section ref={ref} className="grain relative overflow-hidden bg-forest-deep py-20 text-bone md:py-48">
      <motion.p style={{ x: big }} className="display pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[22vw] italic text-bone/[0.04]">
        Beach Tennis · Beach Tennis
      </motion.p>
      <div className="relative mx-auto grid max-w-[1600px] items-center gap-12 px-6 md:grid-cols-2 md:gap-20 md:px-12">
        <div>
          <p className="label-mono mb-8 text-accent">(05) — Além da obra</p>
          <h2 className="display mobile-heading text-[clamp(2.5rem,5.5vw,5.5rem)]">A mesma garra, <span className="italic text-accent">dentro e fora</span> do canteiro.</h2>
          <p className="mt-10 max-w-md text-lg font-light leading-relaxed text-bone/70">
            A Zordan Engenharia patrocina o atleta de beach tennis Dani Mola — porque disciplina, técnica e constância constroem resultados em qualquer terreno.
          </p>
          <a href={patrocinio[0]!.url} target="_blank" rel="noreferrer" className="label-mono mt-12 inline-flex items-center gap-4 border-b border-accent pb-2 text-accent">
            Acompanhe o atleta ↗
          </a>
        </div>
        <div className="patrocinio-gallery relative grid grid-cols-2 items-start gap-4 md:block md:h-[620px]">
          {[[patrocinio[1]!, y1, "left-0 top-10 w-[52%] z-10"], [patrocinio[0]!, y2, "right-0 top-0 w-[56%]"], [patrocinio[3]!, y3, "left-[22%] bottom-0 w-[44%] z-20"]].map(([p, y, cls], i) => (
            <motion.a key={i} href={(p as Post).url} target="_blank" rel="noreferrer" style={{ y: y as never }} className={`patrocinio-image absolute block shadow-[0_40px_80px_-20px_oklch(0_0_0/0.6)] ${cls as string}`}>
              <img src={(p as Post).img} alt={(p as Post).title} loading="lazy" className="aspect-[4/5] w-full object-cover" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Novidades() {
  const list = [...obras.slice(0, 3), patrocinio[2]!, ...datas];
  const [hover, setHover] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 25 });
  const sy = useSpring(my, { stiffness: 200, damping: 25 });
  return (
    <section id="novidades" className="relative bg-background py-20 md:py-44" onMouseMove={(e) => { mx.set(e.clientX); my.set(e.clientY); }}>
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="mb-12 grid gap-6 md:mb-20 md:flex md:items-end md:justify-between md:gap-8">
          <div className="min-w-0">
            <p className="label-mono mb-6 text-muted-foreground">(04) — Diário de obra</p>
            <h2 className="display mobile-heading text-[clamp(3rem,7vw,7rem)] text-primary">Novi<span className="italic text-accent">dades</span></h2>
          </div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="label-mono w-fit border-b border-primary py-3 text-primary md:pb-1 md:pt-0">@zordanengenharia ↗</a>
        </div>
        <ul className="border-t border-primary" onMouseLeave={() => setHover(null)}>
          {list.map((p, i) => (
            <li key={p.url + i}>
              <a href={p.url} target="_blank" rel="noreferrer" onMouseEnter={() => setHover(i)} className="group grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-x-4 gap-y-2 border-b border-border py-5 transition-colors duration-500 active:bg-primary/5 md:grid-cols-[6rem_minmax(0,1fr)_14rem_10rem] md:items-center md:gap-6 md:px-4 md:py-8 md:hover:bg-primary md:hover:text-primary-foreground">
                <img src={p.img} alt="" loading="lazy" className="row-span-2 aspect-square w-full object-cover md:hidden" />
                <span className="label-mono hidden text-muted-foreground group-hover:text-accent md:block">{String(i + 1).padStart(2, "0")}</span>
                <span className="display min-w-0 text-[1.375rem] leading-tight [overflow-wrap:anywhere] transition-transform duration-500 md:text-5xl md:leading-[0.92] md:group-hover:translate-x-4">{p.title}</span>
                <span className="label-mono hidden text-muted-foreground group-hover:text-primary-foreground/70 md:block">{p.tag}</span>
                <span className="label-mono col-start-2 text-muted-foreground md:col-start-auto md:text-right md:group-hover:text-primary-foreground/70">{p.date} <span className="md:hidden">· {p.tag}</span></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <motion.div
        style={{ left: sx, top: sy }}
        animate={{ opacity: hover === null ? 0 : 1, scale: hover === null ? 0.8 : 1 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none fixed z-40 hidden h-72 w-56 -translate-x-1/2 -translate-y-1/2 overflow-hidden md:block"
      >
        {hover !== null && <img src={list[hover]!.img} alt="" className="h-full w-full object-cover" />}
      </motion.div>
    </section>
  );
}

function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const magnetic = useMagnetic(0.12);
  return (
    <footer ref={ref} className="grain relative overflow-hidden bg-forest-deep text-bone">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div aria-hidden="true" className="border-t border-forest-line pb-20 md:pb-32" />
        <Reveal>
          <p className="label-mono mb-8 text-accent">Vamos construir</p>
          <motion.a {...magnetic} href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="group display mobile-heading block w-fit text-[clamp(3rem,8vw,9rem)]">
            Seu próximo <span className="italic text-accent">projeto</span>
            <span className="inline-block transition-transform duration-700 group-hover:-translate-y-6 group-hover:translate-x-6"> ↗</span>
          </motion.a>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-8 border-t border-forest-line py-10 [&>*]:min-w-0 md:mt-24 md:grid-cols-4 md:gap-10 md:py-12">
          <div className="col-span-2 md:col-span-1"><Logo /></div>
          <div className="col-span-2 md:col-span-1">
            <p className="label-mono mb-3 text-bone/40">Instagram</p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-accent">@zordanengenharia</a>
            <p className="label-mono mb-3 mt-6 text-bone/40">WhatsApp</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-3 text-accent transition-colors hover:text-bone">
              <WhatsAppIcon />
              <span>+55 16 99107-8596 ↗</span>
            </a>
          </div>
          <div>
            <p className="label-mono mb-3 text-bone/40">Atuação</p>
            <p className="text-bone/80">Residencial · Infraestrutura · Loteamentos</p>
          </div>
          <p className="label-mono self-end text-right text-bone/40">© {new Date().getFullYear()} Zordan Engenharia</p>
        </div>
      </div>
      <p aria-hidden className="display pointer-events-none flex select-none justify-center overflow-hidden pb-6 text-[24vw] leading-[1.15] text-bone/[0.06]">
        {"ZORDAN".split("").map((ch, i) => <FooterLetter key={i} ch={ch} i={i} progress={scrollYProgress} />)}
      </p>
    </footer>
  );
}

function FooterLetter({ ch, i, progress }: { ch: string; i: number; progress: MotionValue<number> }) {
  const y = useTransform(progress, [0.35 + i * 0.05, 0.75 + i * 0.04], ["100%", "0%"]);
  return <motion.span style={{ y }} className="inline-block">{ch}</motion.span>;
}

function Index() {
  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;
    void startSmoothScroll().then((fn) => (cancelled ? fn() : (stop = fn)));
    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);
  return (
    <main className="bg-background">
      <Intro />
      <Nav />
      <Hero />
      <ParceriaMarquee light />
      <Manifesto />
      <ParceriaMarquee light />
      <Obras />
      <Metodo />
      <Novidades />
      <Patrocinio />
      <Footer />
    </main>
  );
}
