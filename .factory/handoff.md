# Home Service Passbook — review 2 handoff

## Status: FAIL

This reviewer made documentation-only changes: `.factory/review-2.md` records the independent second adversarial review. Product code was not modified.

## Verification performed

- Opened the live landing page cold in fresh 390 × 844 and 1440 × 900 Chromium contexts. The first screen clearly identifies the job, audience, and sample action; it had no console errors.
- Entered the live demo through the visible action. It showed populated sample work, its persistent sandbox banner, reset action, and exit action. A real `Boiler` record survived demo exit while the sample `Furnace` did not cross into real storage. The demo flow made no cross-origin request.
- Confirmed a service-worker-controlled live `/demo` reload works offline with sample work visible.
- Cloned the repository into a fresh `/tmp` directory, ran `npm ci`, ran all 14 literal claim commands separately, then ran `npm test` and `npm run build`. All claim tests and the final suite passed; the build created `dist/index.html`.
- Rechecked the complete set of prior review-1 findings against live output and current code. All F-1 findings are fixed.
- Checked every application route, titles, metadata, 404 behavior, header/footer, back-button focus/live announcement, sitemap/robots/icons, and internal route responses.

## Remaining work

Four review findings remain, all documented with exact quotes and fixes in `.factory/review-2.md`:

1. Remove or make testable the footer claim “Original generated artwork.”
2. Replace the inconsistent app eyebrow “Household ledger” with the established “passbook” term.
3. Remove or plainly rename the 404 label “Wrong panel.”
4. Remove the unexplained landing decoration “HOME / 01.”

After those code/copy changes, rerun the claim commands, full tests/build, and the live browser review. The current verdict remains FAIL until there are zero findings.
