# Methodology v1.0

This document defines the Human Stupidity Index. It is both the implementation
spec and public content on the site. Changing anything here requires a version
bump, and old versions stay published.

## Definition

**Stupidity**, here, means behaviour that is collectively self-defeating given
available knowledge. Not ignorance — ignorance is not knowing. Stupidity is
knowing and proceeding anyway.

The index measures the species, not individuals. It has no moral claim about any
person.

## Scale

Every indicator and the final index run 0 to 100, where 0 is large-scale
cooperation for shared benefit and 100 is self-annihilation.

## Normalisation

Each indicator has two **anchors** fixed at v1.0 and never adjusted afterwards.
Moving anchors would let the index be tuned to a desired answer.

```
s = clamp( 100 * (v - anchor_min) / (anchor_max - anchor_min), 0, 100 )
```

Where `anchor_min` is the value corresponding to score 0 and `anchor_max` the
value corresponding to score 100. When a higher raw value means *less*
stupidity, `anchor_min` is simply the larger number and the formula handles the
inversion without a separate branch.

Anchors are chosen as **plausible historical or physical bounds**, not as
observed minima and maxima, so the index does not rescale itself every reading.

## Pillar and index computation

```
pillar_score = mean(indicator scores in that pillar)      // equal weight within
index        = Σ (pillar_weight × pillar_score)           // weights below
```

The index is reported to one decimal place. Pillar weights sum to 1.

## Pillars, weights and indicators

### P1 — Existential risk (weight 0.25)

| ID | Indicator | Unit | anchor_min (0) | anchor_max (100) | Source | Cadence |
|---|---|---|---|---|---|---|
| `doomsday` | Doomsday Clock, seconds to midnight | s | 300 | 0 | Bulletin of the Atomic Scientists | annual |
| `warheads` | Global nuclear warhead inventory | count | 0 | 70000 | Federation of American Scientists, Nuclear Notebook | annual |

### P2 — Armed conflict (weight 0.20)

| ID | Indicator | Unit | anchor_min (0) | anchor_max (100) | Source | Cadence |
|---|---|---|---|---|---|---|
| `conflict_deaths` | State-based conflict deaths per 100,000 people | rate | 0 | 20 | UCDP Georeferenced Event Dataset | annual |
| `active_conflicts` | Active state-based armed conflicts | count | 0 | 60 | UCDP/PRIO Armed Conflict Dataset | annual |
| `displaced` | Forcibly displaced people, share of world population | % | 0 | 3 | UNHCR Global Trends | annual |

### P3 — Climate and biosphere (weight 0.20)

| ID | Indicator | Unit | anchor_min (0) | anchor_max (100) | Source | Cadence |
|---|---|---|---|---|---|---|
| `co2` | Atmospheric CO₂, Mauna Loa monthly mean | ppm | 280 | 560 | NOAA Global Monitoring Laboratory | monthly |
| `temp_anomaly` | Global surface temperature anomaly vs 1880–1899 | °C | 0 | 4.0 | NASA GISTEMP v4 | annual |
| `living_planet` | Living Planet Index, 1970 = 100 | index | 100 | 0 | WWF Living Planet Report | biennial |

### P4 — Resource misallocation (weight 0.15)

| ID | Indicator | Unit | anchor_min (0) | anchor_max (100) | Source | Cadence |
|---|---|---|---|---|---|---|
| `mil_gdp` | World military expenditure as share of global GDP | % | 0 | 6 | SIPRI Military Expenditure Database | annual |
| `mil_oda` | Ratio of world military expenditure to official development assistance | ratio | 0 | 20 | SIPRI + OECD DAC | annual |

### P5 — Epistemic condition (weight 0.10)

| ID | Indicator | Unit | anchor_min (0) | anchor_max (100) | Source | Cadence |
|---|---|---|---|---|---|---|
| `press_freedom` | RSF World Press Freedom global score | score | 100 | 0 | Reporters Without Borders | annual |
| `democracy` | V-Dem Liberal Democracy Index, population-weighted | 0–1 | 1 | 0 | V-Dem Institute | annual |

### P6 — Cooperation (weight 0.10)

This pillar is the counterweight. High cooperation pushes the whole index down.

| ID | Indicator | Unit | anchor_min (0) | anchor_max (100) | Source | Cadence |
|---|---|---|---|---|---|---|
| `immunisation` | Global DTP3 immunisation coverage | % | 100 | 0 | WHO/UNICEF WUENIC | annual |
| `extreme_poverty` | World population in extreme poverty | % | 0 | 60 | World Bank, $2.15/day 2017 PPP | annual |

## Known limitations, stated publicly

1. **Pillar weights are a judgement.** They are not derived. They are published
   so the judgement can be argued with, and a recomputation tool in a later
   version will let readers set their own.
2. **Indicators update at different cadences.** Most are annual. The index
   therefore moves slowly and should not be read as a live feed.
3. **The cooperation pillar is under-measured.** Cooperation leaves fewer
   statistical traces than violence. This is a real bias toward a higher index
   and is not corrected for.
4. **Anchors are defensible, not objective.** They are fixed so that at least
   the bias is constant across readings.

## Data file

The computed reading is published at `/data/hsi.json` under a stable URL and is
free to reuse with attribution. Each indicator entry carries its raw value, its
normalised score, its source name, source URL, and the date the value refers to.
