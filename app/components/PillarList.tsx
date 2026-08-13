import type { ScoredPillar } from "@/lib/types";

const MARK_COLOR: Record<string, string> = {
  existential_risk: "var(--color-mark-risk)",
  armed_conflict: "var(--color-mark-conflict)",
  climate_biosphere: "var(--color-mark-climate)",
  misallocation: "var(--color-mark-misalloc)",
  epistemic: "var(--color-mark-epistemic)",
  cooperation: "var(--color-klein)",
};

const MARK_ROTATION: Record<string, string> = {
  existential_risk: "-1.5deg",
  armed_conflict: "1deg",
  climate_biosphere: "-1deg",
  misallocation: "1.5deg",
  epistemic: "-1deg",
  cooperation: "1deg",
};

const PILLAR_DESCRIPTION: Record<string, string> = {
  existential_risk:
    "How close humanity has pushed itself toward irreversible catastrophe, nuclear war above all.",
  armed_conflict:
    "How much organised violence is happening right now, and how many people it has driven from their homes.",
  climate_biosphere:
    "How much we have altered the atmosphere, and how much wildlife has vanished as a result.",
  misallocation:
    "How much the world spends preparing for war compared with what it spends helping people survive, and how concentrated its wealth has become.",
  epistemic:
    "How free people are to know the truth and to have a say in how they are governed.",
  cooperation:
    "How well governments, institutions, and communities cooperate on the existential risks no single nation can solve alone.",
};

export function PillarList({ pillars }: { pillars: ScoredPillar[] }) {
  return (
    <dl className="font-utility grid grid-cols-2 gap-x-6 gap-y-4 text-xs tracking-[0.08em] uppercase md:grid-cols-3">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="roughen" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.09 0.25"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={6}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      {pillars.map((pillar) => (
        <div key={pillar.id} className="border-rule border-t pt-3">
          <dt className="text-ink relative inline-block">
            <span
              aria-hidden="true"
              className="absolute -inset-x-1 top-[8%] bottom-[4%] z-0 mix-blend-multiply [filter:url(#roughen)]"
              style={{
                background: MARK_COLOR[pillar.id],
                opacity: pillar.id === "cooperation" ? 0.35 : 1,
                transform: `rotate(${MARK_ROTATION[pillar.id] ?? "0deg"})`,
              }}
            />
            <span className="relative z-10">{pillar.name}</span>
          </dt>
          <p className="font-body text-mute mt-2 text-sm leading-snug normal-case">
            {PILLAR_DESCRIPTION[pillar.id]}
          </p>
          <dd className="mt-2 flex items-baseline justify-between text-ink">
            <span>w {pillar.weight.toFixed(2)}</span>
            <span>{pillar.score.toFixed(1)}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
