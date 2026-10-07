import type { APIRoute } from 'astro';
import { trDateToIso } from '../data/dates';
import { LEGAL_UPDATED, PAGES, absoluteUrl } from '../data/site';

const LEGAL_PATHS = new Set(['/gizlilik', '/kullanim-sartlari']);

export const GET: APIRoute = () => {
  const legalLastmod = trDateToIso(LEGAL_UPDATED);
  const urls = PAGES.map(({ path }) => {
    const lastmod = LEGAL_PATHS.has(path) && legalLastmod ? `\n    <lastmod>${legalLastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${absoluteUrl(path)}</loc>${lastmod}\n  </url>`;
  }).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
