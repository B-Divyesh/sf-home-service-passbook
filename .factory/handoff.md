# Home Service Passbook — polish 1 handoff

## Status: PASS

All 15 findings in `.factory/review-1.md` are resolved. There were no earlier review or polish reports. The deployed product retains the mid-century instrument-panel visual system and the `pwa-offline` artifact class.

## Delivered

- The first screen now says what happens for both new and returning households. Its visible sample action opens the isolated `/?demo=1` passbook in one click.
- Demo records remain in `demo:home-service-passbook`; reset and exit do not change `home-service-passbook`.
- Due next now exports a standards-based local `.ics` file containing every job’s current due date, asset, area, and repeat rule. It is free and works offline.
- `.factory/claims.json` now contains 14 claims, including calendar export and scope boundaries. Every claim has one matching browser test.
- Titles, descriptions, canonicals, Open Graph fields, and Twitter fields now follow every route. Navigation/back restores h1 focus.
- The true 404 response now carries the full product header/footer, metadata, icons, manifest, focus target, mobile layout, and dark treatment.
- All review copy changes are applied to the landing page and README. `.factory/copy-audit.md` has no long, banned, metaphorical, jargon, or inconsistent wording left.
- `.factory/catalog-description.txt` is verb-first and 75 characters long.

## Exact verification

- Implementation commit: `77bd367` (`fix: resolve adversarial review findings`).
- Final clean clone: `/tmp/hsp-polish-1-final-zdli8t`; `npm ci` passed with zero vulnerabilities.
- Every one of the 14 literal claim commands passed separately.
- Full clean-clone `npm test`: 17 Vitest tests and 19 Playwright tests passed.
- `npm run build`: passed and produced `dist/index.html`; initial bundle is 47.54 KB JS / 14.38 KB gzip and 19.93 KB CSS / 5.22 KB gzip.
- Local factory URL verifier: pass, one title/h1/main, all image alt text, zero console errors.
- Live factory URL verifier: pass for `/` and `/?demo=1`; see `polish-1-evidence/verify-live-root/verify.json` and `verify-live-demo/verify.json`.
- Live browser audit: pass; `polish-1-evidence/live-check.json` records first-screen visibility, 3-event calendar content, reset/isolation, focus, all route metadata, HTTP 404, privacy, offline, and 20 clean axe scans.
- Independent live smoke: pass; `polish-1-evidence/live-smoke/live-smoke.json` records 44 px targets, keyboard skip link, no overflow, no console errors, same-origin demo traffic, offline reload, checkout 303, and 20 clean axe scans.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.20 s, TBT 0 ms, CLS 0. Evidence: `polish-1-evidence/lighthouse-live.json`.
- Live status checks: `/`, `/?demo=1`, `/privacy`, and `/terms` return 200; a random missing route returns 404.
- Production deployment ID: `305ac1ac-e9b1-4d85-88b8-10e7239e29ce`.
- Live URL: <https://home-service-passbook.sociobot.in>

## Run locally

```sh
npm ci
npm test
npm run build
npm run preview
```

For the deployed checks:

```sh
npm run verify:live -- https://home-service-passbook.sociobot.in .factory/polish-1-evidence/live-smoke
node .factory/polish-1-evidence/live-check.mjs
```

## Known gaps and next steps

None within the product contract or review scope. No finding of any severity remains unresolved.
