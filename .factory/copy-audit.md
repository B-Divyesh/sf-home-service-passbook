# Copy audit

Audited 2026-08-28 after the fourth polish repair. This table includes every static visitor-facing line on the landing route, including navigation, image alternative, labels, sample values, actions, and footer. Counts treat prices, dates, hyphenated terms, and version strings as one word. No sentence exceeds 22 words. No banned marketing word appears.

## Landing route

| Copy | Words | Location | Result |
| --- | ---: | --- | --- |
| Skip to main content | 4 | Keyboard skip link | Pass |
| Home Service Passbook | 3 | Header wordmark; footer | Pass |
| Home Service Passbook home | 4 | Wordmark accessible name | Pass |
| Main navigation | 2 | Navigation accessible name | Pass |
| Demo | 1 | Header navigation | Pass |
| Passbook | 1 | Header navigation | Pass |
| Privacy | 1 | Header and footer links | Pass |
| Private home maintenance passbook. | 4 | Hero eyebrow | Pass |
| Remember every home service job | 5 | H1 | Pass |
| For households tracking recurring care, service dates, notes, and receipts without another appliance account. | 14 | Hero sentence | Pass |
| Try it with sample data | 5 | Primary action | Pass |
| Start my passbook | 3 | Secondary action | Pass |
| The demo opens with a sample record due next. | 9 | Action explanation | Pass |
| Starting for real opens your passbook. | 6 | Action explanation | Pass |
| Works offline after the first visit | 6 | Product fact | Pass |
| Records stay in this browser | 5 | Product fact | Pass |
| Free for five home assets | 5 | Product fact | Pass |
| Product facts | 2 | Facts-list accessible name | Pass |
| Service record | 2 | Instrument label | Pass |
| A furnace filter, service tag, receipt, screwdriver, and maintenance dial arranged on a workbench. | 14 | Hero image alternative | Pass |
| Example maintenance status | 3 | Instrument accessible name | Pass |
| 03 assets | 2 | Instrument readout | Pass |
| 01 due now | 3 | Instrument readout | Pass |
| 04 service entries | 3 | Instrument readout | Pass |
| Sample service schedule | 3 | Preview eyebrow | Pass |
| See what is due and why | 6 | Preview heading | Pass |
| Each job keeps its own schedule rule and proof. | 9 | Preview sentence | Pass |
| Up next | 2 | Preview column label | Pass |
| 28 Aug 2026 | 3 | Preview date | Pass |
| Overdue | 1 | Sample status | Pass |
| Replace air filter | 3 | Sample job | Pass |
| Furnace · Utility room | 3 | Sample asset and area | Pass |
| Due | 1 | Sample date label | Pass |
| 14 Aug | 2 | Sample due date | Pass |
| 3 months after completion | 4 | Sample recurrence | Pass |
| Next | 1 | Sample status | Pass |
| Vacuum condenser coils | 3 | Sample job | Pass |
| Refrigerator · Kitchen | 2 | Sample asset and area | Pass |
| 15 Sep | 2 | Sample due date | Pass |
| Every 6 months | 3 | Sample recurrence | Pass |
| How it works | 3 | Section eyebrow | Pass |
| Record service history in three steps | 6 | Section heading | Pass |
| 01 | 1 | Step number | Pass |
| Add the thing you maintain | 5 | Step heading | Pass |
| Name its room, appliance, or outside area. | 7 | Step sentence | Pass |
| 02 | 1 | Step number | Pass |
| Choose the repeat rule | 4 | Step heading | Pass |
| Use fixed calendar dates or count from completion. | 8 | Step sentence | Pass |
| 03 | 1 | Step number | Pass |
| Record the work | 3 | Step heading | Pass |
| Keep the date, note, receipt reference, and optional photo. | 9 | Step sentence | Pass |
| What this passbook does not do | 6 | Section eyebrow | Pass |
| A record, not a repair guide | 6 | Section heading | Pass |
| This passbook does not control appliances. | 6 | Boundary sentence | Pass |
| It does not diagnose faults, certify safety, or file warranty claims. | 11 | Boundary sentence | Pass |
| Follow manufacturer guidance and use a qualified professional where needed. | 10 | Boundary sentence | Pass |
| Price | 1 | Paid section eyebrow | Pass |
| Keep more than five assets | 5 | Paid section heading | Pass |
| One $19 House Key purchase adds unlimited assets and local photo attachments. | 12 | Paid section sentence | Pass |
| Backup, print, and accessibility stay free. | 6 | Paid section sentence | Pass |
| Buy House Key — $19 | 4 | Paid action | Pass |
| Restore a license | 3 | Paid action | Pass |
| Terms | 1 | Footer link | Pass |
| Household-owned maintenance records. | 3 | Footer description | Pass |
| Built by Param Factory · v1.0.4 | 5 | Footer build label | Pass |

## README repairs

The README uses the same document, history, entry, and House Key terms as the product. The photo feature is stated in two short, direct sentences: “Records service dates, notes, and receipt references.” and “House Key also stores photo attachments.” Import recovery now explains the household outcome instead of implementation mechanics: it checks every listed record type before replacement and restores the earlier passbook if imported data later cannot open.

## Terminology

| Concept | One term |
| --- | --- |
| The stored household document | passbook |
| The collection of completed work | service history |
| One completed-work record | service entry |
| A maintained appliance, room item, or exterior feature | asset |
| Recurring maintenance work | job |
| Fixed anchored schedule | Repeat every |
| Schedule counted from completed work | Repeat after completion |
| Paid license | House Key |
| Paid file feature | photo attachment |
| Downloaded portable record | backup |
| Calendar reminder download | calendar file |

The hero says **passbook**, not a competing document name. Its third instrument value is the observable sample count: **04 service entries**. The app eyebrow is **Passbook**. Both 404 shells use **Page not found**. The hero keeps the useful **Service record** label and no decorative identifier.

## Demo first screen

At 390 × 844, the demo opens directly to a named sample record before secondary controls. Its static labels are **Demo**, **Sample record**, **Due**, and **Last proof**. The seeded values show the job, its asset and area, its date, and its receipt reference. The browser check `mobile first screen and keyboard path work` proves the full sample record stays in the initial viewport.
