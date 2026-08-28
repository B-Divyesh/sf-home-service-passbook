import { describe, expect, it, vi } from 'vitest';
import { addMonths, nextDue } from './date';
import type { Completion, Task } from './types';

const base: Task = { id: 'task', assetId: 'asset', name: 'Filter', mode: 'calendar', intervalMonths: 3, startDate: '2026-02-28', createdAt: '2026-01-01' };

describe('recurrence rules', () => {
  it('keeps calendar recurrence anchored when completion was late', () => {
    vi.setSystemTime(new Date('2026-08-01T00:00:00Z'));
    const completions: Completion[] = [{ id: 'done', taskId: 'task', completedOn: '2026-06-12', note: '', receiptRef: '', createdAt: '2026-06-12' }];
    expect(nextDue(base, completions)).toBe('2026-08-28');
    vi.useRealTimers();
  });

  it('starts completion-relative recurrence on the completion date', () => {
    vi.setSystemTime(new Date('2026-08-01T00:00:00Z'));
    const task = { ...base, mode: 'completion' as const };
    const completions: Completion[] = [{ id: 'done', taskId: 'task', completedOn: '2026-06-12', note: '', receiptRef: '', createdAt: '2026-06-12' }];
    expect(nextDue(task, completions)).toBe('2026-09-12');
    vi.useRealTimers();
  });

  it('clamps dates at the end of shorter months', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
  });
});
