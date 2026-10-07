import type { APIRoute } from 'astro';
import { FEATURES, HOME_FAQ } from '../data/content';
import { CONTACT_EMAIL, PAGES, SITE, absoluteUrl } from '../data/site';

// https://llmstxt.org biçimi: başlık, kısa özet (blockquote), ayrıntılar ve bağlantı listesi.
export const GET: APIRoute = () => {
  const pages = PAGES.map((page) => `- [${page.title}](${absoluteUrl(page.path)}): ${page.summary}`).join('\n');
  const features = FEATURES.map((feature) => `- **${feature.title}:** ${feature.text}`).join('\n');
  const faq = HOME_FAQ.map((item) => `### ${item.question}\n\n${item.answer}`).join('\n\n');

  const body = `# ${SITE.name}

> ${SITE.description} Uygulama Türkçedir, 18 yaş ve üzeri kullanıcılar içindir ve henüz uygulama mağazalarında yayında değildir (App Store ve Google Play'e yakında gelecek).

- Web sitesi: ${SITE.url}
- İletişim: ${CONTACT_EMAIL}

## Sayfalar

${pages}

## Özellikler

${features}

## Sık sorulan sorular

${faq}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
