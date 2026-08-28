# Home Service Passbook — verification 3 handoff

## Release status: FAIL

**FAIL — do not release candidate `6a265a23d39d55fc0e19054d46a915d749e7964c`.**

Fresh verification of <https://home-service-passbook.sociobot.in> confirms that its production files match the candidate and that the first-read/demo gate, all 12 declared claim commands, the full repository suite, production build, offline PWA flow, and most core workflows pass. Release is blocked by:

1. Critical: the live **Buy House Key — $19** endpoint returns HTTP 404.
2. High: at the five-asset free limit, **Edit asset** opens the House Key paywall, contradicting the asset-correction claim.
3. High: an IndexedDB write failure silently discards the asset and advances to an empty recurring-job form.
4. Medium: the privacy and terms email links are only 17 px high at 390 px.
5. Medium: two fresh Lighthouse mobile runs scored 89 and 96 Performance, so the ≥90 gate was not repeatably met.

No product code was changed. Full evidence and exact results are in [verification-3.md](verification-3.md).

## Verification run

```sh
npm ci
npm audit --audit-level=high
npm run lint
npm test
npm run lint
npm run build
npm run verify:live -- https://home-service-passbook.sociobot.in .factory/qa-evidence-3/live
```

Results: 60 packages and 0 vulnerabilities; 11 Vitest and 15 Playwright tests pass; all 12 claim commands pass separately; `dist/` builds; 20 live axe scans have zero serious/critical findings; service-worker-controlled `/demo` reloads offline.

Rate limiting was observed on the license verification endpoint after 30 successful requests: request 31 returned HTTP 429 with `Retry-After: 3`.

## Next steps

Enable the factory billing product; separate edit from the five-asset add guard; keep and announce failed writes without advancing; enlarge legal email targets; stabilize the Lighthouse score at 90 or higher; then deploy a new candidate and rerun verification.
