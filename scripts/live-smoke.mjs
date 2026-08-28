import { mkdir, writeFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright-core';

const base = process.argv[2] || 'https://home-service-passbook.sociobot.in';
const output = process.argv[3] || '.factory/repair-evidence/live';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const checkoutUrl = 'https://api.sociobot.in/api/v1/products/home-service-passbook/checkout';
const checkoutResponse = await fetch(checkoutUrl, { redirect: 'manual' });
const checkoutLocation = checkoutResponse.headers.get('location');
const results = {
  base,
  checkout: {
    status: checkoutResponse.status,
    hostedCheckout: checkoutLocation ? new URL(checkoutLocation).hostname === 'checkout.dodopayments.com' : false
  },
  consoleErrors: [], externalRequests: [], axe: [], touchTargets: {}, offline: false, keyboard: false, overflow: null
};

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on('console', (message) => { if (message.type() === 'error') results.consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => results.consoleErrors.push(error.message));
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(base).origin) results.externalRequests.push(request.url());
  });
  await page.goto(`${base}/?demo=1`);
  await page.screenshot({ path: `${output}/demo-mobile.png`, fullPage: true });
  results.overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  for (const name of ['Reset demo', 'Start for real']) results.touchTargets[name] = (await page.getByRole('button', { name }).boundingBox())?.height;
  for (const name of ['Privacy', 'Terms']) {
    const box = await page.getByRole('contentinfo').getByRole('link', { name }).boundingBox();
    results.touchTargets[`footer-${name}`] = { width: box?.width, height: box?.height };
  }
  await page.getByText('Skip to main content').focus();
  await page.keyboard.press('Enter');
  results.keyboard = await page.locator('#main').evaluate((element) => element === document.activeElement);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  });
  await context.setOffline(true);
  await page.reload();
  results.offline = await page.locator('[data-task-row]').filter({ hasText: 'Replace air filter' }).isVisible();
  await context.close();

  for (const width of [1280, 390]) {
    for (const colorScheme of ['light', 'dark']) {
      const scanContext = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, colorScheme });
      const scanPage = await scanContext.newPage();
      for (const path of ['/', '/demo', '/privacy', '/terms', '/404']) {
        await scanPage.goto(`${base}${path}`);
        const axe = await new AxeBuilder({ page: scanPage }).analyze();
        results.axe.push({ width, colorScheme, path, seriousOrCritical: axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).length });
      }
      await scanContext.close();
    }
  }
  await writeFile(`${output}/live-smoke.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  if (results.checkout.status !== 303 || !results.checkout.hostedCheckout || results.consoleErrors.length || results.externalRequests.length || !results.offline || !results.keyboard || results.overflow !== 0 || Object.values(results.touchTargets).some((target) => typeof target === 'object' ? Number(target.width) < 44 || Number(target.height) < 44 : Number(target) < 44) || results.axe.some((item) => item.seriousOrCritical)) process.exitCode = 1;
} finally {
  await browser.close();
}
