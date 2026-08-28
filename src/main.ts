import './style.css';
import { dueState, formatDate, nextDue, scheduleLabel, todayISO } from './date';
import { clear, enterDemo, exportPayload, isDemo, leaveDemo, load, replaceWithImport, save, takeRecoveryNotice, validateImport } from './store';
import type { AppState, Asset, Completion, Task } from './types';

const root = document.querySelector<HTMLDivElement>('#app')!;
let state: AppState = { areas: [], assets: [], tasks: [], completions: [] };
let activePanel: 'due' | 'assets' | 'history' | 'backup' | 'license' = 'due';
let toastTimer = 0;
let installPrompt: Event | null = null;

const PRODUCT_SLUG = 'home-service-passbook';
const LICENSE_KEY = `sb_license:${PRODUCT_SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${PRODUCT_SLUG}`;
const CHECKOUT_URL = `https://api.sociobot.in/api/v1/products/${PRODUCT_SLUG}/checkout`;
const VERIFY_URL = `https://api.sociobot.in/api/v1/products/${PRODUCT_SLUG}/verify`;

interface CachedVerdict { valid: boolean; checkedAt: number; token: string }

const titles: Record<string, string> = {
  '/': 'Home Service Passbook — Track home maintenance',
  '/app': 'Your passbook — Home Service Passbook',
  '/demo': 'Demo — Home Service Passbook',
  '/history': 'Service history — Home Service Passbook',
  '/backup': 'Backup — Home Service Passbook',
  '/privacy': 'Privacy — Home Service Passbook',
  '/terms': 'Terms — Home Service Passbook',
  '/404': 'Page not found — Home Service Passbook'
};

const uid = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);

function shell(content: string): string {
  return `
    <div class="site-frame">
      <header class="site-header">
        <a class="wordmark" href="/" data-link aria-label="Home Service Passbook home">
          <span class="wordmark-mark" aria-hidden="true"><i></i></span>
          <span>HOME SERVICE<br><strong>PASSBOOK</strong></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="/demo" data-link>Demo</a>
          <a href="/app" data-link>Passbook</a>
          <a href="/privacy" data-link>Privacy</a>
        </nav>
      </header>
      ${isDemo() ? demoBanner() : ''}
      ${navigator.onLine ? '' : '<div class="offline-banner" role="status">Offline — saved records remain available.</div>'}
      <main id="main" tabindex="-1">${content}</main>
      <footer class="site-footer">
        <p><strong>Home Service Passbook</strong><br>Household-owned maintenance records.</p>
        <div><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a></div>
        <p>Built by Param Factory · v1.0.1<br>Original generated artwork.</p>
      </footer>
      <div class="route-status sr-only" aria-live="polite"></div>
      <div class="toast" role="status" aria-live="polite" hidden></div>
    </div>`;
}

function demoBanner(): string {
  return `<aside class="demo-banner" aria-label="Demo mode">
    <span><strong>Demo</strong> — sample data, nothing is saved to your passbook.</span>
    <span class="demo-actions"><button class="text-button" data-action="reset-demo">Reset demo</button><button class="text-button" data-action="leave-demo">Start for real</button></span>
  </aside>`;
}

function landing(): string {
  return shell(`
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">A private log for the work at home</p>
        <h1 tabindex="-1">Remember every home service job</h1>
        <p class="lede">For households tracking recurring care, service dates, notes, and receipts without another appliance account.</p>
        <div class="hero-actions">
          <a class="button primary" href="/demo" data-link>Try it with sample data</a>
          <a class="button secondary" href="/app" data-link>Start my passbook</a>
        </div>
        <p class="action-note">The demo opens a filled service log. Starting for real opens an empty passbook.</p>
        <ul class="plain-facts" aria-label="Product facts">
          <li><span aria-hidden="true">●</span> Works offline after the first visit</li>
          <li><span aria-hidden="true">●</span> Records stay in this browser</li>
          <li><span aria-hidden="true">●</span> Free for five home assets</li>
        </ul>
      </div>
      <div class="hero-instrument">
        <div class="instrument-label"><span>SERVICE RECORD</span><strong>HOME / 01</strong></div>
        <picture>
          <source type="image/webp" srcset="/assets/hero-640.webp 640w, /assets/hero-1200.webp 1200w" sizes="(max-width: 760px) 100vw, 50vw">
          <img src="/assets/hero-1200.webp" width="1200" height="800" fetchpriority="high" decoding="async" alt="A furnace filter, service tag, receipt, screwdriver, and maintenance dial arranged on a workbench.">
        </picture>
        <div class="dial-strip" aria-label="Example maintenance status">
          <span><b>03</b> assets</span><span><b>01</b> due now</span><span class="lamp"><i></i> log ready</span>
        </div>
      </div>
    </section>
    <section class="preview-section" aria-labelledby="preview-title">
      <div class="section-heading"><p class="eyebrow">The product itself</p><h2 id="preview-title">See what is due and why</h2><p>Each job keeps its own schedule rule and proof.</p></div>
      <div class="ledger-preview">
        <div class="preview-header"><span>UP NEXT</span><span>28 AUG 2026</span></div>
        <article><div><span class="status overdue">Overdue</span><h3>Replace air filter</h3><p>Furnace · Utility room</p></div><div class="readout"><small>DUE</small><b>14 AUG</b><small>3 months after completion</small></div></article>
        <article><div><span class="status soon">Next</span><h3>Vacuum condenser coils</h3><p>Refrigerator · Kitchen</p></div><div class="readout"><small>DUE</small><b>15 SEP</b><small>Every 6 months</small></div></article>
      </div>
    </section>
    <section class="how" aria-labelledby="how-title">
      <div class="section-heading"><p class="eyebrow">How it works</p><h2 id="how-title">Keep a service trail in three steps</h2></div>
      <ol>
        <li><span>01</span><div><h3>Add the thing you maintain</h3><p>Name its room, appliance, or outside area.</p></div></li>
        <li><span>02</span><div><h3>Choose the repeat rule</h3><p>Use fixed calendar dates or count from completion.</p></div></li>
        <li><span>03</span><div><h3>Record the work</h3><p>Keep the date, note, receipt reference, and optional photo.</p></div></li>
      </ol>
    </section>
    <section class="limits" aria-labelledby="limits-title">
      <div><p class="eyebrow">Clear boundaries</p><h2 id="limits-title">A record, not a repair guide</h2></div>
      <p>This passbook does not control appliances. It does not diagnose faults, certify safety, or file warranty claims. Follow manufacturer guidance and use a qualified professional where needed.</p>
    </section>
    <section class="paid" aria-labelledby="paid-title">
      <div><p class="eyebrow">House Key</p><h2 id="paid-title">Keep more than five assets</h2><p>One $19 purchase adds unlimited assets and local photo attachments. Backup, print, and accessibility stay free.</p></div>
      <div><a class="button primary" href="${CHECKOUT_URL}">Buy House Key — $19</a><a class="touch-link" href="/app?panel=license" data-link>Restore a license</a></div>
    </section>`);
}

