# Home Service Passbook — review 4 handoff

## Status: FAIL

Adversarial review 4 found one blocking demo-presentation defect. Product code was not modified.

## What was done

- Reviewed the deployed site cold at 390 × 844 and 1440 × 900.
- Audited every landing-page and README sentence in `.factory/review-4.md`.
- Exercised demo entry, a demo-only service entry, Reset, offline reload, request isolation, and separation from a real browser record.
- Ran every literal `.factory/claims.json` command independently in clean clone `/tmp/hsp-review4-clean-qWoqU6`.
- Rechecked all 22 findings from reviews 1–3 in the live site and source.
- Checked route metadata, deep links, Back/focus behavior, link status, the HTTP 404, visual identity, accessibility, and missed leverage.

## Verification

- 14/14 declared claim commands passed in the clean clone.
- `npm test`: 18 Vitest tests and 19 Playwright tests passed.
- `npm run build`: passed; `dist/` was produced; JavaScript is 14.33 KB gzip.
- `npm run verify:live`: offline reload and keyboard checks passed; no external demo requests, console errors, overflow, or serious/critical Axe findings across 20 scans.
- `/opt/fleet/lib/verify-url.sh https://home-service-passbook.sociobot.in .factory/review-4-evidence/verify`: passed.
- Route crawl: all internal links returned 200; Sociobot checkout returned 303; the missing route returned 404 with the designed shell.

## Remaining work

- `F-4-1` (blocking): at 390 × 844, the initial demo task row starts at y=830 and its specific sample content is below the viewport. Make a complete named sample record readable without scrolling and add a viewport-bound assertion.
- Align “The demo opens a filled service history” with the panel that actually opens.

See `.factory/review-4.md` and `.factory/review-4-evidence/demo-first-mobile.png`.
