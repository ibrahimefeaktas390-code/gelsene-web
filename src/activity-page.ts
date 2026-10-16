// /a/<id> sayfalarının HTML'i. Worker (src/worker.ts) tarafından sunucu tarafında üretilir;
// Astro build'ine girmez. Aktivite başlığı, açıklama ve konum kullanıcı girdisidir: HTML'e
// yalnızca escapeHtml'den geçerek girer, JSON-LD ya da <script> içine hiç konmaz.
import { ACTIVITY_TYPES } from './data/content';
import { CONTACT_EMAIL, SITE } from './data/site';

/** get_public_activity RPC'sinin döndürdüğü satır (adres, organizatör, katılımcı bilgisi yok). */
export type PublicActivity = {
  id: string;
  title: string | null;
  activity_label: string | null;
  scheduled_at: string;
  duration_minutes: number | null;
  location: string | null;
  description_preview: string | null;
  group_size: number | null;
  approved_participant_count: number | null;
  spots_left: number | null;
};

const TIME_ZONE = 'Europe/Istanbul';

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function dateParts(date: Date) {
  const parts = new Intl.DateTimeFormat('tr-TR', {
    timeZone: TIME_ZONE,
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return { day: `${get('day')} ${get('month')} ${get('weekday')}`, time: `${get('hour')}:${get('minute')}` };
}

/** "16 Ekim Cuma, 16:19"; süre varsa "16 Ekim Cuma, 16:19 - 18:19" (gün değişirse bitiş günü de yazılır). */
export function formatActivityDate(scheduledAt: string, durationMinutes: number | null): string {
  const start = new Date(scheduledAt);
  if (Number.isNaN(start.getTime())) return '';
  const startParts = dateParts(start);
  const text = `${startParts.day}, ${startParts.time}`;
  if (!durationMinutes || durationMinutes <= 0) return text;
  const endParts = dateParts(new Date(start.getTime() + durationMinutes * 60_000));
  return endParts.day === startParts.day
    ? `${text} - ${endParts.time}`
    : `${text} - ${endParts.day}, ${endParts.time}`;
}

export function formatSpots(spotsLeft: number | null): string | null {
  if (spotsLeft === null || spotsLeft === undefined) return null;
  return spotsLeft <= 0 ? 'Dolu' : `${spotsLeft} yer kaldı`;
}

/** Emoji, uygulamadaki tür etiketiyle birebir eşleşirse eklenir; eşleşmezse emoji yok. */
export function activityTypeEmoji(label: string | null): string | null {
  const match = ACTIVITY_TYPES.find((type) => type.label === label?.trim());
  return match ? match.emoji : null;
}

type ShellOptions = {
  title: string;
  description: string;
  canonical?: string;
  ogImage: string;
  stylesheets: string[];
  body: string;
};

const PAGE_CSS = `
.activity-page{padding-block:40px 8px}
.activity-card{max-width:640px;margin-inline:auto}
.activity-type{display:inline-flex;align-items:center;gap:8px;background:var(--surface-2);color:var(--text);border-radius:999px;padding:4px 14px;font-weight:700;font-size:.95rem;margin:0 0 14px}
.activity-card h1{font-size:clamp(1.8rem,6vw,2.6rem);overflow-wrap:anywhere}
.activity-facts{list-style:none;margin:0 0 20px;padding:0;display:grid;gap:10px}
.activity-facts li{display:flex;gap:10px;align-items:baseline;overflow-wrap:anywhere}
.activity-facts .fact-label{flex:0 0 5.5em;color:var(--muted);font-size:.9rem;font-weight:600}
.activity-facts .fact-value{font-weight:600}
.spots-full{color:var(--brand-ink)}
.activity-desc{color:var(--muted);white-space:pre-line;overflow-wrap:anywhere;margin:0}
.join{margin-top:24px;text-align:center}
.join h2{font-size:1.3rem}
.join-links{margin:16px 0 0}
.stores{list-style:none;margin:16px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.store{display:grid;grid-template-columns:auto auto;align-items:center;column-gap:14px;min-width:200px;padding:10px 16px;border-radius:14px;border:2px dashed var(--border);background:var(--surface);text-align:left}
.store-platform{grid-column:1;font-size:.8rem;color:var(--muted);line-height:1.2}
.store-name{grid-column:1;font-weight:800;font-size:1.1rem;line-height:1.2}
.store-soon{grid-column:2;grid-row:1/span 2;justify-self:end;background:var(--surface-2);color:var(--brand-ink);font-weight:700;font-size:.85rem;padding:4px 10px;border-radius:999px}
`;

const STORE_BADGES = `<ul class="stores" aria-label="Uygulama mağazaları">
  <li class="store"><span class="store-platform">iPhone için</span><span class="store-name">App Store</span><span class="store-soon">Yakında</span></li>
  <li class="store"><span class="store-platform">Android için</span><span class="store-name">Google Play</span><span class="store-soon">Yakında</span></li>
</ul>`;

function shell({ title, description, canonical, ogImage, stylesheets, body }: ShellOptions): string {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const img = escapeHtml(ogImage);
  const canonicalTags = canonical
    ? `<link rel="canonical" href="${escapeHtml(canonical)}">\n<meta property="og:url" content="${escapeHtml(canonical)}">`
    : '';
  const links = stylesheets.map((href) => `<link rel="stylesheet" href="${escapeHtml(href)}">`).join('\n');
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t}</title>
<meta name="description" content="${d}">
<meta name="robots" content="noindex, nofollow">
${canonicalTags}
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#FFF8F3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0F1115" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:site_name" content="${escapeHtml(SITE.name)}">
<meta property="og:locale" content="${escapeHtml(SITE.locale)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${img}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escapeHtml(SITE.ogImageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${img}">
${links}
<style>${PAGE_CSS}</style>
</head>
<body>
<a class="skip-link" href="#icerik">İçeriğe geç</a>
<header class="site-header"><div class="container header-inner"><a class="brand" href="/" aria-label="Gidelim ana sayfa"><img src="/logo-192.png" alt="" width="36" height="36"><span>Gidelim</span></a><nav aria-label="Ana menü"><ul class="nav-list"><li><a href="/destek">Destek</a></li><li><a href="/gizlilik">Gizlilik</a></li><li><a href="/kullanim-sartlari">Kullanım Şartları</a></li></ul></nav></div></header>
<main id="icerik" tabindex="-1">
${body}
</main>
<footer class="site-footer"><div class="container footer-inner"><div><p class="footer-brand">Gidelim</p><p class="muted">Birlikte yapacak insan bul.</p></div><p class="muted">İletişim: <a href="mailto:${escapeHtml(CONTACT_EMAIL)}">${escapeHtml(CONTACT_EMAIL)}</a></p><p class="muted small">© ${year} Gidelim. Bu site çerez, takip ya da analitik aracı kullanmaz.</p></div></footer>
</body>
</html>`;
}

const JOIN_SECTION = `<section class="card join" aria-labelledby="join-title">
  <h2 id="join-title">Katılmak için Gidelim uygulaması gerekiyor.</h2>
  <p class="muted">Gidelim çok yakında App Store ve Google Play’de.</p>
  ${STORE_BADGES}
  <p class="join-links"><a href="/">Gidelim nedir?</a></p>
</section>`;

export function renderActivityPage(activity: PublicActivity, stylesheets: string[]): string {
  const title = activity.title?.trim() || 'Aktivite';
  const date = formatActivityDate(activity.scheduled_at, activity.duration_minutes);
  const location = activity.location?.trim() || '';
  const spots = formatSpots(activity.spots_left);
  const label = activity.activity_label?.trim() || '';
  const emoji = activityTypeEmoji(label);
  const description = activity.description_preview?.trim() || '';

  const facts = [
    date && ['Ne zaman', escapeHtml(date), ''],
    location && ['Nerede', escapeHtml(location), ''],
    spots && ['Yer', escapeHtml(spots), activity.spots_left !== null && activity.spots_left <= 0 ? ' spots-full' : ''],
  ].filter(Boolean) as [string, string, string][];

  const body = `<div class="container activity-page">
  <article class="card activity-card">
    ${label ? `<p class="activity-type">${emoji ? `<span aria-hidden="true">${escapeHtml(emoji)}</span> ` : ''}${escapeHtml(label)}</p>` : ''}
    <h1>${escapeHtml(title)}</h1>
    ${facts.length ? `<ul class="activity-facts">${facts.map(([name, value, extra]) => `<li><span class="fact-label">${name}</span><span class="fact-value${extra}">${value}</span></li>`).join('')}</ul>` : ''}
    ${description ? `<p class="activity-desc">${escapeHtml(description)}</p>` : ''}
  </article>
  <div class="activity-card">${JOIN_SECTION}</div>
</div>`;

  return shell({
    title: `${title} | Gidelim`,
    description: [date, location, spots].filter(Boolean).join(' · '),
    canonical: `${SITE.url}/a/${activity.id}`,
    ogImage: new URL(SITE.ogImage, SITE.url).href,
    stylesheets,
    body,
  });
}

export function renderGonePage(stylesheets: string[]): string {
  const body = `<div class="container activity-page">
  <section class="card activity-card" aria-labelledby="gone-title">
    <h1 id="gone-title">Bu aktivite artık yok ya da sona erdi</h1>
    <p class="muted">Paylaşılan aktivite iptal edilmiş, tarihi geçmiş ya da artık herkese açık değil.</p>
    <p>${escapeHtml(SITE.description)} Yürüyüş, halı saha, kahve ya da kitap kulübü: aktivite aç veya birine katıl, tanış, birlikte vakit geçir.</p>
  </section>
  <div class="activity-card">${JOIN_SECTION}</div>
</div>`;

  return shell({
    title: 'Aktivite bulunamadı | Gidelim',
    description: 'Bu aktivite artık yok ya da sona erdi.',
    ogImage: new URL(SITE.ogImage, SITE.url).href,
    stylesheets,
    body,
  });
}

export function renderUnavailablePage(stylesheets: string[]): string {
  const body = `<div class="container activity-page">
  <section class="card activity-card" aria-labelledby="error-title">
    <h1 id="error-title">Aktivite şu an yüklenemedi</h1>
    <p class="muted">Bir sorun oluştu. Birkaç dakika sonra sayfayı yenilemeyi dene.</p>
    <p><a href="/">Ana sayfaya dön</a></p>
  </section>
</div>`;

  return shell({
    title: 'Aktivite yüklenemedi | Gidelim',
    description: 'Aktivite şu an yüklenemedi.',
    ogImage: new URL(SITE.ogImage, SITE.url).href,
    stylesheets,
    body,
  });
}
