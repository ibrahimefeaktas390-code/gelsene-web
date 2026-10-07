import type { APIRoute } from 'astro';
import { absoluteUrl } from '../data/site';

// Arama motorları ve yapay zekâ tarayıcıları dahil herkese açık; site tamamen tanıtım amaçlı.
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
