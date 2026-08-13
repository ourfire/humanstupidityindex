import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { Metadata } from "next";
import type { HsiData } from "@/lib/types";
import { Methodology } from "../components/Methodology";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Methodology — Human Stupidity Index",
  description:
    "The exact formula behind the Human Stupidity Index: anchors, weights, and pillar computation.",
};

function loadData(): HsiData {
  const file = path.join(process.cwd(), "data", "hsi.json");
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw) as HsiData;
}

export default function MethodologyPage() {
  const data = loadData();
  return (
    <main className="mx-auto max-w-[1200px] px-6 py-16">
      <Link
        href="/"
        className="font-utility text-mute text-xs tracking-[0.08em] uppercase underline underline-offset-2"
      >
        ← Human Stupidity Index
      </Link>
      <h1 className="font-display text-ink mt-6 mb-10 text-4xl [font-stretch:125%]">
        Methodology
      </h1>
      <Methodology />

      <section className="border-rule mt-16 border-t pt-8">
        <p className="font-utility text-mute text-xs tracking-[0.08em] uppercase">
          Who maintains this
        </p>
        {/*
          TODO: "Alex Moreau" is a placeholder. The real advisor is Peyman
          Faratin (Krnel) — swap in his real name once he confirms how he
          wants to be credited. This page is only being shared with a
          private focus group until then; do not treat this name as final.
        */}
        <p className="font-body mt-3 max-w-[62ch] text-base leading-[1.6]">
          The Human Stupidity Index is built and maintained by
          futurable.now. Alex Moreau advises on AI oversight for the
          index — the model-assisted work planned for future versions,
          including any AI-assisted scoring or proposal evaluation.
        </p>
      </section>

      <SiteFooter
        version={data.version}
        methodologyVersion={data.methodology_version}
      />
    </main>
  );
}
