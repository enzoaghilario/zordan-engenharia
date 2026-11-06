import * as THREE from "three";
import { cameraAt, easeOutBack, easeOutCubic, window01 } from "./obra-timeline";

/**
 * Maquete 3D de uma residência de alto padrão que se constrói conforme a rolagem:
 * Estudo (terreno, gabarito) → Projeto (traço) → Execução (estrutura) → Entrega (acabamentos).
 * Estética de maquete branca de arquitetura sobre o fundo claro do site.
 */

type Anim = (p: number) => void;
export type ObraScene = {
  setProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  resize: (w: number, h: number) => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
};

const C = {
  bg: 0xf6f7f3,
  concrete: 0xeeede6,
  concreteDark: 0xe2e1d8,
  travertine: 0xd8ccb4,
  wood: 0x8f6a47,
  glass: 0x2a4c3f,
  primary: 0x0c3722,
  accent: 0x7bb587,
  water: 0x63a893,
  glow: 0xffd49a,
  tree: 0xa7c4a1,
};

export function createObraScene(canvas: HTMLCanvasElement, opts: { mobile: boolean; reducedMotion: boolean }): ObraScene {
  const { mobile, reducedMotion } = opts;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(C.bg, 40, 85);
  const camera = new THREE.PerspectiveCamera(mobile ? 40 : 30, 1, 0.1, 200);

  // Luz: céu suave + sol baixo vindo da frente-esquerda (sombras longas para trás).
  scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe6dc, 1.5));
  const sun = new THREE.DirectionalLight(0xfff1df, 2.4);
  sun.position.set(-10, 20, 14);
  sun.castShadow = true;
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  const sc = sun.shadow.camera;
  sc.left = -20; sc.right = 20; sc.top = 20; sc.bottom = -20; sc.near = 1; sc.far = 60;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.ShadowMaterial({ color: C.primary, opacity: 0.13 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const anims: Anim[] = [];
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(o: T) => (disposables.push(o), o);

  const mat = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
    track(new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0, ...extra }));
  const lineMat = (color: number, opacity: number) => track(new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));

  const M = {
    concrete: mat(C.concrete),
    concreteDark: mat(C.concreteDark),
    travertine: mat(C.travertine, { roughness: 0.85 }),
    wood: mat(C.wood, { roughness: 0.7 }),
    stakeTip: mat(C.accent, { roughness: 0.6 }),
    stake: mat(C.primary, { roughness: 0.6 }),
    tree: mat(C.tree, { roughness: 1, flatShading: true }),
  };

  /** Caixa com a base no chão local (para crescer de baixo para cima). */
  function block(w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number) {
    const g = track(new THREE.BoxGeometry(w, h, d));
    g.translate(0, h / 2, 0);
    const m = new THREE.Mesh(g, material);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  }
  const growY = (o: THREE.Object3D, from: number, to: number, ease = easeOutCubic) => {
    anims.push((p) => {
      const t = ease(window01(p, from, to));
      o.visible = t > 0.002;
      o.scale.y = Math.max(0.002, t);
    });
  };
  const drop = (o: THREE.Object3D, from: number, to: number, height = 5) => {
    const base = o.position.y;
    anims.push((p) => {
      const t = window01(p, from, to);
      o.visible = t > 0.002;
      o.position.y = base + (1 - easeOutCubic(t)) * height;
    });
  };
  const fade = (m: THREE.Material & { opacity: number }, from: number, to: number, max: number, out?: [number, number, number]) => {
    anims.push((p) => {
      let o = window01(p, from, to) * max;
      if (out) o = o + (out[2] - o) * window01(p, out[0], out[1]);
      m.opacity = o;
      m.visible = o > 0.003;
    });
  };
  const drawLines = (segments: number[], material: THREE.LineBasicMaterial, from: number, to: number, dashed = false) => {
    const g = track(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
    const lines = new THREE.LineSegments(g, material);
    if (dashed) lines.computeLineDistances();
    scene.add(lines);
    const count = segments.length / 3;
    anims.push((p) => {
      const t = easeOutCubic(window01(p, from, to));
      const n = Math.floor((count * t) / 2) * 2;
      g.setDrawRange(0, n);
      lines.visible = n > 0;
    });
    return lines;
  };

  // ───────────── 01 · ESTUDO — malha de levantamento, curvas de nível e gabarito ─────────────
  const grid: number[] = [];
  const R = 15;
  for (let k = 0; k <= R; k++) {
    for (const s of k === 0 ? [0] : [k, -k]) {
      grid.push(s, 0.005, -R, s, 0.005, R);
      grid.push(-R, 0.005, s, R, 0.005, s);
    }
  }
  const gridMat = lineMat(C.primary, 0.1);
  drawLines(grid, gridMat, -1, 0); // a malha já está lá quando a seção chega
  fade(gridMat, -1, 0, 0.1, [0.8, 0.95, 0.045]);

  const contours: number[] = [];
  const hill = new THREE.Vector2(-15, -13);
  for (let r = 0; r < 6; r++) {
    const radius = 3 + r * 2.2;
    const steps = 90;
    let prev: [number, number] | null = null;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const wobble = 1 + 0.12 * Math.sin(a * 3 + r) + 0.06 * Math.sin(a * 7 - r * 2);
      const x = hill.x + Math.cos(a) * radius * wobble * 1.25;
      const z = hill.y + Math.sin(a) * radius * wobble;
      if (prev) contours.push(prev[0], 0.01, prev[1], x, 0.01, z);
      prev = [x, z];
    }
  }
  const contourMat = lineMat(C.primary, 0.2);
  drawLines(contours, contourMat, 0.03, 0.2);

  const plotMat = track(new THREE.LineDashedMaterial({ color: C.accent, dashSize: 0.5, gapSize: 0.3, transparent: true, opacity: 0.9, depthWrite: false }));
  const plot = [-10, -7.5, 11, -7.5, 11, -7.5, 11, 10, 11, 10, -10, 10, -10, 10, -10, -7.5].flatMap((v, i) => (i % 2 === 0 ? [v] : [0.02, v]));
  drawLines(plot, plotMat as unknown as THREE.LineBasicMaterial, 0.04, 0.16, true);

  const stakeSpots = [[-10, -7.5], [11, -7.5], [11, 10], [-10, 10], [-7.3, -4.8], [9.4, -4.8], [9.4, 4.8], [-7.3, 4.8]];
  stakeSpots.forEach(([x, z], i) => {
    const g = new THREE.Group();
    const pole = new THREE.Mesh(track(new THREE.CylinderGeometry(0.04, 0.04, 1.3, 6).translate(0, 0.65, 0)), M.stake);
    const tip = new THREE.Mesh(track(new THREE.BoxGeometry(0.16, 0.16, 0.16).translate(0, 1.35, 0)), M.stakeTip);
    pole.castShadow = tip.castShadow = true;
    g.add(pole, tip);
    g.position.set(x!, 0, z!);
    scene.add(g);
    growY(g, 0.08 + i * 0.012, 0.16 + i * 0.012, easeOutBack);
    // Gabarito some quando a obra assume o terreno.
    anims.push((p) => {
      const out = window01(p, 0.5, 0.58);
      if (out > 0) g.scale.setScalar(Math.max(0.002, 1 - out));
      else g.scale.x = g.scale.z = 1;
      if (out >= 1) g.visible = false;
    });
  });

  // ───────────── 02 · PROJETO — traço técnico da casa ─────────────
  const blueprint: number[] = [];
  const pushBoxEdges = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => {
    const e = new THREE.EdgesGeometry(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2));
    blueprint.push(...(e.getAttribute("position").array as Float32Array));
    e.dispose();
  };
  pushBoxEdges(-7.3, 6.3, 0, 0.4, -4.8, 4.8); // fundação
  pushBoxEdges(-6.5, 3, 0.4, 3.6, -4, 4); // térreo
  pushBoxEdges(-7, 9.4, 3.6, 3.98, -4.5, 4.5); // laje
  pushBoxEdges(-3.5, 8.6, 3.98, 6.98, -3.45, 3.8); // superior em balanço
  pushBoxEdges(-4.2, 9.8, 6.98, 7.34, -4, 4.3); // cobertura
  pushBoxEdges(-6.5, 3.5, 0, 0.18, 6.4, 9); // piscina
  // planta baixa (paredes internas)
  blueprint.push(-2.5, 0.42, -4, -2.5, 0.42, 1.2, -2.5, 0.42, 1.2, 0.5, 0.42, 1.2, 0.5, 0.42, -4, 0.5, 0.42, -1.5, -6.5, 0.42, -1.2, -4.3, 0.42, -1.2);
  // cotas
  const dim = (ax: number, az: number, bx: number, bz: number, ox: number, oz: number) => {
    blueprint.push(ax + ox, 0.02, az + oz, bx + ox, 0.02, bz + oz);
    blueprint.push(ax, 0.02, az, ax + ox * 1.2, 0.02, az + oz * 1.2, bx, 0.02, bz, bx + ox * 1.2, 0.02, bz + oz * 1.2);
  };
  dim(-7.3, 10.6, 9.4, 10.6, 0, 0.7);
  dim(11.6, -4.8, 11.6, 4.8, 0.7, 0);
  const blueprintMat = lineMat(C.primary, 0.85);
  drawLines(blueprint, blueprintMat, 0.25, 0.44);
  fade(blueprintMat, 0.25, 0.27, 0.85, [0.6, 0.82, 0]);

  // ───────────── 03 · EXECUÇÃO — estrutura sobe ─────────────
  const foundation = block(13.6, 0.4, 9.6, M.concreteDark, -0.5, 0, 0);
  growY(foundation, 0.47, 0.52);

  const groundCols: [number, number][] = [];
  for (const x of [-6.3, -3.2, -0.1, 2.8]) for (const z of [-3.8, 3.8]) groundCols.push([x, z]);
  groundCols.push([8.9, -4.1], [8.9, 4.1]);
  groundCols.forEach(([x, z], i) => growY(block(0.32, 3.2, 0.32, M.concrete, x, 0.4, z), 0.51 + i * 0.006, 0.56 + i * 0.006));

  const core = block(2, 6.58, 2.3, M.concrete, -5.3, 0.4, -2.65);
  growY(core, 0.53, 0.67);

  const slab1 = block(16.4, 0.38, 9, M.concrete, 1.2, 3.6, 0);
  drop(slab1, 0.585, 0.635);

  const upperCols: [number, number][] = [];
  for (const x of [-3.3, -0.1, 3, 6, 8.4]) for (const z of [-3.3, 3.5]) upperCols.push([x, z]);
  upperCols.forEach(([x, z], i) => growY(block(0.3, 3, 0.3, M.concrete, x, 3.98, z), 0.625 + i * 0.005, 0.67 + i * 0.005));

  const roof = block(14, 0.36, 8.3, M.concrete, 2.8, 6.98, 0.15);
  drop(roof, 0.675, 0.725);

  // ───────────── 04 · ENTREGA — acabamentos, vidro, madeira, água, luz ─────────────
  growY(block(9.5, 3.2, 0.25, M.travertine, -1.75, 0.4, -3.9), 0.75, 0.81);
  growY(block(0.25, 3.2, 7.8, M.travertine, -6.45, 0.4, 0), 0.76, 0.82);
  growY(block(12.1, 3, 0.2, M.concrete, 2.55, 3.98, -3.35), 0.77, 0.83);
  growY(block(0.2, 3, 7.1, M.concrete, -3.45, 3.98, 0.2), 0.775, 0.835);
  growY(block(0.2, 3, 7.1, M.concrete, 8.55, 3.98, 0.2), 0.78, 0.84);

  const glassMat = track(new THREE.MeshStandardMaterial({ color: C.glass, roughness: 0.08, metalness: 0.35, transparent: true, opacity: 0, depthWrite: false }));
  const glassFront = block(9.3, 3.2, 0.06, glassMat, -1.75, 0.4, 3.85);
  const glassSide = block(0.06, 3.2, 7.6, glassMat, 2.95, 0.4, 0);
  const glassUp = block(12, 3, 0.06, glassMat, 2.55, 3.98, 3.5);
  [glassFront, glassSide, glassUp].forEach((g) => (g.castShadow = false));
  fade(glassMat, 0.79, 0.87, 0.5);

  const glowMat = track(new THREE.MeshBasicMaterial({ color: C.glow, transparent: true, opacity: 0, depthWrite: false, fog: false }));
  const glowDown = block(9, 2.9, 7.2, glowMat, -1.7, 0.45, -0.1);
  const glowUp = block(11.6, 2.8, 6.4, glowMat, 2.55, 4.02, 0.05);
  [glowDown, glowUp].forEach((g) => { g.castShadow = false; g.receiveShadow = false; g.renderOrder = -1; });
  fade(glowMat, 0.9, 1, 0.42);

  // brise de madeira na fachada superior
  const slatCount = mobile ? 26 : 38;
  const slatGeo = track(new THREE.BoxGeometry(0.12, 3, 0.2).translate(0, 1.5, 0));
  const slats = new THREE.InstancedMesh(slatGeo, M.wood, slatCount);
  slats.castShadow = true;
  slats.receiveShadow = true;
  scene.add(slats);
  const dummy = new THREE.Object3D();
  const slatX = (i: number) => -3.35 + (i * 11.9) / (slatCount - 1);
  anims.push((p) => {
    let any = false;
    for (let i = 0; i < slatCount; i++) {
      const t = easeOutCubic(window01(p, 0.8 + i * 0.0018, 0.84 + i * 0.0018));
      if (t > 0.002) any = true;
      dummy.position.set(slatX(i), 3.98, 3.82);
      dummy.scale.set(1, Math.max(0.002, t), 1);
      dummy.updateMatrix();
      slats.setMatrixAt(i, dummy.matrix);
    }
    slats.instanceMatrix.needsUpdate = true;
    slats.visible = any;
  });

  growY(block(13.6, 0.16, 1.6, M.wood, -0.5, 0, 5.6), 0.83, 0.87);
  growY(block(10, 0.2, 2.6, M.travertine, -1.5, 0, 7.7), 0.84, 0.88);
  const waterMat = track(new THREE.MeshStandardMaterial({ color: C.water, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0, emissive: C.water, emissiveIntensity: 0.15 }));
  const water = new THREE.Mesh(track(new THREE.PlaneGeometry(9.2, 1.9)), waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(-1.5, 0.215, 7.7);
  water.receiveShadow = true;
  scene.add(water);
  fade(waterMat, 0.87, 0.93, 0.92);

  // árvores de maquete
  const trees: [number, number, number][] = [[-9.4, -1.5, 1.1], [-8.6, -6, 1.4], [6.8, 8.4, 1], [10.2, 6.6, 1.25], [4.6, -6.6, 0.9], [-4, -6.8, 1.15]];
  const trunkGeo = track(new THREE.CylinderGeometry(0.06, 0.08, 1.6, 6).translate(0, 0.8, 0));
  const crownGeo = track(new THREE.IcosahedronGeometry(1, 1).translate(0, 2.3, 0));
  trees.forEach(([x, z, s], i) => {
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(trunkGeo, M.wood);
    const crown = new THREE.Mesh(crownGeo, M.tree);
    trunk.castShadow = crown.castShadow = true;
    g.add(trunk, crown);
    g.position.set(x, 0, z);
    g.rotation.y = i;
    scene.add(g);
    anims.push((p) => {
      const t = easeOutBack(window01(p, 0.88 + i * 0.012, 0.94 + i * 0.012));
      g.visible = t > 0.002;
      g.scale.setScalar(Math.max(0.002, t) * s);
    });
  });

  // ───────────── loop ─────────────
  let target = 0;
  let current = 0;
  let px = 0;
  let py = 0;
  let cpx = 0;
  let cpy = 0;
  let width = 1;
  let height = 1;
  let raf = 0;
  let running = false;
  const clock = new THREE.Clock();
  const lookAt = new THREE.Vector3();
  const offset = new THREE.Vector3();
  let distance = 1.3;

  function apply(p: number) {
    for (const a of anims) a(p);
    const cam = cameraAt(p);
    const t = clock.getElapsedTime();
    const sway = reducedMotion ? 0 : Math.sin(t * 0.25) * 0.6;
    lookAt.set(...cam.target);
    // Afasta a câmera conforme o espaço útil da tela, para a casa caber inteira.
    offset.set(cam.pos[0] - cam.target[0], cam.pos[1] - cam.target[1], cam.pos[2] - cam.target[2]).multiplyScalar(distance);
    camera.position.set(lookAt.x + offset.x + cpx * 2 + sway, lookAt.y + offset.y - cpy * 1.2, lookAt.z + offset.z + sway * 0.4);
    camera.lookAt(lookAt);
  }

  let last = 0;
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    // Suavização independente da taxa de quadros (igual em 30, 60 ou 120 Hz).
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
    last = now;
    const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 4.5);
    current += (target - current) * k;
    if (Math.abs(target - current) < 0.00005) current = target;
    const kp = 1 - Math.exp(-dt * 3);
    cpx += (px - cpx) * kp;
    cpy += (py - cpy) * kp;
    apply(current);
    renderer.render(scene, camera);
  }

  function resize(w: number, h: number) {
    width = Math.max(1, w);
    height = Math.max(1, h);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Largura útil: a tela toda no celular; ~60% no computador (o texto ocupa a esquerda).
    const vHalf = THREE.MathUtils.degToRad(camera.fov / 2);
    const hFov = 2 * Math.atan(Math.tan(vHalf) * camera.aspect) * (mobile ? 1 : 0.6);
    distance = 1.3 * Math.max(1, Math.tan(THREE.MathUtils.degToRad(mobile ? 18.5 : 14)) / Math.tan(hFov / 2));
    // Desloca a maquete: à direita no computador (texto à esquerda), para cima no celular.
    if (mobile) camera.setViewOffset(width, height, 0, -height * 0.02, width, height);
    else camera.setViewOffset(width, height, -width * 0.19, 0, width, height);
    camera.updateProjectionMatrix();
    if (!running) {
      apply(current);
      renderer.render(scene, camera);
    }
  }

  apply(0);

  return {
    setProgress(p) {
      target = p;
    },
    setPointer(x, y) {
      px = x;
      py = y;
    },
    resize,
    start() {
      if (running) return;
      running = true;
      last = 0;
      clock.start();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      disposables.forEach((d) => d.dispose());
      slats.dispose();
      renderer.dispose();
    },
  };
}
