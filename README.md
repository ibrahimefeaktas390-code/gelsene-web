# gidelim.app

Gidelim uygulamasının statik tanıtım sitesi. Astro (statik çıktı) + TypeScript; çalışma zamanında
JavaScript, çerez, takip veya analitik yok.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/ (önce yasal metin senkron kontrolü yapar)
npm run preview    # dist/ çıktısını yerelde sunar
```

## Sayfalar

| Yol                  | Kaynak                               |
| -------------------- | ------------------------------------ |
| `/`                  | `src/pages/index.astro`              |
| `/nasil-calisir`     | `src/pages/nasil-calisir.astro`      |
| `/guvenlik`          | `src/pages/guvenlik.astro`           |
| `/sss`               | `src/pages/sss.astro`                |
| `/destek`            | `src/pages/destek.astro`             |
| `/gizlilik`          | `src/pages/gizlilik.astro`           |
| `/kullanim-sartlari` | `src/pages/kullanim-sartlari.astro`  |
| `/404`               | `src/pages/404.astro`                |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | `src/pages/*.ts` |

Tanıtım metinleri ve SSS `src/data/content.ts`, site sabitleri ile her sayfanın title, description ve
sitemap `lastmod` tarihi `src/data/site.ts` (`PAGES`) içinde. Bir sayfanın metnini değiştirince
`lastmod`u da güncelle.

Mağaza ve sosyal medya linkleri `src/data/links.ts` içinde ve şimdilik boş. Bir mağaza linki girilince
"Yakında" rozeti "İndir" butonuna döner, "henüz mağazalarda değil" metinleri kalkar, ana sayfaya
`MobileApplication` JSON-LD eklenir; sosyal hesaplar `Organization.sameAs`e girer. Puan, yorum sayısı
gibi alanlar bilerek yoktur.

`npm run check:seo` (build sonrası) her sayfada tek title (≤60) ve description (≤155), canonical,
tek h1, başlık sırası, geçerli JSON-LD, görsel boyutları ve sitemap içeriğini denetler.
Sayfaya yazılan her özellik uygulamada gerçekten olmalı — yeni özellik eklerken önce uygulamada
olduğunu doğrula.

## Yasal metinler: tek kaynak

Gizlilik Politikası ve Kullanım Şartları'nın **tek kaynağı uygulama reposundaki
`gelsene/src/constants/legal.ts`** dosyasıdır. `src/data/legal.ts` onun birebir kopyasıdır
(yalnızca başına "otomatik üretildi" notu eklenir) ve **elle düzenlenmez**.

Metni, son güncelleme tarihini (`LEGAL_LAST_UPDATED`) ya da iletişim e-postasını
(`LEGAL_CONTACT_EMAIL`) değiştirmek için:

1. Uygulama reposunda `src/constants/legal.ts` dosyasını düzenle.
2. Bu repoda `npm run sync:legal` çalıştır.
3. `src/data/legal.ts` değişikliğini commit'le ve push'la.

İletişim e-postası sitenin her yerinde (yasal metinler, destek sayfası, footer, JSON-LD, llms.txt)
`LEGAL_CONTACT_EMAIL`'den okunur; başka bir yerde yazılı değildir.

`npm run build` önce `npm run check:legal` çalıştırır: uygulama reposu `../gelsene` konumunda
(veya `GELSENE_APP_DIR` ile verilen yolda) varsa ve kopya farklıysa build hata verir. Cloudflare
Pages gibi uygulama reposunun olmadığı ortamlarda kontrol atlanır ve commit'lenmiş kopya kullanılır.

## Görseller

`public/` altındaki logo, favicon ve `og-image.png` uygulamanın ikonundan
(`gelsene/assets/images/icon.png`) üretilir. Logo değişirse Windows'ta:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/make-images.ps1
```

## Paylaşılan aktivite sayfası (`/a/<aktivite-id>`)

Cloudflare Worker (`src/worker.ts`) yalnızca `/a/*` isteklerini karşılar (`wrangler.jsonc` →
`assets.run_worker_first`); diğer her şey `dist/` içinden statik servis edilir.

- Aktivite, Supabase'deki `get_public_activity` RPC'sinden **anon** anahtarla okunur. URL ve anon
  anahtar `wrangler.jsonc` → `vars` içindedir (uygulamadaki `EXPO_PUBLIC_` değerleriyle aynı,
  herkese açık değerler). `service_role` anahtarı burada asla kullanılmaz.
- HTML `src/activity-page.ts`'te üretilir; kullanıcı girdileri (başlık, açıklama, konum) her zaman
  `escapeHtml`'den geçer. Testler: `npm run test:worker`.
- Sayfalar `noindex, nofollow`, `robots.txt`'te `Disallow: /a/`; sitemap'te yer almaz.
- Yerelde denemek için: `npm run build && npx wrangler dev`

## Deploy (Cloudflare Workers)

- Build komutu: `npm run build`
- Deploy komutu: `npx wrangler deploy` (ayarlar `wrangler.jsonc`'de; Worker adı `gelsene-web`)
- `public/_headers` statik dosyalara güvenlik başlıklarını ve `/_astro/*` için uzun önbelleği
  ekler. Worker yanıtlarına uygulanmadığı için aynı başlıklar `src/worker.ts`'te de verilir.
- Bulunamayan statik yollar `dist/404.html` ile yanıtlanır (`not_found_handling: "404-page"`).
