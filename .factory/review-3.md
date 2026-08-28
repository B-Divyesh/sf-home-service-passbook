# Adversarial first-read review 3 — Home Service Passbook

Reviewed 2026-08-28 against repository commit `80080f6a48e0ceb9a7496eedd413dfd2e764e5ff` and live <https://home-service-passbook.sociobot.in>.

## Verdict: FAIL

Three copy findings remain. `F-3-1` reopens earlier finding `F-1-13`, so it is BLOCKING under the history rule. All declared claim tests, the demo, storage isolation, offline reload, route structure, link crawl, accessibility smoke checks, full test suite, and production build pass.

- Blocking findings: 1
- Minor findings: 2
- Declared claim tests: 14 passed, 0 failed
- Untested or unlisted behavioral claims: 0
- Verdict rule: any finding means `FAIL`.

## 1. Cold first read

Fresh Chromium contexts opened `/` at 390 × 844 and 1440 × 900. Nothing was scrolled before recording these answers.

| Question | First-read answer | Exact live copy | Result |
| --- | --- | --- | --- |
| What does this do? | It remembers recurring home service work and its records. | “Remember every home service job” | Pass |
| For whom? | Households tracking maintenance dates, notes, and receipts without appliance accounts. | “For households tracking recurring care, service dates, notes, and receipts without another appliance account.” | Pass |
| What should I click first? | Open the filled sample. | “Try it with sample data” | Pass |

The sample action was fully visible before scrolling: `y=494.625–545.422` on mobile and `y=603.031–653.828` on desktop. Both requests returned 200 and produced no console or page errors. The first-screen gate passes.

## 2. Copy audit

Counts use whitespace-delimited words; hyphenated terms, dates, prices, paths, and URLs count as one word. Repeated identical labels are grouped with their locations. The landing audit includes prose, headings, actions, navigation, status labels, sample labels, and footer copy. README shell commands are commands rather than sentences and are not counted.

### Live landing page

| Copy | Words | Location | Result |
| --- | ---: | --- | --- |
| Skip to main content | 4 | Keyboard skip link | Pass |
| Home Service Passbook | 3 | Header wordmark; footer | Pass |
| Home Service Passbook home | 4 | Wordmark accessible name | Pass |
| Main navigation | 2 | Navigation accessible name | Pass |
| Demo | 1 | Header navigation | Pass |
| Passbook | 1 | Header navigation | Pass |
| Privacy | 1 | Header and footer links | Pass |
| A private log for the work at home | 8 | Hero eyebrow | **Flag: F-3-1 / reopened F-1-13** |
| Remember every home service job | 5 | H1 | Pass |
| For households tracking recurring care, service dates, notes, and receipts without another appliance account. | 14 | Hero sentence | Pass |
| Try it with sample data | 5 | Primary action | Pass |
| Start my passbook | 3 | Secondary action | Pass |
| The demo opens a filled service history. | 7 | Action explanation | Pass |
| Starting for real opens your passbook. | 6 | Action explanation | Pass |
| Works offline after the first visit | 6 | Hero fact | Pass |
| Records stay in this browser | 5 | Hero fact | Pass |
| Free for five home assets | 5 | Hero fact | Pass |
| Product facts | 2 | Facts-list accessible name | Pass |
| Service record | 2 | Hero instrument label | Pass |
| A furnace filter, service tag, receipt, screwdriver, and maintenance dial arranged on a workbench. | 14 | Hero image alternative | Pass |
| Example maintenance status | 3 | Instrument accessible name | Pass |
| 03 assets | 2 | Hero instrument readout | Pass |
| 01 due now | 3 | Hero instrument readout | Pass |
| log ready | 2 | Hero instrument readout | **Flag: F-3-1 / reopened F-1-13** |
| Sample service schedule | 3 | Preview eyebrow | Pass |
| See what is due and why | 6 | Preview heading | Pass |
| Each job keeps its own schedule rule and proof. | 9 | Preview sentence | Pass |
| Up next | 2 | Preview column label | Pass |
| 28 Aug 2026 | 3 | Preview date | Pass |
| Overdue | 1 | Sample status | Pass |
| Replace air filter | 3 | Sample job heading | Pass |
| Furnace · Utility room | 3 | Sample asset and area | Pass |
| Due | 1 | Sample date label; appears twice | Pass |
| 14 Aug | 2 | Sample due date | Pass |
| 3 months after completion | 4 | Sample recurrence | Pass |
| Next | 1 | Sample status | Pass |
| Vacuum condenser coils | 3 | Sample job heading | Pass |
| Refrigerator · Kitchen | 2 | Sample asset and area | Pass |
| 15 Sep | 2 | Sample due date | Pass |
| Every 6 months | 3 | Sample recurrence | Pass |
| How it works | 3 | Section eyebrow | Pass |
| Record service history in three steps | 6 | Section heading | Pass |
| Add the thing you maintain | 5 | Step heading | Pass |
| Name its room, appliance, or outside area. | 7 | Step sentence | Pass |
| Choose the repeat rule | 4 | Step heading | Pass |
| Use fixed calendar dates or count from completion. | 8 | Step sentence | Pass |
| Record the work | 3 | Step heading | Pass |
| Keep the date, note, receipt reference, and optional photo. | 9 | Step sentence | Pass |
| What this passbook does not do | 6 | Scope eyebrow | Pass |
| A record, not a repair guide | 6 | Scope heading | Pass |
| This passbook does not control appliances. | 6 | Scope sentence | Pass |
| It does not diagnose faults, certify safety, or file warranty claims. | 11 | Scope sentence | Pass |
| Follow manufacturer guidance and use a qualified professional where needed. | 10 | Scope sentence | Pass |
| Price | 1 | Paid section eyebrow | Pass |
| Keep more than five assets | 5 | Paid section heading | Pass |
| One $19 House Key purchase adds unlimited assets and local photo attachments. | 12 | Paid sentence | Pass |
| Backup, print, and accessibility stay free. | 6 | Paid sentence | Pass |
| Buy House Key — $19 | 4 | Paid action | Pass |
| Restore a license | 3 | License action | Pass |
| Household-owned maintenance records. | 3 | Footer | Pass |
| Terms | 1 | Footer link | Pass |
| Built by Param Factory · v1.0.3 | 5 | Footer | Pass |

