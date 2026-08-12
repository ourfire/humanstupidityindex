import type { ScoredIndicator } from "@/lib/types";

export function IndicatorTable({
  indicators,
}: {
  indicators: ScoredIndicator[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="font-utility w-full border-collapse text-xs tracking-[0.04em] uppercase">
        <thead>
          <tr className="text-mute">
            <th className="border-rule border-b py-2 pr-4 text-left">
              Indicator
            </th>
            <th className="border-rule border-b py-2 pr-4 text-left">
              Value
            </th>
            <th className="border-rule border-b py-2 pr-4 text-left">
              Score
            </th>
            <th className="border-rule border-b py-2 pr-4 text-left">
              Source
            </th>
            <th className="border-rule border-b py-2 pr-4 text-left">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {indicators.map((indicator) => (
            <tr key={indicator.id}>
              <td className="border-rule text-ink border-b py-2 pr-4 normal-case">
                {indicator.label}
              </td>
              <td className="border-rule text-ink border-b py-2 pr-4">
                {indicator.raw} {indicator.unit}
              </td>
              <td className="border-rule text-ink border-b py-2 pr-4">
                {indicator.score.toFixed(1)}
              </td>
              <td className="border-rule text-mute border-b py-2 pr-4 normal-case">
                {indicator.source_url ? (
                  <a
                    href={indicator.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {indicator.source_name}
                  </a>
                ) : (
                  indicator.source_name
                )}
              </td>
              <td className="border-rule text-mute border-b py-2 pr-4">
                {indicator.as_of}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
