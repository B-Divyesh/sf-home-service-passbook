# Adversarial first-read review 5 — Home Service Passbook

Reviewed 2026-08-29 against repository commit `f5343308d5ca969da85e9836ae04fbbc0e50b6f5` and the deployed site at <https://home-service-passbook.sociobot.in>.

## Verdict: PASS

There are zero blocking or minor findings, zero unlisted claims, and zero untested declared claims.

- Blocking findings: 0
- Minor findings: 0
- Declared claim tests: 14 passed
- First-read gate: passed at 390 × 844 and 1440 × 900

## 1. Cold first read

Fresh Chromium contexts opened `/` at 390 × 844 and 1440 × 900. No scrolling occurred before recording these answers. Screenshots are in `review-5-evidence/cold-mobile.png` and `review-5-evidence/cold-desktop.png`.

| Question | First-read answer | Exact supporting copy | Result |
| --- | --- | --- | --- |
| What does this do? | It is a private record for recurring household maintenance, including dates, notes, receipts, and proof. | “Remember every home service job” and “For households tracking recurring care, service dates, notes, and receipts without another appliance account.” | Pass |
| For whom? | Households that want to track recurring home care without an appliance account. | “For households tracking recurring care, service dates, notes, and receipts without another appliance account.” | Pass |
| What should I click first? | Try the populated sample. | “Try it with sample data” and “The demo opens with a sample record due next.” | Pass |

At 390 px, the primary action is fully visible at y=494.6–545.4. The direct action is adjacent to its outcome. The first screen contains no console or page errors. This is not a blocking finding.

## 2. Copy audit

Counts use whitespace-delimited words. Dates, prices, paths, URLs, version strings, and hyphenated terms count as one word. Repeated shell labels are listed once per route role. Buttons and headings are included because they affect first-read comprehension. No item exceeds 22 words. No banned marketing word, unexplained metaphor, inconsistent document name, or non-result-naming action was found.