function appPage(): string {
  const dueTasks = [...state.tasks].sort((a, b) => nextDue(a, state.completions).localeCompare(nextDue(b, state.completions)));
  const overdueCount = dueTasks.filter((task) => dueState(nextDue(task, state.completions)) === 'overdue').length;
  return shell(`
    <section class="app-head">
      <div><p class="eyebrow">Household ledger</p><h1 tabindex="-1">${activePanel === 'due' ? 'What needs care next' : panelTitle()}</h1></div>
      <div class="counter-panel" aria-label="Passbook summary"><span><b>${String(state.assets.length).padStart(2, '0')}</b> assets</span><span><b>${String(overdueCount).padStart(2, '0')}</b> overdue</span><i aria-hidden="true" class="gauge ${overdueCount ? 'gauge-alert' : ''}"></i></div>
    </section>
    <nav class="app-tabs" aria-label="Passbook sections">
      ${tabButton('due', 'Due next')}${tabButton('assets', 'Assets')}${tabButton('history', 'History')}${tabButton('backup', 'Backup')}${tabButton('license', 'House Key')}
    </nav>
    <section class="app-panel">${panelContent(dueTasks)}</section>
    ${dialogs()}`);
}

function panelTitle(): string {
  return ({ assets: 'Home assets and jobs', history: 'Service history', backup: 'Backup and move records', license: 'House Key license', due: 'What needs care next' })[activePanel];
}

function tabButton(id: typeof activePanel, label: string): string {
  return `<button data-panel="${id}" ${activePanel === id ? 'aria-current="page"' : ''}>${label}</button>`;
}

function panelContent(dueTasks: Task[]): string {
  if (activePanel === 'assets') return assetsPanel();
  if (activePanel === 'history') return historyPanel();
  if (activePanel === 'backup') return backupPanel();
  if (activePanel === 'license') return licensePanel();
  if (!dueTasks.length) return emptyBlock('No scheduled jobs yet', 'Add an asset, then add its first recurring job.', '<button class="button primary" data-open="asset-dialog">Add an asset</button>');
  return `<div class="panel-toolbar"><div><p class="panel-kicker">Ordered by due date</p><p>${dueTasks.length} recurring ${dueTasks.length === 1 ? 'job' : 'jobs'}</p></div><button class="button primary" data-open="completion-dialog" ${dueTasks.length ? '' : 'disabled'}>Record completed work</button></div>
    <div class="task-list">${dueTasks.map(taskRow).join('')}</div>`;
}

function taskRow(task: Task): string {
  const asset = state.assets.find((item) => item.id === task.assetId);
  const area = state.areas.find((item) => item.id === asset?.areaId);
  const due = nextDue(task, state.completions);
  const status = dueState(due);
  const last = state.completions.filter((item) => item.taskId === task.id).sort((a, b) => b.completedOn.localeCompare(a.completedOn))[0];
  return `<article class="task-row" data-task-row="${task.id}">
    <div class="task-status"><span class="status ${status}">${status === 'later' ? 'Scheduled' : status === 'soon' ? 'Due soon' : 'Overdue'}</span></div>
    <div><h2>${escapeHtml(task.name)}</h2><p>${escapeHtml(asset?.name ?? 'Unknown asset')} · ${escapeHtml(area?.name ?? 'No area')}</p><small>${scheduleLabel(task.mode)} ${task.intervalMonths} ${task.intervalMonths === 1 ? 'month' : 'months'} · Last done ${formatDate(last?.completedOn)}</small><div class="record-actions"><button class="text-button" data-edit-task="${task.id}">Edit job</button><button class="text-button danger-link" data-delete-task="${task.id}">Delete job</button></div></div>
    <div class="due-readout"><small>Due</small><strong>${formatDate(due)}</strong><button class="button compact" data-complete="${task.id}">Record work</button></div>
  </article>`;
}

