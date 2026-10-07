import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED } from './legal';

// İletişim e-postası ve son güncelleme tarihi uygulamadaki legal.ts'ten gelir (bkz. scripts/sync-legal.mjs);
// burada tekrar yazılmaz ki tek yerden değişsin.
export const CONTACT_EMAIL = LEGAL_CONTACT_EMAIL;
export const LEGAL_UPDATED = LEGAL_LAST_UPDATED;

export const SITE = {
  name: 'Gelsene',
  url: 'https://gelseneapp.com',
  locale: 'tr_TR',
  lang: 'tr',
  brandColor: '#FF6B35',
  ogImage: '/og-image.png',
  ogImageAlt: 'Gelsene logosu, “Yapmak istediğin aktiviteye eşlik edecek insanları bul.” sloganı ve gelseneapp.com adresi',
  tagline: 'Yapmak istediğin aktiviteye eşlik edecek insanları bul.',
  description:
    'Gelsene, ortak ilgi alanlarına sahip insanların birlikte sosyal aktiviteler oluşturup katıldığı bir sosyal aktivite eşleştirme uygulamasıdır.',
} as const;

export const NAV = [
  { href: '/', label: 'Ana sayfa' },
  { href: '/destek', label: 'Destek' },
  { href: '/gizlilik', label: 'Gizlilik' },
  { href: '/kullanim-sartlari', label: 'Kullanım Şartları' },
] as const;

/** Sitemap ve llms.txt'te listelenen indekslenebilir sayfalar. */
export const PAGES = [
  {
    path: '/',
    title: 'Gelsene — Birlikte yapacak insan bul',
    summary: 'Gelsene nedir, nasıl çalışır, öne çıkan özellikler ve sık sorulan sorular.',
  },
  {
    path: '/destek',
    title: 'Destek',
    summary: 'İletişim e-postası, sık sorulanlar, hesap silme ve kişisel veri talepleri.',
  },
  {
    path: '/gizlilik',
    title: 'Gizlilik Politikası (KVKK Aydınlatma Metni)',
    summary: 'Hangi kişisel verilerin, hangi amaçla işlendiği, kimlerle paylaşıldığı ve KVKK kapsamındaki hakların.',
  },
  {
    path: '/kullanim-sartlari',
    title: 'Kullanım Şartları',
    summary: 'Hizmetin tanımı, 18 yaş sınırı, kullanıcı sorumlulukları, moderasyon ve hesabın sonlandırılması.',
  },
] as const;

export const absoluteUrl = (path: string) => new URL(path, SITE.url).href;
