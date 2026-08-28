import { sampleData } from './sample';
import type { AppState, PassbookData } from './types';

const DB_VERSION = 1;
const STORE = 'passbook';
const STATE_KEY = 'state';
const PREVIOUS_STATE_KEY = 'previous-state';
const DAMAGED_STATE_KEY = 'damaged-state';
let demoMode = false;
let recoveryNotice = '';

function dbName(): string {
  return demoMode ? 'demo:home-service-passbook' : 'home-service-passbook';
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName(), DB_VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const emptyState = (): AppState => ({ areas: [], assets: [], tasks: [], completions: [] });

export function isDemo(): boolean { return demoMode; }

export async function enterDemo(reset = false): Promise<AppState> {
  demoMode = true;
  if (reset) await clear();
  const saved = await load();
  if (!saved.areas.length && !saved.assets.length) {
    await save(structuredClone(sampleData));
    return structuredClone(sampleData);
  }
  return saved;
}

export function leaveDemo(): void { demoMode = false; }

export async function load(): Promise<AppState> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const currentRequest = store.get(STATE_KEY);
    const previousRequest = store.get(PREVIOUS_STATE_KEY);
    previousRequest.onsuccess = () => {
      if (currentRequest.result === undefined) return resolve(emptyState());
      try {
        resolve(validateState(currentRequest.result));
      } catch {
        try {
          const previous = validateState(previousRequest.result);
          recoveryNotice = 'A damaged import was removed. Your earlier passbook has been restored.';
          void replaceInvalidState(currentRequest.result, previous);
          resolve(previous);
        } catch {
          recoveryNotice = 'Damaged saved data was set aside. The passbook opened with empty records.';
          void replaceInvalidState(currentRequest.result, emptyState());
          resolve(emptyState());
        }
      }
    };
    currentRequest.onerror = () => reject(currentRequest.error);
    previousRequest.onerror = () => reject(previousRequest.error);
    tx.oncomplete = () => db.close();
  });
}

async function replaceInvalidState(damaged: unknown, replacement: AppState): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    store.put(structuredClone(damaged), DAMAGED_STATE_KEY);
    store.put(structuredClone(replacement), STATE_KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export function takeRecoveryNotice(): string {
  const notice = recoveryNotice;
  recoveryNotice = '';
  return notice;
}

export async function save(state: AppState): Promise<void> {
  const validState = validateState(state);
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    try {
      tx.objectStore(STORE).put(structuredClone(validState), STATE_KEY);
    } catch (error) {
      db.close();
      reject(error);
      return;
    }
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error ?? new Error('The storage write was aborted.')); };
  });
}

export async function replaceWithImport(state: AppState): Promise<void> {
  const validState = validateState(state);
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const current = store.get(STATE_KEY);
    current.onsuccess = () => {
      if (current.result !== undefined) store.put(current.result, PREVIOUS_STATE_KEY);
      store.put(structuredClone(validState), STATE_KEY);
    };
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function clear(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(STATE_KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
}

export function exportPayload(state: AppState): PassbookData {
  return { version: 1, exportedAt: new Date().toISOString(), ...structuredClone(state) };
}

export function validateImport(value: unknown): AppState {
  if (!value || typeof value !== 'object') throw new Error('The file is not a passbook backup. Choose an exported JSON file.');
  const data = value as Partial<PassbookData>;
  if (data.version !== 1 || !Array.isArray(data.areas) || !Array.isArray(data.assets) || !Array.isArray(data.tasks) || !Array.isArray(data.completions)) {
    throw new Error('This backup version cannot be read. Choose a version 1 passbook file.');
  }
  return validateState({ areas: data.areas, assets: data.assets, tasks: data.tasks, completions: data.completions });
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`The backup has an invalid ${label}. Export a new backup and try again.`);
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string, max: number, allowEmpty = false): string {
  if (typeof value !== 'string' || (!allowEmpty && !value.trim()) || value.length > max) throw new Error(`The backup has an invalid ${label}. Export a new backup and try again.`);
  return value;
}

function isoDate(value: unknown, label: string, allowEmpty = false): string {
  const date = text(value, label, 10, allowEmpty);
  if (!date && allowEmpty) return date;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) throw new Error(`The backup has an invalid ${label}. Export a new backup and try again.`);
  return date;
}

function timestamp(value: unknown, label: string): string {
  const date = text(value, label, 40);
  if (Number.isNaN(Date.parse(date))) throw new Error(`The backup has an invalid ${label}. Export a new backup and try again.`);
  return date;
}

