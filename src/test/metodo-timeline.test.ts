import { describe, expect, it } from "vitest";
import { metodoSceneAt, METODO_LOGO_HOLD_MS } from "@/lib/metodo-timeline";

describe("Método timing", () => {
  it.each([[0, 0], [4.99, 0], [5, 1], [9.49, 1], [9.5, 2], [13.99, 2], [14, 3], [18.49, 3], [18.5, 4], [22.99, 4], [23, 5], [31.4, 5]])("selects scene at %s seconds", (time, scene) => {
    expect(metodoSceneAt(time)).toBe(scene);
  });
  it("holds the final logo for four seconds", () => {
    expect(METODO_LOGO_HOLD_MS).toBe(4000);
  });
  it("returns to the first scene when the video restarts", () => {
    expect(metodoSceneAt(30)).toBe(5);
    expect(metodoSceneAt(0)).toBe(0);
  });
});