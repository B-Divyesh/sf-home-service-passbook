export type ScheduleMode = 'calendar' | 'completion';

export interface Area {
  id: string;
  name: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  areaId: string;
  name: string;
  makeModel: string;
  installedOn: string;
  createdAt: string;
}

export interface Task {
  id: string;
  assetId: string;
  name: string;
  mode: ScheduleMode;
  intervalMonths: number;
  startDate: string;
  lastCompletedOn?: string;
  createdAt: string;
}

export interface Attachment {
  name: string;
  type: string;
  dataUrl: string;
}

export interface Completion {
  id: string;
  taskId: string;
  completedOn: string;
  note: string;
  receiptRef: string;
  attachment?: Attachment;
  createdAt: string;
}

export interface PassbookData {
  version: 1;
  exportedAt: string;
  areas: Area[];
  assets: Asset[];
  tasks: Task[];
  completions: Completion[];
}

export type AppState = Omit<PassbookData, 'version' | 'exportedAt'>;
