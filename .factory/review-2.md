# Adversarial first-read review 2 — Home Service Passbook

Reviewed 2026-08-28 against live <https://home-service-passbook.sociobot.in> and repository commit `6e8e9cfbccc486309d8663e41e73c3f1c35cbb00`.

## Verdict: FAIL

There are **four findings**. No declared claim test failed and the demo is functional, but the release does not meet the requested zero-finding threshold. One published provenance assertion has no entry in `.factory/claims.json`; three labels use unexplained, decorative, or inconsistent language.

- Blocking findings: 0
- Medium findings: 1
- Minor findings: 3
- Declared claim tests: 14 passed, 0 failed

## 1. Cold first read

Fresh Chromium contexts opened `/` without scrolling at 390 × 844 and 1440 × 900.

| Question | First-read answer | Exact live copy | Result |
| --- | --- | --- | --- |
| What does this do? | It records recurring household maintenance, including completed work and proof. | “Remember every home service job” | Pass |
| For whom? | Households that want maintenance records without another appliance account. | “For households tracking recurring care, service dates, notes, and receipts without another appliance account.” | Pass |
| What should I click first? | Open the populated sample passbook. | “Try it with sample data” | Pass |

The primary action was fully inside the first viewport: `y=494.6–545.4` at 390 px and `y=603.0–653.8` at desktop. Both cold loads returned 200 and had no browser-console errors. The first-screen gate is not blocking.

## 2. Copy audit

Counts use whitespace-delimited words; prices, URLs, and hyphenated terms count as one word. The following are every prose sentence or factual line on the landing page. No line exceeds 22 words.

| Landing copy | Words | Result |
| --- | ---: | --- |
| For households tracking recurring care, service dates, notes, and receipts without another appliance account. | 14 | Pass |
| The demo opens a filled service history. | 7 | Pass |
| Starting for real opens your passbook. | 6 | Pass |
| Works offline after the first visit | 6 | Pass |
| Records stay in this browser | 5 | Pass |
| Free for five home assets | 5 | Pass |
| Each job keeps its own schedule rule and proof. | 9 | Pass |
| Name its room, appliance, or outside area. | 7 | Pass |
| Use fixed calendar dates or count from completion. | 8 | Pass |
| Keep the date, note, receipt reference, and optional photo. | 9 | Pass |
| This passbook does not control appliances. | 6 | Pass |
| It does not diagnose faults, certify safety, or file warranty claims. | 11 | Pass |
| Follow manufacturer guidance and use a qualified professional where needed. | 10 | Pass |
| One $19 House Key purchase adds unlimited assets and local photo attachments. | 12 | Pass |
| Backup, print, and accessibility stay free. | 6 | Pass |
| Household-owned maintenance records. | 3 | Pass |
| Original generated artwork. | 3 | F-2-1 |

The landing headings and actions are all result-naming or descriptive: `A private log for the work at home` (8), `Remember every home service job` (5), `Try it with sample data` (5), `Start my passbook` (3), `Sample service schedule` (3), `See what is due and why` (6), `How it works` (3), `Record service history in three steps` (6), `Add the thing you maintain` (5), `Choose the repeat rule` (4), `Record the work` (3), `What this passbook does not do` (6), `A record, not a repair guide` (6), `Price` (1), `Keep more than five assets` (5), `Buy House Key — $19` (4), and `Restore a license` (3).

README prose audit:

| README copy | Words | Result |
| --- | ---: | --- |
| Track recurring home care and keep proof in a private passbook. | 11 | Pass |
| Home Service Passbook is for households that want maintenance dates, notes, and receipts without appliance accounts. | 16 | Pass |
| It works offline after the first visit and stores records in this browser. | 13 | Pass |
| Stores areas, assets, and recurring jobs in the browser. | 9 | Pass |
| Schedules jobs on fixed dates or from the last completion date. | 11 | Pass |
| Records service dates, notes, receipt references, and licensed photo attachments. | 10 | Pass |
| Lets you edit or delete assets, recurring jobs, and service entries. | 11 | Pass |
| Exports and imports one complete JSON backup. | 7 | Pass |
| Exports every current job and due date to a calendar file. | 11 | Pass |
| Prints service history. | 3 | Pass |
| Works offline after the first visit. | 6 | Pass |
| The demo uses its own IndexedDB database. | 7 | Pass — technical storage detail in the demo documentation context |
| Demo changes never write to the real passbook. | 8 | Pass |
| The free passbook holds five assets. | 6 | Pass |
| House Key costs $19 once and adds unlimited assets and local photo attachments. | 13 | Pass |
| Backup, printing, and accessibility remain free. | 6 | Pass |
| Checkout and license verification use the Sociobot billing API. | 9 | Pass — technical payment detail |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| npm test runs recurrence unit tests and Playwright browser tests. | 10 | Pass |
| Browser tests cover the demo, privacy, offline use, backups, and accessibility. | 11 | Pass |
| They also cover keyboard use and the full service-record flow. | 10 | Pass |
| npm run build is the deployment command. | 7 | Pass |
| It writes the static site to dist/, with dist/index.html at its root. | 12 | Pass |
| Passbook data stays in browser IndexedDB unless the user exports it. | 11 | Pass — technical privacy detail |
| License verification sends only the license token to api.sociobot.in. | 9 | Pass |
| There are no analytics, third-party scripts, or remote fonts. | 9 | Pass |
| Export JSON before clearing site data or moving devices. | 9 | Pass |
| Import validates every nested record before confirmation. | 7 | Pass |
| The prior passbook is retained as a rollback if imported data ever fails startup validation. | 15 | Pass |
| This product keeps records. | 4 | Pass |
| It does not control appliances, diagnose faults, certify safety, give repair advice, or file warranty claims. | 16 | Pass |

