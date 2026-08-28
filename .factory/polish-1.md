# Perfection-loop polish 1

Release candidate `cfd6e2e5d81329123427b675ec7c9ca34373d3f1` was repaired against review `0969b1f28594ae417849051d78822c7a8a5aabee`. Review 1 is the only `.factory/review-*.md` file, and no earlier `.factory/polish-*.md` existed.

## Finding closure

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the false empty-passbook promise with “Starting for real opens your passbook.” The primary action now opens `/?demo=1`. | `@claim:demo-sandbox`; `reviewed product copy > uses the approved first-screen and section wording`; [live cold mobile](polish-1-evidence/live-cold-mobile.png); live `/` and `/?demo=1` in `live-check.json`. |
| F-1-2 | Added the exact `scope-boundaries` manifest claim and a browser test covering published limits, available actions, and request destinations. | `@claim:scope-boundaries`; zero external requests in `live-check.json`; live `/`, `/terms`. |
| F-1-3 | Removed the repository credential statement instead of publishing an unobservable promise. | `reviewed product copy > removes the reviewed README jargon and unsupported statements`; `README.md`. |
| F-1-4 | Added route-specific description, Open Graph title/description, Twitter title/description, title, and canonical updates. | `every route has matching metadata and History API navigation restores focus`; all seven live routes show `*Matches: true` in `live-check.json`. |
| F-1-5 | Rebuilt standalone 404 metadata, icons, manifest link, complete header navigation, full footer, focus target, mobile layout, dark contrast, and product dial/wordmark. | `static deployment policy > ships the standalone 404 with the full shell and social metadata`; [live 404 mobile](polish-1-evidence/live-404-mobile.png); live random URL returned 404 in `live-check.json`. |
| F-1-6 | Added free local “Export calendar (.ics)” on Due next. It writes one all-day event per current job with due date, asset, area, and repeat rule. | `@claim:calendar-export` runs offline and parses the file; `calendar export` unit tests; live export has 3 events and dates `20260814`, `20260915`, `20261001` in `live-check.json`; [live demo](polish-1-evidence/live-demo-mobile.png). |
| F-1-7 | Split the 23-word README browser-test sentence into two short sentences. | `reviewed product copy > removes the reviewed README jargon and unsupported statements`; `.factory/copy-audit.md`. |
| F-1-8 | Replaced “durable maintenance record” with specific dates, notes, and receipts. | Same copy test; `.factory/copy-audit.md`. |
| F-1-9 | Replaced introductory PWA/IndexedDB jargon with offline and browser-storage behavior. | Same copy test; `README.md`. |
| F-1-10 | Replaced “completion-relative recurrence” with fixed dates or the last completion date. | Same copy test; `@claim:recurrence-rules`. |
| F-1-11 | Replaced “clean service history” with “Prints service history.” | Same copy test; `@claim:print-history`. |
| F-1-12 | Replaced “The product itself” with “Sample service schedule.” | First-screen copy test; [live cold mobile](polish-1-evidence/live-cold-mobile.png). |
| F-1-13 | Standardized the collection as “service history” and individual records as “service entries.” | First-screen copy test; terminology table in `.factory/copy-audit.md`; live `/`. |
| F-1-14 | Replaced “Clear boundaries” with “What this passbook does not do.” | First-screen copy test; [live cold mobile](polish-1-evidence/live-cold-mobile.png). |
| F-1-15 | Replaced the unexplained “House Key” eyebrow with “Price,” while retaining House Key as the license name. | First-screen copy test; [live cold mobile](polish-1-evidence/live-cold-mobile.png). |

## Cumulative regression evidence

- All 14 literal `.factory/claims.json` commands passed separately after `npm ci` in final clean clone `/tmp/hsp-polish-1-final-zdli8t`.
- The clean clone then passed 17 Vitest tests, 19 Playwright tests, and `npm run build`. The release bundle is 47.54 KB JS and 19.93 KB CSS raw.
- `live-check.json` proves a visible first-screen action at 390 × 844, demo reset, separate real/demo records, offline reload, zero cross-origin demo requests, all route metadata, focus after navigation/back, a true HTTP 404, and 20 axe scans with zero serious/critical issues.
- `live-smoke/live-smoke.json` separately proves 44 px demo/legal targets, keyboard skip navigation, no horizontal overflow, offline reload, no console errors, no external demo requests, hosted checkout redirect, and 20 more clean axe scans.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.20 s, TBT 0 ms, CLS 0. See `polish-1-evidence/lighthouse-live.json`.

No review finding remains open.
