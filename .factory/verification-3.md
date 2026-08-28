# Independent product verification 3 — FAIL

Verified on 2026-08-28 against candidate commit `6a265a23d39d55fc0e19054d46a915d749e7964c` and <https://home-service-passbook.sociobot.in>.

## Decision

**FAIL — do not release this candidate.** The live static files match the candidate byte for byte, the first-read/demo gate passes, and all 12 declared claim commands pass after the locked install. Release is still blocked by the live paid checkout returning 404. Independent boundary testing also disproves the asset-correction claim at the five-asset free limit and finds a silent save-failure path. Two smaller accessibility/performance findings remain.

No product code was changed during this verification.

## First-read and demo gate

The cold first screen passes at desktop and 390 × 844 px.

- What it does: **“Remember every home service job.”**
- For whom: **“For households tracking recurring care, service dates, notes, and receipts without another appliance account.”**
- What to click first: **“Try it with sample data.”**
- At 390 px the primary action occupies `x=21`, `y=494.625`, `348 × 50.797` CSS px, wholly inside the first 844 px viewport.
- One click opens `/demo`, the working product UI, three sample jobs using both recurrence modes, and the persistent **“Demo — sample data, nothing is saved to your passbook”** banner with **Reset demo** and **Start for real**.
- **Start for real** opens the separate, empty real namespace.

Evidence: `qa-evidence-3/first-read-mobile.png`, `qa-evidence-3/verify-url/screenshot-desktop.png`, and `qa-evidence-3/live/demo-mobile.png`.

## Candidate and deployment identity

- `git rev-parse HEAD`: `6a265a23d39d55fc0e19054d46a915d749e7964c` before verification-only files.
- `/`, `/app`, `/demo`, `/history`, `/backup`, `/privacy`, and `/terms` return 200.
- A random missing path returns the designed 404 body with HTTP 404.
- Local production and live SHA-256 values match:

| File | SHA-256 (local = live) |
| --- | --- |
| `index.html` | `ab64bf3ac804aa7a80508fa14957c44fd967e78751b894af4ded6582547a4333` |
| `assets/index-B-9SPCwf.js` | `9c8302c01e926ef9e90a69531501824ddd70e616a686ebc97a6ddc3e9221d67e` |
| `assets/index-D2EER7Qk.css` | `260d863d5081f68d98629dc559bf9f16e7902214162da59ff5f5c916e1c6f35e` |
| `sw.js` | `bd8fa2c4fb9bf127feb193c047eee603cf2c67f18597257a73f36cd271241f05` |
| `manifest.webmanifest` | `2e4e214c6813f982693ccdd4206be8afc9635cb7e8b2610fe66b45b4be099d94` |
| `404.html` | `764cff590c54ad4eb8676a7a471296940333642bb481068613316861feb36d06` |

## Mandatory claim tests

`.factory/claims.json` exists and contains 12 unique claims, each with exactly one matching browser-test tag. The first literal pre-install probe returned `vitest: not found`, as expected before a clean clone has dependencies. After `npm ci`, every exact listed command was run separately and exited 0:

| Claim | Declared command result | Independent assessment |
| --- | --- | --- |
| `demo-sandbox` | PASS | PASS — sample and real IndexedDB namespaces remain separate. |
| `recurrence-rules` | PASS | PASS — missed fixed work stays overdue; late fixed work remains anchored; completion-relative work advances from completion. |
| `json-backup` | PASS | PASS — all four collections and licensed attachment round-trip tests pass. |
| `local-only` | PASS | PASS — maintenance, demo, history, and export produced no cross-origin request. |
| `offline-reload` | PASS | PASS — a controlled `/demo` reloads offline with its sample records. |
| `house-key-limit` | PASS | PASS for the stated limit and mocked license behavior; live checkout is unavailable. |
| `service-log` | PASS | PASS — dates, notes, receipt references, and refresh persistence work. |
| `print-history` | PASS | PASS — print mode contains four demo entries and removes navigation controls. |
| `record-corrections` | PASS | **FAIL in a boundary state** — editing an existing asset is blocked when the free passbook contains five assets. |
| `import-validation` | PASS | PASS — malformed JSON, nested references, and future completion dates are rejected without replacement. |
| `import-rollback` | PASS | PASS — the prior passbook is restored after startup validation fails. |
| `refund-revocation` | PASS | PASS with the required recorded/mock gateway verdict. |

