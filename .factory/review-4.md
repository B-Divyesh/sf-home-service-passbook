# Adversarial first-read review 4 — Home Service Passbook

Reviewed 2026-08-28 against repository commit `f69a6898ae4ede97727872408d348578ccce32cc` and live <https://home-service-passbook.sociobot.in>.

## Verdict: FAIL

The cold landing page is clear, every declared claim test passes, and the product is structurally complete. The mobile demo still fails the explicit first-screen requirement: after one click, no realistic sample record is readable without scrolling. This is one BLOCKING finding.

- Blocking findings: 1
- Minor findings: 0
- Declared claim tests: 14 passed, 0 failed
- Untested or unlisted claims: 0

## 1. Cold first read

Fresh Chromium contexts opened `/` at 390 × 844 and 1440 × 900. Nothing was scrolled before recording these answers.

| Question | First-read answer | Exact live copy | Result |
| --- | --- | --- | --- |
| What does this do? | It records recurring home service jobs, dates, notes, and receipts. | “Remember every home service job” | Pass |
| For whom? | Households tracking recurring home care without another appliance account. | “For households tracking recurring care, service dates, notes, and receipts without another appliance account.” | Pass |
| What should I click first? | Open the populated sample. | “Try it with sample data” | Pass |

At 390 px, the primary action occupied y=495–545 and all three facts ended by y=794. Desktop showed the same headline, audience, action, explanation, and facts. Both cold loads had no console or page errors. Evidence: [mobile](review-4-evidence/cold-mobile.png) and [desktop](review-4-evidence/cold-desktop.png).

## 2. Copy audit

Counts use whitespace-delimited words; dates, prices, paths, URLs, versions, and hyphenated terms count as one word. Repeated identical labels are grouped. Shell commands are commands rather than sentences. No line exceeds 22 words, no banned marketing word appears, terms are otherwise consistent, headings name their sections, and actions use result-naming verbs. The one accuracy flag maps to F-4-1.

### Live landing page

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
| The demo opens a filled service history. | 7 | **Flag: the opened panel is Due next and its first specific sample is below the mobile fold; F-4-1.** |
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
| Exports and imports one complete JSON backup. | 7 | Pass; JSON names the documented backup format. |
| Exports every current job and due date to a calendar file. | 11 | Pass |
| Prints service history. | 3 | Pass |
| Works offline after the first visit. | 6 | Pass |
| The demo uses its own IndexedDB database. | 7 | Pass; implementation detail in demo documentation. |
| Demo changes never write to the real passbook. | 8 | Pass |
| See .factory/demo.md. | 2 | Pass |
| Price | 1 | Pass |
| The free passbook holds five assets. | 6 | Pass |
| House Key costs $19 once and adds unlimited assets and local photo attachments. | 13 | Pass |
| Backup, printing, and accessibility remain free. | 6 | Pass |
| Checkout and license verification use the Sociobot billing API. | 9 | Pass; named integration in developer documentation. |
| Run and test | 3 | Pass |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass; run requirement. |
| npm test runs recurrence unit tests and Playwright browser tests. | 10 | Pass; test command and framework. |
| Browser tests cover the demo, privacy, offline use, backups, and accessibility. | 11 | Pass |
| They also cover keyboard use and the full service-record flow. | 10 | Pass |
| npm run build is the deployment command. | 7 | Pass |
| It writes the static site to dist/, with dist/index.html at its root. | 12 | Pass; deployment output. |
| Data and privacy | 3 | Pass |
| Passbook data stays in browser IndexedDB unless the user exports it. | 11 | Pass; exact storage mechanism in privacy documentation. |
| License verification sends only the license token to api.sociobot.in. | 9 | Pass; exact transmitted field and destination. |
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

Terminology remains stable: **passbook** is the stored document, **service history** is the collection, **service entry** is one completed-work record, **asset** is the maintained item, **job** is recurring work, **backup** is the portable file, and **House Key** is the paid license.

## 3. Demo and sandbox

