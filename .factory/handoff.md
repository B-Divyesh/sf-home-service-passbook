# Home Service Passbook — polish 3 handoff

## Status: PASS

Release repair commit: `7aafe2a4cf9b71a36cb27b325871e04f685a407c` (`fix: close review three copy findings`). It is pushed to `origin/main` and deployed to <https://home-service-passbook.sociobot.in> through Azure Static Web Apps deployment `9144ecea-677a-4771-8c03-b99dbaf83128`.

## What changed

- Replaced the remaining landing-page `log` wording with “Private home maintenance passbook.”
- Replaced the empty `log ready` readout with the real sample value “04 service entries.” The value remains visible at 390 px.
- Rewrote README photo and import recovery copy in household language.
- Updated the two import claims and made the import-validation claim test reject bad area, asset, job, service-entry, and attachment records before confirmation.
- Preserved the isolated `?demo=1` flow, banner, reset, Start for real path, real routes, legal links, static 404, and the mid-century instrument-panel visual system.
- Bumped the PWA cache/manifest version to v6 and the product footer/package version to v1.0.4 so installed clients receive the repair.
- Updated the catalog line: “Keep home service work, due dates, and proof in a private browser passbook.”

## Verification

- Clean clone: `/tmp/hsp-polish-3-clean-riEgZB` checked out `7aafe2a`, ran `npm ci`, then every literal command in `.factory/claims.json` independently. All 14 claim commands passed: `demo-sandbox`, `recurrence-rules`, `json-backup`, `local-only`, `offline-reload`, `house-key-limit`, `service-log`, `print-history`, `calendar-export`, `scope-boundaries`, `record-corrections`, `import-validation`, `import-rollback`, and `refund-revocation`.
- The same clean clone passed `npm test` (18 Vitest/static tests and 19 Playwright browser tests) and `npm run build`; `dist/index.html` was rebuilt at 2026-08-28 22:57:17 UTC.
- Local production verification: [verify-url](polish-3-evidence/local-verify/verify.json) reports 541 ms load, zero console errors, title/lang/main, one h1, and no missing image alt text or unnamed buttons. [Local live smoke](polish-3-evidence/local-live/live-smoke.json) reports offline reload, keyboard skip navigation, zero external demo requests, zero overflow, 44 px checked targets, hosted checkout redirect, and 20 clean Axe scans.
- Local Lighthouse retry: [100/100/100/100](polish-3-evidence/local-lighthouse-retry.json), LCP 1.51 s, TBT 0 ms, CLS 0.
- Live cold verification: [verify-url](polish-3-evidence/live-verify/verify.json) reports 852 ms load and zero console errors. The post-propagation [live smoke retry](polish-3-evidence/live-smoke-retry/live-smoke.json) reports zero console/external-request errors, offline demo reload, keyboard skip navigation, zero overflow, 44 px checked targets, a hosted checkout 303, and 20 zero-serious/critical Axe scans.
- Live product review: [first-screen results](polish-3-evidence/live-first-read.json), [direct demo reset](polish-3-evidence/live-demo-reset.json), [real/demo isolation](polish-3-evidence/live-demo-real-isolation.json), [route/focus/404 review](polish-3-evidence/live-routes-final.json), and [headers/link review](polish-3-evidence/live-policy-and-links.json) all pass. Screenshots are [landing desktop](polish-3-evidence/screenshots/live-landing-desktop.png), [landing mobile](polish-3-evidence/screenshots/live-landing-mobile.png), [demo mobile](polish-3-evidence/screenshots/live-demo-mobile.png), and [404 mobile](polish-3-evidence/screenshots/live-404-mobile.png).
- Live Lighthouse: [100/100/100/100](polish-3-evidence/live-lighthouse.json), LCP 1.26 s, TBT 0 ms, CLS 0.

## Run it

```sh
npm ci
npm test
npm run build
npm run preview
```

Open `/?demo=1` for the isolated sample passbook. Use Reset demo to discard sample changes and Start for real to return to the separate household passbook.

## Known gaps

None. The product remains local-first: records stay in browser storage unless the user exports a backup; no analytics, remote fonts, or third-party scripts are loaded.
