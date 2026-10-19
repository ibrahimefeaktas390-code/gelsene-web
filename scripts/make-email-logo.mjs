// E-posta şablonları (Supabase Auth) için logo: public/email/logo.png, 192x192, düz beyaz zemin, < 20 KB.
// Kaynak public/logo-512.png (uygulamanın icon.png'sinden scripts/make-images.ps1 ile üretilir).
// sharp, Astro'nun görsel işleme bağımlılığı olarak zaten kurulu; ayrı bir paket gerekmez.
// Çalıştır: node scripts/make-email-logo.mjs
import { mkdirSync, statSync } from 'node:fs';
import sharp from 'sharp';

const source = new URL('../public/logo-512.png', import.meta.url);
const target = new URL('../public/email/logo.png', import.meta.url);
const MAX_BYTES = 20 * 1024;

mkdirSync(new URL('./', target), { recursive: true });

await sharp(source.pathname.replace(/^\/([A-Za-z]:)/, '$1'))
  .resize(192, 192, { kernel: 'lanczos3' })
  // E-posta istemcilerinde şeffaflık tutarsız; koyu temada da okunsun diye düz beyaz zemin, alfa yok.
  .flatten({ background: '#ffffff' })
  .removeAlpha()
  .png({ palette: true, colours: 128, compressionLevel: 9, effort: 10 })
  .toFile(target.pathname.replace(/^\/([A-Za-z]:)/, '$1'));

const { size } = statSync(target);
const { width, height, channels } = await sharp(target.pathname.replace(/^\/([A-Za-z]:)/, '$1')).metadata();
console.log(`public/email/logo.png: ${width}x${height}, ${channels} kanal, ${(size / 1024).toFixed(1)} KB`);
if (size >= MAX_BYTES) {
  console.error('Dosya 20 KB sınırını aşıyor.');
  process.exit(1);
}
