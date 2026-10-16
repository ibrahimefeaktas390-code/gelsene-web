// dist/ içindeki her HTML sayfasının temel SEO kurallarını denetler (npm run build sonrasında çalıştır):
// tek ve benzersiz <title> (≤60) ve description (≤155), canonical/noindex, lang="tr", tek h1, başlık sırası,
// geçerli JSON-LD, görsellerde width/height/alt, ayrıca sitemap'in yalnızca indekslenebilir sayfaları içermesi.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SITE = 'https://gidelim.app';
const errors = [];
const seen = { title: new Map(), description: new Map() };

const decode = (value) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

const pages = readdirSync(DIST).filter((file) => file.endsWith('.html'));
const indexable = [];

for (const file of pages) {
  const html = readFileSync(join(DIST, file), 'utf8');
  const fail = (message) => errors.push(`${file}: ${message}`);

  const titles = [...html.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => decode(m[1]));
  const descriptions = [...html.matchAll(/<meta name="description" content="([^"]*)"/g)].map((m) => decode(m[1]));
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const noindex = /<meta name="robots" content="noindex/.test(html);

  if (titles.length !== 1) fail(`${titles.length} adet <title>`);
  if (descriptions.length !== 1) fail(`${descriptions.length} adet meta description`);
  const [title = '', description = ''] = [titles[0], descriptions[0]];
  if ([...title].length > 60) fail(`title ${[...title].length} karakter: ${title}`);
  if ([...description].length > 155) fail(`description ${[...description].length} karakter`);
  for (const [key, value] of [['title', title], ['description', description]]) {
    if (seen[key].has(value)) fail(`${key} ${seen[key].get(value)} ile aynı`);
    seen[key].set(value, file);
  }

  if (!/<html lang="tr"/.test(html)) fail('html lang="tr" değil');
  if (noindex && canonical) fail('noindex sayfada canonical var');
  if (!noindex) {
    if (!canonical) fail('canonical yok');
    else if (!canonical.startsWith(SITE) || (canonical !== `${SITE}/` && canonical.endsWith('/')))
      fail(`canonical tutarsız: ${canonical}`);
    else indexable.push(canonical);
  }
  for (const property of ['og:title', 'og:description', 'og:url', 'og:image']) {
    if (!html.includes(`property="${property}"`)) fail(`${property} yok`);
  }
  for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    if (!html.includes(`name="${name}"`)) fail(`${name} yok`);
  }

  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  if (levels.filter((level) => level === 1).length !== 1) fail(`${levels.filter((l) => l === 1).length} adet h1`);
  levels.forEach((level, index) => {
    if (index > 0 && level > levels[index - 1] + 1) fail(`başlık atlıyor: h${levels[index - 1]} → h${level}`);
  });

  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (jsonLd.length === 0) fail('JSON-LD yok');
  const types = [];
  for (const [, raw] of jsonLd) {
    try {
      for (const item of [JSON.parse(raw)].flat()) {
        if (item['@context'] !== 'https://schema.org' || !item['@type']) fail(`JSON-LD @context/@type eksik`);
        types.push(item['@type']);
      }
    } catch (error) {
      fail(`JSON-LD geçersiz: ${error.message}`);
    }
  }

  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!attr(tag, 'width') || !attr(tag, 'height')) fail(`width/height eksik: ${tag}`);
    // Astro boş alt'ı "alt" diye yazar (alt="" ile aynı, dekoratif görsel).
    if (!/\salt(=|\s|>)/.test(tag)) fail(`alt eksik: ${tag}`);
  }

  console.log(`${file.padEnd(24)} ${noindex ? 'noindex' : canonical}\n  ${title} (${[...title].length})\n  ${description} (${[...description].length})\n  JSON-LD: ${types.join(', ')}`);
}

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
const lastmods = [...sitemap.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((m) => m[1]);
if (lastmods.length !== locs.length) errors.push(`sitemap: ${locs.length} URL'den ${lastmods.length} tanesinde lastmod var`);
const missing = indexable.filter((url) => !locs.includes(url));
const extra = locs.filter((url) => !indexable.includes(url));
if (missing.length) errors.push(`sitemap'te eksik: ${missing.join(', ')}`);
if (extra.length) errors.push(`sitemap'te indekslenemeyen sayfa: ${extra.join(', ')}`);

if (errors.length) {
  console.error(`\n${errors.length} sorun:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exit(1);
}
console.log(`\nSEO denetimi temiz: ${pages.length} sayfa, sitemap'te ${locs.length} URL.`);
