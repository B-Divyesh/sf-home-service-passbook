# Independent product verification 5 — PASS

Verified on 2026-08-28 against candidate commit `cfd6e2e5d81329123427b675ec7c9ca34373d3f1` and <https://home-service-passbook.sociobot.in>.

## Decision

**PASS — release this candidate.** The live deployment matches the candidate byte for byte, the mandatory first-read/demo gate passes, all 12 declared claim commands pass, and fresh end-to-end, accessibility, privacy, PWA, billing, routing, and performance checks found no release-blocking defect.

No product code was changed during verification.

## First-read and demo gate

Cold desktop and 390 × 844 px visits pass the mandatory first screen:

- What it does: **“Remember every home service job.”**
- For whom: **“For households tracking recurring care, service dates, notes, and receipts without another appliance account.”**
- What to click first: **“Try it with sample data.”**
- At 390 px the primary action is `348 × 50.797` CSS px at `y=494.625`, wholly inside the first 844 px viewport.
- One click opens `/demo`, three realistic recurring jobs, both recurrence modes, and the persistent **“Demo — sample data, nothing is saved to your passbook”** banner with **Reset demo** and **Start for real**.
- Demo data uses `demo:home-service-passbook`; real data uses `home-service-passbook`.

Evidence: `qa-evidence-5/first-read-desktop.png`, `qa-evidence-5/first-read-mobile.png`, and `qa-evidence-5/independent-live.json`.

## Mandatory claims

`.factory/claims.json` exists with 12 unique IDs. Each has exactly one `@claim:<id>` browser test. Before any other product gate, every literal `test` command was run separately from the candidate checkout; every command exited 0:

| Claim | Result | Fresh observable evidence |
| --- | --- | --- |
| `demo-sandbox` | PASS | A pre-seeded real Boiler survives demo entry/reset/exit; sample Furnace data does not cross namespaces. |
| `recurrence-rules` | PASS | Fixed-calendar work stays overdue until recorded and remains calendar-anchored; completion-relative work advances from completion. |
| `json-backup` | PASS | All four record collections and a persisted photo attachment export and round-trip. |
| `local-only` | PASS | Demo browse/export and the independent full maintenance flow make only product-origin requests. |
| `offline-reload` | PASS | A controlled live `/demo` reloads offline with its sample records. |
| `house-key-limit` | PASS | Five assets remain free, the sixth reaches House Key, token binding and revocation work, and a 3 MB photo persists and exports. |
| `service-log` | PASS | Date, note, receipt reference, recurrence, and reload persistence work. |
| `print-history` | PASS | The action invokes print; fresh print media contains four service entries and hides application chrome/controls. |
| `record-corrections` | PASS | Asset/job/entry corrections persist at the five-asset boundary; independent asset/job/entry deletion and cascade checks pass. |
| `import-validation` | PASS | Malformed JSON and malformed nested records are rejected without replacing valid data. |
| `import-rollback` | PASS | Startup validation restores the passbook retained before import. |
| `refund-revocation` | PASS | A revoked verdict replaces the optimistic cached verdict and locks paid features. |

Landing, privacy/terms, license-panel, and README claims were cross-checked against this manifest. No unsupported material product claim or conflicting promise was found.

## Clean repository gates

- `npm ci`: PASS — 60 packages installed; 0 vulnerabilities.
- `npm audit --audit-level=high`: PASS — 0 vulnerabilities.
- `npm run lint`: PASS — `tsc --noEmit`.
- `npm test`: PASS — 11 Vitest tests and 16 Playwright tests.
- `npm run build`: PASS — TypeScript and the exact Vite production build wrote `dist/`.
- `git diff --check`: PASS before report edits.
- README, MIT license, privacy, terms, design thesis, demo notes, copy audit, handoff, manifest, icons, robots, sitemap, security policy, and designed 404 all exist.

This is a static PWA, not a library, CLI, or backend. Package-consumer, server concurrency/persistence, backend health/build identity, and Entra sign-in checks are not applicable. The product has no sign-in.

## Independent end-to-end and recovery checks

The fresh live flow in `qa-evidence-5/independent-live.json` passes 48 independent assertions outside the repository suite:

- Starts from a filled isolated demo, enters an empty real passbook, adds a Water heater and two recurrence modes, records work, and retrieves the last-completed details after reload.
- A completion-relative annual job completed 2026-08-28 becomes due 2027-08-28.
- A fixed six-month job first due 2026-08-01 remains overdue; completion on 2026-08-28 advances to the anchored 2027-02-01 occurrence.
- Empty required input, interval `0`, interval `121`, and a future completion date are rejected with focus retained on the invalid field. The maximum interval `120` is accepted.
- Exactly five free assets are accepted; the sixth reaches House Key. Existing assets remain editable at the limit. Backup remains free.
- Asset, job, and service-entry correction works. Independent cancel/confirm checks prove asset and job deletion, including cascaded service entries.
- A `3,000,000`-byte image persists, reloads, downloads, and exports. `3,000,001` bytes is rejected with a clear error.
- Malformed nested import leaves existing records intact. Export contains areas, assets, jobs, completions, and attachment data.
- HTML-like record text renders as text and does not execute.
- An injected IndexedDB write failure keeps the entered asset form open with a recovery message; retry succeeds after storage is restored.
- Print media contains all four demo history records. Evidence: `qa-evidence-5/print-history.pdf`.

