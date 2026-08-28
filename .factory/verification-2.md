# Independent product verification 2 — FAIL

Verified on 2026-08-28 against candidate commit `a5e8f67398d473499cbaeb0be67b4c2a0e01b2bf` and <https://home-service-passbook.sociobot.in>.

## Decision

**FAIL — do not release this candidate.** The deployed static product matches the candidate, all nine declared claim commands pass after the locked install, and most repaired workflows work. Release is blocked by a dead paid checkout, incorrect missed-date behavior for fixed-calendar jobs, and published claims that are absent from `.factory/claims.json`. Two keyboard/touch accessibility defects also remain.

## First-read gate

The cold first screen passes on desktop and at 390 × 844 px.

- What it does: **“Remember every home service job.”**
- For whom: **“For households tracking recurring care, service dates, notes, and receipts without another appliance account.”**
- What to click first: **“Try it with sample data.”**
- The action is visible without scrolling. Its adjacent sentence says the demo opens a filled service log.
- One click opens `/demo` with realistic records and the persistent **Demo — sample data, nothing is saved to your passbook** banner, **Reset demo**, and **Start for real**.

Evidence: `evidence/live-first-read-desktop.png`, `evidence/live-first-read-mobile.png`, and `evidence/live-demo-mobile.png`.

## Candidate and deployment identity

- `git rev-parse HEAD`: `a5e8f67398d473499cbaeb0be67b4c2a0e01b2bf`.
- The checkout was otherwise clean before verification evidence was added.
- The built and live files match byte for byte:

| File | SHA-256 local = live |
| --- | --- |
| `index.html` | `d1b2875431e8a318f7a87bd9104b65dceabaf96465c3ff68e8182381f3d7247a` |
| `assets/index-CsvaVtZa.js` | `0b2f9c88b630339b78a7d59c37e9bee3da099f544e764368167cb996065ff047` |
| `assets/index-ByxEwoz2.css` | `358f4624c616863a338183956b3972620d49aaecd5aaf4264c727cd6b70d` |
| `sw.js` | `bd8fa2c4fb9bf127feb193c047eee603cf2c67f18597257a73f36cd271241f05` |
| `manifest.webmanifest` | `2e4e214c6813f982693ccdd4206be8afc9635cb7e8b2610fe66b45b4be099d94` |
| `404.html` | `764cff590c54ad4eb8676a7a471296940333642bb481068613316861feb36d06` |

Live `/`, `/app`, `/demo`, `/history`, `/backup`, `/privacy`, and `/terms` return 200. An unknown route returns the designed page with HTTP 404.

## Mandatory claim tests

`.factory/claims.json` exists and contains nine entries. The initial pre-install invocation could not start because the clean clone had no `node_modules` (`vitest: not found`). After the required `npm ci`, every exact listed command was rerun independently and returned exit 0:

| Claim | Result | Evidence |
| --- | --- | --- |
| `demo-sandbox` | PASS | A pre-existing real Boiler survives demo entry/reset/exit; demo Furnace does not cross namespaces. |
| `recurrence-rules` | PASS | Both labels render and the three declared date unit cases pass. The missed-date defect below is not covered. |
| `json-backup` | PASS | All collections and a persisted attachment round-trip through JSON. |
| `local-only` | PASS | The declared demo browse/export flow has no cross-origin request. |
| `offline-reload` | PASS | A controlled `/demo` reloads offline with sample records. |
| `house-key-limit` | PASS | Five-asset boundary, token binding, attachment persistence/export, and free controls pass with a mocked valid verdict. |
| `service-log` | PASS | Asset, schedule, date, note, receipt, and refresh persistence pass. |
| `print-history` | PASS | The action invokes the browser print path. |
| `record-corrections` | PASS | Future dates are rejected; asset/job/entry correction and deletion persist. |

The manifest still violates the claims contract. Published, user-reliable statements have no claim entry or exact `@claim:` test:

- README: **“Import validates every nested record before confirmation.”**
- README: **“The prior passbook is retained as a rollback if imported data ever fails startup validation.”**
- License panel: **“A refund revokes the license.”**

There are untagged tests for two import recovery cases, but the contract requires the claims themselves in `.factory/claims.json`. This is release-blocking regardless of those untagged checks.

## Repository gates

- `npm ci`: PASS — 60 packages, 0 vulnerabilities.
- `npm audit --audit-level=high`: PASS — 0 vulnerabilities.
- `npm run lint`: PASS — `tsc --noEmit`.
- `npm test`: PASS — 10 Vitest tests and 14 Playwright tests.
- `npm run build`: PASS — exact production build created `dist/`.
- `git diff --check`: PASS before report edits.
- README, MIT LICENSE, privacy, terms, design, demo, copy audit, manifest, icons, robots, sitemap, and handoff files exist.

## Independent end-to-end testing

A fresh 390 px live context completed 25 independent checks outside the repository suite. Evidence is in `evidence/independent-e2e.json` and `evidence/live-e2e-mobile.png`.

Passing behavior:

