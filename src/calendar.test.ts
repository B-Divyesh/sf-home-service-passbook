import { describe, expect, it } from 'vitest';
import { calendarPayload } from './calendar';
import { nextDue } from './date';
import { sampleData } from './sample';

describe('calendar export', () => {
  it('writes one dated event for every current job', () => {
    const calendar = calendarPayload(sampleData);
    expect(calendar.match(/BEGIN:VEVENT/g)).toHaveLength(sampleData.tasks.length);
    for (const task of sampleData.tasks) {
      expect(calendar).toContain(`UID:${task.id}@home-service-passbook.sociobot.in`);
      expect(calendar).toContain(`DTSTART;VALUE=DATE:${nextDue(task, sampleData.completions).replaceAll('-', '')}`);
      expect(calendar).toContain(`SUMMARY:${task.name}`);
    }
  });

  it('escapes calendar punctuation in household labels', () => {
    const data = structuredClone(sampleData);
    data.tasks[0].name = 'Replace filter, inspect; frame';
    expect(calendarPayload(data)).toContain('SUMMARY:Replace filter\\, inspect\\; frame');
  });
});
