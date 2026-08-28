import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('claim manifest', () => {
  it('maps every claim to exactly one tagged browser test', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ id: string; test: string }>;
    const browserTests = readFileSync('tests/claims.spec.ts', 'utf8');
    expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      const tag = `@claim:${claim.id}`;
      expect(claim.test).toBe(`npm test -- --grep ${tag}`);
      expect(browserTests.split(tag)).toHaveLength(2);
    }
  });
});
