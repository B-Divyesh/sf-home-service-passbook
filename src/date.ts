import type { Completion, ScheduleMode, Task } from './types';

export function todayISO(now = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function addMonths(date: string, months: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const target = new Date(Date.UTC(year, month - 1 + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target.toISOString().slice(0, 10);
}

export function nextDue(task: Task, completions: Completion[]): string {
  if (task.mode === 'calendar') {
    // Fixed schedules do not become complete merely because their date passed.
    // A recorded completion clears the most recent scheduled occurrence on or
    // before that completion, then the next date stays anchored to the series.
    const latestCompletion = completions
      .filter((item) => item.taskId === task.id)
      .sort((a, b) => b.completedOn.localeCompare(a.completedOn))[0];
    if (!latestCompletion || latestCompletion.completedOn < task.startDate) return task.startDate;

    let completedOccurrence = task.startDate;
    while (true) {
      const next = addMonths(completedOccurrence, task.intervalMonths);
      if (next === completedOccurrence || next > latestCompletion.completedOn) break;
      completedOccurrence = next;
    }
    return addMonths(completedOccurrence, task.intervalMonths);
  }

  const latest = completions
    .filter((item) => item.taskId === task.id)
    .sort((a, b) => b.completedOn.localeCompare(a.completedOn))[0];
  return addMonths(latest?.completedOn ?? task.startDate, latest ? task.intervalMonths : 0);
}

export function scheduleLabel(mode: ScheduleMode): string {
  return mode === 'calendar' ? 'Repeat every' : 'Repeat after completion';
}

export function dueState(date: string): 'overdue' | 'soon' | 'later' {
  const now = new Date(`${todayISO()}T00:00:00Z`).getTime();
  const due = new Date(`${date}T00:00:00Z`).getTime();
  const days = Math.round((due - now) / 86400000);
  if (days < 0) return 'overdue';
  if (days <= 30) return 'soon';
  return 'later';
}

export function formatDate(date?: string): string {
  if (!date) return 'Not yet';
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${date}T00:00:00Z`));
}
