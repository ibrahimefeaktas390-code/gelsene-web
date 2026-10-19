// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';

/**
 * Supabase URL'i ve anon anahtarı tek yerde, wrangler.jsonc "vars" içinde durur (Worker da oradan okur).
 * /sifre-yenile ve /e-posta-dogrula sayfalarının tarayıcı kodu bu iki değeri build'de buradan alır.
 * Yalnızca herkese açık anon/publishable anahtar kabul edilir; service_role ya da secret anahtar gelirse build durur.
 */
function readPublicSupabaseConfig() {
  const raw = readFileSync(new URL('./wrangler.jsonc', import.meta.url), 'utf8');
  // JSONC → JSON: string'lerin içindeki "//" korunarak yorumlar ve sondaki virgüller atılır.
  const json = raw
    .replace(/("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (_, string) => string ?? '')
    .replace(/,(\s*[}\]])/g, '$1');
  const { SUPABASE_URL: url, SUPABASE_ANON_KEY: key } = JSON.parse(json).vars ?? {};

  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url ?? '')) throw new Error('wrangler.jsonc: SUPABASE_URL geçersiz');
  if (!key) throw new Error('wrangler.jsonc: SUPABASE_ANON_KEY yok');
  if (key.startsWith('sb_secret_')) throw new Error('wrangler.jsonc: secret anahtar kullanılamaz');
  if (!key.startsWith('sb_publishable_')) {
    const role = JSON.parse(Buffer.from(key.split('.')[1] ?? '', 'base64url').toString() || '{}').role;
    if (role !== 'anon') throw new Error('wrangler.jsonc: SUPABASE_ANON_KEY anon rolünde değil');
  }
  return { url, key };
}

const supabase = readPublicSupabaseConfig();

export default defineConfig({
  site: 'https://gidelim.app',
  output: 'static',
  // /gizlilik → gizlilik.html: Cloudflare Pages bunu uzantısız, sonda "/" olmadan sunar.
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  vite: {
    define: {
      'import.meta.env.PUBLIC_SUPABASE_URL': JSON.stringify(supabase.url),
      'import.meta.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(supabase.key),
    },
  },
});
