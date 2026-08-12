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

Version string for the footer: `HSI v1.0 · methodology v1.0`

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
  page.tsx              # the entire site
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

`--klein` is used in exactly one place on the entire site: the cells of the
lattice that the Cooperation pillar removes. It is the only colour on the page,
and it is the colour of cooperation. Do not use it for links, buttons, or hover
states.

### Type

- **Display** — Archivo, variable, `wght 800`, `wdth 125`. Expanded ultra-bold
  grotesque. Used for the index number and the two section heads. Tight tracking
  (`-0.03em`), never below 48px.
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

A **10 × 10 lattice of 100 cells**. Each cell is one point of the index. The
current reading fills that many cells with `--ink`; unfilled cells are 1px
`--rule` outlines. The cells the Cooperation pillar has removed from the total
are shown in `--klein` outline in the unfilled region, so the viewer can see
exactly how much cooperation is subtracting.

The number *is* the picture. Do not add a gauge, a needle, a dial, a speedometer,
or a progress bar alongside it.

**Load sequence:** cells fill in reading order, 8ms apart, ease-out, starting
400ms after paint. Nothing else on the page animates. Ever.

### Page order

1. Lattice, full bleed on the grid, with the number set beside it in Display
2. One paragraph defining the term. Body serif. Nothing else.
3. The six pillars: name, weight, score. Utility face, aligned to the lattice.
4. The fourteen indicators as a table: value, unit, score, source, date.
5. Methodology prose, rendered from `METHODOLOGY.md`.
6. Email capture. One field, one verb. Label: "Get the next reading."
7. Footer: data URL, licence, version string.

No hero image. No testimonials. No FAQ. No card components.
