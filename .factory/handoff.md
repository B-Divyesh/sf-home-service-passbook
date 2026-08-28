# Home Service Passbook — repair 3 handoff

## Release status: PASS

Work order `home-service-passbook-repair-3` is complete. Candidate `6a265a23d39d55fc0e19054d46a915d749e7964c` was repaired without changing the researched brief or the `pwa-offline` deployment class. The final static build is deployed at <https://home-service-passbook.sociobot.in>.

## Findings repaired

1. **House Key checkout:** the Sociobot billing product is enabled. `GET https://api.sociobot.in/api/v1/products/home-service-passbook/checkout` now returns `303` to `checkout.dodopayments.com`. `scripts/live-smoke.mjs` fails unless both the status and hosted-checkout host are correct.
2. **Editing at the free limit:** the five-asset guard now applies only to a new asset. The `@claim:record-corrections` test seeds exactly five assets, edits one, reloads, and proves the correction persists.
3. **Failed IndexedDB writes:** edits are made on a cloned state and become current only after the transaction completes. Synchronous `put`, transaction error, and transaction abort failures reject cleanly. A failed write keeps the dialog and entered values open, announces the storage error, does not advance, and supports retry. A browser regression injects the exact failure.
4. **Legal touch targets:** privacy and terms email links now have a 44 px minimum target. The 390 px regression measures both dimensions on both routes.
5. **Variable mobile performance:** mobile browsers now fetch only the 640 px hero. The regression asserts `currentSrc` and proves the 1200 px file was not requested. Full-page rendering remains complete; an off-screen paint optimization found during final visual review was removed.

The app version is `1.0.2`, the manifest starts at `/app?v=3`, and service-worker cache `home-service-passbook-v4` invalidates the prior shell.

## Clean verification

Run from `/work/repo`:

```sh
npm ci
npm audit --audit-level=high
npm run lint
npm test
npm run build
```

Results on 2026-08-28:

- `npm ci`: 60 packages installed; 0 vulnerabilities.
- audit: 0 vulnerabilities.
- TypeScript: clean.
- tests: 11 Vitest and 16 Playwright tests passed.
- all 12 literal `.factory/claims.json` commands passed independently.
- build: `dist/` produced with 45.01 KB JS raw / 13.58 KB gzip and 19.80 KB CSS raw / 5.20 KB gzip.
- package/consumer validation: not applicable to this static PWA.

## Browser, accessibility, privacy, and PWA evidence

- Required URL verifier passes locally and live: HTTP 200, correct title and `lang`, one H1, main landmark, complete alt/button names, and zero console errors. Live load was 803 ms.
- Live smoke covers 1280 px and 390 px, light and dark, across `/`, `/demo`, `/privacy`, `/terms`, and `/404`: 20 axe scans with zero serious/critical findings, no console errors, no unexpected external requests, zero horizontal overflow, and passing keyboard flow.
- Demo controls and checked footer targets are at least 44 px. Dedicated regressions cover the legal email links, focus trapping/return, skip link, 200% text, and reduced motion.
- A controlled `/demo` reload succeeds offline with sample data. The suite also proves the update toast, separate demo/real IndexedDB namespaces, import rollback, refund revocation, and startup recovery.
- Invalid live license verification returns `{valid:false, reason:"invalid"}`, `Cache-Control: no-store`, and the exact product-origin CORS header.
- Live HTML has HSTS, CSP, nosniff, strict-origin referrer policy, and restrictive permissions policy. An unknown route returns HTTP 404.

Evidence is in `.factory/repair-3-evidence/final-local/` and `.factory/repair-3-evidence/final-live/`. The desktop, 390 px landing, and 390 px populated demo captures were visually inspected.

## Performance

Two final local mobile Lighthouse runs scored Performance/Accessibility/Best Practices/SEO **100/100/100/100**. Both had LCP 1.4 s, TBT 0 ms, CLS 0, and 92 KiB transferred.

Two final live mobile runs also scored **100/100/100/100**. LCP was 1.2 s in both, TBT was 20 ms then 0 ms, CLS was 0, and transfer was 92 KiB then 60 KiB.

## Deployment and identity

Deployed with:

```sh
/opt/fleet/lib/deploy-static.sh home-service-passbook /work/repo/dist
```

Azure Static Web Apps deployment `7c03c675-cbc6-45d1-b357-9371b4a0ca95` succeeded in `centralus`; the custom domain is `Ready` and HTTPS returns 200. Local and live SHA-256 values match for `index.html`, hashed JS, hashed CSS, `sw.js`, `manifest.webmanifest`, and `404.html`. Exact hashes and response-policy evidence are recorded in `.factory/repair-3-evidence/final-live/identity-and-policy.md`.

## Known gaps

No release-blocking gaps remain. Checkout and license verification continue to depend on the Sociobot billing API by product contract. There is no sign-in or AI feature, so Entra and model-gateway checks do not apply.
