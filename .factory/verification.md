# Independent product verification — FAIL

Verified on 2026-08-28 against candidate commit `2daa5a5ceef426cd542565aa5d003b85408aa7ff` and `https://home-service-passbook.sociobot.in`.

## Decision

**FAIL — do not release this candidate.** The core free passbook works, the required claim commands pass after the locked install, and the live static assets match the candidate. Release is blocked by a dead paid checkout, unsafe backup import recovery, serious dark-theme accessibility failures, and a paid entitlement that can become active without a token or verification.

## First-read test

Cold desktop and 390 px visits passed the mandatory first-screen gate.

- What it does: **“Remember every home service job.”**
- For whom: **“For households tracking recurring care, service dates, notes, and receipts without another appliance account.”**
- What to click first: **“Try it with sample data.”**
- One click opens `/demo` with three assets, three jobs, and four service entries. The persistent demo banner offers **Reset demo** and **Start for real**.

Evidence: `qa-evidence/first-read-desktop.png` and `qa-evidence/first-read-mobile.png`.

## Candidate and deployment identity

- Clean checkout began at the requested commit; `git status --short --branch` was clean.
- `npm ci` completed with 0 vulnerabilities.
- Live `/index.html`, hashed JS, hashed CSS, `sw.js`, manifest, and `404.html` SHA-256 hashes exactly match `dist/` from this commit.
- Live `/` returned 200 and the verifier found no console or page errors.

## Required claim tests

Every exact command from `.factory/claims.json` was run after `npm ci`. All returned exit 0:

| Claim | Result | Observable test result |
| --- | --- | --- |
| `demo-sandbox` | PASS | Sample demo opens; leaving reaches an empty real namespace in the test. |
| `recurrence-rules` | PASS | Both recurrence labels render; the unit suite also passed three date tests. |
| `json-backup` | PASS | Export has version 1 and 3/3/3/4 collections; sample import retrieves Furnace. |
| `local-only` | PASS | The tested demo browse flow made no cross-origin request. |
| `offline-reload` | PASS | A controlled `/demo` reloaded offline and retained sample records. |
| `house-key-limit` | PASS | Sixth asset is gated; mocked valid verification exposes the asset/photo controls. |
| `service-log` | PASS | Asset/job/completion flow persists and the receipt reference survives reload. |
| `print-history` | PASS | The Print history action calls the browser print path. |

The manifest exists, but claim coverage itself is release-blocking under the claims contract:

- `demo-sandbox` starts with empty real storage. It would still pass an implementation that erased existing real data. Independent QA pre-seeded a real Boiler and confirmed this implementation preserves it, but the claim test does not prove the stated isolation.
- `house-key-limit` only checks that a file input appears. It does not attach, save, reload, retrieve, or export a photo. Independent QA found the implementation works for a small PNG and rejects 3,000,001 bytes, but the claim test does not prove the claim.
- `service-log` fills a date and note but never asserts either after reload.
- “The backup includes ... attached photos,” “accessibility stay[s] free,” “$19 once,” and README statements about no analytics/third-party scripts/remote fonts are not fully represented and proven by claim entries.

## Build and repository gates

- `npm test`: PASS — 3 Vitest tests and 10 Playwright tests.
- `npm run build`: PASS — includes `tsc --noEmit`; output is in `dist/`.
- Lint: no lint script or separate lint configuration exists.
- `npm audit --audit-level=high`: PASS — 0 vulnerabilities.
- MIT `LICENSE`, README, privacy, terms, design, demo, copy audit, manifest, icons, robots, sitemap, and handoff files exist.

## End-to-end and input testing

Passing cases:

- Added a Water heater, selected completion-relative annual recurrence, recorded a completion note and receipt, reloaded history, and retained the record.
- Fixed and completion-relative schedules produce different due dates.
- Empty required Area is blocked and focused with a native error; interval `0` is rejected and focused because the minimum is 1.
- The free five-asset boundary gates the sixth asset.
- A licensed 8-byte PNG persisted after reload and appeared in JSON export. A 3,000,001-byte file produced the stated 3 MB error.
- Syntactically invalid JSON leaves the app usable; version 2 receives a clear incompatible-version message.
- Print media hides navigation and controls and contains all four sample history entries (`qa-evidence/print-history.pdf`).

Failing cases:

- A plausible corrupt version-1 backup containing `assets: [{}]` passes validation, is saved before rendering, then shows `Cannot read properties of undefined (reading 'replace')`. Every reload thereafter shows the false “Browser storage is unavailable” screen. Its Reload action loops; recovery requires clearing site data and losing the passbook. Evidence: `qa-evidence/malformed-import-before-reload.png` and `qa-evidence/malformed-import-after-reload.png`.
- A completion dated `2099-12-31` is accepted as completed work.
- There is no edit, delete, or undo action for an asset, recurring job, or service entry. A typo or false proof record cannot be corrected in the product.

## Accessibility and responsive QA

Passing:

