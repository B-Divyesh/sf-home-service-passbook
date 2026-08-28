# Adversarial first-read review 1 — Home Service Passbook

Reviewed 2026-08-28 against commit `0cb012c4fff9bee1d6667bd1aea94440facdb00c` and <https://home-service-passbook.sociobot.in>.

## Verdict: FAIL

The first-read, demo, core workflow, declared claims, accessibility, offline, privacy, build, and performance checks pass. The release still fails the owner's zero-finding rule: 15 findings remain. None meets the brief's explicit BLOCKING conditions, but three published statements are not fully represented by `.factory/claims.json`, one first-screen statement is false for returning users, route metadata is incomplete, and the copy audit has unresolved plain-word defects.

- Blocking findings: 0
- High findings: 1
- Medium findings: 5
- Low findings: 9
- Untested or unlisted claims: 3
- Verdict rule applied: any finding or untested claim means `FAIL`.

## 1. Cold first read

Fresh Chromium contexts opened the live site at 390 × 844 and 1440 × 900. No scrolling occurred before these answers were recorded.

| Question | First-read answer | Exact supporting copy | Result |
| --- | --- | --- | --- |
| What does this do? | It keeps a household record of recurring maintenance work, dates, notes, and receipts. | “Remember every home service job” | PASS |
| For whom? | Households that want maintenance records without an appliance account. | “For households tracking recurring care, service dates, notes, and receipts without another appliance account.” | PASS |
| What should I click first? | Open the populated sample. | “Try it with sample data” | PASS |

At 390 px, the primary action was fully visible at `y=495–545` in the first viewport. Desktop showed the same headline, audience, primary action, and adjacent explanation. There were no console errors. The first-screen gate is not blocking.

## 2. Copy audit

Counts treat hyphenated terms, URLs, paths, prices, and versions as one word. Repeated navigation/footer labels and changing sample values are listed once or excluded when they are data labels rather than sentences. Headings and actions are included because the review contract explicitly applies to them.

### Live landing page

| # | Copy | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Home Service Passbook | 3 | Pass |
| 2 | Demo | 1 | Pass |
| 3 | Passbook | 1 | Pass |
| 4 | Privacy | 1 | Pass |
| 5 | A private log for the work at home | 8 | Pass |
| 6 | Remember every home service job | 5 | Pass |
| 7 | For households tracking recurring care, service dates, notes, and receipts without another appliance account. | 14 | Pass |
| 8 | Try it with sample data | 5 | Pass |
| 9 | Start my passbook | 3 | Pass |
| 10 | The demo opens a filled service log. | 7 | Flag: terminology, F-1-13 |
| 11 | Starting for real opens an empty passbook. | 7 | Flag: false/unlisted claim, F-1-1 |
| 12 | Works offline after the first visit | 6 | Pass |
| 13 | Records stay in this browser | 5 | Pass |
| 14 | Free for five home assets | 5 | Pass |
| 15 | The product itself | 3 | Flag: empty decorative label, F-1-12 |
| 16 | See what is due and why | 6 | Pass |
| 17 | Each job keeps its own schedule rule and proof. | 9 | Pass |
| 18 | How it works | 3 | Pass |
| 19 | Keep a service trail in three steps | 7 | Flag: metaphor/terminology, F-1-13 |
| 20 | Add the thing you maintain | 5 | Pass |
| 21 | Name its room, appliance, or outside area. | 7 | Pass |
| 22 | Choose the repeat rule | 4 | Pass |
| 23 | Use fixed calendar dates or count from completion. | 8 | Pass |
| 24 | Record the work | 3 | Pass |
| 25 | Keep the date, note, receipt reference, and optional photo. | 9 | Pass |
| 26 | Clear boundaries | 2 | Flag: context-free label, F-1-14 |
| 27 | A record, not a repair guide | 6 | Pass |
| 28 | This passbook does not control appliances. | 6 | Flag: unlisted claim, F-1-2 |
| 29 | It does not diagnose faults, certify safety, or file warranty claims. | 11 | Flag: unlisted claim, F-1-2 |
| 30 | Follow manufacturer guidance and use a qualified professional where needed. | 10 | Pass |
| 31 | House Key | 2 | Flag: unexplained brand-lore label, F-1-15 |
| 32 | Keep more than five assets | 5 | Pass |
| 33 | One $19 purchase adds unlimited assets and local photo attachments. | 10 | Pass |
| 34 | Backup, print, and accessibility stay free. | 6 | Pass |
| 35 | Buy House Key — $19 | 4 | Pass |
| 36 | Restore a license | 3 | Pass |
| 37 | Household-owned maintenance records. | 3 | Pass |
| 38 | Built by Param Factory · v1.0.2 | 5 | Pass |
| 39 | Original generated artwork. | 3 | Pass |