The manifest covers the material claims found on the landing page and in README. The defect above is a scope weakness in the tagged correction test, which only edits a three-asset demo.

## Repository gates

- `npm ci`: PASS — 60 packages installed; 0 vulnerabilities.
- `npm audit --audit-level=high`: PASS — 0 vulnerabilities.
- `npm run lint`: PASS — `tsc --noEmit`.
- `npm test`: PASS — 11 Vitest tests and 15 Playwright tests.
- `npm run build`: PASS — exact production build produced `dist/`.
- `git diff --check`: PASS before report edits.
- README, MIT license, design thesis, demo documentation, copy audit, privacy/terms pages, manifest, icons, robots, sitemap, 404, and handoff exist.

## Independent end-to-end behavior

Passing live scenarios on a fresh 390 px context:

- Required empty asset fields block submission and focus the invalid field.
- Intervals `0` and `121` are rejected; normal values save.
- A completion-relative annual job completed on 2026-08-28 becomes due 2027-08-28.
- A fixed six-month job first due 2026-08-01 remains **OVERDUE** until completed; a 2026-08-28 completion advances to the anchored 2027-02-01 occurrence.
- Future completion dates are rejected and focus the date field.
- Two service entries, notes, and receipt references survive reload.
- JSON export contains one area, one asset, two jobs, and two completions.
- A nested import with a missing asset and one with a future completion are rejected without replacing current records.
- The fifth free asset is accepted and a sixth reaches House Key; Backup remains available.
- A 3,000,000-byte image persists after reload; a 3,000,001-byte image remains in the dialog with a clear error. The declared attachment test separately confirms export.
- HTML-like asset text is escaped; no code executes.
- When IndexedDB is unavailable at startup, the app gives a specific recovery screen and Reload action.

### Boundary claim failure: editing is paywalled at five assets

With exactly five valid free assets, selecting **Edit asset** does not open the edit dialog. It navigates to `/app?panel=license` and displays **Add unlimited assets and photos**. This is caused by applying the add-limit guard to every opening of `asset-dialog`, including edit mode. Existing records therefore cannot always be corrected, contrary to the `record-corrections` claim.

Evidence: `qa-evidence-3/edit-blocked-at-free-limit.png`.

### Save-failure recovery failure

A one-shot IndexedDB write failure was injected after startup. Saving a valid Boiler showed no error, discarded the asset, and opened **Add a recurring job** with an empty Asset selector. The app had already mutated in-memory state, swallowed the save error, replaced the toast during re-render, and proceeded to the next step. This can mislead a household into believing a record was saved when storage is full or fails transiently.

Evidence: `qa-evidence-3/storage-save-failure.png`.

## Accessibility, keyboard, and responsive checks

- `/opt/fleet/lib/verify-url.sh` passes: HTTPS 200, title, `lang=en`, one H1, main landmark, image alt text, named buttons, and zero console errors; load was 678 ms.
- Twenty fresh live axe scans report zero serious/critical findings across `/`, `/demo`, `/privacy`, `/terms`, and `/404`, at 1280 and 390 px, in light and dark modes.
- The landing page, demo, app, privacy, and terms have one H1, one main landmark, route-specific titles, and no 390 px page overflow.
- The populated app and landing page have no page overflow at 200% text.
- Skip-link activation works; focus has a visible 3 px teal outline. Dialog Tab/Shift+Tab wraps and Escape returns focus. Back navigation restores the prior panel and focuses its H1.
- Reduced motion computes automatic scrolling, a 0.01 ms transition, and no running animation.
- **Failure:** the inline `privacy@sociobot.in` and `support@sociobot.in` links are each 17 CSS px high at 390 px, below the contract's 44 × 44 px touch target. Other checked live controls meet the target.

