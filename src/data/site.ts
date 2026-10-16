import { trDateToIso } from './dates';
import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED } from './legal';

// İletişim e-postası ve son güncelleme tarihi uygulamadaki legal.ts'ten gelir (bkz. scripts/sync-legal.mjs);
// burada tekrar yazılmaz ki tek yerden değişsin.
export const CONTACT_EMAIL = LEGAL_CONTACT_EMAIL;
export const LEGAL_UPDATED = LEGAL_LAST_UPDATED;

export const SITE = {
  name: 'Gidelim',
  url: 'https://gidelim.app',
  locale: 'tr_TR',
  lang: 'tr',
  brandColor: '#FF6B35',
  ogImage: '/og-image.png',
  ogImageAlt: 'Gidelim logosu, “Yapmak istediğin aktiviteye eşlik edecek insanları bul.” sloganı ve gidelim.app adresi',
  tagline: 'Yapmak istediğin aktiviteye eşlik edecek insanları bul.',
  description:
    'Gidelim, yalnız yapmak istemediğin şeyler için birlikte yapacak insan bulmanı sağlayan ücretsiz bir aktivite uygulamasıdır.',
} as const;

export const HEADER_NAV = [
  { href: '/nasil-calisir', label: 'Nasıl çalışır?' },
  { href: '/guvenlik', label: 'Güvenlik' },
  { href: '/sss', label: 'SSS' },
  { href: '/destek', label: 'Destek' },
] as const;

export const FOOTER_NAV = [
  { href: '/', label: 'Ana sayfa' },
  { href: '/nasil-calisir', label: 'Nasıl çalışır?' },
  { href: '/guvenlik', label: 'Güvenlik' },
  { href: '/sss', label: 'Sık sorulan sorular' },
  { href: '/destek', label: 'Destek' },
  { href: '/gizlilik', label: 'Gizlilik' },
  { href: '/kullanim-sartlari', label: 'Kullanım Şartları' },
] as const;

const legalLastmod = trDateToIso(LEGAL_UPDATED) ?? '';

/**
 * İndekslenebilir sayfalar: <title> (≤60 karakter), meta description (≤155), sitemap lastmod'u ve
 * llms.txt özeti tek yerde. Bir sayfanın metnini değiştirince lastmod'u da o günün tarihi yap.
 */
export const PAGES = [
  {
    path: '/',
    title: 'Gidelim | Birlikte yapacak insan bulma uygulaması',
    description:
      'Gidelim; yürüyüş, halı saha, kahve ya da kitap kulübü için birlikte yapacak insan bulmanı sağlayan ücretsiz bir uygulama. Aktivite aç ya da birine katıl.',
    summary: 'Gidelim nedir, kimler için, nasıl çalışır, öne çıkan özellikler ve kısa sık sorulan sorular.',
    lastmod: '2026-10-16',
  },
  {
    path: '/nasil-calisir',
    title: 'Nasıl çalışır? Aktivite aç, katıl, buluş | Gidelim',
    description:
      'Gidelim’de profil oluşturmak, Keşfet’te aktivite bulmak, kendi aktiviteni açmak, katılım isteği, grup sohbeti ve hatırlatmalar adım adım.',
    summary: 'Profil oluşturma, aktivite arama ve açma, katılım onayı, grup sohbeti, hatırlatmalar ve aktivite paylaşma adım adım.',
    lastmod: '2026-10-16',
  },
  {
    path: '/guvenlik',
    title: 'Güvenlik ve hesap doğrulama | Gidelim',
    description:
      'Gidelim’de selfie ile hesap doğrulama, engelleme ve şikâyet, 18 yaş sınırı, paylaşılan linkte gizlenen bilgiler ve güvenli buluşma önerileri.',
    summary: 'Selfie ile hesap doğrulama, engelleme ve şikâyet, moderasyon, 18 yaş sınırı, gizlilik ayarları ve güvenli buluşma önerileri.',
    lastmod: '2026-10-16',
  },
  {
    path: '/sss',
    title: 'Sık sorulan sorular | Gidelim',
    description:
      'Gidelim ücretsiz mi, kimler katılabilir, hangi şehirlerde kullanılır, güvenli mi, nasıl şikâyet edilir, hesap nasıl silinir? Tüm yanıtlar burada.',
    summary: 'Ücret, yaş sınırı, şehirler, güvenlik, şikâyet, hesap silme, bildirimler ve diğer sık sorulan soruların yanıtları.',
    lastmod: '2026-10-16',
  },
  {
    path: '/destek',
    title: 'Destek ve iletişim | Gidelim',
    description: `Gidelim destek: ${CONTACT_EMAIL} adresinden bize ulaş, hesabını nasıl sileceğini ve KVKK kapsamında veri talebini nasıl ileteceğini öğren.`,
    summary: 'İletişim e-postası, hesap silme adımları ve KVKK kapsamındaki kişisel veri talepleri.',
    lastmod: '2026-10-16',
  },
  {
    path: '/gizlilik',
    title: 'Gizlilik Politikası (KVKK Aydınlatma Metni) | Gidelim',
    description:
      'Gidelim’de hangi kişisel verilerin hangi amaçla işlendiği, kimlerle paylaşıldığı, ne kadar saklandığı ve KVKK 11. madde kapsamındaki hakların.',
    summary: 'Hangi kişisel verilerin, hangi amaçla işlendiği, kimlerle paylaşıldığı ve KVKK kapsamındaki hakların.',
    lastmod: legalLastmod,
  },
  {
    path: '/kullanim-sartlari',
    title: 'Kullanım Şartları | Gidelim',
    description:
      'Gidelim Kullanım Şartları: hizmetin tanımı, 18 yaş sınırı, hesap ve kimlik doğrulama, yasaklı davranışlar, içerik moderasyonu ve hesabın sonlandırılması.',
    summary: 'Hizmetin tanımı, 18 yaş sınırı, kullanıcı sorumlulukları, moderasyon ve hesabın sonlandırılması.',
    lastmod: legalLastmod,
  },
] as const;

export type PagePath = (typeof PAGES)[number]['path'];

export const getPage = (path: PagePath) => PAGES.find((page) => page.path === path)!;

export const absoluteUrl = (path: string) => new URL(path, SITE.url).href;
