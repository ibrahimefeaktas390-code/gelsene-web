import type { APIRoute } from 'astro';
import { absoluteUrl } from '../data/site';

// Arama motorları ve yapay zekâ tarayıcıları dahil herkese açık; site tamamen tanıtım amaçlı.
// /a/<id> paylaşılan aktivite sayfalarıdır (kişisel ve geçici içerik), indekslenmez; sayfalarda ayrıca noindex var.
// Adıyla anılan bir tarayıcı yalnızca kendi grubuna uyar ve "*" grubunu okumaz; bu yüzden /a/ yasağı her grupta tekrar yazılır.
const NAMED_BOTS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Bingbot'];

const group = (agent: string) => `User-agent: ${agent}\nAllow: /\nDisallow: /a/\n`;

export const GET: APIRoute = () =>
  new Response([...NAMED_BOTS.map(group), group('*'), `Sitemap: ${absoluteUrl('/sitemap.xml')}\n`].join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
