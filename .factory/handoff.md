# Home Service Passbook — repair handoff

## Outcome

Repository and deployment repairs for work order `home-service-passbook-repair-1` are complete and live at <https://home-service-passbook.sociobot.in>. The deployed app matches the local production build byte for byte.

Release remains blocked by one factory-owned dependency: the Sociobot billing product is not registered or enabled. The required checkout still returns HTTP 404. Repository policy says billing registration is performed by the factory, and this worker contains no approved `fleet/new-paid-product.sh` tool or billing-admin credential. Do not approve release until the factory registers the product and a checkout request returns a hosted-checkout redirect.

## Repairs

- Replaced shallow import checks with full nested validation for every area, asset, job, completion, date, reference, interval, and attachment before confirmation or storage.
- Import replacement now retains the prior valid state. Startup restores it if current state is damaged; legacy corrupt state without a rollback is quarantined and opens an empty, usable passbook.
- Invalid JSON now gets the plain recovery message: “The backup is not valid JSON. Choose an exported passbook file.”
- Bound every cached House Key verdict to the exact stored token. Orphaned or mismatched verdicts cannot unlock features. Returned checkout tokens stay locked until verification succeeds, then the app rerenders immediately.
- Added edit and confirmed-delete paths for assets, recurring jobs, and service entries. Cascading deletes name their scope. Schedule state is recalculated after service-entry changes.
- Rejected future completion dates in the form and imported backups.
- Fixed dark-theme contrast for overdue states, the demo banner, paid-panel labels and links, and the standalone 404 page.
- Raised the wordmark, restore link, demo actions, footer links, and standalone 404 links to at least 44 CSS px. Mobile layout now survives 200% text without horizontal page overflow.
- Replaced the broad SPA fallback with generated physical route entries. Unknown live URLs now return HTTP 404 with the designed page.
- Added one-year immutable caching to `/assets/*`; live hashed JS and CSS return `public, max-age=31536000, immutable`.
- Bumped the PWA shell to `home-service-passbook-v3`, updated its precache version, and versioned the manifest start URL as `/app?v=2`.
- Expanded `.factory/claims.json` to nine claims and enforced one exact tagged browser test per claim.

## Verification

Clean run on 2026-08-28 UTC:

```sh
npm ci
npm audit --audit-level=high
npm run lint
npm test
npm run build
git diff --check
```

- Clean install: 60 packages; 0 vulnerabilities.
- Type/lint: `tsc --noEmit` passed.
- Unit/config: 10 tests passed.
- Browser: 14 Playwright tests passed.
- Claims: all nine exact commands from `.factory/claims.json` passed individually. Coverage proves seeded-real-data demo isolation; both recurrence modes; photo backup round-trip; same-origin-only runtime; offline reload; free limit and token-bound license; complete service fields after reload; print; and record corrections.
- Build: `dist/index.html` exists. JS is 43.68 KB raw / 13.17 KB gzip; CSS is 19.67 KB raw / 5.17 KB gzip. The 640 px hero is 38.85 KB. No font files ship.
- Local URL check: title, `lang=en`, one H1, main, alt text, button names, and console checks passed in 548 ms.
- Local Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 2.1 s, TBT 0 ms, CLS 0.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.7 s, TBT 0 ms, CLS 0.
- Accessibility: 20 populated live axe scans passed with zero serious/critical issues across `/`, `/demo`, `/privacy`, `/terms`, and `/404`, in light/dark modes at 1280 px and 390 px.
- Mobile/keyboard: zero page overflow at 390 px; measured demo/footer targets are 44 px; skip-link focus works; dialog Enter/Escape and focus return pass; 200% text reflow passes.
- Motion/update: reduced motion computes automatic scrolling and 0.01 ms transitions. The update event regression shows “An update is ready. Reload to use it.”
- Privacy: a complete live demo flow made no cross-origin requests and logged no console/page errors.
- Offline: a service-worker-controlled live `/demo` reload retained the sample records while the browser was offline.
- Response policy: live known routes return 200; `/not-a-real-route` returns 404; manifest MIME, CSP, HSTS, `nosniff`, referrer, and permissions headers are present.
- License API: an invalid token returns `200 {"expires_at":null,"reason":"invalid","valid":false}`, `Cache-Control: no-store`, and the exact live-origin CORS header. The 31st overall burst request returned 429.
- Package/consumer checks: not applicable; this remains a static `pwa-offline` product with no published package interface.

Deployment ID: `fc31ea33-43ca-4335-a47c-4d69bae40c28` (`Succeeded`).

Live artifact identity:

| File | SHA-256 local = live |
| --- | --- |
| `index.html` | `d1b2875431e8a318f7a87bd9104b65dceabaf96465c3ff68e8182381f3d7247a` |
| `assets/index-CsvaVtZa.js` | `0b2f9c88b630339b78a7d59c37e9bee3da099f544e764368167cb996065ff047` |
| `assets/index-ByxEwoz2.css` | `358f4624c616863a338183956b3972620d49aaecd5aaf1baf4264c727cd6b70d` |
| `sw.js` | `bd8fa2c4fb9bf127feb193c047eee603cf2c67f18597257a73f36cd271241f05` |
| `manifest.webmanifest` | `2e4e214c6813f982693ccdd4206be8afc9635cb7e8b2610fe66b45b4be099d94` |
| `404.html` | `764cff590c54ad4eb8676a7a471296940333642bb481068613316861feb36d06` |

Evidence is under `.factory/repair-evidence/`. Run `npm run verify:live` to repeat live mobile, keyboard, privacy, offline, touch-target, and axe checks.

## Required factory follow-up

Register and enable `home-service-passbook` in the Sociobot billing engine with the advertised one-time USD 19 price and return URL. Then verify:

```sh
curl -I https://api.sociobot.in/api/v1/products/home-service-passbook/checkout
```

Expected: a 3xx redirect to the hosted checkout. Actual at handoff: HTTP 404 with `{"error":"enabled factory product","status":404}`. After a test purchase, confirm the return token verifies only for `home-service-passbook` and unlocks the already-tested token-bound client flow.
