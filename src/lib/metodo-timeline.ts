// Midpoints of the five 1s crossfades in the 31.4s composition.
export const METODO_SCENES = [
  { start: 0, lines: ["Todo sonho começa em terreno firme."] },
  { start: 5, lines: ["Engenharia que sustenta gerações."] },
  { start: 9.5, lines: ["Tijolo por tijolo, cada detalhe importa."] },
  { start: 14, lines: ["Espaços pensados para viver."] },
  { start: 18.5, lines: ["Onde a família se encontra."] },
  { start: 23, lines: ["Não construímos apenas casas.", "Construímos memórias."] },
] as const;

export const METODO_LOGO_HOLD_MS = 4000;
export const METODO_LOGO_FADE_MS = 700;

export function metodoSceneAt(time: number) {
  return Math.max(0, METODO_SCENES.findLastIndex((scene) => time >= scene.start));
}