function assetsPanel(): string {
  if (!state.assets.length) return emptyBlock('No assets in this passbook', 'Add a room, appliance, or outside feature to begin.', '<button class="button primary" data-open="asset-dialog">Add an asset</button>');
  return `<div class="panel-toolbar"><div><p class="panel-kicker">What you maintain</p><p>${state.areas.length} ${state.areas.length === 1 ? 'area' : 'areas'}</p></div><button class="button primary" data-open="asset-dialog">Add an asset</button></div>
    <div class="asset-list">${state.assets.map((asset) => {
      const area = state.areas.find((item) => item.id === asset.areaId);
      const tasks = state.tasks.filter((item) => item.assetId === asset.id);
      return `<article data-asset-row="${asset.id}"><div><p class="asset-area">${escapeHtml(area?.name ?? 'No area')}</p><h2>${escapeHtml(asset.name)}</h2><p>${escapeHtml(asset.makeModel || 'No make or model recorded')}</p><small>Installed ${formatDate(asset.installedOn)}</small><div class="record-actions"><button class="text-button" data-edit-asset="${asset.id}">Edit asset</button><button class="text-button danger-link" data-delete-asset="${asset.id}">Delete asset</button></div></div><div class="asset-jobs"><strong>${tasks.length} ${tasks.length === 1 ? 'job' : 'jobs'}</strong>${tasks.map((task) => `<span>${escapeHtml(task.name)}</span>`).join('')}<button class="text-button" data-task-asset="${asset.id}">Add recurring job</button></div></article>`;
    }).join('')}</div>`;
}

function historyPanel(): string {
  const records = [...state.completions].sort((a, b) => b.completedOn.localeCompare(a.completedOn));
  if (!records.length) return emptyBlock('No completed work yet', 'Completed jobs will appear here with their notes and receipt references.', '<button class="button primary" data-panel="due">View scheduled jobs</button>');
  return `<div class="panel-toolbar print-hide"><div><p class="panel-kicker">Proof of work</p><p>${records.length} service ${records.length === 1 ? 'entry' : 'entries'}</p></div><button class="button secondary" data-action="print">Print history</button></div>
    <div class="history-list">${records.map(historyRow).join('')}</div>`;
}

function historyRow(record: Completion): string {
  const task = state.tasks.find((item) => item.id === record.taskId);
  const asset = state.assets.find((item) => item.id === task?.assetId);
  return `<article data-history-row="${record.id}"><time datetime="${record.completedOn}">${formatDate(record.completedOn)}</time><div><h2>${escapeHtml(task?.name ?? 'Removed job')}</h2><p><strong>${escapeHtml(asset?.name ?? 'Removed asset')}</strong>${record.note ? ` · ${escapeHtml(record.note)}` : ''}</p>${record.receiptRef ? `<small>Receipt: ${escapeHtml(record.receiptRef)}</small>` : ''}${record.attachment ? `<a class="attachment" href="${record.attachment.dataUrl}" download="${escapeHtml(record.attachment.name)}">Download ${escapeHtml(record.attachment.name)}</a>` : ''}<div class="record-actions print-hide"><button class="text-button" data-edit-completion="${record.id}">Edit entry</button><button class="text-button danger-link" data-delete-completion="${record.id}">Delete entry</button></div></div></article>`;
}

function backupPanel(): string {
  return `<div class="backup-grid">
    <section><p class="eyebrow">Take a copy</p><h2>Export one complete JSON file</h2><p>The backup includes areas, assets, schedules, history, notes, receipt references, and attached photos.</p><button class="button primary" data-action="export">Export passbook</button></section>
    <section><p class="eyebrow">Bring it back</p><h2>Import a passbook backup</h2><p>Import replaces the open passbook after you confirm. Export the current one first if you need it.</p><label class="file-button">Choose backup file<input id="import-file" type="file" accept="application/json,.json"></label></section>
  </div>`;
}

function licensePanel(): string {
  const licensed = hasValidCachedLicense();
  const inactive = Boolean(localStorage.getItem(LICENSE_KEY)) && !licensed;
  return `<div class="license-panel">
    <div><p class="eyebrow">One-time purchase</p><h2>${licensed ? 'House Key is active' : 'Add unlimited assets and photos'}</h2><p>${licensed ? 'This browser can add unlimited assets and attach photos to service entries.' : 'Free passbooks hold five assets. A $19 House Key removes that limit and adds local photo attachments.'}</p></div>
    ${inactive ? '<p class="locked-note">This license is no longer active. Paste another license or buy a new House Key.</p>' : ''}
    ${licensed ? '<p class="license-active"><span aria-hidden="true">●</span> License active</p>' : `<a class="button primary" href="${CHECKOUT_URL}">Buy House Key — $19</a>
    <form id="license-form"><label for="license-token">Have a license? Paste it here</label><div><input id="license-token" name="license" autocomplete="off" required><button class="button secondary" type="submit">Verify license</button></div><p class="form-message" aria-live="polite"></p></form>`}
    <p class="fine-print">Sociobot/Dodo is the merchant of record. Refunds are handled there. A refund revokes the license.</p>
  </div>`;
}

