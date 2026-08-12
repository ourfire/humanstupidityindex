# Human Stupidity Index — Product Requirements (v1.0)

## What this is

A public, single-page instrument that reports one number: how stupid the human
species is behaving right now, as a collective.

The scale runs 0 to 100.

- **0** — large-scale human cooperation for the benefit of all
- **100** — self-annihilation of the species

The number is not an opinion. It is a published formula over public data, with
fixed anchors and open weights. Anyone can recompute it. That auditability is
the whole point: the work is a mirror, and a mirror that cheats is worthless.

## Why it exists

It is a conceptual artwork in the form of a statistical instrument. It borrows
the authority of the index — the format we use for GDP, inflation, credit
scores — and turns it on the thing indices never measure. The intended
experience is not outrage. It is a pause.

## Audience

1. **The reflective visitor.** Arrives from a link, sees the number, stays
   ninety seconds, leaves changed slightly. This is the primary user.
2. **The skeptic.** Wants to know how the number is made. Must be able to reach
   the full methodology and the raw data in one click, or the work loses.
3. **Press and the art world.** Need a citable methodology, a stable URL, and a
   share image that carries the number.

## Success metric for v1.0

Not traffic. **Methodology page views as a share of homepage views.** If people
scroll into the math, the piece is working. Target: 15%.

Secondary: email signups for the next reading.

## In scope for v1.0

- One page, one number, the lattice visualisation
- Six pillars, fourteen indicators, all values real and sourced
- Full methodology, readable on the same page
- Raw data downloadable as JSON at a stable URL
- Email capture for the next reading
- Open Graph image carrying the current number
- Responsive, keyboard-accessible, reduced-motion respected

## Explicitly out of scope for v1.0

- Any account, login, or user-submitted data
- Voting, comments, or a "your personal stupidity score" quiz
- Automated data ingestion (v1.1)
- Historical time series chart (v1.1 — needs more than one reading to exist)
- Multiple languages. The site is English only.
- Any mention of politics by party, country blame, or current events commentary

## Editorial rules

- The site never names a country, a leader, or a party as the cause.
- The voice is flat, institutional, and unhurried. No jokes. No exclamation marks.
- Every number on the page has a source and a date visible near it.
- Uncertainty is stated, never hidden.
- The word "stupidity" appears in the title and is then defined precisely once,
  as *behaviour that is collectively self-defeating given available knowledge*.
  After that definition, the site does not editorialise.

## Release plan

- **v1.0 (today)** — static values in a versioned JSON, manual updates
- **v1.1** — automated fetch for the machine-readable sources (CO2, temperature,
  conflict), scheduled recompute, first time series
- **v1.2** — historical backfill to 1990, animated series, print edition
