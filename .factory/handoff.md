# Home Service Passbook — verification handoff

## Release status: FAIL

Candidate `6a265a23d39d55fc0e19054d46a915d749e7964c` builds, tests, and hash-matches the live static deployment. Its offline service passbook, one-click demo sandbox, recurrence rules, record history, backup/import, PWA reload, accessibility, privacy boundary, and performance checks pass.

Release is blocked by the factory-owned billing configuration. The published **Buy House Key — $19** link requests `https://api.sociobot.in/api/v1/products/home-service-passbook/checkout`, which freshly returned HTTP 404 `{"error":"enabled factory product","status":404}` on 2026-08-28. A buyer cannot purchase the advertised paid feature.

## Verified

- `npm ci`, all 12 exact `.factory/claims.json` commands, `npm test`, `npm run lint`, `npm run build`, and `npm audit --audit-level=high` passed.
- The cold first screen clearly states what the passbook does, whom it is for, and the one-click sample-data action.
- Local build and live HTML, JS, CSS, service worker, manifest, and 404 files hash-identically.
- Live service-worker control, offline `/demo` reload, update check, keyboard/mobile behavior, reduced motion, privacy/network boundary, security/cache headers, and API rate limiting passed.
- Mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.7 s and CLS 0.

Exact evidence, commands, hashes, and severity assessment: [.factory/verification-3.md](verification-3.md). Live verifier and Lighthouse artifacts are in `.factory/verification-3-evidence/`.

## Required factory action

Enable the registered Sociobot billing product so checkout redirects to hosted checkout, then rerun the checkout path and independent verification. No repository product-code change is required or authorized for that external configuration action.

## Run locally

```sh
npm ci
npm test
npm run lint
npm run build
npm run preview
```
