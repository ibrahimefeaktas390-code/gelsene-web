import type { APIRoute } from 'astro';
import { absoluteUrl } from '../data/site';

// Arama motorları ve yapay zekâ tarayıcıları dahil herkese açık; site tamamen tanıtım amaçlı.
// İndekslenmeyenler (sayfalarda ayrıca noindex var):
// - /a/<id>: paylaşılan aktivite sayfaları (kişisel ve geçici içerik)
// - /sifre-yenile, /e-posta-dogrula: e-postadaki tek kullanımlık bağlantıların açtığı sayfalar
// Adıyla anılan bir tarayıcı yalnızca kendi grubuna uyar ve "*" grubunu okumaz; bu yüzden yasaklar her grupta tekrar yazılır.
const NAMED_BOTS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Bingbot'];
const DISALLOW = ['/a/', '/sifre-yenile', '/e-posta-dogrula'];

const group = (agent: string) =>
  `User-agent: ${agent}\nAllow: /\n${DISALLOW.map((path) => `Disallow: ${path}\n`).join('')}`;

export const GET: APIRoute = () =>
  new Response([...NAMED_BOTS.map(group), group('*'), `Sitemap: ${absoluteUrl('/sitemap.xml')}\n`].join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
