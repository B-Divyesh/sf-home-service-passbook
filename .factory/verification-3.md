# Independent product verification 3 — FAIL

Verified 2026-08-28 against candidate commit `6a265a23d39d55fc0e19054d46a915d749e7964c` and <https://home-service-passbook.sociobot.in>.

## Decision

**FAIL — do not release.** The candidate otherwise matches the live offline PWA and passes claims, build, core workflow, accessibility, privacy, PWA, and performance gates. The advertised House Key purchase cannot start: its required Sociobot checkout endpoint returns HTTP 404. That factory billing dependency makes a published paid feature unavailable and is release-blocking.

## First-read and demo gates

Fresh cold live browser:

- What it does: **“Remember every home service job.”**
- For whom: **“For households tracking recurring care, service dates, notes, and receipts without another appliance account.”**
- What to click first: visible **“Try it with sample data”**; adjacent copy says it opens a filled service log.

The five-word headline and first screen answer all three questions in plain language, give offline/local/five-free-assets facts, and link in one click to `/demo`. The demo has realistic records, a persistent “Demo — sample data, nothing is saved to your passbook” banner, Reset demo, and Start for real. This mandatory gate passes.

## Candidate/deployment identity

`git rev-parse HEAD` was `6a265a23d39d55fc0e19054d46a915d749e7964c`. After the exact production build, local and live SHA-256 matched:

| File | SHA-256 |
| --- | --- |
| `index.html` | `ab64bf3ac804aa7a80508fa14957c44fd967e78751b894af4ded6582547a4333` |
| `assets/index-B-9SPCwf.js` | `9c8302c01e926ef9e90a69531501824ddd70e616a686ebc97a6ddc3e9221d67e` |
| `assets/index-D2EER7Qk.css` | `260d863d5081f68d98629dc559bf9f16e7902214162da59ff5f5c916e1c6f35e` |
| `sw.js` | `bd8fa2c4fb9bf127feb193c047eee603cf2c67f18597257a73f36cd271241f05` |
| `manifest.webmanifest` | `2e4e214c6813f982693ccdd4206be8bafc9635cb7e8b2610fe66b45b4be099d94` |
| `404.html` | `764cff590c54ad4eb8676a7a471296940333642bb481068613316861feb36d06` |

Live `/`, `/demo`, `/app`, `/history`, `/backup`, `/privacy`, and `/terms` return 200; an unknown route returns the designed page with HTTP 404.

## Claims and repository gates

After clean `npm ci`, every literal `.factory/claims.json` test command ran through the demo entry point and passed: `demo-sandbox`, `recurrence-rules`, `json-backup`, `local-only`, `offline-reload`, `house-key-limit`, `service-log`, `print-history`, `record-corrections`, `import-validation`, `import-rollback`, and `refund-revocation`. Final Playwright status was `{"status":"passed","failedTests":[]}`.

```text
npm ci                         PASS — 60 packages; 0 reported vulnerabilities
npm test                       PASS — 11 Vitest and 15 Playwright tests
npm run lint                   PASS — tsc --noEmit
npm run build                  PASS — dist/ produced
npm audit --audit-level=high  PASS — 0 vulnerabilities
git diff --check               PASS before verifier documentation changes
```

The claims manifest covers published import-validation, rollback, and refund-revocation promises. The landing page and README had no additional material user-reliable claim without a manifest entry.

## Workflow, boundary, recovery, and privacy

The fresh suite covers asset → either recurrence rule → completion date/note/receipt → refreshed history; correction/deletion; print; JSON export/import; malformed nested JSON rejection; startup rollback; refund revocation; five-asset limit; and both recurrence semantics.

Fresh live checks: interval 120 is valid and 121 is rejected; a 3,000,001-byte attachment is rejected with the stated 3 MB error; demo browse/export made no non-product-origin request and had no console/page error. There is no sign-in, so Entra validation is not applicable.

## Accessibility, PWA, policies, and performance

- Required `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, title, `lang=en`, one H1, main, image alt, button names, no console errors; cold load 1,694 ms. Evidence: `.factory/verification-3-evidence/verify.json`.
- Playwright axe scanned `/`, `/demo`, `/privacy`, `/terms`, `/404` at 1280 and 390 px in light/dark: 20 scans, **zero serious/critical findings** and zero console/page errors.
- At 390 px, skip link, dialog Escape focus return, forward/reverse dialog Tab containment, 44 × 44 px Terms target, 200% text/no horizontal overflow, and reduced motion all pass.
- The live service worker controls `/demo`, has cache `home-service-passbook-v3`, completes `registration.update()`, and reloads sample data offline with no error.
- HSTS, CSP (self plus `https://api.sociobot.in` connect source), nosniff, strict-origin referrer policy, and restrictive permissions policy are live. Hashed JS/CSS are immutable for one year; HTML/manifest/worker revalidate after 30 seconds.
- Mobile Lighthouse: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.7 s, LCP 1.7 s, TBT 0 ms, CLS 0, transfer 172 KiB. Evidence: `.factory/verification-3-evidence/lighthouse-live.json`.
- Built JS is 44,385 bytes (13.39 kB gzip), CSS 19,684 bytes (5.18 kB gzip), and 640-px hero 38,846 bytes; all within budget.

## Billing and rate limit

The license verify API rate-limits correctly: burst requests 1–30 returned 200; request **31** returned `429` with `Retry-After: 3`.

```text
GET https://api.sociobot.in/api/v1/products/home-service-passbook/checkout
HTTP/2 404
{"error":"enabled factory product","status":404}
```

Both landing and license panel advertise “Buy House Key — $19”; that action cannot start checkout.

## Defects by severity

### Critical / release blocker

1. **House Key checkout is unavailable.** Enable/register the `home-service-passbook` Sociobot billing product so checkout redirects to hosted checkout, then rerun live checkout and verification. This repo is not authorized to change the external billing configuration.

### High, medium, and low

No additional defects found.

## Evidence

Live URL-verifier screenshots and Lighthouse JSON are in `.factory/verification-3-evidence/`.