No landing sentence exceeds 22 words and no banned marketing word appears. All action labels name their result. The two uses of “log” fail terminology and useful-label requirements.

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
| Records service dates, notes, receipt references, and licensed photo attachments. | 10 | **Flag: F-3-2** |
| Lets you edit or delete assets, recurring jobs, and service entries. | 11 | Pass |
| Exports and imports one complete JSON backup. | 7 | Pass |
| Exports every current job and due date to a calendar file. | 11 | Pass |
| Prints service history. | 3 | Pass |
| Works offline after the first visit. | 6 | Pass |
| The demo uses its own IndexedDB database. | 7 | Pass in technical sandbox documentation |
| Demo changes never write to the real passbook. | 8 | Pass |
| See .factory/demo.md. | 2 | Pass |
| Price | 1 | Pass |
| The free passbook holds five assets. | 6 | Pass |
| House Key costs $19 once and adds unlimited assets and local photo attachments. | 13 | Pass |
| Backup, printing, and accessibility remain free. | 6 | Pass |
| Checkout and license verification use the Sociobot billing API. | 9 | Pass in technical payment documentation |
| Run and test | 3 | Pass |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| npm test runs recurrence unit tests and Playwright browser tests. | 10 | Pass |
| Browser tests cover the demo, privacy, offline use, backups, and accessibility. | 11 | Pass |
| They also cover keyboard use and the full service-record flow. | 10 | Pass |
| npm run build is the deployment command. | 7 | Pass |
| It writes the static site to dist/, with dist/index.html at its root. | 12 | Pass |
| Data and privacy | 3 | Pass |
| Passbook data stays in browser IndexedDB unless the user exports it. | 11 | Pass in technical privacy documentation |
| License verification sends only the license token to api.sociobot.in. | 9 | Pass |
| There are no analytics, third-party scripts, or remote fonts. | 9 | Pass |
| Export JSON before clearing site data or moving devices. | 9 | Pass |
| Import validates every nested record before confirmation. | 7 | **Flag: F-3-3** |
| The prior passbook is retained as a rollback if imported data ever fails startup validation. | 15 | **Flag: F-3-3** |
| Scope | 1 | Pass |
| This product keeps records. | 4 | Pass |
| It does not control appliances, diagnose faults, certify safety, give repair advice, or file warranty claims. | 16 | Pass |
| Project notes | 2 | Pass |
| Visual system and generated-art provenance: .factory/design.md | 6 | Pass in repository documentation |
| Testable product claims: .factory/claims.json | 4 | Pass |
| Final verification: .factory/handoff.md | 3 | Pass |
| License: MIT | 2 | Pass |

No README sentence exceeds 22 words and no banned marketing word appears. `F-3-2` is ambiguous wording; `F-3-3` uses implementation language where a user-facing outcome is clearer.

## 3. Demo and sandbox

Result: pass.

