# Home Service Passbook — polish 4 handoff

## Status: PASS

Polish round 4 is complete.  The product repair is commit `d62a72ce8153793bf157096372aab56bdcfab1fb`, deployed at https://home-service-passbook.sociobot.in as deployment `7c33c6fb-343d-4d1e-bf12-fca19887123d`.

## What changed

- Fixed F-4-1: direct `?demo=1` on a 390 × 844 phone now starts with an above-the-fold named sample record. It shows the actual seeded task, asset and area, due date, and proof; it is not a decorative or duplicate sample.
- Kept the demo isolated under its own storage namespace. Its banner provides Reset demo and Start for real, and the revised first-screen note accurately says that the demo opens with the sample record due next.
- Added a viewport-bound browser assertion for the mobile record and corrected the task-row selectors so recurrence, offline, and correction tests exercise the working list rather than the compact preview.
- Updated the fourth polish record, copy audit, catalog description, and live smoke selector.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run verify:live
```

To run the isolated sample directly, open `/?demo=1` (or `/demo`). Use **Reset demo** to reseed it and **Start for real** to discard it and open the real passbook.

The final clean-clone verification used `/tmp/hsp-polish-4-final-pass.Ezci2r` and passed all of the following with `set -euo pipefail`:

- `npm ci --silent`
- All 14 commands listed verbatim in `.factory/claims.json`
- `npm test` (18 Vitest tests, 19 Playwright tests)
- `npm run build` (`dist/` produced; JavaScript 14.57 KB gzip, CSS 5.64 KB gzip)

After deployment, a cold live check passed `npm run verify:live` (offline reload, isolation, keyboard, touch sizes, no overflow, no console errors, no external demo requests, and 20 Axe scans with zero serious/critical findings) and `/opt/fleet/lib/verify-url.sh` (title, language, h1, main, alt text, buttons, console). The live mobile demo record is documented in `.factory/polish-4-evidence/live/live-review.json`; its box is y=336 to 536.52 in a 844 px viewport. Lighthouse scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO locally and live.

## Evidence and scope

- Cumulative finding map and exact evidence: `.factory/polish-4.md`
- Screenshots, browser reports, Lighthouse reports, and live checks: `.factory/polish-4-evidence/`
- The PWA remains local-first, static, and offline-capable; no third-party tracking, fonts, or runtime scripts were added.

## Known gaps

None. All findings from reviews 1–4 are closed and rechecked on the deployed site.