Result: **BLOCKING failure**.

- “Try it with sample data” enters `/?demo=1` in one click.
- The persistent banner says “Demo — sample data, nothing is saved to your passbook.” and exposes `Reset demo` and `Start for real`.
- Sample storage and real storage are separate IndexedDB databases: `demo:home-service-passbook` and `home-service-passbook`.
- A live demo-only fifth service entry disappeared after Reset, restoring the original four entries.
- A real `Review 4 Boiler` survived demo entry and reset; the sample `Furnace` did not enter the real passbook.
- The live demo flow produced no cross-origin request. After service-worker control it reloaded offline with sample data.
- At 390 × 844, however, the first task row begins at y=830. Its status, “Replace air filter,” “Furnace · Utility room,” date, and repeat rule are below the viewport. The visible content is limited to generic totals, “3 recurring jobs,” and controls. Evidence: [first demo screen](review-4-evidence/demo-first-mobile.png).

Reset and isolation work; the first-screen sample presentation does not.

## 4. Claims verification

A clean clone at `/tmp/hsp-review4-clean-qWoqU6` ran `npm ci`, followed by every literal `test` command in `.factory/claims.json` separately. Every command exited 0.

| Claim ID | Result | Observable coverage |
| --- | --- | --- |
| `demo-sandbox` | Pass | Real/demo isolation, populated sample, reset, and exit |
| `recurrence-rules` | Pass | Fixed and completion-based schedule behavior |
| `json-backup` | Pass | All collections and licensed attachment round-trip |
| `local-only` | Pass | Demo browse/export request log stays same-origin |
| `offline-reload` | Pass | Controlled demo reloads offline with sample records |
| `house-key-limit` | Pass | Five-asset limit, $19 checkout, license, photos, free controls |
| `service-log` | Pass | Date, note, receipt, and refreshed persistence |
| `print-history` | Pass | Print action invokes the browser print path |
| `calendar-export` | Pass | Every current job and due date appears in parsed ICS |
| `scope-boundaries` | Pass | Published boundaries match available actions and requests |
| `record-corrections` | Pass | Edit/delete paths persist and future work is rejected |
| `import-validation` | Pass | Every malformed record type is rejected before replacement |
| `import-rollback` | Pass | A damaged imported state restores the earlier passbook |
| `refund-revocation` | Pass | A revoked verdict locks paid features |

The landing and README statements map to these entries. No listed test failed and no claim-like sentence lacks manifest coverage. F-4-1 is a presentation mismatch: the demo contains the tested records, but its first mobile viewport does not show them.

## 5. Earlier findings and regressions

Read in full: reviews 1–3, polish records 1–3, and the prior handoff. Each earlier finding was rechecked in live output and current source.

| Earlier ID | Live and code confirmation | Result |
| --- | --- | --- |
| F-1-1 | Action note says starting for real opens the existing passbook; real data survived demo exit. | Fixed |
| F-1-2 | `scope-boundaries` is listed and passed. | Fixed |
| F-1-3 | Repository-credential assertion remains absent. | Fixed |
| F-1-4 | All seven routes update title, description, canonical, OG, and Twitter text. | Fixed |
| F-1-5 | A random URL returns HTTP 404 with complete header/footer, metadata, icons, and home action. | Fixed |
| F-1-6 | Free `Export calendar (.ics)` remains present and its claim passed. | Fixed |
| F-1-7 | The former 23-word README sentence remains split. | Fixed |
| F-1-8 | Unsupported “durable” remains absent. | Fixed |
| F-1-9 | The introduction uses browser/offline language; implementation names remain only in technical sections. | Fixed |
| F-1-10 | Reader copy says “from the last completion date.” | Fixed |
| F-1-11 | “Clean” remains absent from the print claim. | Fixed |
| F-1-12 | Preview label remains “Sample service schedule.” | Fixed |
| F-1-13 | Visitor copy uses service history/service entry; `log` and `trail` remain absent. | Fixed |
| F-1-14 | Boundary label remains “What this passbook does not do.” | Fixed |
| F-1-15 | Paid section remains labeled “Price,” with House Key explained. | Fixed |
| F-2-1 | Public artwork-provenance assertion remains absent. | Fixed |
| F-2-2 | App eyebrow remains “Passbook”; `ledger` is absent. | Fixed |
| F-2-3 | Both 404 variants say “Page not found.” | Fixed |
| F-2-4 | Decorative `HOME / 01` remains absent. | Fixed |
| F-3-1 / F-1-13 | Hero says “Private home maintenance passbook” and shows “04 service entries.” | Fixed |
| F-3-2 | README separates free record fields from House Key photo attachments. | Fixed |
| F-3-3 | README names every checked import record and the visible restore outcome. | Fixed |

