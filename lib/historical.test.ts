import { describe, expect, it } from "vitest";
import {
  computeHistoricalSeries,
  extractHistoricalSeries,
} from "./historical";
import type { HsiData } from "./types";

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

const baseData: HsiData = {
  version: "1.0",
  methodology_version: "1.1",
  computed_at: "2026-01-01T00:00:00.000Z",
  index: null,
  pillars: [
    { id: "p1", name: "Pillar One", weight: 0.5 },
    { id: "p2", name: "Pillar Two", weight: 0.5 },
  ],
  indicators: [
    makeIndicator({ id: "a", pillar: "p1", anchor_min: 0, anchor_max: 100 }),
    makeIndicator({ id: "b", pillar: "p2", anchor_min: 0, anchor_max: 100 }),
  ],
};

describe("computeHistoricalSeries", () => {
  it("computes a full-coverage year normally", () => {
    const series = {
      a: [{ year: 2000, value: 100 }],
      b: [{ year: 2000, value: 0 }],
    };
    const result = computeHistoricalSeries(baseData, series);
    expect(result).toEqual([
      { year: 2000, value: 50, coveragePillars: 2, totalPillars: 2 },
    ]);
  });

  it("renormalises weights when a pillar is missing that year", () => {
    const series = {
      a: [{ year: 1950, value: 100 }],
      // b (pillar p2) has no 1950 point
    };
    const result = computeHistoricalSeries(baseData, series);
    // only p1 contributes; its score (100) becomes the whole index, not
    // just its 0.5 share of one
    expect(result).toEqual([
      { year: 1950, value: 100, coveragePillars: 1, totalPillars: 2 },
    ]);
  });

  it("omits years where no indicator has data, rather than estimating", () => {
    const series = {
      a: [{ year: 1900, value: 50 }],
    };
    const result = computeHistoricalSeries(baseData, series);
    expect(result.map((p) => p.year)).toEqual([1900]);
  });

  it("means multiple indicators within the same pillar before weighting", () => {
    const data: HsiData = {
      ...baseData,
      indicators: [
        ...baseData.indicators,
        makeIndicator({ id: "c", pillar: "p1", anchor_min: 0, anchor_max: 100 }),
      ],
    };
    const series = {
      a: [{ year: 2010, value: 100 }],
      c: [{ year: 2010, value: 0 }],
      b: [{ year: 2010, value: 100 }],
    };
    // p1 = mean(100, 0) = 50; p2 = 100; index = 0.5*50 + 0.5*100 = 75
    const result = computeHistoricalSeries(data, series);
    expect(result).toEqual([
      { year: 2010, value: 75, coveragePillars: 2, totalPillars: 2 },
    ]);
  });

  it("sorts results by year and returns nothing for an empty series", () => {
    const series = {
      a: [
        { year: 1920, value: 10 },
        { year: 1900, value: 10 },
      ],
    };
    const result = computeHistoricalSeries(baseData, series);
    expect(result.map((p) => p.year)).toEqual([1900, 1920]);
    expect(computeHistoricalSeries(baseData, {})).toEqual([]);
  });
});

describe("extractHistoricalSeries", () => {
  it("reads the plain value field for most indicators", () => {
    const raw = {
      indicators: {
        co2: { data: [{ year: 1900, value: 294.1, note: "x" }] },
      },
    };
    expect(extractHistoricalSeries(raw)).toEqual({
      co2: [{ year: 1900, value: 294.1 }],
    });
  });

  it("uses rate_per_100k instead of the raw count for conflict_deaths", () => {
    const raw = {
      indicators: {
        conflict_deaths: {
          data: [{ year: 1946, value: 500000, rate_per_100k: 21.9 }],
        },
      },
    };
    expect(extractHistoricalSeries(raw)).toEqual({
      conflict_deaths: [{ year: 1946, value: 21.9 }],
    });
  });

  it("skips points missing the expected numeric field and drops empty series", () => {
    const raw = {
      indicators: {
        temp_anomaly: { data: [] },
        conflict_deaths: { data: [{ year: 1900, value: 100 }] }, // no rate_per_100k
      },
    };
    expect(extractHistoricalSeries(raw)).toEqual({});
  });
});
