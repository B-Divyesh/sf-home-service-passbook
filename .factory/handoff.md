# Home Service Passbook verification handoff

## Result: FAIL

Independent QA on 2026-08-28 tested candidate `2daa5a5ceef426cd542565aa5d003b85408aa7ff` at `https://home-service-passbook.sociobot.in`. Do not release this candidate.

The cold first screen and one-click sample demo pass. All eight exact claim commands pass after `npm ci`; the full suite passes 3 unit and 10 Playwright tests; TypeScript and the production build pass; live core assets match the candidate byte-for-byte. Live offline reload, service-worker update messaging, print history, privacy request boundaries, rate limiting, and performance budgets also pass.

Release blockers:

- The advertised House Key checkout returns HTTP 404.
- A malformed version-1 backup is persisted, bricks startup, and cannot be recovered by the offered Reload action.
- Axe finds serious dark-mode contrast failures.
- House Key becomes active from an unbound local verdict with no license token or verification request.
- Existing claim tests do not fully prove demo isolation, attachment persistence/export, or all service-log fields, and published claims remain unlisted or only partially tested.

Additional defects: future completion dates are accepted; core records have no edit/delete/undo; multiple mobile links are under 44 px high; hashed assets cache for only 30 seconds; unknown routes return soft 404 status 200.

Full commands, evidence, measurements, and severity-ranked findings are in [.factory/verification.md](verification.md). Browser artifacts are under `.factory/qa-evidence/`.

## Re-run

```sh
npm ci
npm test
npm run build
npm audit --audit-level=high
```

Then repeat every command in `.factory/claims.json`, both-theme axe runs at desktop and 390 px, live billing checkout, API burst limiting, malformed-backup recovery, and live offline/update checks.
