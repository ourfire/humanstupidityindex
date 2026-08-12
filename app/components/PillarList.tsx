import type { ScoredPillar } from "@/lib/types";

export function PillarList({ pillars }: { pillars: ScoredPillar[] }) {
  return (
    <dl className="font-utility grid grid-cols-2 gap-x-6 gap-y-4 text-xs tracking-[0.08em] uppercase md:grid-cols-3">
      {pillars.map((pillar) => (
        <div key={pillar.id} className="border-rule border-t pt-3">
          <dt className="text-mute">{pillar.name}</dt>
          <dd className="mt-1 flex items-baseline justify-between text-ink">
            <span>w {pillar.weight.toFixed(2)}</span>
            <span>{pillar.score.toFixed(1)}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