- `verify-url.sh`: title, `lang=en`, one `h1`, main landmark, alt text, labeled buttons, and console checks pass; measured live load 875 ms. Evidence: `qa-evidence/verify-url/verify.json`.
- Axe has no violations in the light theme on `/`, `/demo`, `/privacy`, `/terms`, or the client 404 at desktop and 390 px.
- There is no horizontal overflow at normal text size on those routes at 390 px.
- Keyboard checks pass for the skip link, opening and closing the asset dialog, Escape focus return, required-field focus, and invalid-number focus.
- Dialog states tested clean in axe in light and dark themes.
- `prefers-reduced-motion: reduce` changes smooth scrolling to auto, cuts transitions to 0.01 ms, and leaves zero running animations.

Failing:

- Axe reports **serious `color-contrast`** violations in dark mode at desktop and 390 px:
  - white “Overdue” on `#f47a51`: 2.7:1;
  - House Key eyebrow and Restore link on the paid panel: 1.04:1;
  - demo banner text and buttons: 3.24:1.
- Several mobile touch targets are below the required 44 px height: wordmark 36 px, Restore license 24.8 px, and footer Privacy/Terms about 21.3 px.

## Privacy, security, and outbound requests

- A full demo browse/export flow contacted only `https://home-service-passbook.sociobot.in`.
- No analytics, remote font, or third-party script request was observed.
- License verification goes only to `api.sociobot.in`; a live invalid token returned `{valid:false, reason:"invalid"}` with `Cache-Control: no-store` and correct CORS for the product origin.
- Security headers include HSTS, CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a restrictive `Permissions-Policy`. No CSP errors appeared.
- API rate limiting passes: in a rapid sequential burst, requests 1–30 returned 200; request 31 returned 429 with `Retry-After: 4`.
- Sign-in/Entra testing is not applicable; the product has no sign-in.

Paid entitlement fails independently of the dead checkout: in a fresh browser, setting only `sb_license_verdict:home-service-passbook` to a recent valid verdict, with no `sb_license:home-service-passbook` token, displays **House Key is active** and makes no verification request. The app trusts an unbound boolean cache instead of requiring a token-backed verdict.

## PWA, offline, and update behavior

- Manifest names, standalone display, versioned `/app?v=1` start URL, theme colors, and 192/512/maskable icons are present with correct dimensions.
- On live `/demo`, service worker `/sw.js` activated, cache `home-service-passbook-v2` existed, offline reload retained sample data, and the offline banner appeared without console errors. Evidence: `qa-evidence/offline-demo.png`.
- A same-origin controlled worker-version test caused the in-app **“An update is ready. Reload to use it.”** toast to appear.

## Deployment, headers, and performance

- The advertised buy link is broken: `GET https://api.sociobot.in/api/v1/products/home-service-passbook/checkout` returns **404** with `{"error":"enabled factory product","status":404}`. A visitor cannot purchase the advertised $19 House Key.
- Unknown extensionless routes render the designed client 404 but return HTTP 200. `/not-a-real-route` is therefore a soft 404. Missing excluded assets correctly return 404.
- All live files, including content-hashed JS/CSS, use `Cache-Control: public, must-revalidate, max-age=30`; hashed assets are not long-lived or immutable.
- Production output: JS 33.05 KB raw / 10.47 KB gzip; CSS 19.08 KB raw / 5.07 KB gzip; mobile hero 38.85 KB; no downloaded fonts. All stated static budgets pass.
- Lighthouse 13 mobile on the live landing page: Performance 99, Accessibility 100 (light theme only), Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.8 s, TBT 130 ms, CLS 0, total transfer 167 KiB. INP is unavailable for this non-interactive lab run. Evidence: `qa-evidence/lighthouse-live.json`.

## Defects by severity

### Critical

1. **Paid checkout is unavailable.** The first-party $19 purchase link returns 404.

### High

2. **Malformed version-1 imports can persist corrupt state and brick every future startup.** The offered Reload recovery does not work.
3. **Dark mode has serious WCAG contrast failures** on primary status, demo, and paid-tier content.
4. **House Key can be active without a license token or verification request** because the verdict cache is trusted by itself.
5. **Claim tests do not fully prove several published promises**, contrary to the release contract.

### Medium

6. **Record mistakes cannot be corrected:** future completion dates are accepted and there is no edit/delete/undo for core records.
7. **Several mobile links are smaller than the 44 px touch-target requirement.**
8. **Hashed static assets are cached for only 30 seconds**, not long-lived immutable caching.
9. **Unknown application routes are soft 404s** with HTTP 200.

### Low

10. Invalid JSON exposes a raw parser error instead of the product’s plain recovery sentence.

## Required remediation before re-verification

Register/enable the billing product and verify checkout end to end; bind cached entitlement to a stored token; deeply validate backup schemas before saving and provide recoverable rollback; fix and test dark-theme contrast and target sizes; add correction paths and reject future completion dates; strengthen claim tests to prove full outcomes; configure immutable caching and real 404 status behavior.
