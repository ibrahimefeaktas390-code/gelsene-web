import type { APIRoute } from 'astro';
import { ALL_FAQ, FEATURES } from '../data/content';
import { IS_LIVE, LIVE_STORES, SOCIAL_LINKS } from '../data/links';
import { CONTACT_EMAIL, PAGES, SITE, absoluteUrl } from '../data/site';

// https://llmstxt.org biçimi: başlık, kısa özet (blockquote), ayrıntılar ve bağlantı listesi.
export const GET: APIRoute = () => {
  const availability = IS_LIVE
    ? `Uygulama ${LIVE_STORES.map((store) => store.name).join(' ve ')} üzerinden ücretsiz indirilebilir.`
    : "Uygulama henüz uygulama mağazalarında yayında değildir (App Store ve Google Play'e yakında gelecek).";
  const pages = PAGES.map((page) => `- [${page.title}](${absoluteUrl(page.path)}): ${page.summary}`).join('\n');
  const features = FEATURES.map((feature) => `- **${feature.title}:** ${feature.text}`).join('\n');
  const faq = ALL_FAQ.map((item) => `### ${item.question}\n\n${item.answer}`).join('\n\n');
  const links = [
    `- Web sitesi: ${SITE.url}`,
    `- İletişim: ${CONTACT_EMAIL}`,
    ...LIVE_STORES.map((store) => `- ${store.name}: ${store.url}`),
    ...SOCIAL_LINKS.map((social) => `- ${social.name}: ${social.url}`),
  ].join('\n');

  const body = `# ${SITE.name}

> ${SITE.description} Kullanıcılar yürüyüş, halı saha, kahve, kitap kulübü gibi bir aktivite açar ya da başkasının aktivitesine katılım isteği gönderir; onaylanınca aktivitenin grup sohbetinde tanışıp buluşurlar.

Gidelim Türkçe bir mobil uygulamadır, 18 yaşını doldurmuş kişilere açıktır. İstanbul'dan başlıyor ama şehir sınırı yoktur; aktivitenin konumunu onu açan kişi belirler. Uygulamada abonelik ya da uygulama içi satın alma yoktur. ${availability}

${links}

## Sayfalar

${pages}

## Özellikler

${features}

## Sık sorulan sorular

${faq}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
