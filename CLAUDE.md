# CLAUDE.md

Read `PRD.md` and `METHODOLOGY.md` before writing code. `METHODOLOGY.md` is the
source of truth for all index math — never reimplement it from memory.

## Domain

`humanstupidityindex.org`, registered at Namecheap. Point it at Vercel:
`A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com`, then add the domain in
the Vercel project settings. Propagation is usually under an hour; do this
early, before the build, so it isn't the last blocking step.

## Branding rule

The acronym **HSI never appears on the first screen.** The full name, "Human
Stupidity Index," is what the visitor reads first — the sigla is not announced,
it's earned. "HSI" is permitted only in: the `data/hsi.json` filename, the
version string in the footer, and body copy inside `METHODOLOGY.md` after the
full name has already been used once on that page.

Version string for the footer: `HSI v{version} · methodology v{methodology_version}`,
read from `data/hsi.json` — never hardcode it.

## Stack

- Next.js 15, App Router, TypeScript strict
- Tailwind CSS v4
- Motion (`motion/react`) for the load sequence only
- No component library. The page is fourteen elements; shadcn would be overhead.
- No charting library in v1.0. The visualisation is hand-written SVG.
- Deploy: Vercel. Node 20.

## Commands

```
pnpm dev        # local
pnpm build      # must pass before any deploy
pnpm lint
pnpm typecheck
pnpm test       # vitest, index math only
```

## Structure

```
app/
  layout.tsx
  page.tsx              # the landing: number, pillars, indicators, narrative
  methodology/page.tsx  # the full technical formula, one click from the landing
  opengraph-image.tsx   # dynamic OG carrying the current number
  api/subscribe/route.ts
lib/
  index.ts              # normalise, pillar, computeIndex — pure, tested
  types.ts
data/
  hsi.json              # the reading. hand-edited in v1.0.
public/
  data/hsi.json         # symlinked or copied at build; the public stable URL
```

## Rules

- `lib/index.ts` is pure and has no imports from React or Next. It is the only
  place the math lives, and it is unit tested against the worked example in
  `METHODOLOGY.md`.
- Never hardcode the index number in a component. Always compute from
  `data/hsi.json`.
- Every displayed figure renders its source and reference date from the JSON. If
  a source is missing from the data file, the build fails — do not render a
  number without provenance.
- No analytics that sets cookies. Vercel Analytics only.
- No client-side data fetching. Everything is static at build time.
- Accessibility floor: visible keyboard focus, `prefers-reduced-motion` honoured
  (the lattice appears filled instantly instead of animating), the index number
  has an `aria-label` spelling out the scale.

## Design system

The direction is **reticular minimalism with ultra-bold type**. Restraint
everywhere except one place. Do not add gradients, shadows, rounded corners,
glassmorphism, or a second accent colour.

### Colour

```css
--paper:  #FAFAF8;  /* background */
--ink:    #0A0A0A;  /* type, filled lattice cells */
--rule:   #D6D6D2;  /* hairlines, empty lattice cells */
--mute:   #6E6E6A;  /* captions, sources, dates */
--klein:  #002FA7;  /* International Klein Blue */
```

`--klein` is used in the lattice cells that the Cooperation pillar removes,
and, at 35% opacity, as that pillar's highlighter mark below. It is the colour
of cooperation everywhere it appears. Do not use it for links, buttons, or
hover states.

### Pillar highlighter marks

The six pillar names in "Six pillars" each carry a translucent highlighter
mark behind the name — rough-edged (an SVG turbulence/displacement filter,
not a clean rectangle), multiplied over the paper like real ink, not a flat
brand chip. This is the one deliberate exception to "one accent colour": it
exists purely so a reader can relocate a pillar at a glance, and it must
never spread beyond that one spot (no marks on indicators, body copy, or
anywhere else).

```css
--mark-risk:      #FF4D3D;  /* existential risk — hot red, the alarm colour */
--mark-conflict:  #FF2D6B;  /* armed conflict — crimson, adjacent to risk */
--mark-climate:   #B6FF3D;  /* climate and biosphere — acid green */
--mark-misalloc:  #FFB13D;  /* resource misallocation — amber */
--mark-epistemic: #C9AEFF;  /* epistemic condition — pastel lavender */
```

Cooperation keeps `--klein` (at 35% opacity) instead of a sixth new hue, since
Klein is already its colour in the lattice.

### Type