function emptyBlock(title: string, body: string, action: string): string {
  return `<div class="empty-state"><span class="empty-stamp" aria-hidden="true">0</span><h2>${title}</h2><p>${body}</p>${action}</div>`;
}

function dialogs(): string {
  const options = state.assets.map((asset) => `<option value="${asset.id}">${escapeHtml(asset.name)}</option>`).join('');
  return `<dialog id="asset-dialog"><form method="dialog" id="asset-form"><div class="dialog-head"><h2>Add an asset</h2><button class="icon-button" type="button" data-close aria-label="Close dialog">×</button></div><p>Add the room or area if it is new.</p>
    <label for="area-name">Area</label><input id="area-name" name="area" required maxlength="60" placeholder="Utility room">
    <label for="asset-name">Asset name</label><input id="asset-name" name="asset" required maxlength="80" placeholder="Furnace">
    <label for="model-name">Make or model <span>optional</span></label><input id="model-name" name="model" maxlength="100">
    <label for="installed-on">Installed on <span>optional</span></label><input id="installed-on" name="installed" type="date">
    <p class="form-message" aria-live="polite"></p><div class="dialog-actions"><button class="button secondary" type="button" data-close>Cancel</button><button class="button primary" type="submit">Save asset</button></div></form></dialog>
    <dialog id="task-dialog"><form method="dialog" id="task-form"><div class="dialog-head"><h2>Add a recurring job</h2><button class="icon-button" type="button" data-close aria-label="Close dialog">×</button></div>
      <label for="task-asset">Asset</label><select id="task-asset" name="asset" required>${options}</select>
      <label for="task-name">Job name</label><input id="task-name" name="name" required maxlength="90" placeholder="Replace air filter">
      <fieldset><legend>Repeat rule</legend><label class="radio"><input type="radio" name="mode" value="calendar" checked><span><strong>Repeat every</strong><small>Keep fixed calendar dates, even when work is late.</small></span></label><label class="radio"><input type="radio" name="mode" value="completion"><span><strong>Repeat after completion</strong><small>Start the next interval when work is recorded.</small></span></label></fieldset>
      <div class="field-row"><label for="interval">Months between jobs<input id="interval" name="interval" type="number" min="1" max="120" value="6" required></label><label for="start-date">First due date<input id="start-date" name="start" type="date" value="${todayISO()}" required></label></div>
      <p class="form-message" aria-live="polite"></p><div class="dialog-actions"><button class="button secondary" type="button" data-close>Cancel</button><button class="button primary" type="submit">Save recurring job</button></div></form></dialog>
    <dialog id="completion-dialog"><form method="dialog" id="completion-form"><div class="dialog-head"><h2>Record completed work</h2><button class="icon-button" type="button" data-close aria-label="Close dialog">×</button></div>
      <label for="complete-task">Job</label><select id="complete-task" name="task" required>${state.tasks.map((task) => `<option value="${task.id}">${escapeHtml(task.name)}</option>`).join('')}</select>
      <label for="completed-on">Completed on</label><input id="completed-on" name="date" type="date" value="${todayISO()}" required>
      <label for="work-note">What was done <span>optional</span></label><textarea id="work-note" name="note" rows="3" maxlength="500"></textarea>
      <label for="receipt-ref">Receipt or invoice reference <span>optional</span></label><input id="receipt-ref" name="receipt" maxlength="120">
      ${hasValidCachedLicense() ? '<label for="proof-file">Photo or receipt file <span>optional, 3 MB maximum</span></label><input id="proof-file" name="proof" type="file" accept="image/*,application/pdf"><label class="remove-attachment" hidden><input name="removeProof" type="checkbox"> Remove the saved attachment</label>' : '<p class="locked-note">House Key adds local photo attachments. Notes and receipt references stay free.</p>'}
      <p class="form-message" aria-live="polite"></p><div class="dialog-actions"><button class="button secondary" type="button" data-close>Cancel</button><button class="button primary" type="submit">Save service entry</button></div></form></dialog>`;
}

