# Home Service Passbook — visual thesis

## Direction

**Mid-century instrument panel.** The passbook should feel like a dependable panel in a well-kept utility room: cream enamel, charcoal housings, stamped labels, safety-orange controls, teal status lamps, and ruled service cards. This gives household paperwork weight without imitating an appliance maker or a generic task app. Records lead; decoration explains status and recurrence.

The interface uses one deliberately asymmetric composition. The landing page pairs an illustrated maintenance bench with a compact status readout. The app becomes a dense, legible service ledger. Corners are clipped or gently rounded, shadows are short, and controls have physical depth. There are no gradients, glass effects, floating blobs, or generic feature-card rows.

## Palette

Light is the primary treatment because paper records are the product metaphor. The dark treatment follows the same enamel-panel logic and is selected from the operating system.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--paper` | `#F3EBD8` | `#171B1A` | page/background |
| `--surface` | `#FFF9EA` | `#222826` | paper cards/panels |
| `--ink` | `#202522` | `#F5EEDC` | primary text |
| `--muted` | `#59615B` | `#BFC6BE` | secondary text |
| `--line` | `#71786F` | `#7E8981` | rules and control outlines |
| `--panel` | `#28312E` | `#0E1211` | instrument housing |
| `--orange` | `#C94F2D` | `#F47A51` | primary action / overdue |
| `--orange-ink` | `#FFFFFF` | `#171B1A` | text on accent |
| `--teal` | `#176D68` | `#63C7BB` | completed / ready |
| `--amber` | `#8B5D05` | `#F3C35B` | due soon / caution |
| `--danger` | `#A22929` | `#FF8E86` | destructive feedback |

All normal text pairs are targeted at WCAG AA contrast (4.5:1 or better). Status always includes a word or symbol, never color alone.

## Type and spacing

- Display: `Rockwell`, `Roboto Slab`, `Courier New`, serif. Broad, stamped letterforms suit labels and counters without a font download.
- Body: `Avenir Next`, `Segoe UI`, `Helvetica Neue`, sans-serif. It stays calm at ledger density.
- Numbers: tabular figures for dates, counters, and intervals.
- Scale: 14, 16, 18, 24, 36, and `clamp(42px, 8vw, 76px)`.
- Spacing: 4px base with an 8px working rhythm: 8, 16, 24, 32, 48, 64, 96.
- Reading measure: 64 characters; touch targets: at least 44px.

## Shape and interaction grammar

- Main panels use a 2px dark rule and a 12px radius, like powder-coated housings.
- Small status readouts use square corners, inset shadows, and monospaced/tabular numbers.
- Primary actions are orange, slightly raised, and move down 1px when pressed.
- Ledger rows are separated by horizontal rules rather than nested cards.
- Focus uses a 3px teal outline with a 3px cream offset.
- Navigation replaces page content through real History API routes. Focus moves to the new `h1` and a polite live region announces it.

## Motion

The signature motion is a single gauge needle settling when due counts change. Page content enters with a 180ms opacity/translate transition. Buttons depress over 100ms. Nothing loops. Under `prefers-reduced-motion: reduce`, transforms and transitions are removed; gauge status changes instantly and remains fully understandable from its label.

## Responsive intent

At 390px, the status readout moves before supporting explanation, ledgers become stacked rows, and nonessential illustration detail is cropped. Actions stay full-width where useful. The primary add/complete/export paths remain visible without horizontal scrolling. Print removes all navigation and controls and renders a black-on-white history ledger.

## Asset plan and provenance

- Hero: one original still-life illustration of a furnace filter, brass service tags, receipt, screwdriver, and compact dial on a cream workbench. It clarifies that this is household-owned service paperwork, not appliance control.
- Social preview: composed from the same generated art with live HTML text kept outside the source image; the actual Open Graph file contains only art and product-safe geometric framing.
- Icons, gauge, logo mark, empty-state stamp, and PWA icons: hand-authored SVG/CSS by the Param Factory for this product.
- Generated-art prompt: “Editorial mid-century product illustration, overhead three-quarter view of a tidy home utility workbench, pleated furnace filter, small brass service tags, paper receipt, flat screwdriver, compact analog maintenance dial, cream enamel and charcoal metal, safety orange and muted teal accents, warm directional studio light, subtle screenprint grain, precise geometry, no people, no text, no letters, no watermark, no logos, no branded appliances, no gradients.”
- Generation tool/model: `/opt/fleet/lib/gen-image.sh`, factory Azure image deployment, 2026-08-28. Generated imagery is original for Home Service Passbook. Final source prompt is stored beside the candidate in `assets/src/`.
- Review: the selected source has no text artifacts, people, brands, broken geometry, or visible seams.
- Delivery: responsive WebP files are 38 KB at 640 px and 151 KB at 1200 px. The social crop is 119 KB at 1200 × 630.
