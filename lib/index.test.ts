import { describe, expect, it } from "vitest";
import { computeIndex, normalise, pillarScore } from "./index";
import type { HsiData, ScoredIndicator } from "./types";

describe("normalise", () => {
  it("maps anchor_min to 0 and anchor_max to 100", () => {
    expect(normalise(280, 280, 560)).toBe(0);
    expect(normalise(560, 280, 560)).toBe(100);
    expect(normalise(420, 280, 560)).toBeCloseTo(50);
  });

  it("clamps values beyond the anchors", () => {
    expect(normalise(100, 280, 560)).toBe(0);
    expect(normalise(700, 280, 560)).toBe(100);
  });

  it("handles inverted anchors, where a higher raw value is less stupid", () => {
    // doomsday: anchor_min 300 (score 0), anchor_max 0 (score 100)
    expect(normalise(300, 300, 0)).toBe(0);
    expect(normalise(0, 300, 0)).toBe(100);
    expect(normalise(150, 300, 0)).toBeCloseTo(50);
  });
});

describe("pillarScore", () => {
  it("is the equal-weighted mean of indicator scores", () => {
    const indicators = [{ score: 0 }, { score: 100 }] as ScoredIndicator[];
    expect(pillarScore(indicators)).toBe(50);
  });

  it("throws for an empty pillar", () => {
    expect(() => pillarScore([])).toThrow();
  });
});

function makeIndicator(overrides: Partial<HsiData["indicators"][number]>) {
  return {
    id: "x",
    pillar: "p1",
    label: "X",
    unit: "u",
    anchor_min: 0,
    anchor_max: 100,
    raw: 0,
    as_of: "2026",
    source_name: "Source",
    source_url: "https://example.com",
    retrieved: "2026-08-12",
    note: null,
    ...overrides,
  };
}

// Worked example, hand-computed from the formula in METHODOLOGY.md:
//   pillar_score = mean(indicator scores)
//   index        = sum(pillar_weight * pillar_score)
const baseData: HsiData = {
  version: "1.0",
  methodology_version: "1.0",
  computed_at: "2026-01-01T00:00:00.000Z",
  index: null,
  pillars: [
    { id: "p1", name: "Pillar One", weight: 0.5 },
    { id: "p2", name: "Pillar Two", weight: 0.5 },
  ],
  indicators: [
    makeIndicator({ id: "a", pillar: "p1", raw: 100 }),
    makeIndicator({ id: "b", pillar: "p1", raw: 0 }),
    makeIndicator({ id: "c", pillar: "p2", raw: 50 }),
  ],
};

describe("computeIndex", () => {
  it("computes the weighted index from a worked example", () => {
    // p1 = mean(100, 0) = 50; p2 = mean(50) = 50
    // index = 0.5*50 + 0.5*50 = 50.0
    const result = computeIndex(baseData);
    expect(result.index).toBe(50);
  });

  it("rounds the index to one decimal place", () => {
    const data: HsiData = {
      ...baseData,
      indicators: baseData.indicators.map((i) =>
        i.id === "c" ? { ...i, raw: 33 } : i,
      ),
    };
    // p1 = 50, p2 = 33 -> index = 0.5*50 + 0.5*33 = 41.5
    const result = computeIndex(data);
    expect(result.index).toBe(41.5);
  });

  it("throws when pillar weights do not sum to 1", () => {
    const data: HsiData = {
      ...baseData,
      pillars: [
        { id: "p1", name: "Pillar One", weight: 0.5 },
        { id: "p2", name: "Pillar Two", weight: 0.6 },
      ],
    };
    expect(() => computeIndex(data)).toThrow();
  });

  it("throws when an indicator is missing a raw value", () => {
    const data: HsiData = {
      ...baseData,
      indicators: baseData.indicators.map((i) =>
        i.id === "a" ? { ...i, raw: null } : i,
      ),
    };
    expect(() => computeIndex(data)).toThrow();
  });

  it("throws when an indicator is missing provenance", () => {
    const data: HsiData = {
      ...baseData,
      indicators: baseData.indicators.map((i) =>
        i.id === "a" ? { ...i, source_url: null } : i,
      ),
    };
    expect(() => computeIndex(data)).toThrow();
  });
});
