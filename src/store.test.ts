import { describe, expect, it } from 'vitest';
import { sampleData } from './sample';
import { exportPayload, validateImport, validateState } from './store';

describe('passbook validation', () => {
  it('accepts a complete exported passbook', () => {
    expect(validateImport(exportPayload(sampleData))).toEqual(sampleData);
  });

  it('rejects malformed nested records before they reach storage', () => {
    expect(() => validateImport({ version: 1, areas: [{}], assets: [{}], tasks: [], completions: [] }))
      .toThrow('invalid area id');
  });

  it('rejects broken references and attachments', () => {
    const missingArea = structuredClone(sampleData);
    missingArea.assets[0].areaId = 'missing';
    expect(() => validateState(missingArea)).toThrow('refers to a missing area');

    const invalidAttachment = structuredClone(sampleData);
    invalidAttachment.completions[0].attachment = { name: 'proof.png', type: 'image/png', dataUrl: 'javascript:alert(1)' };
    expect(() => validateState(invalidAttachment)).toThrow('invalid attachment');
  });

  it('rejects impossible and future completion dates', () => {
    const impossible = structuredClone(sampleData);
    impossible.completions[0].completedOn = '2026-02-31';
    expect(() => validateState(impossible)).toThrow('invalid completed date');

    const future = structuredClone(sampleData);
    future.completions[0].completedOn = '2099-12-31';
    expect(() => validateState(future)).toThrow('future completion date');
  });
});
