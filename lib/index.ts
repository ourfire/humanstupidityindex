import type {
  HsiData,
  HsiResult,
  Indicator,
  ScoredIndicator,
  ScoredPillar,
} from "./types";

/**
 * s = clamp( 100 * (v - anchor_min) / (anchor_max - anchor_min), 0, 100 )
 * METHODOLOGY.md ("Normalisation"). When anchor_min > anchor_max the
 * inversion (higher raw = lower stupidity) falls out of the same formula.
 */
export function normalise(
  raw: number,
  anchorMin: number,
  anchorMax: number,
): number {
  const s = (100 * (raw - anchorMin)) / (anchorMax - anchorMin);
  return Math.min(100, Math.max(0, s));
}

function scoreIndicator(indicator: Indicator): ScoredIndicator {
  if (indicator.raw === null) {
    throw new Error(`Indicator "${indicator.id}" has no raw value.`);
  }
  if (!indicator.source_name || !indicator.source_url || !indicator.as_of) {
    throw new Error(
      `Indicator "${indicator.id}" is missing provenance (source or date).`,
    );
  }
  return {
    ...indicator,
    score: normalise(indicator.raw, indicator.anchor_min, indicator.anchor_max),
  };
}

export function pillarScore(indicators: ScoredIndicator[]): number {
  if (indicators.length === 0) {
    throw new Error("Cannot score a pillar with no indicators.");
  }
  const sum = indicators.reduce((acc, i) => acc + i.score, 0);
  return sum / indicators.length;
}

export function computeIndex(data: HsiData): HsiResult {
  const scoredIndicators = data.indicators.map(scoreIndicator);

  const pillars: ScoredPillar[] = data.pillars.map((pillar) => {
    const members = scoredIndicators.filter((i) => i.pillar === pillar.id);
    const score = pillarScore(members);
    return { ...pillar, score, indicators: members };
  });

  const weightSum = pillars.reduce((acc, p) => acc + p.weight, 0);
  if (Math.abs(weightSum - 1) > 1e-9) {
    throw new Error(`Pillar weights must sum to 1, got ${weightSum}.`);
  }

  const rawIndex = pillars.reduce((acc, p) => acc + p.weight * p.score, 0);
  const index = Math.round(rawIndex * 10) / 10;

  return { index, pillars, indicators: scoredIndicators };
}
