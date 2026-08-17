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
import { PillarList } from "./components/PillarList";
import { SiteFooter } from "./components/SiteFooter";

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

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-16">
      <section>
        <p
          aria-hidden="true"
          className="font-utility text-mute mb-2 text-xs tracking-[0.08em] uppercase"
        >
          Human Stupidity Index
        </p>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <h1
            aria-label={`Human Stupidity Index reading: ${result.index.toFixed(1)} out of 100. Zero is large-scale cooperation for the benefit of all. One hundred is self-annihilation of the species.`}
            className="font-display text-ink text-[clamp(3.5rem,12vw,9rem)] leading-none tracking-[-0.03em] [font-stretch:125%]"
          >
            {result.index.toFixed(1)}
          </h1>
          <p className="font-utility text-mute text-xs tracking-[0.08em] uppercase">
            Reading dated {data.computed_at.slice(0, 10)}
          </p>
        </div>
        <div className="mt-10">
          <HistoricalChart
            points={historicalPoints}
            liveYear={liveYear}
            liveValue={result.index}
          />
          <p className="font-utility text-mute mt-3 text-xs tracking-[0.06em] uppercase">
            {historicalPoints[0]?.year}–{liveYear} · line opacity marks how
            many of six pillars have real data that year
          </p>
        </div>
      </section>

      <section className="mt-20 max-w-[62ch]">
        <p className="font-body text-lg leading-[1.6]">
          <strong>Stupidity</strong>, here, means behaviour that is
          collectively self-defeating given available knowledge. Not
          ignorance — ignorance is not knowing. Stupidity is knowing and
          proceeding anyway. The index measures the species, not
          individuals; it makes no moral claim about any person.
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
