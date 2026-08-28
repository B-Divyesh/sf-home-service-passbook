# Home Service Passbook — independent verification 5 handoff

## Release status: PASS

Candidate `cfd6e2e5d81329123427b675ec7c9ca34373d3f1` is approved for release at <https://home-service-passbook.sociobot.in>.

Fresh verification found that the live deployment matches the candidate byte for byte. The first screen explains the job and audience and exposes a one-click sample demo. All 12 mandatory claim commands, repository gates, live end-to-end cases, privacy checks, accessibility checks, offline/update behavior, billing checks, and performance budgets pass.

No product code was changed. Full results and hashes are in [.factory/verification-5.md](verification-5.md). Fresh machine-readable and visual evidence is in `.factory/qa-evidence-5/`.

## Verification summary

- `npm ci`: 60 packages; 0 vulnerabilities.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm run lint`: TypeScript clean.
- Every literal test in `.factory/claims.json`: 12/12 pass.
- `npm test`: 11 Vitest and 16 Playwright tests pass.
- `npm run build`: pass; writes `dist/`.
- Live/local identity: matching SHA-256 for HTML, JS, CSS, service worker, manifest, and 404 page.
- First-read/demo: pass on desktop and 390 px; sample action is inside the first mobile viewport and opens isolated populated data in one click.
- Independent live flow: 48/48 assertions pass, including both recurrence rules, persistence, corrections/deletions, free/paid and file-size boundaries, malformed import protection, storage-failure retry, export, offline use, reduced motion, and 200% text.
- Accessibility: zero serious/critical findings in 20 route scans and four modal scans across mobile/desktop and light/dark; keyboard/focus/touch-target checks pass.
- Privacy: full maintenance flow makes no cross-origin request; no analytics, third-party script, or remote font loads.
- Billing: checkout returns 303 to hosted Dodo checkout; invalid verification is no-store with correct CORS.
- API allowance: requests 1–30 return 200; request 31 returns 429 with `Retry-After: 3`.
- PWA: live service worker controls `/demo`, offline reload passes, and an actual built-worker update shows the update toast.
- Lighthouse mobile live: Performance 98, Accessibility 100, Best Practices 100, SEO 100; LCP 1.22 s, TBT 167 ms, CLS 0, transfer 93.8 KB.
- Bundles: JS 45.01 KB raw / 13.52 KB gzip; CSS 19.80 KB raw / 5.22 KB gzip; mobile hero 38.85 KB.

## How to reproduce

```sh
cd /work/repo
npm ci
npm audit --audit-level=high
npm run lint
npm test
npm run build
npm run verify:live -- https://home-service-passbook.sociobot.in .factory/qa-evidence-5/live-smoke
node .factory/qa-evidence-5/independent-live.mjs
node .factory/qa-evidence-5/pwa-update.mjs
```

Run each `.factory/claims.json` `test` value separately as the mandatory first product gate.

## Defects and known gaps

- Critical/high/medium/low defects: none found in the acceptance scope.
- Lighthouse lab INP is unavailable for a non-interactive navigation; direct interaction testing passed and TBT is 167 ms.
- Real purchase/refund was not performed. Checkout was verified live; revocation was tested with the required recorded/mock verdict.
- Library/CLI consumer, backend concurrency/health, Entra sign-in, and AI-gateway checks are not applicable to this static, account-free PWA.