Evidence: `qa-evidence-3/live/live-smoke.json` and `qa-evidence-3/verify-url/verify.json`.

## Privacy, security, API, and links

- Full sample and real maintenance flows made no unexpected cross-origin requests. There are no analytics, third-party scripts, or remote fonts.
- The only declared external application endpoint is the Sociobot billing API. An invalid-token verification returns `200`, `{valid:false, reason:"invalid"}`, `Cache-Control: no-store`, and the correct product-origin CORS header.
- Rate limiting passes: after 30 successful verification requests in the window, the 31st returned HTTP 429 with `Retry-After: 3`.
- HTML responses include HSTS, CSP, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and restrictive camera/microphone/geolocation permissions policy. No CSP, console, or page errors were observed.
- Every internal page link returns 200 and both `mailto:` links are explicit exceptions. The sole dead HTTP link is the paid checkout.
- Sign-in and Microsoft Entra checks are not applicable; the product has no sign-in.

### Paid checkout remains unavailable

Fresh request on 2026-08-28:

```text
GET https://api.sociobot.in/api/v1/products/home-service-passbook/checkout
HTTP/2 404
{"error":"enabled factory product","status":404}
```

The advertised **Buy House Key — $19** action cannot start a purchase. This is factory-owned deployment state, but it remains release-blocking under the product contract.

## PWA, offline, and update behavior

- The live worker is active and controlling `/demo` from `/sw.js`.
- Cache `home-service-passbook-v3` contains `/`, `/app`, `/demo`, `/privacy`, `/terms`, the manifest, favicon, mobile hero, and hashed JS/CSS.
- `registration.update()` completes with the current worker active and no console error.
- A service-worker-controlled `/demo` reload succeeds offline with the sample task and an Offline status banner.
- The automated update-event test displays **“An update is ready. Reload to use it.”**
- Manifest is standalone with versioned `/app?v=2`, matching colors, and correct 192, 512, maskable 512, and 180 px Apple icons.

Evidence: `qa-evidence-3/offline-demo.png` and the passing update regression in `npm test`.

## Caching and performance

- Hashed JS/CSS and hero assets use `public, max-age=31536000, immutable`; HTML, manifest, and worker revalidate after 30 seconds.
- Production JS: 44,385 bytes raw / 13.39 KB gzip (budget: 200 KB initial JS).
- Production CSS: 19,684 bytes raw / 5.18 KB gzip (budget: 50 KB).
- Mobile hero candidate: 38,846 bytes; the high-density 1200 px hero is 154,048 bytes (budget: 300 KB).
- No font files ship.
- Two fresh Lighthouse 13 mobile runs scored **89 then 96 Performance**, with Accessibility/Best Practices/SEO **100/100/100** both times. LCP was 1.8–1.9 s and CLS 0; TBT varied from 440 to 220 ms; transfer was 204 KiB. INP is not available from this lab navigation.
- Because one clean run fell below the required Lighthouse 90 score, the performance gate is not repeatably green even though the repeat passed and asset budgets are healthy.

Evidence: `qa-evidence-3/lighthouse-live.json` and `qa-evidence-3/lighthouse-live-repeat.json`.

## Defects by severity

### Critical

1. **The paid checkout is dead.** The advertised $19 purchase URL returns HTTP 404, so House Key cannot be bought.

### High

2. **The asset-correction claim fails at the free limit.** At five assets, **Edit asset** opens the paywall instead of the edit dialog.
3. **A storage write failure is silently lost and advances to an impossible next step.** The save error disappears and the recurring-job dialog opens with no asset.

### Medium

4. **Legal-page email links have 17 px touch height**, below the required 44 px target.
5. **The Lighthouse performance gate is variable:** one of two fresh mobile runs scored 89, below the required 90; the repeat scored 96.

## Required remediation

Enable the Sociobot billing product and verify a real checkout redirect. Apply the five-asset limit only when adding, never when editing. Keep failed saves in their form, announce the storage error, and do not advance until persistence succeeds. Enlarge the legal email targets. Re-run Lighthouse until the mobile score is consistently at least 90, then repeat all claims and this boundary suite against the resulting commit and deployment.