No landing sentence exceeds 22 words and no banned word appears. All landing buttons use result-naming verbs. The flagged labels, metaphor, terminology, and claims remain findings below.

### README

| # | Copy | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Home Service Passbook | 3 | Pass |
| 2 | Track recurring home care and keep proof in a private passbook. | 11 | Pass |
| 3 | Home Service Passbook is for households that need a durable maintenance record without appliance accounts. | 15 | Flag: vague marketing adjective, F-1-8 |
| 4 | It is an offline-first PWA that stores records in IndexedDB. | 10 | Flag: unexplained jargon, F-1-9 |
| 5 | Live site: https://home-service-passbook.sociobot.in | 3 | Pass |
| 6 | Demo: https://home-service-passbook.sociobot.in/demo | 2 | Pass |
| 7 | What it does | 3 | Pass |
| 8 | Stores areas, assets, and recurring jobs in the browser. | 9 | Pass |
| 9 | Supports fixed calendar and completion-relative recurrence. | 6 | Flag: jargon, F-1-10 |
| 10 | Records service dates, notes, receipt references, and licensed photo attachments. | 10 | Pass |
| 11 | Lets you edit or delete assets, recurring jobs, and service entries. | 11 | Pass |
| 12 | Exports and imports one complete JSON backup. | 7 | Pass |
| 13 | Prints a clean service history. | 5 | Flag: untested adjective, F-1-11 |
| 14 | Works offline after the first visit. | 6 | Pass |
| 15 | The demo uses its own IndexedDB database. | 7 | Pass in technical context |
| 16 | Demo changes never write to the real passbook. | 8 | Pass |
| 17 | See .factory/demo.md. | 2 | Pass |
| 18 | Price | 1 | Pass |
| 19 | The free passbook holds five assets. | 6 | Pass |
| 20 | House Key costs $19 once and adds unlimited assets and local photo attachments. | 13 | Pass |
| 21 | Backup, printing, and accessibility remain free. | 6 | Pass |
| 22 | Checkout and license verification use the Sociobot billing API. | 9 | Pass in developer context |
| 23 | No product ID or payment-provider credential is stored here. | 9 | Flag: unlisted claim, F-1-3 |
| 24 | Run and test | 3 | Pass |
| 25 | Requirements: Node.js 20 or newer and npm. | 7 | Pass in developer context |
| 26 | npm test runs recurrence unit tests and Playwright browser tests. | 10 | Pass in developer context |
| 27 | The browser tests cover the demo sandbox, local-only requests, offline reload, backup round trips, accessibility, mobile keyboard use, and the full service-record flow. | 23 | Flag: over 22 words and jargon, F-1-7 |
| 28 | npm run build is the deployment command. | 7 | Pass in developer context |
| 29 | It writes the static site to dist/, with dist/index.html at its root. | 12 | Pass in developer context |
| 30 | Data and privacy | 3 | Pass |
| 31 | Passbook data stays in browser IndexedDB unless the user exports it. | 11 | Pass in technical privacy context |
| 32 | License verification sends only the license token to api.sociobot.in. | 9 | Pass |
| 33 | There are no analytics, third-party scripts, or remote fonts. | 9 | Pass |
| 34 | Export JSON before clearing site data or moving devices. | 9 | Pass |
| 35 | Import validates every nested record before confirmation. | 7 | Pass |
| 36 | The prior passbook is retained as a rollback if imported data ever fails startup validation. | 15 | Pass |
| 37 | Scope | 1 | Pass |
| 38 | This product keeps records. | 4 | Pass |
| 39 | It does not control appliances, diagnose faults, certify safety, give repair advice, or file warranty claims. | 16 | Flag: unlisted claim, F-1-2 |
| 40 | Project notes | 2 | Pass |
| 41 | Visual system and generated-art provenance: .factory/design.md | 6 | Pass in developer context |
| 42 | Testable product claims: .factory/claims.json | 4 | Pass |
| 43 | Final verification: .factory/handoff.md | 3 | Pass |
| 44 | License: MIT | 2 | Pass |

