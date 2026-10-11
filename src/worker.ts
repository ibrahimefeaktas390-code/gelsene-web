// Cloudflare Worker. wrangler.jsonc'deki run_worker_first ayarı yüzünden yalnızca /a/* istekleri
// buraya gelir; sitenin geri kalanı doğrudan statik dosyalardan (dist/) servis edilir.
// /a/<aktivite-id>: herkese açık aktivite sayfası (Supabase get_public_activity RPC'si, anon anahtar).
import {
  renderActivityPage,
  renderGonePage,
  renderUnavailablePage,
  type PublicActivity,
} from './activity-page';

interface Env {
  ASSETS: { fetch(input: Request | string): Promise<Response> };
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SUPABASE_TIMEOUT_MS = 5000;

// public/_headers Worker yanıtlarına uygulanmaz; aynı başlıklar burada verilir.
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
};

function html(body: string, status: number, cacheControl: string): Response {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': cacheControl, ...SECURITY_HEADERS },
  });
}

// Astro CSS dosyasının adı build'de hash'lenir; doğru adı statik ana sayfadan okuyup isolate
// ömrü boyunca saklarız. Böylece /a/ sayfaları sitenin global.css'ini birebir kullanır.
let stylesheetsPromise: Promise<string[]> | null = null;

function getStylesheets(env: Env, origin: string): Promise<string[]> {
  stylesheetsPromise ??= env.ASSETS.fetch(new Request(new URL('/', origin)))
    .then((response) => response.text())
    .then((page) => [...page.matchAll(/<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)"/g)].map((m) => m[1]))
    .catch(() => {
      stylesheetsPromise = null;
      return [];
    });
  return stylesheetsPromise;
}

async function notFound(env: Env, request: Request): Promise<Response> {
  const page = await env.ASSETS.fetch(new Request(new URL('/404', request.url)));
  return html(await page.text(), 404, 'public, max-age=60');
}

async function fetchActivity(env: Env, id: string): Promise<PublicActivity | null> {
  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/get_public_activity`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ p_activity_id: id }),
    signal: AbortSignal.timeout(SUPABASE_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`get_public_activity ${response.status}`);
  const rows = (await response.json()) as PublicActivity[];
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/a\/([^/]+)\/?$/);

    if (!match) return env.ASSETS.fetch(request);
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD', ...SECURITY_HEADERS } });
    }

    const id = match[1].toLowerCase();
    if (!UUID.test(id)) return notFound(env, request);

    const stylesheets = await getStylesheets(env, url.origin);

    let activity: PublicActivity | null;
    try {
      activity = await fetchActivity(env, id);
    } catch (error) {
      console.error('get_public_activity failed', id, error);
      return html(renderUnavailablePage(stylesheets), 503, 'no-store');
    }

    if (!activity) return html(renderGonePage(stylesheets), 404, 'public, max-age=60');
    return html(renderActivityPage(activity, stylesheets), 200, 'public, max-age=60');
  },
};