- **Display** — Archivo, variable, `wght 800`, `wdth 125`. Expanded ultra-bold
  grotesque. Used for the section heads. Tight tracking (`-0.03em`), never
  below 48px.
- **Numeral** — Anton, 400 (its only weight — already ultra-bold by design;
  there is no lighter cut, so smaller size is how it stays quiet, never a
  faked font-weight). Condensed, not expanded — the opposite proportion
  from Display. Two spots only: the hero index number
  (`clamp(4.5rem,16vw,13rem)`, tracking `-0.01em`, line-height `0.82`), and
  the Score column of the indicator table (`text-base`, tracking normal) —
  a deliberate small echo of the hero number, since every row's Score
  lands on the same 0–100 scale the hero number does. Nowhere else.
- **Body** — Newsreader, 400/500. A reading serif. Used for all prose. This is
  the introspective register; give it a 62ch measure and 1.6 line height.
- **Utility** — JetBrains Mono, 400. All numbers-in-tables, source names, dates,
  indicator IDs, and labels. Uppercase, `0.08em` tracking, 11–13px.

Load from Google Fonts via `next/font` with `display: swap`.

### Layout

A visible twelve-column lattice. Hairline rules in `--rule` run the full height
of the page behind the content, 1px, and content aligns to them. The grid is not
decoration — it is the same unit as the visualisation. Gutters 24px, max width
1200px, 6 columns on tablet, 4 on mobile.

### The signature element

The hero is the **10 × 10 lattice of 100 cells**, back after user testing —
readers respond to watching it fill. Each cell is one point of the index. The
current reading fills that many cells with `--ink`; unfilled cells are 1px
`--rule` outlines. The cells the Cooperation pillar has removed from the
total are shown in `--klein` outline in the unfilled region, so the viewer
can see exactly how much cooperation is subtracting. The number sits beside
it, sized as the hero: `clamp(4.5rem, 16vw, 13rem)`, bigger than v1.0's
original scale.

The number *is* the picture. Do not add a gauge, a needle, a dial, a
speedometer, or a progress bar alongside it.

**Load sequence:** cells fill in reading order, 8ms apart, ease-out, starting
400ms after paint. Nothing else on the page animates. Ever.

A second visualisation, **the index drawn as a single line over time**
(`HistoricalChart.tsx`), lives further down the page as its own section, not
in the hero. Line opacity and stroke width encode data coverage — thin and
faint where a year is built from one pillar out of six, full weight where
all six are present — with a coverage strip beneath it as the same signal in
a second form, and the y-axis fixed to the index's real 0–100 range so the
headroom before 100 stays honest. The live reading joins at the right edge
with a `--klein` dashed connector and a dot that snaps into place a beat
after the line finishes sweeping in (back-out easing, one time only — never
a continuous pulse, since nothing here updates in real time). The maths
lives in `lib/historical.ts`, pure and tested, separate from `lib/index.ts`
(METHODOLOGY.md, "Historical reconstruction").

### Page order

1. Lattice, full bleed on the grid, with the number set beside it in Display,
   sized as the hero.
2. A short passage defining the term, body serif, nothing else on the
   page competing with it. As of this text it runs three paragraphs, not
   one -- a more literary register than the flat institutional voice
   elsewhere, a deliberate choice, not drift. Still closes on "makes no
   moral claim about any person," carried over from v1.0.
3. The index over time: the line chart described above, its own section.
4. The six pillars: name, weight, score, and a one-line plain-language
   description of what each measures. Utility face, aligned to the lattice.
5. The fourteen indicators as a table: value, unit, score, source, date.
   The Score column sets its numerals in Anton (see Type, Numeral), a
   small echo of the hero number.
6. One line — "fourteen numbers, six pillars, one weighted score" — linking
   to `/methodology`, which renders `METHODOLOGY.md` in full: the anchors,
   the formula, the tables. The landing stays narrative; the audit trail is
   one click away, not inline.
7. "Raw data, in full" — the transparency case made explicitly (public
   data, fixed anchors, "a mirror that cheats is worthless," from
   PRD.md), landing on a bordered button linking `/data/hsi.json` — the
   footer keeps the same link too, small, as the standing reference; this
   is the invitation.
8. The tradeability question. One sentence, Yes/No, `/api/poll` -- no
   persistent tally yet, logged only, same honesty as email capture.
9. Email capture. One field, one verb. Label: "Get the next reading."
10. Footer: data URL, licence, version string.

No hero image. No testimonials. No FAQ. No card components.
