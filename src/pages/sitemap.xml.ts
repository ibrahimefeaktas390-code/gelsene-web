import type { APIRoute } from 'astro';
import { PAGES, absoluteUrl } from '../data/site';

// Yalnızca indekslenecek sayfalar (PAGES). 404 ve /a/<id> aktivite sayfaları bilerek yok.
export const GET: APIRoute = () => {
  const urls = PAGES.map(({ path, lastmod }) => {
    const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${absoluteUrl(path)}</loc>${lastmodTag}\n  </url>`;
  }).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
