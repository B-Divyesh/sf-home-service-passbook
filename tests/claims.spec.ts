import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:demo-sandbox demo is filled and isolated from real data', async ({ page }) => {
  await page.goto('/app');
  await page.getByRole('button', { name: 'Add an asset' }).click();
  await page.getByLabel('Area').fill('Basement');
  await page.getByLabel('Asset name').fill('Boiler');
  await page.getByRole('button', { name: 'Save asset' }).click();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved to your passbook.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Replace air filter' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByRole('button', { name: 'Assets' }).click();
  await expect(page.getByRole('heading', { name: 'Boiler' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Furnace' })).toHaveCount(0);
});

test('@claim:recurrence-rules fixed and completion-relative schedules differ without hiding missed fixed work', async ({ page }) => {
  await page.goto('/app');
  await page.getByRole('button', { name: 'Add an asset' }).click();
  await page.getByLabel('Area').fill('Utility room');
  await page.getByLabel('Asset name').fill('Boiler');
  await page.getByRole('button', { name: 'Save asset' }).click();
  await page.getByLabel('Job name').fill('Inspect pressure valve');
  await page.getByLabel('Months between jobs').fill('6');
  await page.getByLabel('First due date').fill('2026-08-01');
  await page.getByRole('button', { name: 'Save recurring job' }).click();
  const fixed = page.getByRole('article').filter({ hasText: 'Inspect pressure valve' });
  await expect(fixed).toContainText('Repeat every 6 months');
  await expect(fixed).toContainText('Overdue');
  await expect(fixed).toContainText('Aug 1, 2026');

  await page.goto('/demo');
  const completionRelative = page.getByRole('article').filter({ hasText: 'Replace air filter' });
  await expect(completionRelative).toContainText('Repeat after completion');
});

test('@claim:json-backup export contains every record collection', async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(() => {
    localStorage.setItem('sb_license:home-service-passbook', 'fixture-license');
    localStorage.setItem('sb_license_verdict:home-service-passbook', JSON.stringify({ valid: true, checkedAt: Date.now(), token: 'fixture-license' }));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Record completed work' }).click();
  await page.getByLabel('Completed on').fill('2026-08-28');
  await page.getByLabel('Photo or receipt file optional, 3 MB maximum').setInputFiles({ name: 'backup-proof.png', mimeType: 'image/png', buffer: Buffer.from('backup-photo') });
  await page.getByRole('button', { name: 'Save service entry' }).click();
  await page.getByRole('button', { name: 'Backup', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export passbook' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const data = JSON.parse(Buffer.concat(chunks).toString());
  expect(data.version).toBe(1);
  expect(data.areas).toHaveLength(3);
  expect(data.assets).toHaveLength(3);
  expect(data.tasks).toHaveLength(3);
  expect(data.completions).toHaveLength(5);
  expect(data.completions.some((entry: { attachment?: { name: string; dataUrl: string } }) => entry.attachment?.name === 'backup-proof.png' && entry.attachment.dataUrl.startsWith('data:image/png;base64,'))).toBe(true);
  const filePath = await download.path();
  expect(filePath).toBeTruthy();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByRole('button', { name: 'Backup', exact: true }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#import-file').setInputFiles(filePath!);
  await expect(page.getByText('Passbook imported.')).toBeVisible();
  await page.getByRole('button', { name: 'Assets' }).click();
  await expect(page.getByRole('heading', { name: 'Furnace' })).toBeVisible();
});

test('@claim:local-only demo flow makes no cross-origin requests', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Assets' }).click();
  await page.getByRole('button', { name: 'History' }).click();
  await page.getByRole('button', { name: 'Backup', exact: true }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export passbook' }).click();
  await download;
  expect(external).toEqual([]);
});

test('@claim:offline-reload app reloads offline after first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
    }
  });
  await page.waitForFunction(async () => {
    const keys = await caches.keys();
    const cache = await caches.open(keys.find((key) => key.startsWith('home-service-passbook-')) || 'missing');
    return (await cache.keys()).some((request) => request.url.includes('/assets/index-') && request.url.endsWith('.js'));
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'What needs care next' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Replace air filter' })).toBeVisible();
});

test('@claim:house-key-limit free limit and licensed features are enforced', async ({ page }) => {
  await page.goto('/app');
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('home-service-passbook', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const localState = {
      areas: [{ id: 'area', name: 'House', createdAt: '2026-08-28' }],
      assets: Array.from({ length: 5 }, (_, index) => ({ id: `asset-${index}`, areaId: 'area', name: `Asset ${index + 1}`, makeModel: '', installedOn: '', createdAt: '2026-08-28' })),
      tasks: [], completions: []
    };
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('passbook', 'readwrite');
      transaction.objectStore('passbook').put(localState, 'state');
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
  });
  await page.reload();
  await page.getByRole('button', { name: 'Assets' }).click();
  await page.getByRole('button', { name: 'Add an asset' }).click();
  await expect(page.getByRole('heading', { name: 'Add unlimited assets and photos' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Backup' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'History' })).toBeVisible();
  const buyLink = page.getByRole('link', { name: 'Buy House Key — $19' });
  await expect(buyLink).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/home-service-passbook/checkout');
  await page.evaluate(() => {
    localStorage.removeItem('sb_license:home-service-passbook');
    localStorage.setItem('sb_license_verdict:home-service-passbook', JSON.stringify({ valid: true, checkedAt: Date.now(), token: 'orphan' }));
  });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Add unlimited assets and photos' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license_verdict:home-service-passbook'))).toBeNull();
  await page.route('https://api.sociobot.in/api/v1/products/home-service-passbook/verify?license=test-license', (route) => route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }));
  await page.evaluate(() => {
    localStorage.setItem('sb_license:home-service-passbook', 'test-license');
    localStorage.setItem('sb_license_verdict:home-service-passbook', JSON.stringify({ valid: true, checkedAt: 0, token: 'test-license' }));
  });
  const verifyRequest = page.waitForRequest('https://api.sociobot.in/api/v1/products/home-service-passbook/verify?license=test-license');
  await page.reload();
  const request = await verifyRequest;
  expect([...new URL(request.url()).searchParams.keys()]).toEqual(['license']);
  await page.getByRole('button', { name: 'Assets' }).click();
  await page.getByRole('button', { name: 'Add an asset' }).click();
  await expect(page.getByRole('heading', { name: 'Add an asset' })).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Record completed work' }).click();
  const proof = page.getByLabel('Photo or receipt file optional, 3 MB maximum');
  await expect(proof).toBeVisible();
  await page.getByLabel('Completed on').fill('2026-08-28');
  await page.getByLabel('What was done').fill('Photo proof test.');
  await proof.setInputFiles({ name: 'proof.png', mimeType: 'image/png', buffer: Buffer.from('small-png-fixture') });
  await page.getByRole('button', { name: 'Save service entry' }).click();
  await page.getByRole('button', { name: 'History' }).click();
  await expect(page.getByRole('link', { name: 'Download proof.png' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('link', { name: 'Download proof.png' })).toBeVisible();
  await page.getByRole('button', { name: 'Backup', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export passbook' }).click();
  const backup = await downloadPromise;
  const stream = await backup.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const exported = JSON.parse(Buffer.concat(chunks).toString());
  expect(exported.completions.some((entry: { attachment?: { name: string; dataUrl: string } }) => entry.attachment?.name === 'proof.png' && entry.attachment.dataUrl.startsWith('data:image/png;base64,'))).toBe(true);
  await page.route('https://api.sociobot.in/api/v1/products/home-service-passbook/verify?license=return-token', (route) => route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }));
  await page.goto('/app?panel=license&license=return-token');
  await expect(page).toHaveURL('/app?panel=license');
  await expect(page.getByRole('heading', { name: 'House Key is active' })).toBeVisible();
});

test('light and dark routes have no serious accessibility violations on desktop or mobile', async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      for (const path of ['/', '/demo', '/privacy', '/terms', '/404']) {
        await page.goto(path);
        await expect(page.locator('h1')).toHaveCount(1);
        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')), `${colorScheme} ${width}px ${path}`).toEqual([]);
      }
    }
  }
});

