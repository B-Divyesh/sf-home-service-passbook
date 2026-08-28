import { writeFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright-core';

const base = 'https://home-service-passbook.sociobot.in';
const output = '.factory/polish-1-evidence';
const expected = [
  ['/', 'Home Service Passbook — Track home maintenance', 'Track recurring home care and keep service proof in one private, offline passbook.'],
  ['/demo', 'Demo — Home Service Passbook', 'Try a filled Home Service Passbook with isolated sample records.'],
  ['/app', 'Your passbook — Home Service Passbook', 'View due home service jobs and record completed work in your private passbook.'],
  ['/history', 'Service history — Home Service Passbook', 'Review and print the service entries saved in this browser.'],
  ['/backup', 'Backup — Home Service Passbook', 'Export or import a complete Home Service Passbook backup.'],
  ['/privacy', 'Privacy — Home Service Passbook', 'Read how Home Service Passbook stores records and handles license checks.'],
  ['/terms', 'Terms — Home Service Passbook', 'Read the terms for using Home Service Passbook and House Key.']
];
const browser = await chromium.launch({ headless: true });
const results = { cold: {}, demo: {}, calendar: {}, isolation: {}, focus: {}, routes: [], missing: {}, accessibility: [], privacy: {}, offline: false, errors: [] };

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
  const page = await context.newPage();
  const requests = [];
  page.on('console', (message) => { if (message.type() === 'error') results.errors.push(message.text()); });
  page.on('pageerror', (error) => results.errors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));

  await page.goto(base, { waitUntil: 'networkidle' });
  const sample = page.getByRole('link', { name: 'Try it with sample data' });
  results.cold = {
    title: await page.title(),
    headline: await page.getByRole('heading', { level: 1 }).textContent(),
    sampleHref: await sample.getAttribute('href'),
    sampleBottom: (await sample.boundingBox())?.y + (await sample.boundingBox())?.height,
    viewportHeight: 844,
    overflow: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  };
  await page.screenshot({ path: `${output}/live-cold-mobile.png`, fullPage: true });
  await sample.click();
  await page.waitForURL(`${base}/?demo=1`);
  await page.locator('.demo-banner').waitFor();
  results.demo = {
    url: page.url(),
    banner: await page.locator('.demo-banner').isVisible(),
    reset: await page.getByRole('button', { name: 'Reset demo' }).isVisible(),
    startReal: await page.getByRole('button', { name: 'Start for real' }).isVisible(),
    jobs: await page.locator('[data-task-row]').count()
  };
  await page.screenshot({ path: `${output}/live-demo-mobile.png`, fullPage: true });
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export calendar (.ics)' }).click();
  const calendarDownload = await downloadPromise;
  const stream = await calendarDownload.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const calendar = Buffer.concat(chunks).toString();
  results.calendar = {
    filename: calendarDownload.suggestedFilename(),
    events: (calendar.match(/BEGIN:VEVENT/g) || []).length,
    dates: [...calendar.matchAll(/DTSTART;VALUE=DATE:(\d{8})/g)].map((match) => match[1])
  };
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  });
  await context.setOffline(true);
  await page.reload();
  results.offline = await page.getByRole('heading', { name: 'Replace air filter' }).isVisible();
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  results.demo.resetJobs = await page.locator('[data-task-row]').count();
  results.privacy = { externalRequests: [...new Set(requests.filter((url) => new URL(url).origin !== base))] };

  for (const [path, title, description] of expected) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    results.routes.push({
      path,
      title: await page.title(),
      titleMatches: await page.title() === title,
      descriptionMatches: await page.locator('meta[name="description"]').getAttribute('content') === description,
      openGraphMatches: await page.locator('meta[property="og:title"]').getAttribute('content') === title && await page.locator('meta[property="og:description"]').getAttribute('content') === description,
      twitterMatches: await page.locator('meta[name="twitter:title"]').getAttribute('content') === title && await page.locator('meta[name="twitter:description"]').getAttribute('content') === description,
      canonical: await page.locator('link[rel="canonical"]').getAttribute('href'),
      h1: await page.locator('h1').count(),
      main: await page.locator('main').count()
    });
  }

  await page.goto(base);
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  results.focus.afterNavigation = await page.getByRole('heading', { level: 1 }).evaluate((element) => element === document.activeElement);
  await page.goBack();
  results.focus.afterBack = await page.getByRole('heading', { level: 1 }).evaluate((element) => element === document.activeElement);

  const missingResponse = await page.goto(`${base}/missing-polish-1-check`, { waitUntil: 'networkidle' });
  results.missing = {
    status: missingResponse?.status(),
    title: await page.title(),
    h1: await page.locator('h1').count(),
    passbookLink: await page.getByRole('link', { name: 'Passbook', exact: true }).isVisible(),
    factory: await page.getByText(/Built by Param Factory · v1.0.3/).isVisible(),
    manifest: await page.locator('link[rel="manifest"]').count(),
    appleTouch: await page.locator('link[rel="apple-touch-icon"]').count()
  };
  await page.screenshot({ path: `${output}/live-404-mobile.png`, fullPage: true });
  await context.close();

  const isolationContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const isolationPage = await isolationContext.newPage();
  await isolationPage.goto(`${base}/app`);
  await isolationPage.getByRole('button', { name: 'Add an asset' }).click();
  await isolationPage.getByLabel('Area').fill('Basement');
  await isolationPage.getByLabel('Asset name').fill('Boiler');
  await isolationPage.getByRole('button', { name: 'Save asset' }).click();
  await isolationPage.getByRole('button', { name: 'Close dialog' }).click();
  await isolationPage.goto(base);
  await isolationPage.getByRole('link', { name: 'Try it with sample data' }).click();
  await isolationPage.getByRole('button', { name: 'Reset demo' }).click();
  await isolationPage.getByRole('button', { name: 'Start for real' }).click();
  await isolationPage.getByRole('button', { name: 'Assets' }).click();
  await isolationPage.getByRole('heading', { name: 'Boiler' }).waitFor();
  results.isolation = {
    realBoilerSurvives: await isolationPage.getByRole('heading', { name: 'Boiler' }).isVisible(),
    sampleFurnaceAbsent: await isolationPage.getByRole('heading', { name: 'Furnace' }).count() === 0
  };
  await isolationContext.close();

  for (const width of [390, 1280]) {
    for (const colorScheme of ['light', 'dark']) {
      const axeContext = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, colorScheme });
      const axePage = await axeContext.newPage();
      for (const path of ['/', '/?demo=1', '/privacy', '/terms', '/missing-polish-1-axe']) {
        await axePage.goto(`${base}${path}`, { waitUntil: 'networkidle' });
        const scan = await new AxeBuilder({ page: axePage }).analyze();
        results.accessibility.push({ width, colorScheme, path, seriousCritical: scan.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).length });
      }
      await axeContext.close();
    }
  }

  results.errors = results.errors.filter((message) => !/Failed to load resource: the server responded with a status of 404/.test(message));
  await writeFile(`${output}/live-check.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  const failed = results.errors.length || results.cold.sampleHref !== '/?demo=1' || results.cold.sampleBottom > 844 || results.cold.overflow !== 0 || !results.demo.banner || !results.demo.reset || !results.demo.startReal || results.demo.jobs !== 3 || results.demo.resetJobs !== 3 || results.calendar.events !== 3 || !results.offline || !results.isolation.realBoilerSurvives || !results.isolation.sampleFurnaceAbsent || !results.focus.afterNavigation || !results.focus.afterBack || results.privacy.externalRequests.length || results.routes.some((route) => !route.titleMatches || !route.descriptionMatches || !route.openGraphMatches || !route.twitterMatches || route.h1 !== 1 || route.main !== 1) || results.missing.status !== 404 || !results.missing.passbookLink || !results.missing.factory || !results.missing.manifest || !results.missing.appleTouch || results.accessibility.some((scan) => scan.seriousCritical);
  if (failed) process.exitCode = 1;
} finally {
  await browser.close();
}
