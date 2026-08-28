import { copyFile, mkdir } from 'node:fs/promises';

const routes = ['app', 'demo', 'history', 'backup', 'privacy', 'terms'];
await Promise.all(routes.map(async (route) => {
  await mkdir(`dist/${route}`, { recursive: true });
  await copyFile('dist/index.html', `dist/${route}/index.html`);
}));