test('mobile first screen and keyboard path work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to main content')).toBeFocused();
  for (const target of [page.getByLabel('Home Service Passbook home'), page.getByRole('link', { name: 'Restore a license' }), page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' }), page.getByRole('contentinfo').getByRole('link', { name: 'Terms' })]) {
    const box = await target.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  const termsBox = await page.getByRole('contentinfo').getByRole('link', { name: 'Terms' }).boundingBox();
  expect(termsBox?.width).toBeGreaterThanOrEqual(44);
  await page.goto('/demo');
  for (const name of ['Reset demo', 'Start for real']) {
    const box = await page.getByRole('button', { name }).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  await page.getByText('Skip to main content').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.goto('/app');
  const add = page.getByRole('button', { name: 'Add an asset' });
  await add.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(add).toBeFocused();

  await add.focus();
  await page.keyboard.press('Enter');
  const saveAsset = page.getByRole('button', { name: 'Save asset' });
  await saveAsset.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close dialog' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(saveAsset).toBeFocused();
  await page.keyboard.press('Escape');

  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('reduced motion and update messaging remain available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const motion = await page.evaluate(() => {
    const style = getComputedStyle(document.querySelector('.button')!);
    return { transition: style.transitionDuration, scroll: getComputedStyle(document.documentElement).scrollBehavior };
  });
  expect(Number.parseFloat(motion.transition)).toBeLessThanOrEqual(0.00001);
  expect(motion.scroll).toBe('auto');

  await page.addInitScript(() => {
    const installing = new EventTarget() as EventTarget & { state: string };
    installing.state = 'installing';
    const registration = new EventTarget() as EventTarget & { installing: typeof installing };
    registration.installing = installing;
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        controller: {},
        register: async () => {
          setTimeout(() => {
            registration.dispatchEvent(new Event('updatefound'));
            setTimeout(() => { installing.state = 'installed'; installing.dispatchEvent(new Event('statechange')); }, 10);
          }, 10);
          return registration;
        }
      }
    });
  });
  await page.reload();
  await expect(page.locator('.toast')).toContainText('An update is ready. Reload to use it.');
});

