import Link from "next/link";
import type { Metadata } from "next";
import { Methodology } from "../../components/Methodology";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Methodology v1.0 (archived) — Human Stupidity Index",
  description:
    "The first published methodology for the Human Stupidity Index, archived and unchanged.",
};

export default function MethodologyV1Page() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 py-16">
      <Link
        href="/methodology"
        className="font-utility text-mute text-xs tracking-[0.08em] uppercase underline underline-offset-2"
      >
        ← Current methodology
      </Link>
      <div className="border-rule mt-6 mb-10 border p-4">
        <p className="font-utility text-mute text-xs tracking-[0.08em] uppercase">
          Archived version — no longer live
        </p>
        <p className="font-body mt-2 max-w-[62ch] text-sm leading-[1.6]">
          This is v1.0 exactly as first published, kept for reference. The
          site now runs on a newer methodology version.
        </p>
      </div>
      <Methodology file="METHODOLOGY.v1.0.md" />
      <SiteFooter />
    </main>
  );
}
