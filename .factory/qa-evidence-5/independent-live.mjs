import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = 'https://home-service-passbook.sociobot.in';
const evidenceDir = '.factory/qa-evidence-5';
const browser = await chromium.launch({ headless: true });
const results = { checks: [], consoleErrors: [], pageErrors: [], outgoing: [], smallTargets: [] };

function check(name, value, detail = '') {
  results.checks.push({ name, pass: Boolean(value), detail });
  if (!value) throw new Error(`${name}: ${detail}`);
}

async function text(locator) {
  return (await locator.innerText()).trim();
}

async function addAsset(page, area, name) {
  await page.getByRole('button', { name: 'Assets' }).click();
  await page.getByRole('button', { name: 'Add an asset' }).click();
  await page.getByLabel('Area').fill(area);
  await page.getByLabel('Asset name').fill(name);
  await page.getByRole('button', { name: 'Save asset' }).click();
  await page.getByRole('heading', { name: 'Add a recurring job' }).waitFor();
  await page.getByRole('button', { name: 'Close dialog' }).click();
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on('console', (message) => { if (message.type() === 'error') results.consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => results.pageErrors.push(error.message));
  page.on('request', (request) => results.outgoing.push(request.url()));

  const landingResponse = await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  check('landing returns 200', landingResponse?.status() === 200, String(landingResponse?.status()));
  check('landing title is plain and route-specific', (await page.title()) === 'Home Service Passbook — Track home maintenance', await page.title());
  check('landing has one h1', await page.locator('h1').count() === 1);
  check('landing has main landmark', await page.locator('main').count() === 1);
  check('headline states the job', (await text(page.locator('h1'))) === 'Remember every home service job');
  const firstRead = await page.locator('.hero-copy').innerText();
  check('first screen names households', firstRead.includes('For households tracking recurring care'));
  const demoLink = page.getByRole('link', { name: 'Try it with sample data' });
  check('sample demo action is visible', await demoLink.isVisible());
  await page.screenshot({ path: `${evidenceDir}/first-read-desktop.png` });
  await demoLink.click();
  await page.getByRole('heading', { name: 'What needs care next' }).waitFor();
  check('one click opens populated demo', await page.locator('[data-task-row]').count() === 3, `${await page.locator('[data-task-row]').count()} jobs`);
  check('demo banner is persistent', await page.getByText('Demo — sample data, nothing is saved to your passbook.').isVisible());
  check('demo uses separate indexeddb namespace', (await page.evaluate(async () => (await indexedDB.databases()).map((item) => item.name))).includes('demo:home-service-passbook'));

  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByRole('heading', { name: 'No scheduled jobs yet' }).waitFor();
  check('real passbook starts empty', await page.getByRole('heading', { name: 'No scheduled jobs yet' }).isVisible());
  await page.getByRole('button', { name: 'Add an asset' }).click();
  await page.getByRole('button', { name: 'Save asset' }).click();
  check('empty required asset is rejected', await page.getByRole('dialog').isVisible() && await page.getByLabel('Area').evaluate((node) => node === document.activeElement));
  await page.getByLabel('Area').fill('Basement');
  await page.getByLabel('Asset name').fill('Water heater');
  await page.getByLabel('Make or model').fill('Rheem XG40');
  await page.getByRole('button', { name: 'Save asset' }).click();
  await page.getByRole('heading', { name: 'Add a recurring job' }).waitFor();
  await page.getByLabel('Job name').fill('Flush tank');
  await page.getByText('Repeat after completion', { exact: true }).click();
  await page.getByLabel('Months between jobs').fill('0');
  await page.getByRole('button', { name: 'Save recurring job' }).click();
  check('zero interval is rejected', await page.getByLabel('Months between jobs').evaluate((node) => node === document.activeElement));
  await page.getByLabel('Months between jobs').fill('121');
  await page.getByRole('button', { name: 'Save recurring job' }).click();
  check('interval above 120 is rejected', await page.getByLabel('Months between jobs').evaluate((node) => node === document.activeElement));
  await page.getByLabel('Months between jobs').fill('12');
  await page.getByLabel('First due date').fill('2026-08-01');
  await page.getByRole('button', { name: 'Save recurring job' }).click();
  const flush = page.locator('[data-task-row]').filter({ hasText: 'Flush tank' });
  check('completion-relative job saves', (await flush.innerText()).includes('Repeat after completion 12 months'));
  await flush.getByRole('button', { name: 'Record work' }).click();
  await page.getByLabel('Completed on').fill('2099-12-31');
  await page.getByRole('button', { name: 'Save service entry' }).click();
  check('future completion is rejected and focused', await page.getByText('Completed work cannot be dated in the future.').isVisible() && await page.getByLabel('Completed on').evaluate((node) => node === document.activeElement));
  await page.getByLabel('Completed on').fill('2026-08-28');
  await page.getByLabel('What was done').fill('Drained sediment and checked for leaks.');
  await page.getByLabel('Receipt or invoice reference').fill('Plumber invoice 208');
  await page.getByRole('button', { name: 'Save service entry' }).click();
  await page.getByRole('button', { name: 'History' }).click();
  check('service note and receipt are in history', (await page.locator('[data-history-row]').innerText()).includes('Plumber invoice 208'));
  await page.reload();
  check('service record survives reload', (await page.locator('[data-history-row]').innerText()).includes('Drained sediment and checked for leaks.'));
  await page.getByRole('button', { name: 'Due next' }).click();
  check('completion-relative due date advances from completion', (await page.locator('[data-task-row]').innerText()).includes('Aug 28, 2027'));

  await page.getByRole('button', { name: 'Assets' }).click();
  await page.locator('[data-asset-row]').filter({ hasText: 'Water heater' }).getByRole('button', { name: 'Add recurring job' }).click();
  await page.getByLabel('Job name').fill('Inspect pressure valve');
  await page.getByLabel('Months between jobs').fill('6');
  await page.getByLabel('First due date').fill('2026-08-01');
  await page.getByRole('button', { name: 'Save recurring job' }).click();
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Due next' }).click();
  const fixedJob = page.locator('[data-task-row]').filter({ hasText: 'Inspect pressure valve' });
  await fixedJob.waitFor();
  check('missed fixed-calendar work remains overdue', (await fixedJob.innerText()).includes('OVERDUE') && (await fixedJob.innerText()).includes('Aug 1, 2026'));
  await fixedJob.getByRole('button', { name: 'Record work' }).click();
  await page.getByLabel('Completed on').fill('2026-08-28');
  await page.getByRole('button', { name: 'Save service entry' }).click();
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  check('fixed-calendar completion stays anchored', (await fixedJob.innerText()).includes('Feb 1, 2027'));

  await page.getByRole('button', { name: 'Assets' }).click();
  const waterHeater = page.locator('[data-asset-row]').filter({ hasText: 'Water heater' });
  await waterHeater.getByRole('button', { name: 'Edit asset' }).click();
  await page.getByLabel('Asset name').fill('Main water heater');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.getByRole('heading', { name: 'Main water heater' }).waitFor();
  check('asset correction persists', await page.getByRole('heading', { name: 'Main water heater' }).isVisible());

  for (const [area, name] of [['Kitchen', 'Refrigerator'], ['Outside', 'Rain gutters'], ['Utility room', 'Furnace'], ['Basement', '<img src=x onerror=alert(1)>']]) {
    await addAsset(page, area, name);
  }
  await page.getByRole('button', { name: 'Assets' }).click();
  check('free boundary accepts exactly five assets', await page.locator('[data-asset-row]').count() === 5);
  check('html-like record text is rendered as text', await page.getByRole('heading', { name: '<img src=x onerror=alert(1)>' }).isVisible());
  const firstAtLimit = page.locator('[data-asset-row]').filter({ hasText: 'Main water heater' });
  await firstAtLimit.getByRole('button', { name: 'Edit asset' }).click();
  await page.getByLabel('Asset name').fill('Corrected water heater');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.getByRole('heading', { name: 'Corrected water heater' }).waitFor();
  check('existing asset remains editable at free limit', await page.getByRole('heading', { name: 'Corrected water heater' }).isVisible());
  await page.getByRole('button', { name: 'Add an asset' }).click();
  await page.getByRole('heading', { name: 'Add unlimited assets and photos' }).waitFor();
  check('sixth asset opens House Key panel', await page.getByRole('heading', { name: 'Add unlimited assets and photos' }).isVisible());
  check('backup remains free at asset limit', await page.getByRole('button', { name: 'Backup' }).isVisible());

  await page.getByRole('button', { name: 'Backup' }).click();
  await page.locator('#import-file').setInputFiles({ name: 'corrupt.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ version: 1, exportedAt: '2026-08-28T00:00:00Z', areas: [{}], assets: [{}], tasks: [], completions: [] })) });
  check('nested malformed import gives a specific error', (await page.locator('.toast').innerText()).includes('invalid area id'));
  await page.reload();
  await page.getByRole('button', { name: 'Assets' }).click();
  await page.getByRole('heading', { name: 'Corrected water heater' }).waitFor();
  check('rejected import leaves existing records intact', await page.getByRole('heading', { name: 'Corrected water heater' }).isVisible());

  await page.evaluate(() => {
    localStorage.setItem('sb_license:home-service-passbook', 'qa-cached-license');
    localStorage.setItem('sb_license_verdict:home-service-passbook', JSON.stringify({ valid: true, checkedAt: Date.now(), token: 'qa-cached-license' }));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Due next' }).click();
  const correctedJob = page.locator('[data-task-row]').filter({ hasText: 'Flush tank' });
  await correctedJob.getByRole('button', { name: 'Record work' }).click();
  await page.getByLabel('Completed on').fill('2026-08-28');
  await page.getByLabel('Photo or receipt file optional, 3 MB maximum').setInputFiles({ name: 'proof-max.png', mimeType: 'image/png', buffer: Buffer.alloc(3_000_000, 1) });
  await page.getByRole('button', { name: 'Save service entry' }).click();
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'History' }).click();
  await page.getByRole('link', { name: 'Download proof-max.png' }).waitFor();
  check('exactly 3 MB attachment saves', await page.getByRole('link', { name: 'Download proof-max.png' }).isVisible());
  await page.getByRole('button', { name: 'Due next' }).click();
  await correctedJob.getByRole('button', { name: 'Record work' }).click();
  await page.getByLabel('Completed on').fill('2026-08-28');
  await page.getByLabel('Photo or receipt file optional, 3 MB maximum').setInputFiles({ name: 'proof-too-large.png', mimeType: 'image/png', buffer: Buffer.alloc(3_000_001, 1) });
  await page.getByRole('button', { name: 'Save service entry' }).click();
  check('attachment above 3 MB is rejected', await page.getByText('The file is over 3 MB.').isVisible() && await page.getByRole('dialog').isVisible());
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'Backup' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export passbook' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const backup = JSON.parse(Buffer.concat(chunks).toString());
  check('export contains all record collections', ['areas', 'assets', 'tasks', 'completions'].every((key) => Array.isArray(backup[key])));
  check('export contains attachment data', backup.completions.some((entry) => entry.attachment?.name === 'proof-max.png' && entry.attachment.dataUrl.startsWith('data:image/png;base64,')));
  await page.screenshot({ path: `${evidenceDir}/live-e2e-desktop.png`, fullPage: true });
  await context.close();

  const failureContext = await browser.newContext();
  const failurePage = await failureContext.newPage();
  await failurePage.goto(`${base}/app`);
  await failurePage.getByRole('button', { name: 'Add an asset' }).click();
  await failurePage.getByLabel('Area').fill('Basement');
  await failurePage.getByLabel('Asset name').fill('Boiler');
  await failurePage.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    window.restorePut = () => { IDBObjectStore.prototype.put = original; };
    IDBObjectStore.prototype.put = function () { throw new DOMException('Injected failure', 'QuotaExceededError'); };
  });
  await failurePage.getByRole('button', { name: 'Save asset' }).click();
  await failurePage.getByText('The record could not be saved.').waitFor();
  check('storage failure keeps entered form open', await failurePage.getByText('The record could not be saved.').isVisible() && await failurePage.getByLabel('Asset name').inputValue() === 'Boiler');
  await failurePage.evaluate(() => window.restorePut());
  await failurePage.getByRole('button', { name: 'Save asset' }).click();
  await failurePage.getByRole('heading', { name: 'Add a recurring job' }).waitFor();
  check('storage failure can be retried successfully', true);
  await failureContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobile = await mobileContext.newPage();
  await mobile.goto(`${base}/`, { waitUntil: 'networkidle' });
  const actionBox = await mobile.getByRole('link', { name: 'Try it with sample data' }).boundingBox();
  check('mobile sample action is inside first viewport', actionBox && actionBox.y + actionBox.height <= 844, JSON.stringify(actionBox));
  check('mobile landing has no horizontal overflow', await mobile.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth));
  await mobile.screenshot({ path: `${evidenceDir}/first-read-mobile.png` });
  await mobile.keyboard.press('Tab');
  check('first tab reaches skip link', await mobile.getByText('Skip to main content').evaluate((node) => node === document.activeElement));
  const focusStyle = await mobile.getByText('Skip to main content').evaluate((node) => ({ width: getComputedStyle(node).outlineWidth, style: getComputedStyle(node).outlineStyle, color: getComputedStyle(node).outlineColor }));
  check('focus indicator is visible', Number.parseFloat(focusStyle.width) >= 3 && focusStyle.style !== 'none', JSON.stringify(focusStyle));
  await mobile.getByRole('link', { name: 'Try it with sample data' }).click();
  await mobile.getByRole('heading', { name: 'What needs care next' }).waitFor();
  const targetData = await mobile.locator('a:visible, button:visible, input:visible, select:visible, textarea:visible').evaluateAll((nodes) => nodes.map((node) => { const box = node.getBoundingClientRect(); return { name: node.getAttribute('aria-label') || node.textContent?.trim() || node.getAttribute('name') || node.tagName, width: box.width, height: box.height }; }).filter((item) => item.width < 44 || item.height < 44));
  results.smallTargets = targetData;
  check('visible mobile interactive targets meet 44 px', targetData.length === 0, JSON.stringify(targetData));
  await mobile.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  check('mobile demo does not overflow at 200% text', await mobile.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth));
  await mobileContext.close();

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reduced = await reducedContext.newPage();
  await reduced.goto(`${base}/`);
  const motion = await reduced.evaluate(() => ({ scroll: getComputedStyle(document.documentElement).scrollBehavior, transition: getComputedStyle(document.querySelector('.button')).transitionDuration, animations: document.getAnimations().filter((item) => item.playState === 'running').length }));
  check('reduced motion removes movement', motion.scroll === 'auto' && Number.parseFloat(motion.transition) <= 0.00001 && motion.animations === 0, JSON.stringify(motion));
  await reducedContext.close();

  const offlineContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const offline = await offlineContext.newPage();
  await offline.goto(`${base}/demo`);
  await offline.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  });
  const pwa = await offline.evaluate(async () => ({ registrations: (await navigator.serviceWorker.getRegistrations()).length, caches: await caches.keys(), controller: navigator.serviceWorker.controller?.scriptURL }));
  check('service worker controls the PWA', pwa.registrations === 1 && pwa.controller?.endsWith('/sw.js'), JSON.stringify(pwa));
  check('versioned PWA cache exists', pwa.caches.includes('home-service-passbook-v4'), JSON.stringify(pwa.caches));
  await offlineContext.setOffline(true);
  await offline.reload();
  check('offline reload retains demo records', await offline.getByRole('heading', { name: 'Replace air filter' }).isVisible());
  await offline.screenshot({ path: `${evidenceDir}/offline-demo.png`, fullPage: true });
  await offlineContext.close();

  const unexpected = results.outgoing.filter((url) => new URL(url).origin !== new URL(base).origin);
  check('full maintenance flow sends no cross-origin request', unexpected.length === 0, JSON.stringify(unexpected));
  check('no console errors', results.consoleErrors.length === 0, JSON.stringify(results.consoleErrors));
  check('no page errors', results.pageErrors.length === 0, JSON.stringify(results.pageErrors));
} catch (error) {
  results.failure = error instanceof Error ? error.stack : String(error);
  process.exitCode = 1;
} finally {
  await writeFile(`${evidenceDir}/independent-live.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}