## Accessibility, keyboard, and responsive behavior

- `/opt/fleet/lib/verify-url.sh`: PASS — HTTPS 200, route title, `lang=en`, one H1, main landmark, no missing alt text, no unnamed buttons, zero console errors, 597 ms load. Evidence: `qa-evidence-5/verify-url/verify.json`.
- Fresh axe: 20 route scans have zero serious/critical findings across `/`, `/demo`, `/privacy`, `/terms`, and `/404`, at 1280 and 390 px, in light and dark themes. Four additional light/dark mobile dialog scans are also clear. Evidence: `qa-evidence-5/live-smoke/live-smoke.json`.
- The first Tab reaches the skip link. Focus uses a visible 3 px solid teal outline. Dialog Tab/Shift+Tab wraps, Escape returns focus, and browser Back restores the prior panel and focuses its H1.
- All checked live interactive targets at 390 px are at least 44 × 44 CSS px. There is no horizontal overflow on any core route or on the populated demo at 200% text.
- Reduced motion computes `scroll-behavior: auto`, `0.00001s` transitions, and zero running animations.
- Every core route has one H1, one main landmark, a route-specific title, and no 390 px overflow.

## Privacy, security, billing, and rate limit

- A complete live demo and real maintenance flow recorded only product-origin requests. There are no analytics, third-party scripts, or remote fonts. No console or page error occurred.
- The only allowed product API is Sociobot billing. A live invalid license returns `200 {"expires_at":null,"reason":"invalid","valid":false}`, `Cache-Control: no-store`, and `Access-Control-Allow-Origin: https://home-service-passbook.sociobot.in`.
- The buy link returns HTTP 303 to `checkout.dodopayments.com`; no payment provider is embedded in the product.
- Rate limiting is enforced: requests 1–30 in one sequential client burst returned 200; request 31 returned **429** with `Retry-After: 3` and `X-RateLimit-After: 3`. Observed allowance: **30 requests per window**.
- HTML responses carry HSTS, CSP, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and restrictive camera/microphone/geolocation permissions policy. No CSP violation occurred.
- All product links return 200, the checkout returns the expected 303, and explicit `mailto:` links are valid crawl exceptions.

## PWA, offline, update, deployment, and performance

- Manifest: standalone display, `/app?v=3` start URL, matching colors, valid 192/512/maskable icons, and a 180 px Apple touch icon.
- Live `/demo` is controlled by `/sw.js`; versioned cache `home-service-passbook-v4` exists and an offline reload retains sample records. Evidence: `qa-evidence-5/offline-demo.png`.
- A real same-origin worker update using the built service worker shows **“An update is ready. Reload to use it.”** with no errors. Evidence: `qa-evidence-5/pwa-update.json` and its runner `pwa-update.mjs`.
- `/`, `/app`, `/demo`, `/history`, `/backup`, `/privacy`, and `/terms` return 200. A random unknown route returns the designed page with HTTP 404.
- Hashed JS/CSS use `Cache-Control: public, max-age=31536000, immutable`; HTML and `sw.js` revalidate after 30 seconds.
- Production sizes: JS 45.01 KB raw / 13.52 KB gzip; CSS 19.80 KB raw / 5.22 KB gzip; mobile hero 38.85 KB; no downloaded fonts. All budgets pass.
- Lighthouse 13.4.1 mobile live: Performance **98**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.00 s, LCP 1.22 s, TBT 167 ms, CLS 0, total transfer 93.8 KB. INP is unavailable for this non-interactive lab navigation. Evidence: `qa-evidence-5/lighthouse-live.json`.

The locally built and live files match exactly:

| File | SHA-256 (local = live) |
| --- | --- |
| `index.html` | `e45c0b5a68f3daa30535cae597dc2235becb65aa52db56d026dd2f2b2a624c70` |
| `assets/index-BrCrBByi.js` | `e5204bed816391f18e912a1c45a123d8feef5f83ae3135c68a1ec59408040f1a` |
| `assets/index-v3kgqw0P.css` | `22b4bc4ca2e85642d88550feee62b423e117d634df2b7c739b9ffad02090214e` |
| `sw.js` | `fe087f95d0d2f620a1ee6bcb73a73ba0c3166305c8129b756ff8a35580e17c45` |
| `manifest.webmanifest` | `e046e6322833fdb209174f1914c7c07043cba664c3915c63904263d589098fb3` |
| `404.html` | `764cff590c54ad4eb8676a7a471296940333642bb481068613316861feb36d06` |

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none found in the tested acceptance scope.

## Known limitations of verification

- Lighthouse does not report lab INP for this navigation; TBT was 167 ms and direct interactions remained responsive.
- Refund revocation uses the required recorded/mock negative verdict so verification does not create or refund a real purchase.
- No AI feature is present or warranted by this record-keeping brief; Sociobot inference checks are not applicable.
