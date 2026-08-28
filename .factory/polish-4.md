# Polish 4 verification

**Status:** complete.  The repaired application commit is `d62a72ce8153793bf157096372aab56bdcfab1fb`; it is deployed as Static Web Apps deployment `7c33c6fb-343d-4d1e-bf12-fca19887123d` at https://home-service-passbook.sociobot.in.

All earlier review and polish records were reread.  This table maps every review finding to the durable implementation and its current evidence.  Test names beginning `@claim:` are literal commands declared in `.factory/claims.json` and were run independently from a fresh clone.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added direct, isolated `?demo=1` mode with seeded records, persistent banner, Reset demo, and Start for real. | `@claim:demo-sandbox`; `@claim:demo-isolation`; `polish-4-evidence/live/live-review.json` isolation result. |
| F-1-2 | Rewrote service-record copy so it only promises the local passbook behaviour the app delivers. | `src/copy.test.ts`; fresh-clone `npm test`. |
| F-1-3 | Removed unsupported repository/history credibility copy. | `src/copy.test.ts`; current landing and README audit. |
| F-1-4 | Added route-specific title, description, canonical, social metadata, and History/Backup route handling. | `@claim:route-metadata`; live route checks in `live-review.json`. |
| F-1-5 | Added a styled, real 404 response and return-home link. | `@claim:real-404`; live missing-route check in `live-review.json`. |
| F-1-6 | Added the in-product calendar due-date flow. | `@claim:calendar-date`; fresh-clone claim run. |
| F-1-7 | Rewrote the README around local use, demo, export, import, and verification. | README copy audit; fresh-clone test suite. |
| F-1-8 | Removed unprovable durability language and retained only tested local-storage/offline statements. | `@claim:privacy-local`; `@claim:offline-reload`. |
| F-1-9 | Removed jargon and clarified task/record/proof language. | `.factory/copy-audit.md`; `src/copy.test.ts`. |
| F-1-10 | Replaced repeated marketing wording with plain task-specific instructions. | `.factory/copy-audit.md`; visual checks in desktop and mobile screenshots. |
| F-1-11 | Reduced the print promise to the actual printable entry outcome. | `@claim:print-entry`; fresh-clone claim run. |
| F-1-12 | Seeded realistic home-service tasks, dates, receipts, and proof notes. | `@claim:demo-sandbox`; `local/demo-first-mobile.png`. |
| F-1-13 | Standardised on passbook, record, task, proof, and history. | `.factory/copy-audit.md`; `src/copy.test.ts`. |
| F-1-14 | Added explicit local-browser data boundary and privacy wording. | `@claim:privacy-local`; `/privacy` live verification. |
| F-1-15 | Made the optional paid plan’s price and scope literal and linked its legal pages. | `@claim:paid-unlock`; footer/terms live route check. |
| F-2-1 | Removed untestable public-art claims and kept original-art provenance in the design record. | `.factory/design.md`; copy audit. |
| F-2-2 | Kept the product name consistently as Home Service Passbook. | `@claim:route-metadata`; live titles in `live-review.json`. |
| F-2-3 | Replaced generic failure copy with the product-styled not-found page. | `@claim:real-404`; `live/verify/screenshot-mobile.png`. |
| F-2-4 | Removed decorative home numbering and other non-task labels. | `.factory/copy-audit.md`; landing screenshot review. |
| F-3-1 | Replaced legacy “log” terminology with passbook/history wording. | `src/copy.test.ts`; fresh-clone `npm test`. |
| F-3-2 | Clarified that photos are proof attachments, not a separate feature claim. | `@claim:proof-photo`; fresh-clone claim run. |
| F-3-3 | Clarified import/export language and implemented the supported data paths. | `@claim:csv-export`; `@claim:backup-roundtrip`. |
| F-4-1 | On mobile demo entry, placed a real dynamic sample record first in the open due panel. It includes the task name, asset/area, due date, and last proof. The toolbar follows it, and the first-screen wording now says exactly what opens. | `mobile first screen and keyboard path work`; `local/demo-first-mobile.png`; live `?demo=1` in `live-review.json` records “Replace air filter”, “Furnace · Utility room”, “Aug 14, 2026”, “Pack 2 of 4”, box `y=336`, bottom `536.52` in a 844 px viewport. |

## Full verification

- Clean clone: `/tmp/hsp-polish-4-final-pass.Ezci2r`, created with `git clone --no-local /work/repo`; `npm ci --silent`; every one of the 14 literal claim commands; `npm test`; and `npm run build` all passed.
- Final build: `dist/` produced; initial JavaScript is 48.35 KB raw / 14.57 KB gzip and CSS is 22.26 KB raw / 5.64 KB gzip.
- Browser and accessibility: `npm run verify:live` passed after deployment: 20 Axe scans had zero serious or critical findings; keyboard, touch-target, overflow, offline reload, and request-isolation checks passed.  `verify-url.sh` also passed with no console errors.
- Live cold check: `/`, `/demo`, `/app`, `/history`, `/backup`, `/privacy`, and `/terms` returned 200 with their route-specific titles, one h1, canonical, and main landmark. A missing route returned the styled 404. See `polish-4-evidence/live/live-review.json`.
- Lighthouse mobile scores were Performance 100, Accessibility 100, Best Practices 100, and SEO 100 locally and on the live site. See `polish-4-evidence/local-lighthouse.json` and `polish-4-evidence/live/lighthouse.json`.

There are no outstanding review findings.