Terminology should settle on **service history** for the collection and **service entry** for one completed job. “Service log” and “service trail” create unnecessary synonyms. The established terms **passbook**, **asset**, **job**, **service entry**, **backup**, and **House Key** are otherwise used consistently.

## 3. Demo and sandbox

PASS.

- One click on “Try it with sample data” opened `/demo` and, after route render, showed the working app rather than another explanation screen.
- The first app screen showed three assets, three recurring jobs, one overdue job, realistic names, dates, notes, and receipts.
- The persistent banner read: “Demo — sample data, nothing is saved to your passbook.” It exposed `Reset demo` and `Start for real` at 44 px height.
- A live service entry changed the demo from four to five entries. `Reset demo` returned it to four.
- A real `Boiler` created before demo entry remained after reset and exit. The sample `Furnace` did not appear in the real passbook.
- IndexedDB exposed separate `demo:home-service-passbook` and `home-service-passbook` databases.
- The full live flow made requests only to `https://home-service-passbook.sociobot.in`.
- After service-worker control, `/demo` reloaded offline and retained “Replace air filter.”

## 4. Declared claims

Every literal `test` command in `.factory/claims.json` was run separately after `npm ci` in the clean candidate checkout. All exited 0.

| Claim ID | Result | Observable coverage |
| --- | --- | --- |
| `demo-sandbox` | PASS | A real Boiler survives demo/reset/exit; sample Furnace stays isolated. |
| `recurrence-rules` | PASS | Fixed and completion-relative rules differ; missed fixed work remains overdue. |
| `json-backup` | PASS | All collections and an attachment export and round-trip. |
| `local-only` | PASS | Demo browse/export has no cross-origin request. |
| `offline-reload` | PASS | Controlled demo reloads offline with sample records. |
| `house-key-limit` | PASS | Five-asset limit, $19 checkout URL, token binding, photo persistence, and free controls. |
| `service-log` | PASS | Asset, schedule, date, note, receipt, and refresh persistence. |
| `print-history` | PASS | The print action invokes browser print. |
| `record-corrections` | PASS | Asset/job/entry corrections and deletion persist at the free limit. |
| `import-validation` | PASS | Malformed JSON and nested data do not replace real records. |
| `import-rollback` | PASS | Invalid imported startup state restores the prior passbook. |
| `refund-revocation` | PASS | A revoked verdict locks paid features. |

The tests pass, but F-1-1, F-1-2, and F-1-3 identify published statements without exact manifest coverage. Under the claims contract, passing listed tests does not excuse unlisted claims.

## 5. History and regression check

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. The prior `.factory/handoff.md` reports no open defect. As an additional safeguard, the findings in `verification.md`, `verification-2.md`, and `verification-3.md` were checked rather than relying only on the PASS in `verification-5.md`.

| Earlier issue | Current confirmation |
| --- | --- |
| Dead checkout | Fixed: live endpoint returns 303 to hosted Dodo checkout. |
| Unsafe/corrupt import and rollback | Fixed: `import-validation` and `import-rollback` pass. |
| Future dates and missing correction/delete paths | Fixed: full suite and `record-corrections` pass. |
| Missed fixed-calendar work hidden | Fixed: `recurrence-rules` keeps it overdue. |
| Tokenless entitlement/refund behavior | Fixed: `house-key-limit` and `refund-revocation` pass. |
| Asset editing blocked at five assets | Fixed by the five-asset correction case. |
| Silent IndexedDB save failure | Fixed by the full suite's failure/retry case. |
| Dark contrast, undersized targets, dialog focus, legal email targets | Fixed: 20 live axe scans have zero serious/critical issues; keyboard and 44 px target checks pass. |
| Soft 404 and short asset caching | Fixed: an unknown route returns HTTP 404; hashed JS returns `max-age=31536000, immutable`. |
| Variable Lighthouse result | Current mobile Lighthouse: 100/100/100/100, LCP 1.3 s, TBT 10 ms, CLS 0. |