export function validateState(value: unknown): AppState {
  const source = record(value, 'record set');
  if (!Array.isArray(source.areas) || !Array.isArray(source.assets) || !Array.isArray(source.tasks) || !Array.isArray(source.completions)) {
    throw new Error('The backup is missing required record lists. Export a new backup and try again.');
  }
  const ids = new Set<string>();
  const uniqueId = (value: unknown, label: string): string => {
    const id = text(value, label, 160);
    if (ids.has(id)) throw new Error(`The backup repeats the ${label} “${id}”. Export a new backup and try again.`);
    ids.add(id);
    return id;
  };
  const areas = source.areas.map((item, index) => {
    const row = record(item, `area ${index + 1}`);
    return { id: uniqueId(row.id, 'area id'), name: text(row.name, 'area name', 60), createdAt: timestamp(row.createdAt, 'area creation date') };
  });
  const areaIds = new Set(areas.map((item) => item.id));
  const assets = source.assets.map((item, index) => {
    const row = record(item, `asset ${index + 1}`);
    const areaId = text(row.areaId, 'asset area', 160);
    if (!areaIds.has(areaId)) throw new Error(`The backup asset ${index + 1} refers to a missing area. Export a new backup and try again.`);
    return { id: uniqueId(row.id, 'asset id'), areaId, name: text(row.name, 'asset name', 80), makeModel: text(row.makeModel, 'make or model', 100, true), installedOn: isoDate(row.installedOn, 'installed date', true), createdAt: timestamp(row.createdAt, 'asset creation date') };
  });
  const assetIds = new Set(assets.map((item) => item.id));
  const tasks = source.tasks.map((item, index) => {
    const row = record(item, `job ${index + 1}`);
    const assetId = text(row.assetId, 'job asset', 160);
    if (!assetIds.has(assetId)) throw new Error(`The backup job ${index + 1} refers to a missing asset. Export a new backup and try again.`);
    if (row.mode !== 'calendar' && row.mode !== 'completion') throw new Error(`The backup has an invalid repeat rule for job ${index + 1}. Export a new backup and try again.`);
    if (!Number.isInteger(row.intervalMonths) || Number(row.intervalMonths) < 1 || Number(row.intervalMonths) > 120) throw new Error(`The backup has an invalid interval for job ${index + 1}. Export a new backup and try again.`);
    const task = { id: uniqueId(row.id, 'job id'), assetId, name: text(row.name, 'job name', 90), mode: row.mode, intervalMonths: Number(row.intervalMonths), startDate: isoDate(row.startDate, 'first due date'), createdAt: timestamp(row.createdAt, 'job creation date') } as AppState['tasks'][number];
    if (row.lastCompletedOn !== undefined) task.lastCompletedOn = isoDate(row.lastCompletedOn, 'last completed date');
    return task;
  });
  const taskIds = new Set(tasks.map((item) => item.id));
  const completions = source.completions.map((item, index) => {
    const row = record(item, `service entry ${index + 1}`);
    const taskId = text(row.taskId, 'service entry job', 160);
    if (!taskIds.has(taskId)) throw new Error(`The backup service entry ${index + 1} refers to a missing job. Export a new backup and try again.`);
    const completedOn = isoDate(row.completedOn, 'completed date');
    const localToday = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    if (completedOn > localToday) throw new Error(`The backup service entry ${index + 1} has a future completion date. Correct the source backup and try again.`);
    const completion = { id: uniqueId(row.id, 'service entry id'), taskId, completedOn, note: text(row.note, 'service note', 500, true), receiptRef: text(row.receiptRef, 'receipt reference', 120, true), createdAt: timestamp(row.createdAt, 'service entry creation date') } as AppState['completions'][number];
    if (row.attachment !== undefined) {
      const attachment = record(row.attachment, 'attachment');
      const type = text(attachment.type, 'attachment type', 100);
      const dataUrl = text(attachment.dataUrl, 'attachment data', 4_100_000);
      if (!/^(image\/[a-z0-9.+-]+|application\/pdf)$/i.test(type) || !dataUrl.startsWith(`data:${type};base64,`)) throw new Error('The backup has an invalid attachment. Export a new backup and try again.');
      completion.attachment = { name: text(attachment.name, 'attachment name', 180), type, dataUrl };
    }
    return completion;
  });
  return { areas, assets, tasks, completions };
}
