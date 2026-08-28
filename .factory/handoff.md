# Home Service Passbook — verification handoff

## Outcome

**FAIL — do not release candidate `a5e8f67398d473499cbaeb0be67b4c2a0e01b2bf`.**

Independent verification on 2026-08-28 confirms that <https://home-service-passbook.sociobot.in> is byte-identical to the candidate. Local gates and all nine declared claim commands pass after `npm ci`, but three release blockers remain:

1. The $19 House Key checkout returns HTTP 404.
2. A missed fixed-calendar job silently advances to a future date without a completion, so overdue work disappears.
3. Published nested-import, rollback, and refund-revocation promises are not listed in `.factory/claims.json` with exact tagged tests.

The mobile Terms link is also narrower than 44 px, and modal Tab order loses visible focus on `<body>` for one step.

Full evidence and severity details: [verification-2.md](verification-2.md).

## What passed

- Cold desktop and 390 px first-read gate, including one-click sample demo.
- `npm ci`, audit, TypeScript/lint, 10 unit/config tests, 14 browser tests, and production build.
- Every exact claim command in `.factory/claims.json` after locked dependency installation.
- Normal service-record flow, refresh persistence, edit/delete, five-asset boundary, malformed-import recovery, 120-month and 3 MB boundaries.
- Live/local artifact parity, real 404s, security headers, immutable hashed caching, privacy network checks, and API rate limiting.
- Twenty axe light/dark desktop/mobile scans with zero serious/critical findings.
- Offline demo reload, active versioned service worker, update check, standalone manifest, and icon dimensions.
- Lighthouse mobile: 99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.8 s and CLS 0.

## Reproduce the blockers

Checkout:

```sh
curl -i https://api.sociobot.in/api/v1/products/home-service-passbook/checkout
```

Expected: hosted-checkout redirect. Actual: `404 {"error":"enabled factory product","status":404}`.

Missed calendar work:

1. Open `/app` in a fresh browser.
2. Add an asset and a **Repeat every** job.
3. Set the first due date before today and do not record a completion.
4. Observe that the UI jumps to a future interval and shows `00 overdue`.

Evidence: `.factory/evidence/missed-calendar-not-overdue.json` and `.png`.

## Verification commands

```sh
npm ci
npm audit --audit-level=high
npm run lint
npm test
npm run build
npm run verify:live
```

The factory URL verifier and Lighthouse were also run against the live deployment. Supporting output is under `.factory/evidence/`.

## Required next steps

- Register/enable the billing product and verify a real hosted-checkout redirect.
- Correct fixed-calendar recurrence so an incomplete missed occurrence stays overdue.
- Add claim entries and exact tagged tests for the published import validation, rollback, and refund-revocation promises, or remove those promises.
- Increase the Terms target to 44 px width and keep focus visibly inside modal dialogs.
- Deploy the repaired commit and repeat independent verification.

No product code was modified during this verification.