No prior ID is reopened.

## 6. Structure, accessibility, privacy, and identity

- `/`, `/demo`, `/app`, `/history`, `/backup`, `/privacy`, and `/terms` return 200 with `lang=en`, one `h1`, one `main`, route-specific titles/descriptions/canonicals/OG/Twitter metadata, favicon, Apple touch icon, and social image.
- Navigation and browser Back focus the new `h1`; the polite route status is present. Deep links load the correct panel.
- All crawled internal links return 200. Checkout returns the expected 303 from Sociobot. Explicit `mailto:` links are the only crawl exclusions.
- `/review-4-missing-page` returns HTTP 404 with the designed instrument-panel shell and `Return home`.
- `robots.txt`, sitemap, manifest, response-header CSP, privacy, terms, consistent header/footer, and reduced-motion rules are present.
- `npm run verify:live` reports no external demo requests, successful offline reload, keyboard operation, no mobile overflow, 44 px checked targets, no console errors on product routes, and zero serious/critical Axe findings across 20 route/theme/viewport scans.
- `/opt/fleet/lib/verify-url.sh` reports title, `lang`, one h1, `main`, complete alt text, named buttons, and zero load errors.
- `npm test` passes 18 Vitest and 19 Playwright tests. `npm run build` passes and produces `dist/`; JavaScript is 47.48 KB raw / 14.33 KB gzip.
- The cream enamel, charcoal panel, orange controls, teal indicators, ruled service records, workbench art, and physical-control shapes match `.factory/design.md` and are not a generic SaaS template.

## 7. Missed leverage

No additional feature is required by the brief. Calendar export supplies the obvious reminder path outside the app, and JSON export/import supplies portable local-first backup. Sync would change the privacy model. AI adds no clear value to deterministic maintenance records, and no decorative AI, provider key, Azure endpoint, or runtime model call is present.

## 8. Finding

### Blocking

#### F-4-1 — The mobile demo’s first screen hides every realistic sample record

- Exact quote/location: landing action note, “The demo opens a filled service history”; first mobile screen after “Try it with sample data,” 390 × 844. `.task-row` begins at y=830, but its first readable sample content begins below the 844 px viewport.
- Why a first-time visitor is lost or misled: the action promises a filled history, but the opened `Due next` panel shows only `03 assets`, `01 overdue`, `3 recurring jobs`, and controls before scrolling. No named asset, job, due date, service note, receipt, or entry is visible. A visitor cannot confirm what the sample contains or how the product represents their records within the required first screen.
- Concrete fix: make one complete sample record visible in the initial 390 × 844 viewport. Compact the demo banner/app header/toolbar, move the first task above the toolbar actions, or open a compact sample-history view. Show at least the job, asset/area, due or completed date, and one proof field. Then change the action note to describe the panel that actually opens, and add a 390 × 844 assertion that a named sample record’s bounding box is fully inside the initial viewport without scrolling.

## What would make this perfect

Resolve F-4-1 so one realistic, named sample record is fully readable immediately after the demo click at 390 × 844. Re-run the first-screen bounding-box assertion, Reset and real/demo isolation, all 14 claim commands, full suite/build, live offline/privacy log, route crawl, and the complete copy/history audit. PASS requires that result with zero remaining findings.
