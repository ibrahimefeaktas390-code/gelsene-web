# gelseneapp.com

Gelsene uygulamasının statik tanıtım sitesi. Astro (statik çıktı) + TypeScript; çalışma zamanında
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
| `/destek`            | `src/pages/destek.astro`             |
| `/gizlilik`          | `src/pages/gizlilik.astro`           |
| `/kullanim-sartlari` | `src/pages/kullanim-sartlari.astro`  |
| `/404`               | `src/pages/404.astro`                |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | `src/pages/*.ts` |

Tanıtım metinleri `src/data/content.ts`, site sabitleri `src/data/site.ts` içinde.
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

## Deploy (Cloudflare Pages)

- Build komutu: `npm run build`
- Çıktı klasörü: `dist`
- `public/_headers` güvenlik başlıklarını ve `/_astro/*` için uzun önbelleği tanımlar.
- `dist/404.html` Cloudflare Pages tarafından otomatik olarak 404 sayfası kullanılır.
