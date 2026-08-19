import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { computeIndex } from "@/lib/index";
import {
  computeHistoricalSeries,
  extractHistoricalSeries,
  type HistoricalDataFile,
} from "@/lib/historical";
import type { HsiData } from "@/lib/types";
import { EmailCapture } from "./components/EmailCapture";
import { HistoricalChart } from "./components/HistoricalChart";
import { IndicatorTable } from "./components/IndicatorTable";
import { Lattice } from "./components/Lattice";
import { PillarList } from "./components/PillarList";
import { ProposeSource } from "./components/ProposeSource";
import { SiteFooter } from "./components/SiteFooter";
import { TradeabilityPoll } from "./components/TradeabilityPoll";

function loadData(): HsiData {
  const file = path.join(process.cwd(), "data", "hsi.json");
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw) as HsiData;
}

function loadHistoricalData(): HistoricalDataFile {
  const file = path.join(process.cwd(), "data", "historical.json");
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw) as HistoricalDataFile;
}

export default function Home() {
  const data = loadData();
  const result = computeIndex(data);
  const historicalRaw = loadHistoricalData();
  const historicalPoints = computeHistoricalSeries(
    data,
    extractHistoricalSeries(historicalRaw),
  );
  const liveYear = new Date(data.computed_at).getUTCFullYear();
  const filled = Math.round(result.index);
  const cooperation = result.pillars.find((p) => p.id === "cooperation");
  const removed = cooperation
    ? Math.round(cooperation.weight * (100 - cooperation.score))
    : 0;

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-16">
      <section className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Lattice filled={filled} removed={removed} />
        </div>
        <div className="md:col-span-8">
          <p
            aria-hidden="true"
            className="font-utility text-mute mb-2 text-xs tracking-[0.08em] uppercase"
          >
            Human Stupidity Index
          </p>
          <h1
            aria-label={`Human Stupidity Index reading: ${result.index.toFixed(1)} out of 100. Zero is large-scale cooperation for the benefit of all. One hundred is self-annihilation of the species.`}
            className="font-numeral text-ink text-[clamp(4.5rem,16vw,13rem)] leading-[0.82] tracking-[-0.01em]"
          >
            {result.index.toFixed(1)}
          </h1>
          <p className="font-utility text-mute mt-4 text-xs tracking-[0.08em] uppercase">
            Reading dated {data.computed_at.slice(0, 10)}
          </p>
        </div>
      </section>

      <section className="mt-20 max-w-[62ch] space-y-6">
        <p className="font-body text-lg leading-[1.6]">
          <strong>Stupidity</strong>, here, is worse than malice. Malice
          requires intent. Stupidity requires none. That is why it
          spreads faster than malice, and answers to no one.
        </p>
        <p className="font-body text-lg leading-[1.6]">
          Much of it is not a flaw in any individual mind. It is a
          failure of coordination: a species that understands a risk
          clearly enough to name it, and still cannot act on that
          knowledge together.
        </p>
        <p className="font-body text-lg leading-[1.6]">
          This index measures that failure. Not intelligence. Not
          virtue. It makes no moral claim about any person. What it
          tracks is simpler, and harder to look away from: how much
          agency our species still holds over the risks it has created
          for itself, and whether that agency is growing or running out.
        </p>
      </section>

      <section className="mt-20">
        <h2 className="font-display mb-6 text-2xl">The index over time</h2>
        <HistoricalChart
          points={historicalPoints}
          liveYear={liveYear}
          liveValue={result.index}
        />
        <p className="font-utility text-mute mt-3 text-xs tracking-[0.06em] uppercase">
          {historicalPoints[0]?.year}–{liveYear} · line opacity marks how
          many of six pillars have real data that year
        </p>
      </section>

      <section className="mt-20">
        <h2 className="font-display mb-6 text-2xl">Six pillars</h2>
        <PillarList pillars={result.pillars} />
      </section>

      <section className="mt-20">
        <h2 className="font-display mb-6 text-2xl">
          {result.indicators.length === 14
            ? "Fourteen indicators"
            : `${result.indicators.length} indicators`}
        </h2>
        <p className="font-body mb-6 max-w-[62ch] text-base leading-[1.6]">
          The pillar scores above are built from these numbers. Every one
          carries its source and the date it refers to.
        </p>
        <IndicatorTable indicators={result.indicators} />
      </section>

      <section className="mt-20 max-w-[62ch]">
        <p className="font-body text-lg leading-[1.6]">
          {result.indicators.length} public numbers, six pillars, one
          weighted score.{" "}
          <Link href="/methodology" className="underline underline-offset-2">
            See exactly how it&apos;s calculated
          </Link>
          .
        </p>
      </section>

      <section className="mt-20 max-w-[62ch]">
        <h2 className="font-display mb-4 text-2xl">Raw data, in full</h2>
        <p className="font-body mb-6 text-lg leading-[1.6]">
          This number is a formula over public data, with fixed anchors
          and published weights. It is not an opinion, and nothing here
          is required to be taken on faith. A mirror that cheats is
          worthless, so every raw value, every score, every source and
          date behind the reading above is open to inspect, question, or
          recompute independently.
        </p>
        <a
          href="/data/hsi.json"
          className="font-utility border-ink hover:bg-ink hover:text-paper inline-block border px-5 py-3 text-xs tracking-[0.08em] uppercase transition-colors"
        >
          /data/hsi.json →
        </a>
      </section>

      <section className="mt-20 max-w-[62ch]">
        <h2 className="font-display mb-4 text-2xl">Propose a data source</h2>
        <p className="font-body mb-6 text-lg leading-[1.6]">
          This index is not finished. If you know a public, sourced number
          that belongs in it, name it below and say why. No account, no
          personal data required. Every proposal is read; not every one is
          added, and additions get a version bump like everything else here.
        </p>
        <ProposeSource />
      </section>

      <section className="mt-20">
        <TradeabilityPoll />
      </section>

      <section className="mt-20">
        <EmailCapture />
      </section>

      <SiteFooter
        version={data.version}
        methodologyVersion={data.methodology_version}
      />
    </main>
  );
}