README headings, links, commands, and project-note labels are labels rather than sentences. All are under 22 words. `IndexedDB`, `API`, Playwright, Node.js, and `dist/` occur only in technical run, privacy, or implementation documentation; they are not used to explain the first screen.

## 3. Demo and sandbox

The visible landing action opens `/?demo=1` in one click. The first resulting screen already showed “Replace air filter,” the persistent banner “Demo — sample data, nothing is saved to your passbook.”, `Reset demo`, and `Start for real`.

In a fresh 390 px context, I created a real `Boiler` record, entered the demo from the landing action, reset it, and left it. The real `/app?panel=assets` then contained `Boiler` once and `Furnace` zero times. The reset toast read “Demo reset to its original records.” The complete demo flow made no cross-origin request and emitted no console error. Live offline verification loaded `/demo`, let the service worker control the page, then reloaded offline with “Replace air filter” present.

Result: pass. The demo weakness is not blocking.

## 4. Claims verification

I made a fresh clone in `/tmp`, ran `npm ci`, then ran every literal `test` command in `.factory/claims.json` separately. The chain completed, the final full suite reported `test-results/.last-run.json` status `passed`, and `npm run build` produced `dist/index.html` at 2026-08-28 21:22:42 UTC.

| Claim ID | Result | Evidence |
| --- | --- | --- |
| `demo-sandbox` | Pass | Isolated real/demo record test passed. |
| `recurrence-rules` | Pass | Fixed and completion-relative schedule test passed. |
| `json-backup` | Pass | Complete backup and attachment round-trip test passed. |
| `local-only` | Pass | Playwright request log test passed. |
| `offline-reload` | Pass | Offline demo reload test passed. |
| `house-key-limit` | Pass | Limit, checkout, license, and attachment test passed. |
| `service-log` | Pass | Asset-to-completion persistence test passed. |
| `print-history` | Pass | Browser print invocation test passed. |
| `calendar-export` | Pass | ICS event content test passed. |
| `scope-boundaries` | Pass | Published-boundary and action/request test passed. |
| `record-corrections` | Pass | Edit/delete persistence test passed. |
| `import-validation` | Pass | Malformed imports preserve current records. |
| `import-rollback` | Pass | Corrupt imported startup state restores prior records. |
| `refund-revocation` | Pass | Revoked verdict locks paid features. |

The live landing and README were then cross-checked against the manifest. The footer assertion in F-2-1 has no entry and no observable claim test. All other visitor-relevant behavioral statements map to the above claims.

## 5. Earlier findings and regression check

Read in full: `.factory/review-1.md`, `.factory/polish-1.md`, and the prior `.factory/handoff.md`.

