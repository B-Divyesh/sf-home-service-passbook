import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('reviewed product copy', () => {
  const app = readFileSync('src/main.ts', 'utf8');
  const readme = readFileSync('README.md', 'utf8');

  it('uses the approved first-screen and section wording', () => {
    for (const wording of [
      'The demo opens a filled service history. Starting for real opens your passbook.',
      'Sample service schedule',
      'Record service history in three steps',
      'What this passbook does not do',
      '<p class="eyebrow">Price</p>'
    ]) expect(app).toContain(wording);
    for (const removed of ['filled service log', 'empty passbook', 'The product itself', 'service trail', 'Clear boundaries']) expect(app).not.toContain(removed);
  });

  it('removes the reviewed README jargon and unsupported statements', () => {
    for (const removed of [
      'durable maintenance record', 'offline-first PWA', 'completion-relative recurrence',
      'clean service history', 'No product ID or payment-provider credential is stored here.'
    ]) expect(readme).not.toContain(removed);
    expect(readme).toContain('Schedules jobs on fixed dates or from the last completion date.');
    expect(readme).toContain('Exports every current job and due date to a calendar file.');
  });

  it('keeps the catalog line verb-first and within 120 characters', () => {
    const catalog = readFileSync('.factory/catalog-description.txt', 'utf8').trim();
    expect(catalog.length).toBeLessThanOrEqual(120);
    expect(catalog).toMatch(/^Track\b/);
  });
});
