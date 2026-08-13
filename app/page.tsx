import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { computeIndex } from "@/lib/index";
import type { HsiData } from "@/lib/types";
import { EmailCapture } from "./components/EmailCapture";
import { IndicatorTable } from "./components/IndicatorTable";
import { Lattice } from "./components/Lattice";
import { PillarList } from "./components/PillarList";
import { SiteFooter } from "./components/SiteFooter";

function loadData(): HsiData {
  const file = path.join(process.cwd(), "data", "hsi.json");
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw) as HsiData;
}

export default function Home() {
  const data = loadData();
  const result = computeIndex(data);
  const filled = Math.round(result.index);
  const cooperation = result.pillars.find((p) => p.id === "cooperation");
  const removed = cooperation
    ? Math.round(cooperation.weight * (100 - cooperation.score))
    : 0;

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-16">
      <section className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Lattice filled={filled} removed={removed} />
        </div>
        <div className="md:col-span-7">
          <p
            aria-hidden="true"
            className="font-utility text-mute mb-2 text-xs tracking-[0.08em] uppercase"
          >
            Human Stupidity Index
          </p>
          <h1
            aria-label={`Human Stupidity Index reading: ${result.index.toFixed(1)} out of 100. Zero is large-scale cooperation for the benefit of all. One hundred is self-annihilation of the species.`}
            className="font-display text-ink text-[clamp(3.5rem,12vw,9rem)] leading-none tracking-[-0.03em] [font-stretch:125%]"
          >
            {result.index.toFixed(1)}
          </h1>
          <p className="font-utility text-mute mt-4 text-xs tracking-[0.08em] uppercase">
            Reading dated {data.computed_at.slice(0, 10)}
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
        <h2 className="font-display mb-6 text-2xl">Fourteen indicators</h2>
        <p className="font-body mb-6 max-w-[62ch] text-base leading-[1.6]">
          The pillar scores above are built from these fourteen numbers.
          Every one carries its source and the date it refers to.
        </p>
        <IndicatorTable indicators={result.indicators} />
      </section>

      <section className="mt-20 max-w-[62ch]">
        <p className="font-body text-lg leading-[1.6]">
          Fourteen public numbers, six pillars, one weighted score.{" "}
          <Link href="/methodology" className="underline underline-offset-2">
            See exactly how it&apos;s calculated
          </Link>
          .
        </p>
      </section>

      <section className="mt-20">
        <EmailCapture />
      </section>

      <SiteFooter />
    </main>
  );
}