| Earlier finding | Live/code confirmation | Result |
| --- | --- | --- |
| F-1-1 empty-passbook promise | The live note now says “Starting for real opens your passbook”; real records survived demo exit. | Fixed |
| F-1-2 scope claim missing | `scope-boundaries` is present and passed. | Fixed |
| F-1-3 credential statement | The statement is absent from README. | Fixed |
| F-1-4 route social metadata | All seven application routes had matching title, description, canonical, OG, and Twitter title. | Fixed |
| F-1-5 incomplete 404 | A random missing URL returned HTTP 404 with header, footer, icons, manifest, and social metadata. | Fixed |
| F-1-6 calendar export | `Export calendar (.ics)` is present and `calendar-export` passed. | Fixed |
| F-1-7 long README sentence | The old 23-word line is split; no audited prose exceeds 22 words. | Fixed |
| F-1-8 unsupported “durable” | Absent from README. | Fixed |
| F-1-9 introductory PWA/IndexedDB jargon | “offline-first PWA” is absent from the introduction. | Fixed |
| F-1-10 completion-relative jargon | The reader-facing description now says “from the last completion date.” | Fixed |
| F-1-11 “clean” history claim | Absent; print claim is tested. | Fixed |
| F-1-12 “The product itself” | Replaced by “Sample service schedule.” | Fixed |
| F-1-13 service-log/trail terminology | Landing uses “service history” and “service entry.” | Fixed |
| F-1-14 “Clear boundaries” | Replaced by “What this passbook does not do.” | Fixed |
| F-1-15 unexplained paid-section label | The section label is “Price.” | Fixed |

No F-1 identifier is repeated as blocking: the former findings are fixed in both live output and current code. F-2-2 through F-2-4 are separate, newly observed copy defects.

## 6. Structure, routing, privacy, and product fit

- `/`, `/demo`, `/app`, `/history`, `/backup`, `/privacy`, and `/terms` each returned 200, had exactly one h1, and supplied route-specific title, description, canonical, Open Graph, and Twitter metadata. `/not-found-review-2` returned HTTP 404 with the designed shell.
- A live header navigation to Privacy and browser Back returned focus and the polite announcement to the appropriate h1 on both route changes.
- The consistent header, footer, skip link, Privacy/Terms links, favicon, apple touch icon, manifest, `robots.txt`, and sitemap are present. Retries of all internal routes and static links returned 200; the external checkout link is intentionally a Sociobot billing destination.
- Live mobile and desktop cold loads had no console errors. The service-worker-controlled demo reloaded offline. Demo request logging found no analytics, remote font, third-party script, or cross-origin request.
- The cream enamel, charcoal housing, orange controls, teal lamps, ruled ledger rows, and original workbench art match `.factory/design.md`. The composition is product-specific and not a generic centered-gradient SaaS template.
- The calendar export supplies the obvious off-app reminder path implied by recurring care. Private backup/import already supplies the expected portability path. No AI feature is warranted for deterministic local household records, and no runtime AI endpoint or provider key was found.

## 7. Findings

### Medium

#### F-2-1 — Footer provenance assertion is an unlisted claim

- Exact quote/location: global footer on the live landing and all application routes, “Original generated artwork.”
- Why this fails: “original” and “generated” are factual provenance assertions. `.factory/claims.json` has no entry for this assertion, and no test can establish it from the shipped visitor experience. The claims rule requires an entry for every claim-like sentence or removal of the claim.
- Concrete fix: remove this footer sentence. Keep detailed asset provenance in `.factory/design.md`, where it is already documented. If it remains public product copy, add a narrowly testable provenance record and claim test instead.

### Minor

#### F-2-2 — The app uses a second, unexplained name for the passbook

- Exact quote/location: `/app` eyebrow above the main heading, “Household ledger.”
- Why this fails: the product, navigation, README, demo banner, and terminology table call the stored document a “passbook.” “Ledger” can sound like a separate record or financial feature to a first-time visitor and breaks the one-term rule.
- Concrete fix: replace the eyebrow with “Passbook” or “Home maintenance passbook.” Add it to the terminology/copy test so the alternate label does not return.

#### F-2-3 — The 404 contains a context-free panel metaphor

- Exact quote/location: live unknown-route page and `public/404.html`, “Wrong panel.”
- Why this fails: it is decorative instrument-panel language, not a useful route label. A first-time visitor has no reason to call a web page a panel; the following h1 already conveys the needed information.
- Concrete fix: remove the eyebrow, or replace it with “Page not found.” Keep the h1 and the “Return home” action.

#### F-2-4 — The hero exposes an unexplained decorative identifier

- Exact quote/location: landing hero instrument label, “HOME / 01.”
- Why this fails: the number neither identifies a service record nor tells a visitor what to do. It is decorative text in a product whose copy rules prohibit decorative labels and require every visible line to carry usable information.
- Concrete fix: remove `HOME / 01`. If the visual needs a secondary label, use the useful “Service record” label only and hide purely decorative instrumentation from assistive technology.

## What would make this perfect

Remove the untestable artwork assertion, use `passbook` consistently, and delete or plainly rename the two decorative labels. Then rerun the 14 claim commands, full test suite, build, fresh mobile/desktop first-read check, demo isolation/offline request logging, and route crawl. A PASS requires those checks to remain clean with zero findings.
