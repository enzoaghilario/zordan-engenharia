import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { useRef, useState, useEffect } from "react";
import hero from "@/assets/hero-residencia.jpg";
import detalhe from "@/assets/detalhe-fachada.jpg";
import { MetodoVideo } from "@/components/site/MetodoVideo";
import { Logo, ZordanMark } from "@/components/site/Logo";
import { Reveal, SplitWords } from "@/components/site/Reveal";
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

function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 80);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-bone transition-all duration-700 ${solid ? "border-b border-forest-line bg-forest-deep/80 py-4 backdrop-blur-xl" : "py-7"}`}
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:flex sm:justify-between sm:px-6 md:px-12">
        <a href="#topo" aria-label="Zordan Engenharia — início" className="min-w-0 min-h-11 content-center"><Logo className="nav-logo" /></a>
        <nav className="label-mono hidden gap-10 md:flex">
          {[["Manifesto", "#manifesto"], ["Obras", "#obras"], ["Método", "#metodo"], ["Novidades", "#novidades"]].map(([l, h]) => (
            <a key={h} href={h} className="group relative py-1">
              {l}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a href="https://wa.me/5516991078596" target="_blank" rel="noreferrer" className="label-mono flex min-h-11 shrink-0 items-center whitespace-nowrap border-b border-accent pb-1 text-accent transition-colors hover:text-bone">
          Fale conosco ↗
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.35]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  return (
    <section id="topo" ref={ref} className="grain relative min-h-svh overflow-hidden bg-forest-deep text-bone">
      <motion.img
        src={hero}
        alt="Residência de alto padrão ao entardecer"
        width={1920}
        height={1088}
        style={{ scale, y }}
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-transparent to-forest-deep/50" />

      <motion.div style={{ y: textY, opacity: fade }} className="relative mx-auto flex min-h-svh max-w-[1600px] flex-col justify-end px-6 pb-12 pt-36 md:px-12 md:pb-14">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }} className="label-mono mb-6 flex items-center gap-4 text-accent">
          <span className="h-px w-8 shrink-0 bg-accent md:w-16" /> Engenharia de alto padrão
        </motion.p>
        <h1 className="display hero-title max-w-6xl">
          {["Construímos", "o que", "permanece."].map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className={`block ${i === 1 ? "pl-[12vw] italic text-accent" : ""}`}
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.4, delay: 0.4 + i * 0.15, ease }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 1 }} className="mt-8 grid gap-6 border-t border-forest-line pt-6 md:grid-cols-[1fr_auto]">
          <p className="max-w-md text-base font-light leading-relaxed text-bone/75 md:text-lg">
            Do movimento de terra à última pedra do acabamento — projetos executados com rigor técnico e a calma de quem constrói para gerações.
          </p>
          <a href="#obras" className="label-mono flex items-center gap-4 self-end">
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

function Marquee() {
  const words = ["Residências", "Infraestrutura", "Loteamentos", "Terraplenagem", "Fundações", "Gestão de obra"];
  return (
    <div className="overflow-hidden border-y border-border bg-background py-8">
      <div className="animate-marquee flex w-max gap-16 whitespace-nowrap">
        {[...words, ...words, ...words, ...words].map((w, i) => (
          <span key={i} className="display flex items-center gap-16 text-6xl text-primary md:text-7xl">
            <span className={i % 2 ? "italic" : ""}>{w}</span>
            <ZordanMark className="h-8 w-8 text-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const frameY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  return (
    <section id="manifesto" ref={ref} className="relative overflow-hidden bg-background py-20 md:py-48">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 md:grid-cols-12 md:gap-20 md:px-12">
        <div className="md:col-span-7">
          <p className="label-mono mb-10 text-muted-foreground">(01) — Manifesto</p>
          <h2 className="display mobile-heading text-[clamp(2.5rem,6vw,6rem)] text-primary">
            <SplitWords text="Engenharia é a arte de transformar" />
            <SplitWords text="ideias em obras" className="italic text-accent" />
            <SplitWords text="que atravessam o tempo." />
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
          <div className="relative aspect-[3/4] overflow-hidden">
            <motion.img src={detalhe} alt="Detalhe de fachada em travertino e madeira" loading="lazy" width={1024} height={1344} style={{ y: imgY, scale: 1.25 }} className="h-full w-full object-cover" />
          </div>
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      role="dialog" aria-modal="true" aria-label={p.title}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-deep/95 p-4 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="relative flex h-[min(88svh,820px)] w-[min(92vw,420px)] flex-col">
        <div className="mb-3 flex items-center justify-between gap-4 text-bone">
          <p className="label-mono min-w-0 truncate text-accent">{p.tag} — {p.title}</p>
          <button type="button" onClick={onClose} aria-label="Fechar vídeo" className="label-mono shrink-0 border border-bone/40 px-3 py-1.5 transition-colors hover:border-accent hover:text-accent">Fechar ✕</button>
        </div>
        {p.videoSrc ? (
          <video src={p.videoSrc} poster={p.videoPoster} controls autoPlay playsInline preload="auto" className="min-h-0 w-full flex-1 bg-black object-contain" />
        ) : src && <iframe src={src} title={p.title} allow="autoplay; encrypted-media; picture-in-picture; clipboard-write" allowFullScreen className="min-h-0 w-full flex-1 border-0 bg-bone" />}
      </div>
    </motion.div>
  );
}

function ObraCard({ p, i, mobile = false, onOpen }: { p: Post; i: number; mobile?: boolean; onOpen: (p: Post) => void }) {
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
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className={mobile ? "group relative block w-full cursor-pointer text-left" : `group relative block cursor-pointer text-left w-[min(36vw,40svh)] shrink-0 ${i % 2 ? "mt-10" : ""}`}
    >
      <div className={mobile ? "relative aspect-[4/5] overflow-hidden bg-forest" : "relative h-[32svh] overflow-hidden bg-forest"}>
        <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-transparent" />
        {p.video && <span className="label-mono absolute right-5 top-5 border border-bone/40 px-3 py-1.5 text-bone backdrop-blur-sm">▶ Assistir</span>}
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
          <div key={p.url} className="w-[82vw] shrink-0 snap-start">
            <ObraCard p={p} i={i} mobile onOpen={onOpen} />
          </div>
        ))}
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex w-[82vw] shrink-0 snap-start flex-col justify-center border-l border-forest-line pl-8">
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
      <div ref={ref} className="hidden h-[300vh] md:block">
        <div ref={viewportRef} className="grain sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-24 pb-8">
          {header}
          <motion.div ref={trackRef} style={{ x }} className="flex w-max shrink-0 gap-16 px-12 will-change-transform">
            {obras.map((p, i) => <ObraCard key={p.url} p={p} i={i} onOpen={setOpen} />)}
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="group flex w-[30vw] shrink-0 flex-col justify-center border-l border-forest-line pl-12">
              <span className="label-mono mb-6 text-accent">Acompanhe</span>
              <span className="display text-6xl transition-colors group-hover:text-accent">Todas as obras no Instagram ↗</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ParceriaMarquee({ light = false }: { light?: boolean }) {
  return (
    <div className={`w-full min-w-0 overflow-hidden border-y py-5 md:py-7 ${light ? "border-border bg-background text-primary" : "border-forest-line bg-forest-deep text-bone"}`} aria-label="Zordan Engenharia em parceria com o Grupo Kurihara e Figueiredo">
      <div className="parceria-track animate-marquee flex w-max items-center whitespace-nowrap" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="flex items-center gap-6 pr-6 md:gap-10 md:pr-10">
            <span className={`label-mono ${light ? "text-primary" : "text-accent"}`}>Em parceria com</span>
            <Logo className="shrink-0" />
            <span className={`display text-2xl md:text-3xl ${light ? "text-primary" : "text-accent"}`}>×</span>
            <span className="display text-2xl italic md:text-4xl">Grupo Kurihara <span className={light ? "text-primary" : "text-accent"}>&amp;</span> Figueiredo</span>
            <span className={light ? "text-primary" : "text-accent"}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Metodo() {
  const steps = [
    ["Estudo", "Leitura do terreno, viabilidade técnica e planejamento de custos com total transparência."],
    ["Projeto", "Compatibilização de estrutura, instalações e arquitetura antes do primeiro metro cúbico."],
    ["Execução", "Equipe própria, cronograma rigoroso e controle tecnológico em cada etapa."],
    ["Entrega", "Vistoria minuciosa, documentação completa e acompanhamento pós-obra."],
  ];
  return (
    <section id="metodo" className="bg-background">
      <MetodoVideo />
      <ParceriaMarquee />
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-32">
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-2 md:gap-10">
          <p className="label-mono text-primary">(03) — Método</p>
          <h2 className="display mobile-heading text-[clamp(2.75rem,6vw,6rem)] text-primary">Quatro tempos. <span className="italic text-accent">Nenhum improviso.</span></h2>
        </div>
        <div className="grid grid-cols-2 border-t border-primary md:grid-cols-4">
          {steps.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.1} className="group relative min-w-0 border-b border-border py-6 odd:border-r odd:pr-4 even:pl-4 md:odd:pr-0 md:even:pl-0 md:border-b-0 md:border-r md:px-8 md:py-12 md:first:pl-0 md:last:border-r-0">
              <span className="display block text-5xl text-outline transition-colors duration-700 group-hover:text-accent md:text-[7rem]">{i + 1}</span>
              <h3 className="display mt-3 text-3xl text-primary md:mt-6 md:text-4xl">{t}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground md:mt-4 md:text-base">{d}</p>
              <span className="absolute left-0 top-0 h-[3px] w-0 bg-accent transition-all duration-700 group-hover:w-full" />
            </Reveal>
          ))}
        </div>
      </div>
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
              <a href={p.url} target="_blank" rel="noreferrer" onMouseEnter={() => setHover(i)} className="group grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-3 gap-y-2 border-b border-border py-6 transition-colors duration-500 hover:bg-primary hover:text-primary-foreground md:grid-cols-[6rem_minmax(0,1fr)_14rem_10rem] md:items-center md:gap-6 md:px-4 md:py-8">
                <span className="label-mono text-muted-foreground group-hover:text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="display min-w-0 text-2xl leading-tight [overflow-wrap:anywhere] transition-transform duration-500 md:leading-[0.92] md:group-hover:translate-x-4 md:text-5xl">{p.title}</span>
                <span className="label-mono hidden text-muted-foreground group-hover:text-primary-foreground/70 md:block">{p.tag}</span>
                <span className="label-mono col-start-2 text-muted-foreground group-hover:text-primary-foreground/70 md:col-start-auto md:text-right">{p.date}</span>
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
  return (
    <footer className="grain relative overflow-hidden bg-forest-deep text-bone">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div aria-hidden="true" className="border-t border-forest-line pb-20 md:pb-32" />
        <Reveal>
          <p className="label-mono mb-8 text-accent">Vamos construir</p>
          <a href="https://wa.me/5516991078596" target="_blank" rel="noreferrer" className="group display mobile-heading block text-[clamp(3rem,8vw,9rem)]">
            Seu próximo <span className="italic text-accent">projeto</span>
            <span className="inline-block transition-transform duration-700 group-hover:translate-x-6 group-hover:-translate-y-6"> ↗</span>
          </a>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-8 border-t border-forest-line py-10 [&>*]:min-w-0 md:mt-24 md:grid-cols-4 md:gap-10 md:py-12">
          <div className="col-span-2 md:col-span-1"><Logo /></div>
          <div className="col-span-2 md:col-span-1">
            <p className="label-mono mb-3 text-bone/40">Instagram</p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-accent">@zordanengenharia</a>
            <p className="label-mono mb-3 mt-6 text-bone/40">WhatsApp</p>
            <a href="https://wa.me/5516991078596" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-accent transition-colors hover:text-bone">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true">
                <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.47 0 .12 5.35.12 11.93c0 2.1.55 4.15 1.6 5.96L0 24l6.25-1.64a11.94 11.94 0 0 0 5.8 1.48h.01c6.58 0 11.93-5.35 11.94-11.93a11.86 11.86 0 0 0-3.48-8.43ZM12.06 21.83a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.87 9.87 0 0 1-1.52-5.29c0-5.47 4.45-9.92 9.92-9.92a9.85 9.85 0 0 1 7.02 2.91 9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.92-9.95 9.89Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.49-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
              </svg>
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
      <p className="display pointer-events-none select-none pb-6 text-center text-[24vw] leading-[1.15] text-bone/[0.06]">ZORDAN</p>
    </footer>
  );
}

function Index() {
  return (
    <main className="bg-background">
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
