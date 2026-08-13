import Link from "next/link";
import type { Metadata } from "next";
import { Methodology } from "../components/Methodology";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Methodology — Human Stupidity Index",
  description:
    "The exact formula behind the Human Stupidity Index: anchors, weights, and pillar computation.",
};

export default function MethodologyPage() {
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
      <SiteFooter />
    </main>
  );
}
