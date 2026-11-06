import { describe, expect, it } from "vitest";
import { cameraAt, METODO_STEPS, stepAt, window01 } from "@/lib/obra-timeline";

describe("Linha do tempo da maquete 3D", () => {
  it("tem os quatro tempos do método, em ordem", () => {
    expect(METODO_STEPS.map((s) => s.title)).toEqual(["Estudo", "Projeto", "Execução", "Entrega"]);
    const starts = METODO_STEPS.map((s) => s.start);
    expect([...starts].sort((a, b) => a - b)).toEqual(starts);
  });

  it("mostra o tempo certo para cada ponto da rolagem", () => {
    expect(stepAt(0)).toBe(0);
    expect(stepAt(0.3)).toBe(1);
    expect(stepAt(0.6)).toBe(2);
    expect(stepAt(1)).toBe(3);
  });

  it("limita o progresso local entre 0 e 1", () => {
    expect(window01(-1, 0.2, 0.4)).toBe(0);
    expect(window01(0.3, 0.2, 0.4)).toBeCloseTo(0.5);
    expect(window01(2, 0.2, 0.4)).toBe(1);
  });

  it("leva a câmera da vista aérea até o nível dos olhos", () => {
    expect(cameraAt(0).pos[1]).toBeGreaterThan(cameraAt(1).pos[1]);
    expect(cameraAt(1).pos).toEqual([-17, 5.2, 19]);
  });
});