- The first-screen “Try it with sample data” link opens `/?demo=1` in one click.
- The first resulting screen is the working product. It immediately shows three assets, three recurring jobs, one overdue job, and realistic names including “Replace air filter.”
- The persistent banner reads “Demo — sample data, nothing is saved to your passbook.” and includes `Reset demo` and `Start for real`.
- Adding a fourth demo asset and selecting `Reset demo` returned the count to three and removed the added record.
- A real Boiler seeded before demo entry remained after reset and exit. The sample Furnace did not appear in the real passbook.
- IndexedDB exposed separate `demo:home-service-passbook` and `home-service-passbook` databases.
- The complete live demo browse/export flow made no cross-origin request and produced no console error.
- After service-worker control, `/demo` reloaded offline and still showed “Replace air filter.”

## 4. Claims verification

A clean clone at `/tmp/hsp-review3-nRcj1S` checked out `80080f6`. After `npm ci`, every literal command in `.factory/claims.json` was run separately. Each command exited 0.

| Claim ID | Result | Observed coverage |
| --- | --- | --- |
| `demo-sandbox` | Pass | Filled demo, reset, and real/demo namespace isolation |
| `recurrence-rules` | Pass | Fixed and completion-based schedules produce the promised due behavior |
| `json-backup` | Pass | All collections and an attachment export and round-trip |
| `local-only` | Pass | Demo browse/export emits no cross-origin request |
| `offline-reload` | Pass | Controlled demo reloads offline with sample records |
| `house-key-limit` | Pass | Five-asset limit, $19 checkout, token binding, photos, and free controls |
| `service-log` | Pass | Dates, notes, receipt reference, and refresh persistence |
| `print-history` | Pass | Print action invokes the browser print path |
| `calendar-export` | Pass | Three current jobs export with matching dates and context |
| `scope-boundaries` | Pass | Published limits match actions and request destinations |
| `record-corrections` | Pass | Future-date rejection plus edit/delete persistence |
| `import-validation` | Pass | Malformed JSON and nested records do not replace real records |
| `import-rollback` | Pass | Invalid imported startup state restores the prior passbook |
| `refund-revocation` | Pass | A revoked verdict locks paid features |

The live landing page and README were cross-checked after the tests. Every behavioral statement maps to a listed claim: sample isolation, scheduling, service records, backup/import, local-only storage, offline use, price/limits, printing, calendar export, boundaries, corrections, validation, rollback, and revocation. No unlisted behavioral claim remains.

## 5. Earlier findings and regression check

Read in full: `.factory/review-1.md`, `.factory/review-2.md`, `.factory/polish-1.md`, `.factory/polish-2.md`, and `.factory/handoff.md`. Each prior finding was checked in the deployed UI and current source.

| Earlier finding | Live and code confirmation | Result |
| --- | --- | --- |
| F-1-1 empty-passbook promise | Live/source say “Starting for real opens your passbook”; the real asset survived demo exit. | Fixed |
| F-1-2 missing scope claim | `scope-boundaries` exists and its clean-clone command passed. | Fixed |
| F-1-3 repository credential assertion | The sentence is absent from README and shipped copy. | Fixed |
| F-1-4 stale route social metadata | All seven routes update title, description, canonical, Open Graph, and Twitter text. | Fixed |
| F-1-5 incomplete 404 shell | Live random path returns HTTP 404 with full header/footer, metadata, icons, manifest, and home action; source matches. | Fixed |
| F-1-6 no off-app reminder | `Export calendar (.ics)` is present and `calendar-export` passed. | Fixed |
| F-1-7 23-word README sentence | It remains split into two shorter sentences. | Fixed |
| F-1-8 unsupported “durable” | The word is absent from README. | Fixed |
| F-1-9 introductory PWA/IndexedDB jargon | The introduction uses browser/offline language. IndexedDB remains only in technical storage documentation. | Fixed |
| F-1-10 “completion-relative recurrence” jargon | Reader copy says “from the last completion date.” | Fixed |
| F-1-11 untested “clean” print claim | “Clean” is absent; the tested statement is “Prints service history.” | Fixed |
| F-1-12 “The product itself” | Live/source use “Sample service schedule.” | Fixed |
| F-1-13 log/trail/history synonyms | “service log” and “service trail” were removed, but live/source still show “A private log…” and “log ready.” | **Not fixed; BLOCKING. Reopened as F-3-1.** |
| F-1-14 “Clear boundaries” | Live/source use “What this passbook does not do.” | Fixed |
| F-1-15 unexplained paid label | Live/source use “Price” and explain House Key before the action. | Fixed |
| F-2-1 artwork provenance assertion | “Original generated artwork.” is absent from SPA and static 404 copy. | Fixed |
| F-2-2 “Household ledger” synonym | `/app` uses “Passbook”; the old term is absent from source and bundle. | Fixed |
| F-2-3 “Wrong panel” metaphor | Static and SPA 404s use “Page not found.” | Fixed |
| F-2-4 “HOME / 01” decorative identifier | It is absent; the useful “Service record” label remains. | Fixed |

