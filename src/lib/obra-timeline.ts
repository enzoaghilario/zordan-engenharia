/**
 * Linha do tempo da maquete 3D do Método.
 * O progresso (0 → 1) vem da rolagem da seção; cada etapa ocupa um trecho.
 * Mantido puro (sem three.js) para ser testável.
 */
export const METODO_STEPS = [
  { title: "Estudo", text: "Leitura do terreno, viabilidade técnica e planejamento de custos com total transparência.", start: 0 },
  { title: "Projeto", text: "Compatibilização de estrutura, instalações e arquitetura antes do primeiro metro cúbico.", start: 0.25 },
  { title: "Execução", text: "Equipe própria, cronograma rigoroso e controle tecnológico em cada etapa.", start: 0.47 },
  { title: "Entrega", text: "Vistoria minuciosa, documentação completa e acompanhamento pós-obra.", start: 0.75 },
] as const;

export function stepAt(progress: number) {
  let index = 0;
  METODO_STEPS.forEach((step, i) => {
    if (progress >= step.start) index = i;
  });
  return index;
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Progresso local (0 → 1) de um elemento que anima entre `from` e `to`. */
export function window01(progress: number, from: number, to: number) {
  if (to <= from) return progress >= to ? 1 : 0;
  return clamp01((progress - from) / (to - from));
}

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Leve "assentamento" no fim, como uma peça encaixando. */
export const easeOutBack = (t: number) => {
  const c1 = 1.2;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Quadros-chave da câmera: vista aérea → nível dos olhos. */
export const CAMERA_KEYS = [
  { at: 0, pos: [16, 26, 22], target: [0, 0, 1] },
  { at: 0.3, pos: [4, 20, 26], target: [0.5, 1, 1] },
  { at: 0.62, pos: [-18, 11, 20], target: [1, 2.5, 0.5] },
  { at: 1, pos: [-17, 5.2, 19], target: [1.2, 3, 0.5] },
] as const;

export function cameraAt(progress: number) {
  const p = clamp01(progress);
  let i = 0;
  while (i < CAMERA_KEYS.length - 2 && p > CAMERA_KEYS[i + 1]!.at) i++;
  const a = CAMERA_KEYS[i]!;
  const b = CAMERA_KEYS[i + 1]!;
  const t = easeInOutCubic(window01(p, a.at, b.at));
  const lerp = (x: readonly number[], y: readonly number[]) => x.map((v, k) => v + (y[k]! - v) * t) as [number, number, number];
  return { pos: lerp(a.pos, b.pos), target: lerp(a.target, b.target) };
}