function legalPage(type: 'privacy' | 'terms'): string {
  const privacy = `<section class="legal"><p class="eyebrow">Plain-language policy</p><h1 tabindex="-1">Your records stay under your control</h1><p class="effective">Effective 28 August 2026</p><h2>What the app stores</h2><p>Home areas, assets, schedules, service notes, receipt references, photos, and license details are stored in your browser.</p><h2>What leaves your device</h2><p>The passbook does not send your maintenance records to us. License verification sends only your license token to Sociobot.</p><h2>Backups and removal</h2><p>You can export a JSON backup at any time. Clear this site’s browser data to remove local records.</p><h2>Payment</h2><p>Sociobot/Dodo handles checkout and refunds. Its policy applies to payment details.</p><h2>Questions</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></section>`;
  const terms = `<section class="legal"><p class="eyebrow">Product terms</p><h1 tabindex="-1">Use this passbook as a record</h1><p class="effective">Effective 28 August 2026</p><h2>No repair or safety advice</h2><p>The app records information you enter. It does not diagnose faults, certify work, or replace manufacturer guidance.</p><h2>Your responsibility</h2><p>You control your records and backups. Keep a current export if the history matters to you.</p><h2>House Key</h2><p>A House Key is a one-time license for the features shown at purchase. Sociobot/Dodo handles payment and refunds.</p><h2>Availability</h2><p>The app is provided as available. Local browser limits and device loss can affect stored data.</p><h2>Questions</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p></section>`;
  return shell(type === 'privacy' ? privacy : terms);
}

function notFound(): string {
  return shell(`<section class="not-found"><div class="error-dial" aria-hidden="true"><span>404</span><i></i></div><p class="eyebrow">Wrong panel</p><h1 tabindex="-1">This page is not in the passbook</h1><p>The address may be old or mistyped.</p><a class="button primary" href="/" data-link>Return home</a></section>`);
}

async function render(focus = false): Promise<void> {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `https://home-service-passbook.sociobot.in${path}`;
  if (path === '/demo') {
    state = await enterDemo();
    activePanel = (new URLSearchParams(location.search).get('panel') as typeof activePanel) || 'due';
  } else if (path === '/app' || path === '/history' || path === '/backup') {
    if (isDemo()) leaveDemo();
    state = await load();
    activePanel = path === '/history' ? 'history' : path === '/backup' ? 'backup' : (new URLSearchParams(location.search).get('panel') as typeof activePanel) || activePanel;
  }
  document.title = titles[path] ?? titles['/404'];
  root.innerHTML = path === '/' ? landing() : path === '/privacy' ? legalPage('privacy') : path === '/terms' ? legalPage('terms') : path === '/demo' || path === '/app' || path === '/history' || path === '/backup' ? appPage() : notFound();
  bindEvents();
  if (focus) {
    const heading = root.querySelector<HTMLElement>('h1');
    heading?.focus();
    const live = root.querySelector<HTMLElement>('.route-status');
    if (live && heading) live.textContent = heading.textContent;
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}

function bindEvents(): void {
  root.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach((link) => link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || link.target) return;
    event.preventDefault();
    history.pushState({}, '', link.href);
    void render(true);
  }));
  document.querySelector<HTMLAnchorElement>('.skip-link')?.addEventListener('click', (event) => {
    event.preventDefault();
    root.querySelector<HTMLElement>('#main')?.focus();
  });
  root.querySelectorAll<HTMLButtonElement>('[data-panel]').forEach((button) => button.addEventListener('click', () => {
    activePanel = button.dataset.panel as typeof activePanel;
    history.pushState({}, '', isDemo() ? `/demo?panel=${activePanel}` : activePanel === 'history' ? '/history' : activePanel === 'backup' ? '/backup' : `/app?panel=${activePanel}`);
    void render(true);
  }));
  root.querySelectorAll<HTMLButtonElement>('[data-open]').forEach((button) => button.addEventListener('click', () => { resetDialog(button.dataset.open!); openDialog(button.dataset.open!); }));
  root.querySelectorAll<HTMLButtonElement>('[data-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog')?.close()));
  root.querySelectorAll<HTMLButtonElement>('[data-complete]').forEach((button) => button.addEventListener('click', () => {
    resetDialog('completion-dialog');
    openDialog('completion-dialog');
    const select = root.querySelector<HTMLSelectElement>('#complete-task');
    if (select) select.value = button.dataset.complete!;
  }));
  root.querySelectorAll<HTMLButtonElement>('[data-task-asset]').forEach((button) => button.addEventListener('click', () => {
    resetDialog('task-dialog');
    openDialog('task-dialog');
    const select = root.querySelector<HTMLSelectElement>('#task-asset');
    if (select) select.value = button.dataset.taskAsset!;
  }));
  root.querySelectorAll<HTMLButtonElement>('[data-edit-asset]').forEach((button) => button.addEventListener('click', () => editAsset(button.dataset.editAsset!)));
  root.querySelectorAll<HTMLButtonElement>('[data-edit-task]').forEach((button) => button.addEventListener('click', () => editTask(button.dataset.editTask!)));
  root.querySelectorAll<HTMLButtonElement>('[data-edit-completion]').forEach((button) => button.addEventListener('click', () => editCompletion(button.dataset.editCompletion!)));
  root.querySelectorAll<HTMLButtonElement>('[data-delete-asset]').forEach((button) => button.addEventListener('click', () => void deleteAsset(button.dataset.deleteAsset!)));
  root.querySelectorAll<HTMLButtonElement>('[data-delete-task]').forEach((button) => button.addEventListener('click', () => void deleteTask(button.dataset.deleteTask!)));
  root.querySelectorAll<HTMLButtonElement>('[data-delete-completion]').forEach((button) => button.addEventListener('click', () => void deleteCompletion(button.dataset.deleteCompletion!)));
  root.querySelector('[data-action="reset-demo"]')?.addEventListener('click', async () => { state = await enterDemo(true); await render(); showToast('Demo reset to its original records.'); });
  root.querySelector('[data-action="leave-demo"]')?.addEventListener('click', async () => { await clear(); leaveDemo(); activePanel = 'due'; history.pushState({}, '', '/app'); await render(true); });
  root.querySelector('[data-action="print"]')?.addEventListener('click', () => window.print());
  root.querySelector('[data-action="export"]')?.addEventListener('click', exportBackup);
  root.querySelector<HTMLInputElement>('#import-file')?.addEventListener('change', importBackup);
  root.querySelector<HTMLFormElement>('#asset-form')?.addEventListener('submit', addAsset);
  root.querySelector<HTMLFormElement>('#task-form')?.addEventListener('submit', addTask);
  root.querySelector<HTMLFormElement>('#completion-form')?.addEventListener('submit', completeTask);
  root.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit', restoreLicense);
  root.querySelectorAll<HTMLDialogElement>('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', (event) => keepFocusInDialog(event, dialog));
  });
}