### Landing route

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Home Service Passbook | 3 | Pass |
| Home Service Passbook home | 4 | Pass |
| Main navigation | 2 | Pass |
| Demo | 1 | Pass |
| Passbook | 1 | Pass |
| Privacy | 1 | Pass |
| Private home maintenance passbook. | 4 | Pass |
| Remember every home service job | 5 | Pass |
| For households tracking recurring care, service dates, notes, and receipts without another appliance account. | 14 | Pass |
| Try it with sample data | 5 | Pass |
| Start my passbook | 3 | Pass |
| The demo opens with a sample record due next. | 9 | Pass |
| Starting for real opens your passbook. | 6 | Pass |
| Works offline after the first visit | 6 | Pass |
| Records stay in this browser | 5 | Pass |
| Free for five home assets | 5 | Pass |
| Product facts | 2 | Pass |
| Service record | 2 | Pass |
| A furnace filter, service tag, receipt, screwdriver, and maintenance dial arranged on a workbench. | 14 | Pass |
| Example maintenance status | 3 | Pass |
| 03 assets | 2 | Pass |
| 01 due now | 3 | Pass |
| 04 service entries | 3 | Pass |
| Sample service schedule | 3 | Pass |
| See what is due and why | 6 | Pass |
| Each job keeps its own schedule rule and proof. | 9 | Pass |
| Up next | 2 | Pass |
| 28 Aug 2026 | 3 | Pass |
| Overdue | 1 | Pass |
| Replace air filter | 3 | Pass |
| Furnace · Utility room | 3 | Pass |
| Due | 1 | Pass |
| 14 Aug | 2 | Pass |
| 3 months after completion | 4 | Pass |
| Next | 1 | Pass |
| Vacuum condenser coils | 3 | Pass |
| Refrigerator · Kitchen | 2 | Pass |
| 15 Sep | 2 | Pass |
| Every 6 months | 3 | Pass |
| How it works | 3 | Pass |
| Record service history in three steps | 6 | Pass |
| 01 | 1 | Pass |
| Add the thing you maintain | 5 | Pass |
| Name its room, appliance, or outside area. | 7 | Pass |
| 02 | 1 | Pass |
| Choose the repeat rule | 4 | Pass |
| Use fixed calendar dates or count from completion. | 8 | Pass |
| 03 | 1 | Pass |
| Record the work | 3 | Pass |
| Keep the date, note, receipt reference, and optional photo. | 9 | Pass |
| What this passbook does not do | 6 | Pass |
| A record, not a repair guide | 6 | Pass |
| This passbook does not control appliances. | 6 | Pass |
| It does not diagnose faults, certify safety, or file warranty claims. | 11 | Pass |
| Follow manufacturer guidance and use a qualified professional where needed. | 10 | Pass |
| Price | 1 | Pass |
| Keep more than five assets | 5 | Pass |
| One $19 House Key purchase adds unlimited assets and local photo attachments. | 12 | Pass |
| Backup, print, and accessibility stay free. | 6 | Pass |
| Buy House Key — $19 | 4 | Pass |
| Restore a license | 3 | Pass |
| Terms | 1 | Pass |
| Household-owned maintenance records. | 3 | Pass |
| Built by Param Factory · v1.0.4 | 5 | Pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Home Service Passbook | 3 | Pass |
| Track recurring home care and keep proof in a private passbook. | 11 | Pass |
| Home Service Passbook is for households that want maintenance dates, notes, and receipts without appliance accounts. | 16 | Pass |
| It works offline after the first visit and stores records in this browser. | 13 | Pass |
| Live site: https://home-service-passbook.sociobot.in | 3 | Pass |
| Demo: https://home-service-passbook.sociobot.in/?demo=1 | 2 | Pass |
| What it does | 3 | Pass |
| Stores areas, assets, and recurring jobs in the browser. | 9 | Pass |
| Schedules jobs on fixed dates or from the last completion date. | 11 | Pass |
| Records service dates, notes, and receipt references. | 7 | Pass |
| House Key also stores photo attachments. | 6 | Pass |
| Lets you edit or delete assets, recurring jobs, and service entries. | 11 | Pass |
| Exports and imports one complete JSON backup. | 7 | Pass |
| Exports every current job and due date to a calendar file. | 11 | Pass |
| Prints service history. | 3 | Pass |
| Works offline after the first visit. | 6 | Pass |
| The demo uses its own IndexedDB database. | 7 | Pass; technical demo documentation. |
| Demo changes never write to the real passbook. | 8 | Pass |
| See .factory/demo.md. | 2 | Pass |
| Price | 1 | Pass |
| The free passbook holds five assets. | 6 | Pass |
| House Key costs $19 once and adds unlimited assets and local photo attachments. | 13 | Pass |
| Backup, printing, and accessibility remain free. | 6 | Pass |
| Checkout and license verification use the Sociobot billing API. | 9 | Pass; covered by the House Key checkout and verification flow. |
| Run and test | 3 | Pass |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| npm test runs recurrence unit tests and Playwright browser tests. | 10 | Pass |
| Browser tests cover the demo, privacy, offline use, backups, and accessibility. | 11 | Pass |
| They also cover keyboard use and the full service-record flow. | 10 | Pass |
| npm run build is the deployment command. | 7 | Pass |
| It writes the static site to dist/, with dist/index.html at its root. | 12 | Pass |
| Data and privacy | 3 | Pass |
| Passbook data stays in browser IndexedDB unless the user exports it. | 11 | Pass; technical privacy documentation. |
| License verification sends only the license token to api.sociobot.in. | 9 | Pass; the verification request test asserts `license` is its only query field. |
| There are no analytics, third-party scripts, or remote fonts. | 9 | Pass |
| Export JSON before clearing site data or moving devices. | 9 | Pass |
| Before replacing your passbook, import checks every area, asset, job, service entry, and attachment. | 14 | Pass |
| If imported data cannot open later, the app restores the passbook you had before importing. | 15 | Pass |
| Scope | 1 | Pass |
| This product keeps records. | 4 | Pass |
| It does not control appliances, diagnose faults, certify safety, give repair advice, or file warranty claims. | 16 | Pass |
| Project notes | 2 | Pass |
| Visual system and generated-art provenance: .factory/design.md | 6 | Pass |
| Testable product claims: .factory/claims.json | 4 | Pass |
| Final verification: .factory/handoff.md | 3 | Pass |
| License: MIT | 2 | Pass |

Terminology remains stable: **passbook** is the stored document, **service history** the collection, **service entry** one completed record, **asset** the maintained item, **job** recurring work, **backup** the portable file, and **House Key** the paid license.

## 3. Demo and sandbox

Result: pass.

- One click on “Try it with sample data,” and direct `/?demo=1`, open a working populated passbook.
- On the first 390 × 844 demo view, the card beginning at y=336 shows “Replace air filter,” “Furnace · Utility room,” “Aug 14, 2026,” and “Pack 2 of 4.” It is a realistic sample record, not a generic total.
- The persistent banner reads “Demo — sample data. Nothing saves to your passbook.” It includes `Reset demo` and `Start for real`.
- Live isolation check created a real `Review 5 real boiler`, entered and reset the demo, then returned to real mode. The sample remained available after reset; the real record remained visible after exit; the sample Furnace was absent from real mode; and the browser exposed separate `demo:home-service-passbook` and `home-service-passbook` stores. Evidence: `review-5-evidence/live-isolation.json`.
- `npm run verify:live` confirmed the controlled demo reloads offline and that demo browsing/export makes no cross-origin request. `review-5-evidence/live-review.json` independently recorded only same-origin deployed-page, JavaScript, and CSS requests during the direct demo load.