No earlier finding was observed to be unfixed or regressed, so no prior ID is repeated as BLOCKING.

## 6. Structure, routing, accessibility, and identity

Passing checks:

- `/`, `/demo`, `/app`, `/history`, `/backup`, `/privacy`, `/terms`, and the designed missing route have one `h1`, one `main`, and route-appropriate document titles.
- Canonicals update to the active SPA route. Deep links load the correct panel.
- Back/forward restores the route and focuses the route `h1`; route changes are announced.
- All reachable internal links returned 200; checkout returned the expected 303; explicit `mailto:` links were excluded from HTTP crawling.
- A random missing route returned HTTP 404 with a designed way home.
- The standard header/footer skeleton is present on SPA routes.
- The mid-century instrument-panel identity, original workbench art, cream/charcoal/orange/teal palette, ledger rules, and physical controls are distinct from a generic SaaS template.
- `npm test`: 11 Vitest and 16 Playwright tests passed. The suite includes axe, keyboard, reduced-motion, 200% text, storage-error, route, and claim checks.
- `npm run build`: passed; JS is 45.01 KB raw / 13.58 KB gzip and `dist/` was produced.
- Live verification: 20 axe scans across desktop/mobile and light/dark returned zero serious/critical findings; no console errors; no horizontal overflow.
- Current Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100.

Route metadata and the static 404 shell still have F-1-4 and F-1-5.

## 7. Findings

### High

#### F-1-1 — The first screen falsely promises an empty passbook and the claim is unlisted

- Exact quote/location: landing action note, “Starting for real opens an empty passbook.”
- Why this fails: a returning visitor's real passbook is not empty. The implementation correctly preserves it, so the first-screen explanation contradicts the safe behavior. No claim entry tests this exact promise.
- Concrete fix: replace it with “The demo opens a filled service history. Starting for real opens your passbook.” Update the copy audit. Do not add a test for behavior the product should not have.

### Medium

#### F-1-2 — Safety/scope promises are absent from the claims manifest

- Exact quotes/locations: landing, “This passbook does not control appliances” and “It does not diagnose faults, certify safety, or file warranty claims”; README Scope, “It does not control appliances, diagnose faults, certify safety, give repair advice, or file warranty claims.”
- Why this fails: these are material statements a household may rely on, but no exact `scope-boundaries` claim/test exists.
- Concrete fix: add one manifest entry and `@claim:scope-boundaries` test that checks the published boundaries, available actions, and request destinations, or rewrite the text as an explicit legal limitation and document why it is outside observable product claims.

#### F-1-3 — The repository credential statement is an unlisted claim

- Exact quote/location: README Price, “No product ID or payment-provider credential is stored here.”
- Why this fails: the current tests verify checkout behavior, not that the repository contains no provider credential or embedded provider identifier.
- Concrete fix: remove the sentence, or add a manifest claim with a source/bundle scan for credential patterns and forbidden provider endpoints. A plainer replacement is “Checkout opens on Sociobot; this app stores no payment details.” Test the observed request and storage result.

#### F-1-4 — SPA social metadata stays on the landing-page identity

- Exact location: `/demo`, `/app`, `/history`, `/backup`, `/privacy`, and `/terms` update `document.title` and canonical, but retain `og:title="Home Service Passbook — Track home maintenance"` and the landing description; Twitter title/description also remain unchanged.
- Why this fails: copied or shared deep links describe the landing page instead of the actual route.
- Concrete fix: update description, Open Graph title/description, and Twitter title/description with the route in `render()`, and add a route metadata test for every sitemap URL.

#### F-1-5 — The standalone 404 does not use the complete site shell or metadata

- Exact location: `public/404.html` and live unknown routes. The header omits `Passbook`; the footer omits “Built by Param Factory” and the version/build ID; Open Graph, Twitter card, Apple touch icon, manifest, and theme color are absent.
- Why this fails: the missing page is designed and returns 404, but it breaks the required consistent header/footer and metadata contract.
- Concrete fix: give `404.html` the same header links and full footer fields as the SPA shell, add the missing metadata, and assert them on a random 404 URL.

#### F-1-6 — The product does not help users remember due work outside the app

