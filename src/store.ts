import { sampleData } from './sample';
import type { AppState, PassbookData } from './types';

const DB_VERSION = 1;
const STORE = 'passbook';
let demoMode = false;

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
    const request = tx.objectStore(STORE).get('state');
    request.onsuccess = () => resolve((request.result as AppState | undefined) ?? emptyState());
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function save(state: AppState): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(structuredClone(state), 'state');
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
}

export async function clear(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete('state');
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
  return { areas: data.areas, assets: data.assets, tasks: data.tasks, completions: data.completions };
}
