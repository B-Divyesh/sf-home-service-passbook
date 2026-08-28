# Perfection-loop polish 2

Release candidate `6e8e9cfbccc486309d8663e41e73c3f1c35cbb00` was repaired at `aa60d2ce6c5953e4f313b7f3f5fd07870ee68212`. This record covers every finding in `.factory/review-1.md` and `.factory/review-2.md`, including the earlier items that remained fixed.

## Finding closure

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the truthful first-screen note: the sample opens filled and starting for real opens the existing passbook. | `@claim:demo-sandbox`; `reviewed product copy > uses the approved first-screen and section wording`; live `/?demo=1`; `polish-2-evidence/live-cold-mobile.png`. |
| F-1-2 | Kept the published scope boundary tied to `scope-boundaries`. | `@claim:scope-boundaries`; live `/` and `/terms`; `polish-2-evidence/live-review.json`. |
| F-1-3 | Kept the unsupported repository-credential assertion out of visitor copy. | `reviewed product copy > removes the reviewed README jargon and unsupported statements`; live `/privacy`. |
| F-1-4 | Kept route-specific title, description, canonical, Open Graph, and Twitter metadata. | `every route has matching metadata and History API navigation restores focus`; live `/`, `/demo`, `/app`, `/history`, `/backup`, `/privacy`, `/terms`. |
| F-1-5 | Kept the complete static 404 shell, metadata, footer, and home route. | `static deployment policy > ships the standalone 404 with the full shell and social metadata`; live `/missing-polish-2`; `polish-2-evidence/live-404-mobile.png`. |
| F-1-6 | Kept free calendar export for every current job and due date. | `@claim:calendar-export`; live `/?demo=1`; `polish-2-evidence/live-demo-mobile.png`. |
| F-1-7 | Kept the README browser-test description split into short plain sentences. | `reviewed product copy > removes the reviewed README jargon and unsupported statements`; `README.md`. |
| F-1-8 | Kept the unsupported word “durable” out of the README. | Same copy test; `README.md`. |
| F-1-9 | Kept implementation jargon out of the README introduction. | Same copy test; `README.md`. |
| F-1-10 | Kept the reader-facing schedule term “from the last completion date.” | `@claim:recurrence-rules`; `README.md`. |
| F-1-11 | Kept only the observable printing statement. | `@claim:print-history`; `README.md`. |
| F-1-12 | Kept the preview label “Sample service schedule.” | First-screen copy test; live `/`; `polish-2-evidence/live-cold-mobile.png`. |
| F-1-13 | Kept “service history” for the collection and “service entry” for a completed job. | Copy test and terminology table in `.factory/copy-audit.md`; live `/history`. |
| F-1-14 | Kept the concrete boundary section label. | First-screen copy test; live `/`; `polish-2-evidence/live-cold-mobile.png`. |
| F-1-15 | Kept “Price” as the paid-section label and House Key only as the license name. | First-screen copy test; live `/`; `polish-2-evidence/live-cold-mobile.png`. |
| F-2-1 | Removed “Original generated artwork.” from SPA and standalone-404 footers. Asset provenance remains in `.factory/design.md`, not visitor claims. | `reviewed product copy > keeps reviewed labels literal and uses passbook as the only document name`; live `/` and `/missing-polish-2`; `polish-2-evidence/live-cold-mobile.png`. |
| F-2-2 | Replaced the app eyebrow “Household ledger” with “Passbook.” | Same label regression test; live `/app`; `polish-2-evidence/live-app-mobile.png`. |
| F-2-3 | Replaced the 404 eyebrow “Wrong panel” with the literal “Page not found” in SPA and static 404 shells. | Same label regression test; live `/missing-polish-2`; `polish-2-evidence/live-404-mobile.png`. |
| F-2-4 | Removed the decorative “HOME / 01” identifier and retained the useful “Service record” label. | Same label regression test; live `/`; `polish-2-evidence/live-cold-mobile.png`. |

## Verification

- A clean clone at `/tmp/home-service-passbook-clean-sjBD3H` checked out `aa60d2c`, ran `npm ci`, then ran each of the 14 literal commands in `.factory/claims.json` separately. Every command passed.
- The same clean clone passed `npm test` (18 Vitest tests and 19 Playwright tests) and `npm run build`; `dist/index.html` was present at `2026-08-28 21:41:24 UTC`.
- Local bundle: `index-DlW5YI2U.js` is 47,479 bytes raw and `index-BjYYWMRj.css` is 19,931 bytes raw. The responsive hero remains 38,846 bytes at 640 px.
- Live checks and screenshots named above are recorded after the publisher serves `aa60d2c`.