- Exact location: brief user need (“remember recurring home care”), landing headline (“Remember every home service job”), and the app's Due next panel.
- Why this fails: schedules are useful only after the household remembers to reopen the passbook. A normal user expects a way to put due dates into the calendar they already check. Cloud sync and AI are not warranted, but a private export is.
- Concrete fix: add “Export calendar (.ics)” to Due next. Generate one `VEVENT` per current job due date locally, include asset/area and recurrence wording, and add a claim test that parses the file and matches every due job. Keep it available offline and free.

### Low

#### F-1-7 — One README sentence exceeds the 22-word cap

- Exact quote/location: README Run and test, “The browser tests cover the demo sandbox, local-only requests, offline reload, backup round trips, accessibility, mobile keyboard use, and the full service-record flow.” (23 words)
- Why this fails: it exceeds the attached plain-words hard cap and stacks unrelated checks.
- Concrete fix: “Browser tests cover the demo, privacy, offline use, backups, and accessibility. They also cover keyboard use and the full service-record flow.”

#### F-1-8 — “Durable” is an unsupported marketing adjective

- Exact quote/location: README introduction, “Home Service Passbook is for households that need a durable maintenance record without appliance accounts.”
- Why this fails: “durable” supplies no usable behavior or tested measure.
- Concrete fix: “Home Service Passbook is for households that want maintenance dates, notes, and receipts without appliance accounts.”

#### F-1-9 — The README introduction uses unexplained implementation jargon

- Exact quote/location: “It is an offline-first PWA that stores records in IndexedDB.”
- Why this fails: a first-time reader should not need to know PWA or IndexedDB to understand the product.
- Concrete fix: “It works offline after the first visit and stores records in this browser.” Keep the IndexedDB name in the technical privacy section.

#### F-1-10 — “Completion-relative recurrence” is unnecessary jargon

- Exact quote/location: README What it does, “Supports fixed calendar and completion-relative recurrence.”
- Why this fails: the landing page already expresses the same behavior more clearly.
- Concrete fix: “Schedules jobs on fixed dates or from the last completion date.”

#### F-1-11 — “Clean” is an untested qualitative claim

- Exact quote/location: README What it does, “Prints a clean service history.”
- Why this fails: the `print-history` claim proves printing, not an undefined quality called “clean.”
- Concrete fix: “Prints service history.”

#### F-1-12 — “The product itself” is a context-free decorative label

- Exact quote/location: landing preview eyebrow, “The product itself.”
- Why this fails: it names no section and could appear on any product page.
- Concrete fix: “Sample service schedule.”

#### F-1-13 — “Service log,” “service trail,” and “service history” name the same collection

- Exact quotes/locations: landing action note, “filled service log”; landing heading, “Keep a service trail in three steps”; app/README, “service history.”
- Why this fails: “trail” is a metaphor and three names force a first-time visitor to infer whether they are different things.
- Concrete fix: use “service history” for the collection and “service entry” for one record. Rewrite the heading as “Record service history in three steps.”

#### F-1-14 — “Clear boundaries” does not name its section

- Exact quote/location: landing scope eyebrow, “Clear boundaries.”
- Why this fails: read alone, it gives no subject.
- Concrete fix: “What this passbook does not do.”

#### F-1-15 — “House Key” is brand lore where the section needs “Price”

- Exact quote/location: landing paid-tier eyebrow, “House Key.”
- Why this fails: a cold visitor does not yet know that House Key is the paid license, and the label does not identify the section.
- Concrete fix: use the section label “Price”; retain “House Key” in the explanatory sentence and purchase action.

## 8. AI and missed leverage

No decorative AI feature, provider key, Azure endpoint, or runtime AI call was found. AI is not appropriate for this deterministic, local-first record keeper. F-1-6 identifies calendar export rather than adding unnecessary model use or cloud sync.

## What would make this perfect

Resolve all 15 findings, add exact tests for the three currently unlisted statements or remove/reframe them, make deep-link and 404 metadata complete, and add the private `.ics` calendar export with a claim test. Then rerun every manifest command, the full suite, build, live crawl, offline/privacy flow, axe scans, and this entire first-read/copy audit from a clean checkout. The standard for PASS is zero remaining findings, not “no blockers.”