## 6. Structure, routing, accessibility, and identity

Result: pass.

- `/`, `/demo`, `/app`, `/history`, `/backup`, `/privacy`, and `/terms` each return 200 with `lang=en`, one `h1`, one `main`, route-specific title/description/canonical/Open Graph/Twitter text, favicon, and the 1200 × 630 social image.
- A random missing route returns HTTP 404 with the designed passbook shell and a `Return home` action.
- Privacy navigation and browser Back both restore focus to the new `h1` and update the polite live region.
- Every discovered internal link returned 200. The billing link returned the expected 303 to hosted checkout; the two `mailto:` links are explicit crawl exceptions.
- `robots.txt`, `sitemap.xml`, manifest, favicon, Apple touch icon, and social image all returned 200.
- Live response headers include CSP with `frame-ancestors` as a response header, HSTS, `nosniff`, referrer policy, and a restrictive permissions policy. No CSP error occurred.
- `/opt/fleet/lib/verify-url.sh` passed: 567 ms load, no errors, one H1, `lang=en`, main landmark, no missing alt text, and no unnamed buttons.
- Twenty live Axe scans across core routes, desktop/mobile, and light/dark modes found zero serious or critical issues. Checked demo and footer targets are at least 44 px; the mobile page has no horizontal overflow; reduced-motion coverage passes in the suite.
- The mid-century instrument-panel identity matches `.factory/design.md`: cream enamel, charcoal housings, orange controls, teal indicators, ruled records, original workbench art, and physical control shapes. It is not a generic SaaS template.
- The local production build matches the live JS and CSS byte-for-byte. JS is 47.48 KB raw / 14.33 KB gzip; CSS is 19.93 KB raw / 5.22 KB gzip.

## 7. Missed leverage

No additional feature is required by the brief. Calendar export supplies the obvious reminder path outside the app, and JSON export/import supplies local-first portability. Cloud sync would weaken the stated local-first model unless made an explicit opt-in product expansion. AI would not improve this deterministic record-keeping job, and no decorative AI feature, embedded provider key, Azure endpoint, or runtime model request is present.

## 8. Findings

### Blocking

#### F-3-1 (reopens F-1-13) — “Log” remains as a fourth name and an empty status label

- Exact quotes/locations: landing hero eyebrow, “A private log for the work at home”; hero instrument readout, “log ready”; source at `src/main.ts:74` and `src/main.ts:96`.
- Why this fails: the earlier finding required one stable vocabulary: `passbook` for the document, `service history` for completed work, and `service entry` for one record. “Log” still asks the visitor to infer whether it is another object. “log ready” also reports no count, condition, or action and is decorative status copy. `.factory/copy-audit.md` marks the first phrase as passing and omits the second, so the claimed closure did not audit all visible landing copy.
- Concrete fix: change the eyebrow to “Private home maintenance passbook.” Remove “log ready” or replace it with a specific existing term and observable value, such as “04 service entries,” with the sample count asserted in `@claim:demo-sandbox`. Update `.factory/copy-audit.md` and its regression test to reject standalone `log` in visitor copy.

### Minor

#### F-3-2 — “Licensed photo attachments” is ambiguous

- Exact quote/location: README, What it does: “Records service dates, notes, receipt references, and licensed photo attachments.”
- Why this fails: “licensed” can describe the photo’s copyright status or the user’s paid entitlement. The Price section calls the entitlement House Key, so this phrase makes the reader translate between terms.
- Concrete fix: “Records service dates, notes, and receipt references. House Key also stores photo attachments.”

#### F-3-3 — Import recovery uses developer jargon instead of the user-visible outcome

- Exact quotes/location: README, Data and privacy: “Import validates every nested record before confirmation.” and “The prior passbook is retained as a rollback if imported data ever fails startup validation.”
- Why this fails: “nested record,” “rollback,” and “startup validation” describe implementation mechanics. A household needs to know what is checked and what happens if the imported file cannot reopen.
- Concrete fix: “Before replacing your passbook, import checks every area, asset, job, service entry, and attachment. If imported data cannot open later, the app restores the passbook you had before importing.”

## What would make this perfect

Resolve all three findings: remove the remaining `log` synonym and empty status label, name the House Key photo feature directly, and rewrite import recovery around the visible outcome. Then rerun the full landing/README copy extraction, every claim command from a clean clone, the full suite and build, live demo isolation/offline request logging, route/link/metadata checks, and the earlier-finding table. PASS requires zero findings.