## 4. Declared claims

A clean clone at `/tmp/hsp-review5-clean.SCu4q4` ran `npm ci`, then every literal command in `.factory/claims.json` separately. The complete `npm test` run subsequently passed (`test-results/.last-run.json` reports `passed` with no failed tests), and `npm run build` produced `dist/`.

| Claim | Result |
| --- | --- |
| `demo-sandbox` | Pass |
| `recurrence-rules` | Pass |
| `json-backup` | Pass |
| `local-only` | Pass |
| `offline-reload` | Pass |
| `house-key-limit` | Pass |
| `service-log` | Pass |
| `print-history` | Pass |
| `calendar-export` | Pass |
| `scope-boundaries` | Pass |
| `record-corrections` | Pass |
| `import-validation` | Pass |
| `import-rollback` | Pass |
| `refund-revocation` | Pass |

The landing and README claims map to these declared tests. The direct request log confirms the local-only statement in the demo flow. No unlisted visitor-facing claim was found.

## 5. Earlier findings and regression check

All earlier review, polish, and handoff files were read. Each prior finding was checked against current source and deployed output, not accepted from its prior status alone.

| Earlier finding | Current confirmation | Result |
| --- | --- | --- |
| F-1-1 | The action note says real mode opens the existing passbook; live store isolation confirms it. | Fixed |
| F-1-2 | The scope boundary is published and `scope-boundaries` passes. | Fixed |
| F-1-3 | The unsupported repository-credential assertion is absent. | Fixed |
| F-1-4 | `/`, `/demo`, `/app`, `/history`, `/backup`, `/privacy`, and `/terms` each returned route-specific title, description, canonical, and OG title. | Fixed |
| F-1-5 | An unknown live URL returned HTTP 404 with a designed full shell, metadata, and home link. | Fixed |
| F-1-6 | `Export calendar (.ics)` is present and `calendar-export` passes. | Fixed |
| F-1-7 | The README browser-test description remains split into short sentences. | Fixed |
| F-1-8 | Unsupported “durable” wording is absent. | Fixed |
| F-1-9 | Reader-facing introduction avoids PWA/IndexedDB implementation jargon. | Fixed |
| F-1-10 | The schedule wording says “from the last completion date.” | Fixed |
| F-1-11 | The print statement makes no untested quality promise. | Fixed |
| F-1-12 | The preview is labelled “Sample service schedule.” | Fixed |
| F-1-13 | Landing and app use passbook/service history/service entry; the competing `log` and `trail` copy is absent. | Fixed |
| F-1-14 | The boundary section names what the passbook does not do. | Fixed |
| F-1-15 | Price is explicit; House Key is the named paid license. | Fixed |
| F-2-1 | Public artwork-provenance assertion is absent; provenance remains in the design record. | Fixed |
| F-2-2 | The product document is consistently called a passbook. | Fixed |
| F-2-3 | Both live and standalone 404 pages say “Page not found.” | Fixed |
| F-2-4 | Decorative `HOME / 01` is absent. | Fixed |
| F-3-1 | Hero says “Private home maintenance passbook” and reports actual sample entries. | Fixed |
| F-3-2 | README distinguishes free record fields from paid photo attachments. | Fixed |
| F-3-3 | README states the user-visible import check and restoration outcome. | Fixed |
| F-4-1 | The direct mobile demo begins with the full named sample record above the fold. | Fixed |

No earlier finding is reopened.

## 6. Structure, routing, privacy, and identity

- The landing, app, legal pages, and static 404 have one `h1`, one `main`, language metadata, descriptions, canonicals, OG/Twitter metadata, SVG favicon, Apple touch icon, and manifest.
- The missing route returned HTTP 404 and offers a home action. All landing internal HTTP links returned 200; `mailto:` links are explicit and excluded from HTTP crawling.
- Route navigation uses the History API. The full test suite checks route focus and the polite route announcement; source binds `popstate` to the same focused render path.
- `npm run verify:live` found no console errors, no serious or critical Axe violations across desktop/mobile and light/dark checks, no page overflow, 44 px demo/legal controls, keyboard skip navigation, and reduced-motion/offline coverage through the suite.
- The cream paper, charcoal instrument housing, orange controls, teal status marks, ruled records, generated workbench art, and designed 404 implement the documented mid-century instrument-panel identity. The landing does not use a generic SaaS hero/card treatment.

## 7. Missed leverage

No additional feature is required. The brief’s useful record, schedules, notes/proof, printable history, offline storage, and portable backup/import are present. The private local-first scope does not imply cloud sync, and an AI step would not improve the stated record-keeping job.

## What would make this perfect

Maintain the present result on future releases: rerun every declared claim command from a clean clone, keep the first mobile demo record in the initial viewport, and recheck the live request log whenever a new dependency or integration is introduced.
