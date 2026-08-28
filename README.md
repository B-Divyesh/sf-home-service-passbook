# Home Service Passbook

Track recurring home care and keep proof in a private passbook.

Home Service Passbook is for households that want maintenance dates, notes, and receipts without appliance accounts. It works offline after the first visit and stores records in this browser.

Live site: <https://home-service-passbook.sociobot.in>

Demo: <https://home-service-passbook.sociobot.in/?demo=1>

## What it does

- Stores areas, assets, and recurring jobs in the browser.
- Schedules jobs on fixed dates or from the last completion date.
- Records service dates, notes, and receipt references.
- House Key also stores photo attachments.
- Lets you edit or delete assets, recurring jobs, and service entries.
- Exports and imports one complete JSON backup.
- Exports every current job and due date to a calendar file.
- Prints service history.
- Works offline after the first visit.

The demo uses its own IndexedDB database. Demo changes never write to the real passbook. See [.factory/demo.md](.factory/demo.md).

## Price

The free passbook holds five assets. House Key costs $19 once and adds unlimited assets and local photo attachments. Backup, printing, and accessibility remain free.

Checkout and license verification use the Sociobot billing API.

## Run and test

Requirements: Node.js 20 or newer and npm.

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

`npm test` runs recurrence unit tests and Playwright browser tests. Browser tests cover the demo, privacy, offline use, backups, and accessibility. They also cover keyboard use and the full service-record flow.

`npm run build` is the deployment command. It writes the static site to `dist/`, with `dist/index.html` at its root.

## Data and privacy

Passbook data stays in browser IndexedDB unless the user exports it. License verification sends only the license token to `api.sociobot.in`. There are no analytics, third-party scripts, or remote fonts.

Export JSON before clearing site data or moving devices. Before replacing your passbook, import checks every area, asset, job, service entry, and attachment. If imported data cannot open later, the app restores the passbook you had before importing.

## Scope

This product keeps records. It does not control appliances, diagnose faults, certify safety, give repair advice, or file warranty claims.

## Project notes

- Visual system and generated-art provenance: [.factory/design.md](.factory/design.md)
- Testable product claims: [.factory/claims.json](.factory/claims.json)
- Final verification: [.factory/handoff.md](.factory/handoff.md)
- License: [MIT](LICENSE)
