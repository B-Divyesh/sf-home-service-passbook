# Home Service Passbook — repair 4 handoff

## Release status: PASS

Work order `home-service-passbook-repair-4` repairs the controller-reported browser-suite failure without changing the researched brief, product behavior, PWA artifact, or static deployment class. The repaired commit is recorded below after deployment.

## Repair made

The `@claim:record-corrections` Playwright setup used `page.evaluate` to read the demo IndexedDB `state` record and immediately dereferenced `state.assets`. That implementation detail is not a safe setup contract: first-entry demo population is asynchronous, so an absent record produced the controller’s `Cannot read properties of undefined (reading 'assets')` failure before the claim could run.

The regression now creates its fourth and fifth assets through the visible passbook form, asserts the real five-asset boundary, then corrects an existing asset, job, and service entry. This is both a direct regression for the failed setup and stronger end-to-end proof that editing remains free at the limit. `.factory/claims.json` documents the exact five-asset sandbox flow.

All independent-verifier release blockers documented at `f4aa8eb77bffc7edbddb1302abd860027d5f7a26` remain covered by the retained product regressions: strict import validation and startup rollback, token-bound license verdicts and revocation, fixed-calendar overdue handling, corrections/deletions and future-date rejection, dark-mode/touch-target accessibility, immutable assets/HTTP 404 policy, and the enabled Sociobot checkout.

## Clean verification

Run from `/work/repo`:

```sh
npm ci
npm audit --audit-level=high
npm run lint
npm test
npx playwright test --workers=1
npm run build
npm run verify:live -- https://home-service-passbook.sociobot.in .factory/repair-4-evidence/live
```

Results on 2026-08-28:

- `npm ci`: completed; 60 packages and 0 vulnerabilities.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm run lint`: TypeScript clean.
- `npm test`: 11 Vitest tests and 16 Playwright tests pass.
- Required controller regression: `npx playwright test --workers=1` passes all 16 browser tests in one worker. The revised five-asset correction claim passes on its own too.
- Every one of the 12 literal `.factory/claims.json` commands was run separately and passed.
- `npm run build`: succeeds and writes `dist/`. Initial JS is 45.01 KB raw / 13.58 KB gzip; CSS is 19.80 KB raw / 5.20 KB gzip; the mobile hero is 38.85 KB.
- Package/consumer validation: not applicable; this is a static PWA, not a distributable library.

## Browser, accessibility, privacy, offline, and identity evidence

- Local `verify-url.sh` passes at `http://127.0.0.1:4173`: title, `lang=en`, one H1, main landmark, complete image alt text/button names, and zero console errors. Evidence: `.factory/repair-4-evidence/local/verify.json` and the desktop/390 px captures beside it.
- The repository’s Playwright Axe integration passes 20 scans: `/`, `/demo`, `/privacy`, `/terms`, and `/404`; 1280 px and 390 px; light and dark themes. It finds zero serious/critical issues. The standalone `@axe-core/cli` was also attempted, but its Selenium launcher cannot find the container’s Chrome binary; Playwright uses the installed Chromium and is the authoritative executed scan here.
- Browser regression coverage includes the 390 px first screen, no horizontal overflow at normal and 200% text, keyboard skip link and dialog focus handling, 44 px targets, reduced motion, history focus, offline reload, and update toast.
- Live smoke passed at `https://home-service-passbook.sociobot.in`: checkout is a `303` to `checkout.dodopayments.com`; no console error or unexpected external request; keyboard, offline reload, 390 px overflow, and footer targets pass; all 20 live Axe scans are clear. Evidence: `.factory/repair-4-evidence/live/live-smoke.json` and `demo-mobile.png`.
- The live product remains local-first. License verification is the only allowed external product API path. Response headers and static routing are covered by the retained deployment-policy tests; the live smoke validates the real checkout identity.

## Deployment

Deploy the already-built static output with:

```sh
/opt/fleet/lib/deploy-static.sh home-service-passbook /work/repo/dist
```

Then rerun `npm run verify:live -- https://home-service-passbook.sociobot.in .factory/repair-4-evidence/live` and compare deployed static hashes with `dist/`.

## Known gaps

No release-blocking product gaps are known. The product has no sign-in or AI feature, so Entra and Sociobot inference-gateway checks do not apply. Checkout and license verification intentionally rely only on the Sociobot billing API.
