// Gizlilik Politikası ve Kullanım Şartları için tek kaynak, uygulama reposundaki
// src/constants/legal.ts dosyasıdır. Bu script o dosyayı hiç değiştirmeden
// src/data/legal.ts'e kopyalar (yalnızca başına "otomatik üretildi" notu ekler).
//
//   npm run sync:legal   → kopyala
//   npm run check:legal  → fark varsa hata ver (npm run build de bunu çalıştırır)
//
// Uygulama reposu varsayılan olarak ../gelsene konumunda aranır; farklıysa
// GELSENE_APP_DIR ortam değişkeniyle yolunu ver. Repo bulunamazsa (ör. Cloudflare
// Pages build ortamı) kontrol atlanır ve commit'lenmiş kopya kullanılır.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const appDir = resolve(root, process.env.GELSENE_APP_DIR ?? '../gelsene');
const source = resolve(appDir, 'src/constants/legal.ts');
const target = resolve(root, 'src/data/legal.ts');
const checkOnly = process.argv.includes('--check');

const HEADER = [
  '// ⚠️ BU DOSYA OTOMATİK ÜRETİLİR — ELLE DÜZENLEME.',
  '// Kaynak: gelsene (uygulama) reposu → src/constants/legal.ts',
  '// Güncellemek için: önce uygulamadaki legal.ts dosyasını değiştir, sonra `npm run sync:legal`.',
  '',
  '',
].join('\n');

const normalize = (text) => text.replace(/\r\n/g, '\n');

if (!existsSync(source)) {
  const message = `Uygulama reposu bulunamadı (${source}).`;
  if (checkOnly) {
    console.log(`[legal] ${message} Kontrol atlandı, commit'lenmiş src/data/legal.ts kullanılıyor.`);
    process.exit(0);
  }
  console.error(`[legal] ${message} GELSENE_APP_DIR ile yolunu belirt.`);
  process.exit(1);
}

const expected = HEADER + normalize(readFileSync(source, 'utf8'));
const current = existsSync(target) ? normalize(readFileSync(target, 'utf8')) : null;

if (checkOnly) {
  if (current !== expected) {
    console.error('[legal] src/data/legal.ts uygulamadaki legal.ts ile aynı değil. `npm run sync:legal` çalıştır.');
    process.exit(1);
  }
  console.log('[legal] Yasal metinler uygulamayla senkron ✓');
  process.exit(0);
}

if (current === expected) {
  console.log('[legal] Zaten güncel, değişiklik yok.');
} else {
  writeFileSync(target, expected, 'utf8');
  console.log(`[legal] ${source} → src/data/legal.ts kopyalandı ✓`);
}
