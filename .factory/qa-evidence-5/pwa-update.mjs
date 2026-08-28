import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

let phase = 0;
const root = join(process.cwd(), 'dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1');
  if (url.pathname === '/__flip') {
    phase = 1;
    response.end('updated');
    return;
  }
  try {
    if (url.pathname === '/sw.js') {
      const worker = await readFile(join(root, 'sw.js'), 'utf8');
      response.setHeader('content-type', 'text/javascript');
      response.setHeader('cache-control', 'no-store');
      response.end(`${worker}\n// verifier phase ${phase}\n`);
      return;
    }
    let path = join(root, url.pathname.replace(/^\//, ''));
    if (url.pathname === '/' || !extname(url.pathname)) path = join(root, 'index.html');
    response.setHeader('content-type', types[extname(path)] || 'application/octet-stream');
    response.end(await readFile(path));
  } catch {
    response.statusCode = 404;
    response.end('not found');
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const origin = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(`${origin}/demo`);
await page.evaluate(async () => {
  await navigator.serviceWorker.ready;
  if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
});
await page.evaluate(() => fetch('/__flip'));
await page.evaluate(async () => { const registration = await navigator.serviceWorker.getRegistration(); await registration.update(); });
await page.getByText('An update is ready. Reload to use it.').waitFor();
const result = {
  initialWorkerChanged: phase === 1,
  toast: await page.getByText('An update is ready. Reload to use it.').innerText(),
  controller: await page.evaluate(() => navigator.serviceWorker.controller?.scriptURL),
  caches: await page.evaluate(() => caches.keys()),
  errors
};
await writeFile('.factory/qa-evidence-5/pwa-update.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
await new Promise((resolve) => server.close(resolve));
