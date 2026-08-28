import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('reviewed product copy', () => {
  const app = readFileSync('src/main.ts', 'utf8');
  const readme = readFileSync('README.md', 'utf8');

  it('uses the approved first-screen and section wording', () => {
    for (const wording of [
      'The demo opens a filled service history. Starting for real opens your passbook.',
      'Private home maintenance passbook.',
      '<span><b>04</b> service entries</span>',
      'Sample service schedule',
      'Record service history in three steps',
      'What this passbook does not do',
      '<p class="eyebrow">Price</p>'
    ]) expect(app).toContain(wording);
    for (const removed of ['filled service log', 'empty passbook', 'The product itself', 'service trail', 'Clear boundaries']) expect(app).not.toContain(removed);
    expect(app).not.toMatch(/\blog\b/i);
  });

  it('keeps reviewed labels literal and uses passbook as the only document name', () => {
    const static404 = readFileSync('public/404.html', 'utf8');
    expect(app).toContain('<p class="eyebrow">Passbook</p>');
    expect(app).toContain('<span>Service record</span>');
    expect(app).toContain('<p class="eyebrow">Page not found</p>');
    for (const removed of ['Household ledger', 'Wrong panel', 'HOME / 01', 'Original generated artwork.']) {
      expect(app).not.toContain(removed);
      expect(static404).not.toContain(removed);
    }
  });

  it('removes the reviewed README jargon and unsupported statements', () => {
    for (const removed of [
      'durable maintenance record', 'offline-first PWA', 'completion-relative recurrence',
      'clean service history', 'No product ID or payment-provider credential is stored here.',
      'licensed photo attachments', 'nested record', 'rollback', 'startup validation'
    ]) expect(readme).not.toContain(removed);
    expect(readme).toContain('Schedules jobs on fixed dates or from the last completion date.');
    expect(readme).toContain('Exports every current job and due date to a calendar file.');
    expect(readme).toContain('Records service dates, notes, and receipt references.');
    expect(readme).toContain('House Key also stores photo attachments.');
    expect(readme).toContain('Before replacing your passbook, import checks every area, asset, job, service entry, and attachment.');
    expect(readme).toContain('If imported data cannot open later, the app restores the passbook you had before importing.');
  });

  it('keeps the catalog line verb-first and within 120 characters', () => {
    const catalog = readFileSync('.factory/catalog-description.txt', 'utf8').trim();
    expect(catalog.length).toBeLessThanOrEqual(120);
    expect(catalog).toMatch(/^(Keep|Record|Track)\b/);
  });
});
