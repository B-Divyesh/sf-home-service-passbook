# Home Service Passbook handoff

## Shipped

- A Vite and TypeScript offline PWA for areas, assets, recurring jobs, and service entries.
- Separate **Repeat every** and **Repeat after completion** date rules.
- Completion dates, notes, receipt references, and licensed photo or PDF attachments.
- Due dashboard, asset ledger, printable history, and JSON backup/import.
- A one-click sample demo at `/demo` in a separate IndexedDB namespace.
- A five-asset free tier and $19 House Key through the Sociobot billing contract.
- Optimistic offline license state, daily verification, return-token capture, and license restore.
- Privacy, terms, designed 404, manifest, icons, service worker, metadata, sitemap, CSP, and security headers.
- An original generated hero with source prompt, review record, and responsive WebP files.

## Run and verify

```sh
npm install
npm test
npm run build
npm run preview
```

The exact deployment build command is `npm run build`. Output is `dist/`, and `dist/index.html` is at its root.

Verification on 2026-08-28:

- `npm test`: 3 unit tests and 10 Playwright tests passed.
- Claim tests: demo isolation, both recurrence rules, backup round trip, local-only requests, offline reload, House Key limit, service log persistence, and printing passed.
- `npm run build`: passed. Initial JS is 10.3 KB gzip; CSS is 5.1 KB gzip.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Axe through Playwright: 0 serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, and `/404`.
- `verify-url.sh`: title, `lang`, one `h1`, main landmark, image alt text, labels, and console check passed. Load measured 558 ms locally.
- Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse metrics: LCP 1.9 s, CLS 0, total blocking time 0 ms. INP was unavailable for the non-interactive lab load.
- Manual screenshots reviewed at 1440 × 1000 and 390 × 844.
- Hero WebP: 38 KB mobile and 151 KB desktop. Social preview: 119 KB.

## Known gaps

- Records do not sync between devices. Export/import is the supported transfer path.
- Browser storage quotas vary. Attachments are limited to 3 MB each.
- Live checkout and license issuance require factory product registration. Tests verify the contract with a mocked response.
- The app records maintenance but does not provide repair or safety advice.

## Next steps

- Register `home-service-passbook` with the Sociobot billing engine before launch.
- Deploy `dist/` through the factory static pipeline.
- Run a production URL smoke test after deployment.
