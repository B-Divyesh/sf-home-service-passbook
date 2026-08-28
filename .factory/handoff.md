# Home Service Passbook — review 3 handoff

## Status: FAIL

Adversarial review 3 is complete in `.factory/review-3.md`. Product code was not modified. The live product passes functional, claim, demo, privacy, offline, routing, accessibility, and build checks, but the zero-finding release rule is not met.

## Work completed

- Opened the live site cold in fresh 390 × 844 and 1440 × 900 browser contexts and recorded the first-screen interpretation before scrolling.
- Audited all landing and README copy, including headings, actions, labels, jargon, terminology, and word counts.
- Exercised the live one-click demo, reset, real/demo IndexedDB isolation, offline reload, and request log.
- Ran all 14 literal `.factory/claims.json` commands separately from clean clone `/tmp/hsp-review3-nRcj1S` at `80080f6`.
- Rechecked every finding from reviews 1 and 2 against both the live deployment and current source.
- Crawled links; checked route metadata, the designed 404, History API focus, response headers, static metadata assets, mobile touch targets, and 20 live Axe combinations.
- Ran the full local test suite and production build.

## Verification results

- Every declared claim command: pass.
- `npm test`: pass — 18 Vitest tests and 19 Playwright tests.
- `npm run build`: pass — `dist/index.html` produced.
- Bundle: 47.48 KB JS raw / 14.33 KB gzip; 19.93 KB CSS raw / 5.22 KB gzip.
- Live JS and CSS SHA-256 values match the local build.
- `/opt/fleet/lib/verify-url.sh`: pass — 567 ms load, no console errors, one H1, `lang=en`, main, alt text, and button names.
- Live demo: pass — sample shown immediately, reset works, real record survives, sample data stays separate, same-origin requests only, and offline reload works.
- Live route/link/accessibility checks: pass — valid metadata, real 404, no dead links, route focus restoration, and zero serious/critical Axe findings.

## Open findings

- `F-3-1` reopens `F-1-13` as BLOCKING: “A private log…” and “log ready” retain the discarded `log` synonym; the latter is also a decorative status label.
- `F-3-2`: README “licensed photo attachments” is ambiguous; name House Key directly.
- `F-3-3`: README import recovery uses “nested record,” “rollback,” and “startup validation” instead of describing what the user sees.

## Next step

Make the three copy-only repairs specified in `.factory/review-3.md`, update the copy audit/regression test, and rerun the complete review checklist. Do not mark the product PASS until no finding remains.
