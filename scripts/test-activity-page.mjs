// /a/<id> sayfa üreticisinin birim testleri: HTML-escape, tarih biçimi, kalan yer, emoji eşleşmesi.
//   npm run test:worker
// src/activity-page.ts'i esbuild ile paketleyip (Astro'nun bağımlılığı olarak zaten kurulu) çağırır.
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result = await build({
  entryPoints: ['src/activity-page.ts'],
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  write: false,
});
const page = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`✓ ${name}`);
};

test('escapeHtml beş karakteri kaçırır', () => {
  assert.equal(page.escapeHtml(`<a href="x" onclick='y'>&</a>`), '&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;');
});

const evil = {
  id: '11111111-2222-4333-8444-555555555555',
  title: '<script>alert("başlık")</script>',
  activity_label: 'Konser',
  scheduled_at: '2026-10-16T13:19:00Z',
  duration_minutes: 120,
  location: `"><img src=x onerror=alert(1)>`,
  description_preview: `</p><script>alert('açıklama')</script>`,
  group_size: 5,
  approved_participant_count: 2,
  spots_left: 3,
};

test('kullanıcı girdisi sayfada çalıştırılabilir HTML olarak yer almaz', () => {
  const html = page.renderActivityPage(evil, ['/_astro/x.css']);
  assert.ok(!html.includes('<script'), '<script> etiketi kalmamalı');
  assert.ok(!html.includes('<img src=x'), 'enjekte edilen <img> kalmamalı');
  assert.ok(!html.includes('onerror=alert(1)>'), 'öznitelikten kaçış olmamalı');
  assert.ok(html.includes('<title>&lt;script&gt;alert(&quot;başlık&quot;)&lt;/script&gt; | Gidelim</title>'));
  assert.ok(html.includes('<meta property="og:title" content="&lt;script&gt;alert(&quot;başlık&quot;)&lt;/script&gt; | Gidelim">'));
  assert.ok(html.includes('&lt;/p&gt;&lt;script&gt;alert(&#39;açıklama&#39;)&lt;/script&gt;'));
  assert.ok(html.includes('&quot;&gt;&lt;img src=x onerror=alert(1)&gt;'));
});

test('tarih Europe/Istanbul saatiyle, Türkçe ve süreli aralık', () => {
  assert.equal(page.formatActivityDate('2026-10-16T13:19:00Z', null), '16 Ekim Cuma, 16:19');
  assert.equal(page.formatActivityDate('2026-10-16T13:19:00Z', 120), '16 Ekim Cuma, 16:19 - 18:19');
  assert.equal(page.formatActivityDate('2026-10-16T19:00:00Z', 180), '16 Ekim Cuma, 22:00 - 17 Ekim Cumartesi, 01:00');
});

test('kalan yer metni', () => {
  assert.equal(page.formatSpots(3), '3 yer kaldı');
  assert.equal(page.formatSpots(0), 'Dolu');
  assert.equal(page.formatSpots(null), null);
});

test('emoji yalnızca etiket birebir eşleşirse', () => {
  assert.equal(page.activityTypeEmoji('Konser'), '🎤');
  assert.equal(page.activityTypeEmoji('Bilinmeyen tür'), null);
  assert.equal(page.activityTypeEmoji(null), null);
});

test('meta: robots noindex, canonical, og:description, og:image', () => {
  const html = page.renderActivityPage(evil, []);
  assert.ok(html.includes('<meta name="robots" content="noindex, nofollow">'));
  assert.ok(html.includes(`<link rel="canonical" href="https://gidelim.app/a/${evil.id}">`));
  assert.ok(html.includes('<meta property="og:image" content="https://gidelim.app/og-image.png">'));
  assert.ok(html.includes('<meta name="twitter:card" content="summary_large_image">'));
  assert.ok(html.includes('content="16 Ekim Cuma, 16:19 - 18:19 · &quot;&gt;&lt;img src=x onerror=alert(1)&gt; · 3 yer kaldı"'));
  assert.ok(!html.includes('application/ld+json'), 'aktivite sayfasında JSON-LD olmamalı');
});

console.log(`\n${passed} test geçti.`);