function keepFocusInDialog(event: KeyboardEvent, dialog: HTMLDialogElement): void {
  if (event.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.hidden && getComputedStyle(element).display !== 'none' && getComputedStyle(element).visibility !== 'hidden');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function resetDialog(id: string): void {
  const form = root.querySelector<HTMLFormElement>(`#${id} form`);
  if (!form) return;
  form.reset();
  delete form.dataset.editId;
  const heading = form.querySelector('h2');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const labels: Record<string, [string, string]> = {
    'asset-dialog': ['Add an asset', 'Save asset'],
    'task-dialog': ['Add a recurring job', 'Save recurring job'],
    'completion-dialog': ['Record completed work', 'Save service entry']
  };
  if (heading && labels[id]) heading.textContent = labels[id][0];
  if (submit && labels[id]) submit.textContent = labels[id][1];
  const remove = form.querySelector<HTMLElement>('.remove-attachment');
  if (remove) remove.hidden = true;
  formError(form, '');
}

function editAsset(id: string): void {
  const asset = state.assets.find((item) => item.id === id);
  if (!asset) return;
  resetDialog('asset-dialog');
  const form = root.querySelector<HTMLFormElement>('#asset-form')!;
  form.dataset.editId = id;
  form.querySelector('h2')!.textContent = 'Edit asset';
  form.querySelector<HTMLButtonElement>('button[type="submit"]')!.textContent = 'Save changes';
  (form.elements.namedItem('area') as HTMLInputElement).value = state.areas.find((item) => item.id === asset.areaId)?.name ?? '';
  (form.elements.namedItem('asset') as HTMLInputElement).value = asset.name;
  (form.elements.namedItem('model') as HTMLInputElement).value = asset.makeModel;
  (form.elements.namedItem('installed') as HTMLInputElement).value = asset.installedOn;
  openDialog('asset-dialog');
}

function editTask(id: string): void {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return;
  resetDialog('task-dialog');
  const form = root.querySelector<HTMLFormElement>('#task-form')!;
  form.dataset.editId = id;
  form.querySelector('h2')!.textContent = 'Edit recurring job';
  form.querySelector<HTMLButtonElement>('button[type="submit"]')!.textContent = 'Save changes';
  (form.elements.namedItem('asset') as HTMLSelectElement).value = task.assetId;
  (form.elements.namedItem('name') as HTMLInputElement).value = task.name;
  (form.elements.namedItem('mode') as RadioNodeList).value = task.mode;
  (form.elements.namedItem('interval') as HTMLInputElement).value = String(task.intervalMonths);
  (form.elements.namedItem('start') as HTMLInputElement).value = task.startDate;
  openDialog('task-dialog');
}

function editCompletion(id: string): void {
  const completion = state.completions.find((item) => item.id === id);
  if (!completion) return;
  resetDialog('completion-dialog');
  const form = root.querySelector<HTMLFormElement>('#completion-form')!;
  form.dataset.editId = id;
  form.querySelector('h2')!.textContent = 'Edit service entry';
  form.querySelector<HTMLButtonElement>('button[type="submit"]')!.textContent = 'Save changes';
  (form.elements.namedItem('task') as HTMLSelectElement).value = completion.taskId;
  (form.elements.namedItem('date') as HTMLInputElement).value = completion.completedOn;
  (form.elements.namedItem('note') as HTMLTextAreaElement).value = completion.note;
  (form.elements.namedItem('receipt') as HTMLInputElement).value = completion.receiptRef;
  const remove = form.querySelector<HTMLElement>('.remove-attachment');
  if (remove) remove.hidden = !completion.attachment;
  openDialog('completion-dialog');
}

async function deleteAsset(id: string): Promise<void> {
  const asset = state.assets.find((item) => item.id === id);
  if (!asset) return;
  const taskIds = new Set(state.tasks.filter((item) => item.assetId === id).map((item) => item.id));
  const entryCount = state.completions.filter((item) => taskIds.has(item.taskId)).length;
  if (!confirm(`Delete ${asset.name}, its ${taskIds.size} jobs, and ${entryCount} service entries?`)) return;
  state.assets = state.assets.filter((item) => item.id !== id);
  state.tasks = state.tasks.filter((item) => !taskIds.has(item.id));
  state.completions = state.completions.filter((item) => !taskIds.has(item.taskId));
  removeUnusedAreas();
  await persist('Asset and its records deleted.');
  await render();
}

async function deleteTask(id: string): Promise<void> {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return;
  const entryCount = state.completions.filter((item) => item.taskId === id).length;
  if (!confirm(`Delete ${task.name} and its ${entryCount} service entries?`)) return;
  state.tasks = state.tasks.filter((item) => item.id !== id);
  state.completions = state.completions.filter((item) => item.taskId !== id);
  await persist('Recurring job and its service entries deleted.');
  await render();
}

async function deleteCompletion(id: string): Promise<void> {
  const completion = state.completions.find((item) => item.id === id);
  if (!completion || !confirm(`Delete the service entry from ${formatDate(completion.completedOn)}?`)) return;
  state.completions = state.completions.filter((item) => item.id !== id);
  refreshLastCompleted(completion.taskId);
  await persist('Service entry deleted.');
  await render();
}

function removeUnusedAreas(): void {
  const used = new Set(state.assets.map((item) => item.areaId));
  state.areas = state.areas.filter((item) => used.has(item.id));
}

function refreshLastCompleted(taskId: string): void {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) return;
  const last = state.completions.filter((item) => item.taskId === taskId).sort((a, b) => b.completedOn.localeCompare(a.completedOn))[0];
  if (last) task.lastCompletedOn = last.completedOn;
  else delete task.lastCompletedOn;
}