test('@claim:service-log a household can add an asset, schedule work, complete it, and retrieve history', async ({ page }) => {
  await page.goto('/app');
  await page.getByRole('button', { name: 'Add an asset' }).click();
  await page.getByLabel('Area').fill('Basement');
  await page.getByLabel('Asset name').fill('Water heater');
  await page.getByLabel('Make or model').fill('Rheem XG40');
  await page.getByRole('button', { name: 'Save asset' }).click();
  await expect(page.getByRole('heading', { name: 'Add a recurring job' })).toBeVisible();
  await page.getByLabel('Job name').fill('Flush tank');
  await page.getByText('Repeat after completion', { exact: true }).click();
  await page.getByLabel('Months between jobs').fill('12');
  await page.getByLabel('First due date').fill('2026-08-01');
  await page.getByRole('button', { name: 'Save recurring job' }).click();
  const row = page.getByRole('article').filter({ hasText: 'Flush tank' });
  await expect(row).toContainText('Repeat after completion 12 months');
  await row.getByRole('button', { name: 'Record work' }).click();
  await page.getByLabel('Completed on').fill('2026-08-28');
  await page.getByLabel('What was done').fill('Drained sediment and checked for leaks.');
  await page.getByLabel('Receipt or invoice reference').fill('Plumber invoice 208');
  await page.getByRole('button', { name: 'Save service entry' }).click();
  await page.getByRole('button', { name: 'History' }).click();
  await expect(page.getByRole('heading', { name: 'Flush tank' })).toBeVisible();
  await expect(page.getByText('Plumber invoice 208')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Flush tank' })).toBeVisible();
  const entry = page.locator('[data-history-row]').filter({ hasText: 'Flush tank' });
  await expect(entry.getByText('Aug 28, 2026')).toBeVisible();
  await expect(entry).toContainText('Drained sediment and checked for leaks.');
  await expect(entry).toContainText('Plumber invoice 208');
});

test('@claim:import-validation malformed nested imports are rejected before confirmation without replacing valid records', async ({ page }) => {
  await page.goto('/app');
  await page.getByRole('button', { name: 'Add an asset' }).click();
  await page.getByLabel('Area').fill('Basement');
  await page.getByLabel('Asset name').fill('Boiler');
  await page.getByRole('button', { name: 'Save asset' }).click();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'Backup', exact: true }).click();
  await page.locator('#import-file').setInputFiles({
    name: 'corrupt.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), areas: [{}], assets: [{}], tasks: [], completions: [] }))
  });
  await expect(page.locator('.toast')).toContainText('invalid area id');
  await page.reload();
  await page.getByRole('button', { name: 'Assets' }).click();
  await expect(page.getByRole('heading', { name: 'Boiler' })).toBeVisible();
  await page.getByRole('button', { name: 'Backup', exact: true }).click();
  await page.locator('#import-file').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{not json') });
  await expect(page.locator('.toast')).toContainText('not valid JSON');
});

