import type { AppState } from './types';

export const sampleData: AppState = {
  areas: [
    { id: 'area-utility', name: 'Utility room', createdAt: '2026-01-02T09:00:00.000Z' },
    { id: 'area-kitchen', name: 'Kitchen', createdAt: '2026-01-02T09:02:00.000Z' },
    { id: 'area-exterior', name: 'Outside', createdAt: '2026-01-02T09:03:00.000Z' }
  ],
  assets: [
    { id: 'asset-furnace', areaId: 'area-utility', name: 'Furnace', makeModel: 'Goodman GM9C96', installedOn: '2021-10-08', createdAt: '2026-01-02T09:05:00.000Z' },
    { id: 'asset-fridge', areaId: 'area-kitchen', name: 'Refrigerator', makeModel: 'GE GNE27', installedOn: '2022-05-14', createdAt: '2026-01-02T09:06:00.000Z' },
    { id: 'asset-gutters', areaId: 'area-exterior', name: 'Rain gutters', makeModel: 'Aluminum, north and south runs', installedOn: '2019-04-20', createdAt: '2026-01-02T09:07:00.000Z' }
  ],
  tasks: [
    { id: 'task-filter', assetId: 'asset-furnace', name: 'Replace air filter', mode: 'completion', intervalMonths: 3, startDate: '2026-02-14', lastCompletedOn: '2026-05-14', createdAt: '2026-01-02T09:10:00.000Z' },
    { id: 'task-coils', assetId: 'asset-fridge', name: 'Vacuum condenser coils', mode: 'calendar', intervalMonths: 6, startDate: '2026-03-15', lastCompletedOn: '2026-03-16', createdAt: '2026-01-02T09:11:00.000Z' },
    { id: 'task-gutters', assetId: 'asset-gutters', name: 'Clear leaves from gutters', mode: 'calendar', intervalMonths: 6, startDate: '2026-04-01', lastCompletedOn: '2026-04-06', createdAt: '2026-01-02T09:12:00.000Z' }
  ],
  completions: [
    { id: 'done-filter-1', taskId: 'task-filter', completedOn: '2026-02-14', note: 'Used MERV 8 filter. Airflow looks normal.', receiptRef: 'Hardware receipt #1842', createdAt: '2026-02-14T18:40:00.000Z' },
    { id: 'done-filter-2', taskId: 'task-filter', completedOn: '2026-05-14', note: 'Replaced after renovation dust settled.', receiptRef: 'Pack 2 of 4', createdAt: '2026-05-14T17:20:00.000Z' },
    { id: 'done-coils', taskId: 'task-coils', completedOn: '2026-03-16', note: 'Removed lower grille and vacuumed accessible dust.', receiptRef: '', createdAt: '2026-03-16T16:10:00.000Z' },
    { id: 'done-gutters', taskId: 'task-gutters', completedOn: '2026-04-06', note: 'North run cleared. Downspouts flow.', receiptRef: 'Green Ladder Co. invoice GL-440', createdAt: '2026-04-06T15:45:00.000Z' }
  ]
};