function openDialog(id: string): void {
  if (id === 'asset-dialog' && state.assets.length >= 5 && !hasValidCachedLicense()) {
    activePanel = 'license';
    history.pushState({}, '', '/app?panel=license');
    void render(true);
    showToast('The free passbook holds five assets. House Key removes the limit.');
    return;
  }
  const dialog = root.querySelector<HTMLDialogElement>(`#${id}`);
  dialog?.showModal();
  dialog?.querySelector<HTMLElement>('[data-close]')?.focus();
}

async function addAsset(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const areaName = String(data.get('area')).trim();
  let area = state.areas.find((item) => item.name.toLowerCase() === areaName.toLowerCase());
  if (!area) { area = { id: uid('area'), name: areaName, createdAt: new Date().toISOString() }; state.areas.push(area); }
  const editId = form.dataset.editId;
  const existing = editId ? state.assets.find((item) => item.id === editId) : undefined;
  const asset: Asset = { id: existing?.id ?? uid('asset'), areaId: area.id, name: String(data.get('asset')).trim(), makeModel: String(data.get('model')).trim(), installedOn: String(data.get('installed')), createdAt: existing?.createdAt ?? new Date().toISOString() };
  if (existing) state.assets[state.assets.indexOf(existing)] = asset;
  else state.assets.push(asset);
  removeUnusedAreas();
  await persist(existing ? 'Asset changes saved.' : 'Asset saved. Add its first recurring job.');
  activePanel = 'assets';
  await render();
  if (existing) return;
  resetDialog('task-dialog'); openDialog('task-dialog');
  const select = root.querySelector<HTMLSelectElement>('#task-asset');
  if (select) select.value = asset.id;
}

async function addTask(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const editId = form.dataset.editId;
  const existing = editId ? state.tasks.find((item) => item.id === editId) : undefined;
  const task: Task = { id: existing?.id ?? uid('task'), assetId: String(data.get('asset')), name: String(data.get('name')).trim(), mode: String(data.get('mode')) as Task['mode'], intervalMonths: Number(data.get('interval')), startDate: String(data.get('start')), createdAt: existing?.createdAt ?? new Date().toISOString() };
  if (existing?.lastCompletedOn) task.lastCompletedOn = existing.lastCompletedOn;
  if (existing) state.tasks[state.tasks.indexOf(existing)] = task;
  else state.tasks.push(task);
  await persist(existing ? 'Recurring job changes saved.' : 'Recurring job saved.');
  activePanel = 'due';
  await render();
}

async function completeTask(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const file = data.get('proof') as File | null;
  const completedOn = String(data.get('date'));
  if (completedOn > todayISO()) {
    formError(form, 'Completed work cannot be dated in the future. Choose today or an earlier date.');
    const input = form.elements.namedItem('date') as HTMLInputElement;
    input.focus();
    return;
  }
  if (file && file.size > 3_000_000) return formError(form, 'The file is over 3 MB. Choose a smaller photo or PDF.');
  const editId = form.dataset.editId;
  const existing = editId ? state.completions.find((item) => item.id === editId) : undefined;
  const oldTaskId = existing?.taskId;
  const record: Completion = { id: existing?.id ?? uid('done'), taskId: String(data.get('task')), completedOn, note: String(data.get('note')).trim(), receiptRef: String(data.get('receipt')).trim(), createdAt: existing?.createdAt ?? new Date().toISOString() };
  if (existing?.attachment && data.get('removeProof') !== 'on') record.attachment = existing.attachment;
  if (file?.size) record.attachment = { name: file.name, type: file.type, dataUrl: await fileToDataUrl(file) };
  if (existing) state.completions[state.completions.indexOf(existing)] = record;
  else state.completions.push(record);
  if (oldTaskId && oldTaskId !== record.taskId) refreshLastCompleted(oldTaskId);
  refreshLastCompleted(record.taskId);
  await persist(existing ? 'Service entry changes saved.' : 'Service entry saved. The next due date is updated.');
  await render();
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });
}

