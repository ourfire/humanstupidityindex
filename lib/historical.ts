import { normalise } from "./index";
import type { HsiData } from "./types";

export interface HistoricalSourcePoint {
  year: number;
  value: number;
}

export interface HistoricalYearPoint {
  year: number;
  value: number;
  coveragePillars: number;
  totalPillars: number;
}

/**
 * For each year, scores whichever indicators have a real value that year,
 * means them within each pillar, then takes a weighted mean across
 * whichever pillars have at least one scored indicator -- renormalising
 * weights among the pillars actually present that year. A pillar or
 * indicator missing a given year is omitted, never estimated: the same
 * "drop what lacks a source" rule the live index already applies to
 * press_freedom before 2002, generalised to every pillar and year.
 * Documented in METHODOLOGY.md under "Historical reconstruction".
 */
export function computeHistoricalSeries(
  hsiData: HsiData,
  series: Record<string, HistoricalSourcePoint[]>,
): HistoricalYearPoint[] {
  const indicatorById = new Map(hsiData.indicators.map((i) => [i.id, i]));
  const totalPillars = hsiData.pillars.length;

  const years = new Set<number>();
  for (const points of Object.values(series)) {
    for (const p of points) years.add(p.year);
  }

  const results: HistoricalYearPoint[] = [];

  for (const year of Array.from(years).sort((a, b) => a - b)) {
    const pillarScores = new Map<string, number[]>();

    for (const [indicatorId, points] of Object.entries(series)) {
      const indicator = indicatorById.get(indicatorId);
      if (!indicator) continue;
      const point = points.find((p) => p.year === year);
      if (!point) continue;
      const score = normalise(
        point.value,
        indicator.anchor_min,
        indicator.anchor_max,
      );
      const scores = pillarScores.get(indicator.pillar) ?? [];
      scores.push(score);
      pillarScores.set(indicator.pillar, scores);
    }

    if (pillarScores.size === 0) continue;

    let weightedSum = 0;
    let weightSum = 0;
    for (const pillar of hsiData.pillars) {
      const scores = pillarScores.get(pillar.id);
      if (!scores) continue;
      const pillarScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      weightedSum += pillar.weight * pillarScore;
      weightSum += pillar.weight;
    }

    results.push({
      year,
      value: Math.round((weightedSum / weightSum) * 10) / 10,
      coveragePillars: pillarScores.size,
      totalPillars,
    });
  }

  return results;
}

interface HistoricalIndicatorFile {
  data: Array<Record<string, unknown> & { year: number }>;
}

export interface HistoricalDataFile {
  indicators: Record<string, HistoricalIndicatorFile>;
}

/**
 * conflict_deaths is stored with both a raw world-total count and a
 * derived rate_per_100k -- the live index's conflict_deaths anchor is a
 * rate, so the rate field is what must feed computeHistoricalSeries, not
 * the raw count. Every other indicator's stored "value" already matches
 * its live anchor's unit.
 */
const RATE_FIELD_OVERRIDE: Record<string, string> = {
  conflict_deaths: "rate_per_100k",
};

export function extractHistoricalSeries(
  raw: HistoricalDataFile,
): Record<string, HistoricalSourcePoint[]> {
  const out: Record<string, HistoricalSourcePoint[]> = {};

  for (const [id, entry] of Object.entries(raw.indicators)) {
    const field = RATE_FIELD_OVERRIDE[id] ?? "value";
    const points: HistoricalSourcePoint[] = [];
    for (const p of entry.data) {
      const value = p[field];
      if (typeof value === "number") {
        points.push({ year: p.year, value });
      }
    }
    if (points.length > 0) out[id] = points;
  }

  return out;
}