- Entered the sample demo in one click, then opened a separate empty real passbook.
- Added a Water heater and a completion-relative annual Flush tank job.
- Empty required input focused the Area field; interval `0` focused the invalid field.
- A future completion was rejected and focused; a valid date, note, and receipt survived refresh.
- Asset and service-entry edits persisted. Cancelled deletion retained the record; confirmed deletion removed it.
- The sixth asset reached the paid panel while Backup remained free.
- A malformed nested version-1 backup was rejected without replacing valid records.
- At exact boundaries, interval `120` was accepted and `121` rejected. A 3,000,000-byte attachment persisted and exported; 3,000,001 bytes was rejected.
- No console error, page error, unexpected outbound request, or 390 px page overflow occurred.

### Core recurrence failure

On 2026-08-28, a new **Repeat every 6 months** job with first due date `2026-08-01` and no completions should be overdue. The live product instead shows:

```text
SCHEDULED · Last done Not yet · DUE Feb 1, 2027
00 OVERDUE
```

The fixed-calendar algorithm advances every past date until it finds a future date, even when no work was recorded. Missed calendar work therefore disappears rather than remaining overdue. This defeats the brief's core requirement to remember missed recurring care. Evidence: `evidence/missed-calendar-not-overdue.json` and `evidence/missed-calendar-not-overdue.png`.

## Accessibility and responsive behavior

Passing:

- The factory URL verifier passes: title, `lang=en`, one H1, main landmark, image alt, button names, and zero console errors; measured load was 590 ms. Evidence: `evidence/verify-url/verify.json`.
- Twenty live axe scans report zero serious/critical findings across `/`, `/demo`, `/privacy`, `/terms`, and `/404`, at 1280 and 390 px in both light and dark themes. Evidence: `evidence/live-smoke/live-smoke.json`.
- Cold mobile content has no page overflow. The populated app also has no overflow after text is set to 200%.
- The skip link works. Visible focus is a designed 3 px teal outline. Escape closes the native dialog and returns focus to its opener.
- Back navigation restores the prior panel and focuses its H1.
- Reduced motion computes automatic scrolling, a 0.01 ms transition, and no running animation.

Failing:

- The mobile footer **Terms** link is `37.4375 × 44` CSS px, below the required 44 × 44 touch target.
- In the asset modal, Tab from the final **Save asset** button moves focus to `<body>` for one key press before cycling to **Close dialog**. That step has no visible focus indicator and does not keep focus within the dialog.

Evidence: `evidence/keyboard-responsive.json`.

## Privacy, security, and API behavior

- A complete live demo and real-record flow made only product-origin requests. No analytics, third-party script, or remote font loaded.
- License verification is the only observed product API call. A live invalid token returned `200 {"expires_at":null,"reason":"invalid","valid":false}`, `Cache-Control: no-store`, and `Access-Control-Allow-Origin: https://home-service-passbook.sociobot.in`.
- The invalid-token UI does not store the token. An orphan cached verdict does not unlock House Key and is deleted.
- Rate limiting passes. After one preliminary request, burst requests 1–29 returned 200; burst request 30 (request 31 overall) returned 429 with `Retry-After: 3`.
- Live responses include HSTS, CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and restrictive `Permissions-Policy`. No CSP error appeared.
- Sign-in and Entra checks are not applicable; this product has no sign-in.

### Paid checkout failure

`GET https://api.sociobot.in/api/v1/products/home-service-passbook/checkout` returns:

```text
HTTP/2 404
{"error":"enabled factory product","status":404}
```

The advertised **Buy House Key — $19** action cannot start a purchase. This remains a factory-owned deployment dependency, but it is still a release blocker for the candidate contract.

## PWA, offline, and update behavior

- The live worker is activated at `/sw.js`; cache `home-service-passbook-v3` exists.
- A service-worker-controlled `/demo` reload works offline with sample data and no console error.
- `registration.update()` completes with the active worker retained. The repository update-event regression displays **“An update is ready. Reload to use it.”**
- Manifest uses standalone display, `/app?v=2`, matching theme/background colors, and correct 192, 512, and maskable 512 icons. Evidence: `evidence/pwa-update.json`.

## Caching and performance

- Hashed JS/CSS return `Cache-Control: public, max-age=31536000, immutable`; HTML, manifest, and worker use 30-second revalidation.
- Production JS: 43.68 KB raw / 13.17 KB gzip.
- Production CSS: 19.67 KB raw / 5.17 KB gzip.
- Mobile hero: 38.85 KB. No font files ship.
- Fresh Lighthouse 13 mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.8 s, TBT 80 ms, CLS 0, total transfer 170 KiB. INP is unavailable in this lab navigation. Evidence: `evidence/lighthouse-live.json`.

## Defects by severity

### Critical

1. **Paid checkout is unavailable.** The advertised Sociobot checkout returns HTTP 404.

### High

2. **Missed fixed-calendar work is hidden.** An overdue job with no completion advances to a future date and reports zero overdue.
3. **Published import, rollback, and refund-revocation claims are absent from the required claims manifest.** This violates the explicit claims release gate.

### Medium

4. **The mobile Terms link is only 37.4375 px wide**, below the 44 × 44 touch-target contract.
5. **Modal Tab order loses visible focus on `<body>` for one step** instead of cycling directly within the dialog.

## Required remediation

Register and enable the billing product; keep an incomplete fixed-calendar occurrence overdue until work is recorded; add exact manifest entries and tagged tests for every published claim or remove the copy; make every touch target at least 44 × 44 px; and explicitly cycle modal focus without a blank step. Re-run this full verification against the resulting commit and live deployment.
