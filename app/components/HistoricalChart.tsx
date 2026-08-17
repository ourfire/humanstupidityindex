"use client";

import { motion, useReducedMotion } from "motion/react";
import type { HistoricalYearPoint } from "@/lib/historical";

interface HistoricalChartProps {
  points: HistoricalYearPoint[];
  liveYear: number;
  liveValue: number;
}

const W = 860;
const H = 220;
const PAD_L = 34;
const PAD_R = 8;
const PAD_T = 14;
const PAD_B = 22;
const STRIP_H = 10;
const STRIP_GAP = 8;

function opacityFor(coverage: number, total: number) {
  return 0.14 + (coverage / total) * 0.86;
}

function widthFor(coverage: number, total: number) {
  return 1 + (coverage / total) * 1.5;
}

export function HistoricalChart({
  points,
  liveYear,
  liveValue,
}: HistoricalChartProps) {
  const prefersReducedMotion = useReducedMotion();

  const [first] = points;
  if (!first) return null;

  const totalPillars = first.totalPillars;
  const x0 = PAD_L;
  const x1 = W - PAD_R;
  const y0 = PAD_T;
  const y1 = H - PAD_B;
  const yearMin = first.year;
  const yearMax = liveYear;
  const values = [...points.map((p) => p.value), liveValue];
  const vMin = Math.min(...values);
  const vMax = Math.max(...values);
  const vSpan = vMax - vMin || 1;

  const xScale = (year: number) =>
    x0 + ((year - yearMin) / (yearMax - yearMin)) * (x1 - x0);
  const yScale = (v: number) => y1 - ((v - vMin) / vSpan) * (y1 - y0);

  const segments = points.slice(0, -1).map((a, i) => {
    const b = points[i + 1] ?? a;
    const coverage = Math.min(a.coveragePillars, b.coveragePillars);
    return {
      key: `${a.year}-${b.year}`,
      x1: xScale(a.year),
      y1: yScale(a.value),
      x2: xScale(b.year),
      y2: yScale(b.value),
      opacity: opacityFor(coverage, totalPillars),
      width: widthFor(coverage, totalPillars),
    };
  });

  const stripY = H + STRIP_GAP;
  const stripSegments = points.slice(0, -1).map((a, i) => {
    const b = points[i + 1] ?? a;
    return {
      key: `strip-${a.year}`,
      x: xScale(a.year),
      w: Math.max(1, xScale(b.year) - xScale(a.year)),
      opacity: opacityFor(a.coveragePillars, totalPillars),
    };
  });

  const last = points[points.length - 1] ?? first;

  const revealWidth = prefersReducedMotion ? W : 0;
  const clipId = "historical-chart-reveal";

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H + STRIP_H + STRIP_GAP}`}
        preserveAspectRatio="none"
        className="h-auto w-full"
        role="img"
        aria-label={`Line chart of the Human Stupidity Index from ${yearMin} to ${liveYear}. Data coverage varies by year -- most of this range is built from only one or two of the six pillars, since most indicators have no real historical data yet, and the line is drawn lighter where coverage is thinner. Current reading: ${liveValue.toFixed(1)}.`}
      >
        <defs>
          <clipPath id={clipId}>
            <motion.rect
              x={0}
              y={0}
              height={H + STRIP_H + STRIP_GAP}
              initial={{ width: revealWidth }}
              animate={{ width: W }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 1.4, ease: "easeOut", delay: 0.4 }
              }
            />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <line
            x1={x0}
            x2={x1}
            y1={y1}
            y2={y1}
            stroke="var(--color-rule)"
            strokeWidth={1}
          />
          {segments.map((s) => (
            <line
              key={s.key}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke="var(--color-ink)"
              strokeOpacity={s.opacity}
              strokeWidth={s.width}
            />
          ))}
          <line
            x1={xScale(last.year)}
            y1={yScale(last.value)}
            x2={xScale(liveYear)}
            y2={yScale(liveValue)}
            stroke="var(--color-klein)"
            strokeWidth={1.5}
            strokeDasharray="2 3"
          />
          <circle
            cx={xScale(liveYear)}
            cy={yScale(liveValue)}
            r={4}
            fill="var(--color-klein)"
          />
          {stripSegments.map((s) => (
            <rect
              key={s.key}
              x={s.x}
              y={stripY}
              width={s.w}
              height={STRIP_H}
              fill="var(--color-ink)"
              fillOpacity={s.opacity}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
