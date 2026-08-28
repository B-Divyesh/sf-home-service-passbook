import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:demo-sandbox demo is filled and isolated from real data', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved to your passbook.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Replace air filter' })).toBeVisible();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { name: 'No scheduled jobs yet' })).toBeVisible();
});

test('@claim:recurrence-rules fixed and completion-relative schedules differ', async ({ page }) => {
  await page.goto('/demo');
  const filter = page.getByRole('article').filter({ hasText: 'Replace air filter' });
  const coils = page.getByRole('article').filter({ hasText: 'Vacuum condenser coils' });
  await expect(filter).toContainText('Repeat after completion');
  await expect(coils).toContainText('Repeat every');
});

test('@claim:json-backup export contains every record collection', async ({ page }) => {
  await page.goto('/demo');
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
  expect(data.completions).toHaveLength(4);
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
  const buyLink = page.getByRole('link', { name: 'Buy House Key — $19' });
  await expect(buyLink).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/home-service-passbook/checkout');
  await page.route('https://api.sociobot.in/api/v1/products/home-service-passbook/verify?license=test-license', (route) => route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }));
  await page.evaluate(() => {
    localStorage.setItem('sb_license:home-service-passbook', 'test-license');
    localStorage.setItem('sb_license_verdict:home-service-passbook', JSON.stringify({ valid: true, checkedAt: 0 }));
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
  await expect(page.getByLabel('Photo or receipt file optional, 3 MB maximum')).toBeVisible();
});

test('landing and app have no serious accessibility violations', async ({ page }) => {
  for (const path of ['/', '/demo', '/privacy', '/terms', '/404']) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  }
});

test('mobile first screen and keyboard path work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to main content')).toBeFocused();
  await page.goto('/demo');
  await page.getByText('Skip to main content').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
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
});

test('@claim:print-history service history opens the browser print path', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'History' }).click();
  await page.evaluate(() => { (window as Window & { printCalled?: boolean }).print = () => { (window as Window & { printCalled?: boolean }).printCalled = true; }; });
  await page.getByRole('button', { name: 'Print history' }).click();
  await expect.poll(() => page.evaluate(() => (window as Window & { printCalled?: boolean }).printCalled)).toBe(true);
});
