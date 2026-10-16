// Dış bağlantılar. Boş bırakılan alan sitede hiçbir yerde görünmez; doldurulunca ilgili buton,
// metin ve yapılandırılmış veri (JSON-LD) kendiliğinden güncellenir. Uydurma link yazma.

/** Uygulama mağazası sayfaları. Uygulama yayına çıkınca tam URL'yi yaz, ör. https://apps.apple.com/tr/app/... */
export const STORE_LINKS: { appStore: string; googlePlay: string } = {
  appStore: '',
  googlePlay: '',
};

/** Gidelim'in gerçekten var olan resmî hesapları. Organization.sameAs'e girer, footer'da ve llms.txt'te listelenir. */
export const SOCIAL_LINKS: { name: string; url: string }[] = [
  { name: 'Instagram', url: 'https://www.instagram.com/gidelim.app/' },
];

export const STORES = [
  { key: 'appStore', name: 'App Store', platform: 'iPhone için', os: 'iOS', url: STORE_LINKS.appStore, de: '’da', den: '’dan' },
  { key: 'googlePlay', name: 'Google Play', platform: 'Android için', os: 'Android', url: STORE_LINKS.googlePlay, de: '’de', den: '’den' },
] as const;

export const LIVE_STORES = STORES.filter((store) => store.url !== '');

/** En az bir mağaza linki girildiyse uygulama yayında sayılır. */
export const IS_LIVE = LIVE_STORES.length > 0;

/**
 * Yalnızca linki olan mağazaları sayan metin, son mağazanın adına uyan ekle:
 * liveStoreNames('de') → "App Store ve Google Play’de", liveStoreNames('den') → "App Store’dan".
 */
export const liveStoreNames = (suffix: 'de' | 'den') =>
  LIVE_STORES.map((store, index) => store.name + (index === LIVE_STORES.length - 1 ? store[suffix] : '')).join(' ve ');
