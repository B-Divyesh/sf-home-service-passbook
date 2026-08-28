# Home Service Passbook — repair handoff

## Outcome

The code repairs every repository-owned finding from independent verification 2:

- A fixed-calendar job now remains due on its first missed date until work is recorded. A late completion advances only to the next anchored calendar occurrence.
- The footer Terms link is now at least 44 × 44 CSS px at 390 px.
- Native asset, job, and service dialogs explicitly keep Tab and Shift+Tab inside the dialog, with focus moving from the final submit action to Close dialog and back.
- The nested-import validation, import rollback, and refund-revocation promises are listed in `.factory/claims.json` and have one exact tagged browser regression each.

The Sociobot checkout remains a **factory billing dependency**: on 2026-08-28, `GET https://api.sociobot.in/api/v1/products/home-service-passbook/checkout` still returns `404 {"error":"enabled factory product","status":404}`. This repository intentionally does not register or change billing products, per `AGENTS.md`; the existing paid-link integration and its verification/return/revocation flows are preserved. The factory must enable the registered `home-service-passbook` product before release.

## Verification

Executed from a clean locked install on 2026-08-28:

```sh
npm ci                              # 60 packages; 0 vulnerabilities
npm audit --audit-level=high        # pass, 0 vulnerabilities
npm run lint                        # pass
npm test                            # 11 Vitest + 15 Playwright tests pass
npm run build                       # pass; dist/index.html produced
```

Every exact command declared in `.factory/claims.json` was run independently and passed: `demo-sandbox`, `recurrence-rules`, `json-backup`, `local-only`, `offline-reload`, `house-key-limit`, `service-log`, `print-history`, `record-corrections`, `import-validation`, `import-rollback`, and `refund-revocation`.

Local production smoke against `dist/` (`npm run verify:live -- http://127.0.0.1:4173 .factory/repair-evidence/local`) passed:

- 20 axe scans: 0 serious/critical issues across desktop and 390 px, light and dark, for `/`, `/demo`, `/privacy`, `/terms`, and `/404`.
- No console errors, no external requests, zero 390 px overflow, working skip link and offline `/demo` reload.
- Footer Privacy is 45.08 × 44 px; Terms is 44 × 44 px.
- The 390 px keyboard regression exercises Escape return focus plus final Save asset → Tab → Close dialog → Shift+Tab → Save asset.

Evidence: `.factory/repair-evidence/local/live-smoke.json` and `demo-mobile.png`.

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh home-service-passbook dist
```

The application remains a local-first Vite PWA deployed as static files. Its data stays in IndexedDB, demo data remains in the separate `demo:home-service-passbook` namespace, and no third-party scripts or fonts are loaded.

## Remaining factory action

Enable the existing Sociobot billing product and confirm that its checkout endpoint redirects to hosted checkout. Then rerun the live response-policy, checkout, service-worker/offline/update, and Lighthouse checks against the deployed commit.