async function persist(message: string): Promise<void> {
  try { await save(state); showToast(message); } catch { showToast('The record could not be saved. Check browser storage, then try again.'); }
}

function exportBackup(): void {
  const blob = new Blob([JSON.stringify(exportPayload(state), null, 2)], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href; link.download = `home-service-passbook-${todayISO()}.json`; link.click();
  URL.revokeObjectURL(href);
  showToast('Passbook backup downloaded.');
}

async function importBackup(event: Event): Promise<void> {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    let parsed: unknown;
    try { parsed = JSON.parse(await file.text()); }
    catch { throw new Error('The backup is not valid JSON. Choose an exported passbook file.'); }
    const imported = validateImport(parsed);
    if (!confirm(`Replace this passbook with ${imported.assets.length} assets and ${imported.completions.length} service entries?`)) { input.value = ''; return; }
    await replaceWithImport(imported); state = imported; await render(); showToast('Passbook imported. Your earlier records can be restored if startup validation fails.');
  } catch (error) { showToast(error instanceof Error ? error.message : 'The backup could not be read. Choose an exported JSON file.'); input.value = ''; }
}

function formError(form: HTMLFormElement, message: string): void {
  const target = form.querySelector<HTMLElement>('.form-message');
  if (target) target.textContent = message;
}

function hasValidCachedLicense(): boolean {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) {
    localStorage.removeItem(VERDICT_KEY);
    return false;
  }
  try {
    const cached = JSON.parse(localStorage.getItem(VERDICT_KEY) || '{}') as Partial<CachedVerdict>;
    return cached.valid === true && cached.token === token;
  } catch { return false; }
}

async function restoreLicense(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const token = String(new FormData(form).get('license')).trim();
  formError(form, 'Checking this license…');
  try {
    const response = await fetch(`${VERIFY_URL}?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('verification unavailable');
    const verdict = await response.json() as { valid: boolean };
    if (!verdict.valid) return formError(form, 'This license is not active. Check the token or buy a new House Key.');
    localStorage.setItem(LICENSE_KEY, token);
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: true, checkedAt: Date.now(), token } satisfies CachedVerdict));
    await render(); showToast('House Key is active on this browser.');
  } catch { formError(form, 'The license service could not be reached. Check your connection and try again.'); }
}

function captureReturnedLicense(): void {
  const params = new URLSearchParams(location.search);
  const token = params.get('license');
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token);
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: false, checkedAt: 0, token } satisfies CachedVerdict));
  params.delete('license');
  const query = params.toString();
  history.replaceState({}, '', `${location.pathname}${query ? `?${query}` : ''}`);
}

async function recheckLicense(): Promise<void> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return;
  let cached: Partial<CachedVerdict> = {};
  try { cached = JSON.parse(localStorage.getItem(VERDICT_KEY) || '{}') as Partial<CachedVerdict>; } catch { /* Recheck malformed cache. */ }
  if (cached.token === token && cached.checkedAt && Date.now() - cached.checkedAt < 86400000) return;
  try {
    const response = await fetch(`${VERIFY_URL}?license=${encodeURIComponent(token)}`);
    if (!response.ok) return;
    const verdict = await response.json() as { valid: boolean };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: verdict.valid, checkedAt: Date.now(), token } satisfies CachedVerdict));
    if (['/app', '/demo', '/history', '/backup'].includes(location.pathname)) await render();
    if (verdict.valid) showToast('House Key is active on this browser.');
  } catch { /* Keep the cached state while offline. */ }
}

function showToast(message: string): void {
  const toast = root.querySelector<HTMLElement>('.toast');
  if (!toast) return;
  toast.textContent = message; toast.hidden = false;
  window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => { toast.hidden = true; }, 4000);
}

window.addEventListener('popstate', () => void render(true));
window.addEventListener('online', () => showToast('Back online. Your local records stayed available.'));
window.addEventListener('offline', () => showToast('Offline. You can keep using this passbook.'));
window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); installPrompt = event; });

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) showToast('An update is ready. Reload to use it.'); });
    });
  } catch { /* The app still works online if registration is unavailable. */ }
}

void (async () => {
  try {
    captureReturnedLicense();
    await render();
    const recovery = takeRecoveryNotice();
    if (recovery) showToast(recovery);
    void recheckLicense();
    await registerServiceWorker();
    void installPrompt;
  } catch {
    root.innerHTML = shell('<section class="empty-state"><span class="empty-stamp" aria-hidden="true">!</span><h1 tabindex="-1">This passbook could not open</h1><p>Browser storage is unavailable. Allow site storage, then reload this page.</p><button class="button primary" data-action="reload">Reload passbook</button></section>');
    root.querySelector('[data-action="reload"]')?.addEventListener('click', () => location.reload());
  }
})();
