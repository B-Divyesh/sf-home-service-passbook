# Perfection-loop polish 3

Repair commit `7aafe2a4cf9b71a36cb27b325871e04f685a407c` repaired candidate `80080f6a48e0ceb9a7496eedd413dfd2e764e5ff` against every finding in reviews 1–3 and both earlier polish records. It is deployed at <https://home-service-passbook.sociobot.in> (Azure deployment `9144ecea-677a-4771-8c03-b99dbaf83128`).

## Finding closure

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the truthful note: sample opens filled; Start for real opens the existing passbook. | `@claim:demo-sandbox`; [live first screen](polish-3-evidence/live-first-read.json); [live real/demo isolation](polish-3-evidence/live-demo-real-isolation.json). |
| F-1-2 | Retained the testable scope boundary and kept it in landing, terms, and README. | `@claim:scope-boundaries`; [live policy/link check](polish-3-evidence/live-policy-and-links.json); live `/terms`. |
| F-1-3 | Kept the unobservable repository-credential assertion out of visitor copy. | `reviewed product copy > removes the reviewed README jargon and unsupported statements`; `README.md`. |
| F-1-4 | Retained route-specific title, description, canonical, Open Graph, and Twitter updates. | `every route has matching metadata and History API navigation restores focus`; [live routes](polish-3-evidence/live-routes-final.json). |
| F-1-5 | Retained the full standalone 404 shell, metadata, footer, home action, and response override. | `static deployment policy > ships the standalone 404 with the full shell and social metadata`; [live 404](polish-3-evidence/screenshots/live-404-mobile.png); live `/missing-polish-3` returns 404. |
| F-1-6 | Retained free local calendar export for all current jobs and due dates. | `@claim:calendar-export` from clean clone; [live demo smoke](polish-3-evidence/live-smoke-retry/live-smoke.json). |
| F-1-7 | Kept the README test description split into short sentences. | Copy regression test; `README.md`. |
| F-1-8 | Kept unsupported “durable” out of README copy. | Copy regression test; `README.md`. |
| F-1-9 | Kept implementation jargon out of the introduction. | Copy regression test; `README.md`. |
| F-1-10 | Kept the reader-facing “from the last completion date” schedule wording. | `@claim:recurrence-rules`; `README.md`. |
| F-1-11 | Kept only the observable printing statement. | `@claim:print-history`; `README.md`. |
| F-1-12 | Kept “Sample service schedule” as the preview label. | Copy regression test; [live landing](polish-3-evidence/screenshots/live-landing-mobile.png). |
| F-1-13 | Removed the last competing `log` word from the hero and replaced its empty status with “04 service entries.” | `reviewed product copy > uses the approved first-screen and section wording`; `@claim:demo-sandbox`; [live first screen](polish-3-evidence/live-first-read.json). |
| F-1-14 | Kept the literal “What this passbook does not do” section label. | Copy regression test; live `/`. |
| F-1-15 | Kept “Price” as the paid-section label and House Key as the explained license name. | Copy regression test; live `/`. |
| F-2-1 | Kept the untestable artwork-provenance sentence out of public footer copy. | `reviewed product copy > keeps reviewed labels literal and uses passbook as the only document name`; [live routes](polish-3-evidence/live-routes-final.json). |
| F-2-2 | Kept Passbook as the only name for the stored document. | Same copy test; live `/app`. |
| F-2-3 | Kept “Page not found” on both 404 shells. | Same copy test; [live 404](polish-3-evidence/screenshots/live-404-mobile.png). |
| F-2-4 | Kept the decorative hero identifier removed. | Same copy test; [live first screen](polish-3-evidence/live-first-read.json). |
| F-3-1 | Replaced “A private log for the work at home” with “Private home maintenance passbook.” Replaced “log ready” with a real four-entry sample count, visible on mobile. | Copy regression test rejects standalone `log`; `@claim:demo-sandbox`; [live desktop/mobile first screen](polish-3-evidence/live-first-read.json), [mobile screenshot](polish-3-evidence/screenshots/live-landing-mobile.png). |
| F-3-2 | Rewrote README photo copy: records keep dates, notes, and receipt references; House Key stores photo attachments. | Copy regression test; [live policy/source check](polish-3-evidence/live-policy-and-links.json); `README.md`. |
| F-3-3 | Rewrote README import recovery around what households see. Updated both claim records and strengthened import validation to reject malformed area, asset, job, service-entry, and attachment records before confirmation. | `@claim:import-validation`; `@claim:import-rollback`; [live policy/source check](polish-3-evidence/live-policy-and-links.json); `README.md`. |

## Cumulative verification

- Clean clone `/tmp/hsp-polish-3-clean-riEgZB` ran `npm ci` and every one of the 14 literal claim commands independently; all passed.
- The clean clone then passed `npm test` (18 Vitest/static tests and 19 Playwright tests) and `npm run build`; `dist/index.html` is present.
- Local checks: [verify-url](polish-3-evidence/local-verify/verify.json), [offline/privacy/Axe smoke](polish-3-evidence/local-live/live-smoke.json), [metadata review](polish-3-evidence/local-review.json), and [Lighthouse](polish-3-evidence/local-lighthouse-retry.json). Local Lighthouse is 100 performance, 100 accessibility, 100 best practices, and 100 SEO.
- Live cold checks: [verify-url](polish-3-evidence/live-verify/verify.json), [20-scan live Axe/offline smoke](polish-3-evidence/live-smoke-retry/live-smoke.json), [direct demo reset](polish-3-evidence/live-demo-reset.json), [real/demo isolation](polish-3-evidence/live-demo-real-isolation.json), [routing/focus/404](polish-3-evidence/live-routes-final.json), and [headers/link crawl](polish-3-evidence/live-policy-and-links.json). Live Lighthouse is 100/100/100/100.

No review finding of any severity remains open.
