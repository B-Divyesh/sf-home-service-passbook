import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const base = 'https://home-service-passbook.sociobot.in';
const output = '.factory/polish-2-evidence/live-review.json';
const routes = [
  ['/', 'Home Service Passbook — Track home maintenance'],
  ['/demo', 'Demo — Home Service Passbook'],
  ['/app', 'Your passbook — Home Service Passbook'],
  ['/history', 'Service history — Home Service Passbook'],
  ['/backup', 'Backup — Home Service Passbook'],
  ['/privacy', 'Privacy — Home Service Passbook'],
  ['/terms', 'Terms — Home Service Passbook']
];
const forbidden = ['Household ledger', 'Wrong panel', 'HOME / 01', 'Original generated artwork.'];
const results = { bundle: '', forbidden, absentFromBundle: false, firstScreen: {}, demo: {}, app: {}, routes: [], missing: {} };

await mkdir('.factory/polish-2-evidence', { recursive: true });
const landing = await fetch(`${base}/`, { cache: 'no-store' });
const html = await landing.text();
const asset = html.match(/assets\/index-[\w-]+\.js/)?.[0];
if (!asset) throw new Error('No application bundle found');
const bundle = await (await fetch(`${base}/${asset}`, { cache: 'no-store' })).text();
results.bundle = asset;
results.absentFromBundle = forbidden.every((text) => !bundle.includes(text));

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  const action = page.getByRole('link', { name: 'Try it with sample data' });
  results.firstScreen = {
    status: landing.status,
    heading: await page.getByRole('heading', { level: 1 }).textContent(),
    demoHref: await action.getAttribute('href'),
    serviceRecord: await page.getByText('Service record').count(),
    footerHasProvenanceClaim: await page.getByText('Original generated artwork.').count()
  };
  await action.click();
  await page.waitForURL(`${base}/?demo=1`);
  results.demo = {
    banner: await page.locator('.demo-banner').isVisible() && (await page.locator('.demo-banner').textContent())?.includes('sample data, nothing is saved to your passbook.') === true,
    reset: await page.getByRole('button', { name: 'Reset demo' }).isVisible(),
    startForReal: await page.getByRole('button', { name: 'Start for real' }).isVisible(),
    sampleJob: await page.getByRole('heading', { name: 'Replace air filter' }).isVisible()
  };
  await page.getByRole('button', { name: 'Start for real' }).click();
  results.app = {
    passbookEyebrow: await page.locator('.app-head .eyebrow').textContent(),
    householdLedgerCount: await page.getByText('Household ledger').count()
  };
  for (const [path, title] of routes) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    results.routes.push({
      path,
      titleMatches: await page.title() === title,
      canonical: await page.locator('link[rel="canonical"]').getAttribute('href'),
      oneH1: await page.locator('h1').count() === 1,
      oneMain: await page.locator('main').count() === 1,
      metadata: Boolean(await page.locator('meta[name="description"]').getAttribute('content')) && Boolean(await page.locator('meta[property="og:title"]').getAttribute('content')) && Boolean(await page.locator('meta[name="twitter:title"]').getAttribute('content'))
    });
  }
  const missing = await page.goto(`${base}/missing-polish-2`, { waitUntil: 'networkidle' });
  results.missing = {
    status: missing?.status(),
    eyebrow: await page.locator('.label').textContent(),
    h1: await page.getByRole('heading', { level: 1 }).textContent(),
    wrongPanelCount: await page.getByText('Wrong panel').count(),
    provenanceClaimCount: await page.getByText('Original generated artwork.').count()
  };
  await context.close();
} finally {
  await browser.close();
}

await writeFile(output, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
const failed = !results.absentFromBundle || results.firstScreen.demoHref !== '/?demo=1' || results.firstScreen.serviceRecord !== 1 || results.firstScreen.footerHasProvenanceClaim !== 0 || !results.demo.banner || !results.demo.reset || !results.demo.startForReal || !results.demo.sampleJob || results.app.passbookEyebrow !== 'Passbook' || results.app.householdLedgerCount !== 0 || results.routes.some((route) => !route.titleMatches || !route.oneH1 || !route.oneMain || !route.metadata) || results.missing.status !== 404 || results.missing.eyebrow !== 'Page not found' || results.missing.wrongPanelCount !== 0 || results.missing.provenanceClaimCount !== 0;
if (failed) process.exitCode = 1;
