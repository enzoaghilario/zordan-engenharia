import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { useRef, useState, useEffect } from "react";
import hero from "@/assets/hero-residencia.jpg";
import detalhe from "@/assets/detalhe-fachada.jpg";
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
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-12">
        <a href="#topo"><Logo /></a>
        <nav className="label-mono hidden gap-10 md:flex">
          {[["Manifesto", "#manifesto"], ["Obras", "#obras"], ["Método", "#metodo"], ["Novidades", "#novidades"]].map(([l, h]) => (
            <a key={h} href={h} className="group relative py-1">
              {l}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="label-mono border-b border-accent pb-1 text-accent transition-colors hover:text-bone">
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
    <section id="topo" ref={ref} className="grain relative h-[110svh] overflow-hidden bg-forest-deep text-bone">
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

      <motion.div style={{ y: textY, opacity: fade }} className="relative mx-auto flex h-svh max-w-[1600px] flex-col justify-end px-6 pb-24 md:px-12">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }} className="label-mono mb-8 flex items-center gap-4 text-accent">
          <span className="h-px w-16 bg-accent" /> Engenharia de alto padrão
        </motion.p>
        <h1 className="display max-w-6xl text-[clamp(3.5rem,11vw,11rem)]">
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 1 }} className="mt-14 grid gap-8 border-t border-forest-line pt-8 md:grid-cols-[1fr_auto]">
          <p className="max-w-md text-lg font-light leading-relaxed text-bone/75">
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
    <section id="manifesto" ref={ref} className="relative overflow-hidden bg-background py-32 md:py-48">
      <div className="mx-auto grid max-w-[1600px] gap-20 px-6 md:grid-cols-12 md:px-12">
        <div className="md:col-span-7">
          <p className="label-mono mb-10 text-muted-foreground">(01) — Manifesto</p>
          <h2 className="display text-[clamp(2.5rem,6vw,6rem)] text-primary">
            <SplitWords text="Engenharia é a arte de transformar" />
            <SplitWords text="ideias em obras" className="italic text-accent" />
            <SplitWords text="que atravessam o tempo." />
          </h2>
          <div className="mt-20 grid gap-0 border-t border-border sm:grid-cols-3">
            {[
              ["Precisão", "Cada etapa medida, verificada e documentada."],
              ["Solidez", "Bases sólidas — no concreto e nas relações."],
              ["Permanência", "Obras pensadas para gerações, não para estações."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.12} className="border-b border-border py-8 sm:border-b-0 sm:border-r sm:pr-8 sm:last:border-r-0 sm:[&:not(:first-child)]:pl-8">
                <p className="label-mono mb-4 text-accent">0{i + 1}</p>
                <h3 className="display mb-3 text-3xl text-primary">{t}</h3>
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

function ObraCard({ p, i }: { p: Post; i: number }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 18 });
  return (
    <motion.a
      href={p.url}
      target="_blank"
      rel="noreferrer"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className={`group relative block w-[78vw] shrink-0 sm:w-[46vw] lg:w-[30vw] ${i % 2 ? "mt-24" : ""}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-forest">
        <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-transparent" />
        {p.video && <span className="label-mono absolute right-5 top-5 border border-bone/40 px-3 py-1.5 text-bone backdrop-blur-sm">▶ Reel</span>}
        <span className="display absolute -bottom-6 left-4 text-[9rem] text-outline opacity-60">{String(i + 1).padStart(2, "0")}</span>
      </div>
      <div className="mt-6 flex items-start justify-between gap-6 border-t border-forest-line pt-5">
        <div>
          <p className="label-mono mb-2 text-accent">{p.tag}</p>
          <h3 className="display text-3xl">{p.title}</h3>
        </div>
        <span className="label-mono whitespace-nowrap text-bone/50">{p.date}</span>
      </div>
    </motion.a>
  );
}

function Obras() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section id="obras" ref={ref} className="relative h-[320vh] bg-forest text-bone">
      <div className="grain sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-12 flex w-full max-w-[1600px] items-end justify-between px-6 md:px-12">
          <div>
            <p className="label-mono mb-6 text-accent">(02) — Canteiro</p>
            <h2 className="display text-[clamp(3rem,7vw,7rem)]">Obras <span className="italic text-accent">em curso</span></h2>
          </div>
          <div className="hidden w-64 md:block">
            <p className="label-mono mb-3 text-bone/50">Direto do @zordanengenharia</p>
            <div className="h-px w-full bg-forest-line"><motion.div style={{ width: progress }} className="h-px bg-accent" /></div>
          </div>
        </div>
        <motion.div style={{ x }} className="flex gap-10 pl-6 md:gap-16 md:pl-12">
          {obras.map((p, i) => <ObraCard key={p.url} p={p} i={i} />)}
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="group flex w-[60vw] shrink-0 flex-col justify-center border-l border-forest-line pl-12 sm:w-[30vw]">
            <span className="label-mono mb-6 text-accent">Acompanhe</span>
            <span className="display text-6xl transition-colors group-hover:text-accent">Todas as obras no Instagram ↗</span>
          </a>
        </motion.div>
      </div>
    </section>
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
    <section id="metodo" className="bg-background py-32 md:py-44">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="mb-24 grid gap-10 md:grid-cols-2">
          <p className="label-mono text-muted-foreground">(03) — Método</p>
          <h2 className="display text-[clamp(2.5rem,5vw,5rem)] text-primary">Quatro tempos. <span className="italic text-accent">Nenhum improviso.</span></h2>
        </div>
        <div className="grid border-t border-primary md:grid-cols-4">
          {steps.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.1} className="group relative border-b border-border py-12 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
              <span className="display block text-[7rem] text-outline transition-colors duration-700 group-hover:text-accent">{i + 1}</span>
              <h3 className="display mt-6 text-4xl text-primary">{t}</h3>
              <p className="mt-4 max-w-xs leading-relaxed text-muted-foreground">{d}</p>
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
  const y1 = useTransform(scrollYProgress, [0, 1], [180, -180]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const y3 = useTransform(scrollYProgress, [0, 1], [260, -260]);
  const big = useTransform(scrollYProgress, [0, 1], ["10%", "-30%"]);
  return (
    <section ref={ref} className="grain relative overflow-hidden bg-forest-deep py-32 text-bone md:py-48">
      <motion.p style={{ x: big }} className="display pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[22vw] italic text-bone/[0.04]">
        Beach Tennis · Beach Tennis
      </motion.p>
      <div className="relative mx-auto grid max-w-[1600px] items-center gap-20 px-6 md:grid-cols-2 md:px-12">
        <div>
          <p className="label-mono mb-8 text-accent">(04) — Além da obra</p>
          <h2 className="display text-[clamp(2.5rem,5.5vw,5.5rem)]">A mesma garra, <span className="italic text-accent">dentro e fora</span> do canteiro.</h2>
          <p className="mt-10 max-w-md text-lg font-light leading-relaxed text-bone/70">
            A Zordan Engenharia patrocina o atleta de beach tennis Dani Mola — porque disciplina, técnica e constância constroem resultados em qualquer terreno.
          </p>
          <a href={patrocinio[0]!.url} target="_blank" rel="noreferrer" className="label-mono mt-12 inline-flex items-center gap-4 border-b border-accent pb-2 text-accent">
            Acompanhe o atleta ↗
          </a>
        </div>
        <div className="relative h-[620px]">
          {[[patrocinio[1]!, y1, "left-0 top-10 w-[52%] z-10"], [patrocinio[0]!, y2, "right-0 top-0 w-[56%]"], [patrocinio[3]!, y3, "left-[22%] bottom-0 w-[44%] z-20"]].map(([p, y, cls], i) => (
            <motion.a key={i} href={(p as Post).url} target="_blank" rel="noreferrer" style={{ y: y as never }} className={`absolute block shadow-[0_40px_80px_-20px_oklch(0_0_0/0.6)] ${cls as string}`}>
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
    <section id="novidades" className="relative bg-background py-32 md:py-44" onMouseMove={(e) => { mx.set(e.clientX); my.set(e.clientY); }}>
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="mb-20 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="label-mono mb-6 text-muted-foreground">(05) — Diário de obra</p>
            <h2 className="display text-[clamp(3rem,7vw,7rem)] text-primary">Novi<span className="italic text-accent">dades</span></h2>
          </div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="label-mono border-b border-primary pb-1 text-primary">@zordanengenharia ↗</a>
        </div>
        <ul className="border-t border-primary" onMouseLeave={() => setHover(null)}>
          {list.map((p, i) => (
            <li key={p.url + i}>
              <a href={p.url} target="_blank" rel="noreferrer" onMouseEnter={() => setHover(i)} className="group grid grid-cols-[3rem_1fr_auto] items-center gap-6 border-b border-border py-8 transition-colors duration-500 hover:bg-primary hover:text-primary-foreground md:grid-cols-[6rem_1fr_14rem_10rem] md:px-4">
                <span className="label-mono text-muted-foreground group-hover:text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-2xl transition-transform duration-500 group-hover:translate-x-4 md:text-5xl">{p.title}</span>
                <span className="label-mono hidden text-muted-foreground group-hover:text-primary-foreground/70 md:block">{p.tag}</span>
                <span className="label-mono text-right text-muted-foreground group-hover:text-primary-foreground/70">{p.date}</span>
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
    <footer className="grain relative overflow-hidden bg-forest-deep pt-32 text-bone">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <Reveal>
          <p className="label-mono mb-8 text-accent">Vamos construir</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="group display block text-[clamp(3rem,8vw,9rem)]">
            Seu próximo <span className="italic text-accent">projeto</span>
            <span className="inline-block transition-transform duration-700 group-hover:translate-x-6 group-hover:-translate-y-6"> ↗</span>
          </a>
        </Reveal>
        <div className="mt-24 grid gap-10 border-t border-forest-line py-12 md:grid-cols-4">
          <Logo />
          <div>
            <p className="label-mono mb-3 text-bone/40">Instagram</p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-accent">@zordanengenharia</a>
          </div>
          <div>
            <p className="label-mono mb-3 text-bone/40">Atuação</p>
            <p className="text-bone/80">Residencial · Infraestrutura · Loteamentos</p>
          </div>
          <p className="label-mono text-bone/40 md:text-right">© {new Date().getFullYear()} Zordan Engenharia</p>
        </div>
      </div>
      <p className="display pointer-events-none -mb-[0.2em] select-none text-center text-[24vw] leading-none text-bone/[0.06]">ZORDAN</p>
    </footer>
  );
}

function Index() {
  return (
    <main className="bg-background">
      <Nav />
      <Hero />
      <Marquee />
      <Manifesto />
      <Obras />
      <Metodo />
      <Patrocinio />
      <Novidades />
      <Footer />
    </main>
  );
}
