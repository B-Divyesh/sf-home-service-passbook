import { nextDue, scheduleLabel } from './date';
import type { AppState } from './types';

function escapeCalendarText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function calendarDate(value: string): string {
  return value.replaceAll('-', '');
}

export function calendarPayload(state: AppState): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Param Factory//Home Service Passbook//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Home service jobs'
  ];

  for (const task of state.tasks) {
    const asset = state.assets.find((item) => item.id === task.assetId);
    const area = state.areas.find((item) => item.id === asset?.areaId);
    const due = nextDue(task, state.completions);
    const details = [
      asset?.name ?? 'Unknown asset',
      area?.name ?? 'No area',
      `${scheduleLabel(task.mode)} ${task.intervalMonths} ${task.intervalMonths === 1 ? 'month' : 'months'}`
    ].join(' · ');
    lines.push(
      'BEGIN:VEVENT',
      `UID:${escapeCalendarText(task.id)}@home-service-passbook.sociobot.in`,
      `DTSTART;VALUE=DATE:${calendarDate(due)}`,
      `SUMMARY:${escapeCalendarText(task.name)}`,
      `DESCRIPTION:${escapeCalendarText(details)}`,
      'TRANSP:TRANSPARENT',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
}
