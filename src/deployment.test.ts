import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('static deployment policy', () => {
  const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));

  it('allows unknown routes to return a real 404 response', () => {
    expect(config.navigationFallback).toBeUndefined();
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  });

  it('caches built assets as immutable', () => {
    expect(config.routes).toContainEqual({
      route: '/assets/*',
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' }
    });
  });

  it('ships the standalone 404 with the full shell and social metadata', () => {
    const page = readFileSync('public/404.html', 'utf8');
    for (const required of [
      'href="/demo">Demo', 'href="/app">Passbook', 'href="/privacy">Privacy',
      'href="/terms">Terms', 'Built by Param Factory · v1.0.3',
      'property="og:title"', 'property="og:description"', 'name="twitter:title"',
      'name="twitter:description"', 'rel="apple-touch-icon"', 'rel="manifest"',
      'name="theme-color"'
    ]) expect(page).toContain(required);
  });
});
