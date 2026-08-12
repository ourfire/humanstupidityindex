# Research brief — verify the fourteen v1.0 values

Hand this file to Cowork. It runs in parallel with the build.

## Task

For each of the fourteen indicators in `METHODOLOGY.md`, find the most recent
published value from the **named primary source only**. Not an aggregator, not a
news article summarising it, not Wikipedia. If the primary source is behind a
paywall or unavailable, mark the indicator `unavailable` rather than
substituting.

## For each indicator, return

| Field | Requirement |
|---|---|
| `id` | exactly as in METHODOLOGY.md |
| `raw` | the number, in the stated unit, no rounding beyond the source's own |
| `as_of` | the period the value refers to (e.g. `2025` or `2026-07`), not the publication date |
| `source_name` | the organisation |
| `source_url` | a direct, permanent link to the page or PDF carrying the number |
| `retrieved` | today's date |
| `note` | any caveat: revision status, provisional flag, methodology change |

## Rules

- **Do not compute anything.** Return raw values only. Normalisation happens in
  `lib/index.ts`.
- If a source publishes both a provisional and a revised figure, take the
  revised one and say so in `note`.
- `mil_oda` requires two figures from two sources; return both raw numbers
  separately rather than the ratio.
- `democracy` requires the population-weighted figure specifically. If V-Dem
  publishes only the unweighted mean, say so and return the unweighted value
  flagged in `note`.
- If a value you find is more than three years old, still return it, but flag it.
  Stale is acceptable; invented is not.

## Output

A single JSON array matching `data/hsi.example.json`, plus a short list of any
indicator where you were not fully confident and why.
