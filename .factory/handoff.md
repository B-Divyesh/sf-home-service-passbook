# Home Service Passbook — polish 2 handoff

## Status: PASS

Polish 2 repairs every finding in `.factory/review-1.md` and `.factory/review-2.md`. The product remains a local-first offline PWA with its mid-century instrument-panel visual system.

## Delivered

- Removed the untestable public provenance slogan from both SPA and standalone-404 footers. Generated-art provenance remains documented in `.factory/design.md`.
- Standardized the stored-document label as **Passbook**; `/app` no longer says “Household ledger.”
- Replaced the 404’s decorative “Wrong panel” with **Page not found** in both shells.
- Removed the decorative hero identifier “HOME / 01” and retained the useful **Service record** label.
- Updated the catalog sentence to: “Record recurring home service jobs and keep proof in a private offline passbook.”
- Added regression coverage for all four removed/replaced labels and a deployed-site verifier at `scripts/polish-2-live.mjs`.

## Verification

- Clean clone: `/tmp/home-service-passbook-clean-sjBD3H` at repair commit `aa60d2ce6c5953e4f313b7f3f5fd07870ee68212` ran `npm ci`, then every one of the 14 literal commands from `.factory/claims.json` separately. All passed.
- Clean clone full checks: `npm test` passed 18 Vitest tests and 19 Playwright tests; `npm run build` passed and produced `dist/index.html` at `2026-08-28 21:41:24 UTC`.
- Final workspace regression: `npm test` passed 18 Vitest tests and 19 Playwright tests; `npm run build` passed. The application bundle is 47.48 KB raw / 14.33 KB gzip; CSS is 19.93 KB raw / 5.22 KB gzip; the 640 px hero is 38.85 KB.
- Static deployment: `/opt/fleet/lib/deploy-static.sh home-service-passbook dist` completed successfully, deployment ID `d619b740-73cc-484f-abc0-ffa6fe4e005e`. The public site serves `assets/index-DlW5YI2U.js`.
- Live smoke: `npm run verify:live -- https://home-service-passbook.sociobot.in .factory/polish-2-evidence/live-smoke` passed. It found no console errors or cross-origin demo requests, offline reload passed, keyboard skip navigation passed, there was no mobile overflow, all required targets were at least 44 px, checkout returned the expected hosted 303, and all 20 desktop/mobile × light/dark axe scans had zero serious/critical issues.
- Live review: `node scripts/polish-2-live.mjs` passed. It checked the first screen, direct `/?demo=1` sample path, demo banner/reset/start actions, app eyebrow, all seven SPA metadata routes, and `/missing-polish-2` as HTTP 404. The deployed bundle contains none of “Household ledger,” “Wrong panel,” “HOME / 01,” or “Original generated artwork.”
- Fresh screenshots: `.factory/polish-2-evidence/live-cold-desktop.png`, `live-cold-mobile.png`, `live-demo-mobile.png`, `live-app-mobile.png`, and `live-404-mobile.png`. The detail record is `.factory/polish-2.md`; machine-readable live results are `live-review.json` and `live-smoke/live-smoke.json`.

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh home-service-passbook dist
```

## Known gaps / next steps

None. No review finding remains open.