test('@claim:import-rollback the passbook before an import is restored if imported state fails startup validation', async ({ page }) => {
  await page.goto('/app');
  await page.getByRole('button', { name: 'Add an asset' }).click();
  await page.getByLabel('Area').fill('Basement');
  await page.getByLabel('Asset name').fill('Prior boiler');
  await page.getByRole('button', { name: 'Save asset' }).click();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'Backup', exact: true }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#import-file').setInputFiles({
    name: 'replacement.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({
      version: 1,
      exportedAt: '2026-08-28T12:00:00.000Z',
      areas: [{ id: 'replacement-area', name: 'Kitchen', createdAt: '2026-08-28T12:00:00.000Z' }],
      assets: [{ id: 'replacement-asset', areaId: 'replacement-area', name: 'Replacement fridge', makeModel: '', installedOn: '', createdAt: '2026-08-28T12:00:00.000Z' }],
      tasks: [], completions: []
    }))
  });
  await expect(page.locator('.toast')).toContainText('Passbook imported.');
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('home-service-passbook', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('passbook', 'readwrite');
      transaction.objectStore('passbook').put({ areas: [{}], assets: [{}], tasks: [], completions: [] }, 'state');
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
  });
  await page.reload();
  await expect(page.locator('.toast')).toContainText('earlier passbook has been restored');
  await page.getByRole('button', { name: 'Assets' }).click();
  await expect(page.getByRole('heading', { name: 'Prior boiler' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Replacement fridge' })).toHaveCount(0);
});

test('@claim:refund-revocation an inactive license verdict locks House Key features', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/home-service-passbook/verify?license=revoked-license', (route) => route.fulfill({ json: { valid: false, reason: 'revoked', expires_at: null } }));
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:home-service-passbook', 'revoked-license');
    localStorage.setItem('sb_license_verdict:home-service-passbook', JSON.stringify({ valid: true, checkedAt: 0, token: 'revoked-license' }));
  });
  await page.goto('/app?panel=license');
  await expect(page.getByRole('heading', { name: 'Add unlimited assets and photos' })).toBeVisible();
  await expect(page.getByText('This license is no longer active.')).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('sb_license_verdict:home-service-passbook') || '{}').valid)).toBe(false);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Add unlimited assets and photos' })).toBeVisible();
});

test('@claim:record-corrections future work is rejected and existing records can be corrected', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Record completed work' }).click();
  await page.getByLabel('Completed on').fill('2099-12-31');
  await page.getByRole('button', { name: 'Save service entry' }).click();
  await expect(page.getByText('Completed work cannot be dated in the future.')).toBeVisible();
  await expect(page.getByLabel('Completed on')).toBeFocused();
  await page.getByRole('button', { name: 'Close dialog' }).click();

  await page.getByRole('button', { name: 'Assets' }).click();
  const furnace = page.locator('[data-asset-row]').filter({ hasText: 'Furnace' });
  await furnace.getByRole('button', { name: 'Edit asset' }).click();
  await page.getByLabel('Asset name').fill('Main furnace');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('heading', { name: 'Main furnace' })).toBeVisible();

  await page.getByRole('button', { name: 'Due next' }).click();
  const filter = page.locator('[data-task-row]').filter({ hasText: 'Replace air filter' });
  await filter.getByRole('button', { name: 'Edit job' }).click();
  await page.getByLabel('Job name').fill('Replace HVAC filter');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('heading', { name: 'Replace HVAC filter' })).toBeVisible();

  await page.getByRole('button', { name: 'History' }).click();
  const entry = page.locator('[data-history-row]').filter({ hasText: 'Replace HVAC filter' }).first();
  await entry.getByRole('button', { name: 'Edit entry' }).click();
  await page.getByLabel('What was done').fill('Corrected service note.');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Corrected service note.')).toBeVisible();
  const corrected = page.locator('[data-history-row]').filter({ hasText: 'Corrected service note.' });
  page.once('dialog', (dialog) => dialog.accept());
  await corrected.getByRole('button', { name: 'Delete entry' }).click();
  await expect(page.getByText('Corrected service note.')).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('Corrected service note.')).toHaveCount(0);
});

test('@claim:print-history service history opens the browser print path', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'History' }).click();
  await page.evaluate(() => { (window as Window & { printCalled?: boolean }).print = () => { (window as Window & { printCalled?: boolean }).printCalled = true; }; });
  await page.getByRole('button', { name: 'Print history' }).click();
  await expect.poll(() => page.evaluate(() => (window as Window & { printCalled?: boolean }).printCalled)).toBe(true);
});
