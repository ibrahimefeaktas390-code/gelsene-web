// /sifre-yenile ve /e-posta-dogrula sayfalarının ortak tarayıcı kodu.
// Güvenlik notları:
// - Yalnızca herkese açık anon anahtar kullanılır (build'de wrangler.jsonc'tan gelir, bkz. astro.config.mjs).
// - Oturum yalnızca bellekte tutulur (localStorage'a yazılmaz) ve URL'den otomatik okunmaz.
// - token_hash hiçbir yerde loglanmaz; sayfa açılır açılmaz adres çubuğundan silinir.
// - verifyOtp sayfa yüklenince değil, kullanıcı butona basınca çağrılır: e-posta tarayıcıları linki önceden
//   ziyaret ederse tek kullanımlık token yanmaz.
import { createClient, isAuthError } from '@supabase/supabase-js';

export const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

/** URL'deki token_hash ve type'ı okur, ardından adresi parametresiz hale getirir. */
export function takeTokenFromUrl(): { tokenHash: string | null; type: string | null } {
  const params = new URLSearchParams(window.location.search);
  const tokenHash = params.get('token_hash');
  const type = params.get('type');
  if (window.location.search || window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname);
  }
  return { tokenHash: tokenHash && /^[A-Za-z0-9_-]{8,256}$/.test(tokenHash) ? tokenHash : null, type };
}

export type AuthStep = 'verify' | 'update';

/** Supabase hatasını kullanıcıya gösterilecek Türkçe metne çevirir; ham hata metni asla gösterilmez. */
export function authErrorMessage(error: unknown, step: AuthStep, linkHint: string): string {
  const code = isAuthError(error) ? error.code : undefined;
  const status = isAuthError(error) ? error.status : undefined;

  if (!isAuthError(error) || status === 0 || error.name === 'AuthRetryableFetchError') {
    return 'Sunucuya bağlanılamadı. İnternet bağlantını kontrol edip tekrar dene.';
  }
  if (code === 'over_request_rate_limit' || code === 'over_email_send_rate_limit' || status === 429) {
    return 'Çok fazla deneme yapıldı. Birkaç dakika bekleyip tekrar dene.';
  }
  if (step === 'update') {
    if (code === 'same_password') return 'Yeni şifren eski şifrenden farklı olmalı.';
    if (code === 'weak_password') return 'Bu şifre yeterince güçlü değil. Daha uzun ya da farklı bir şifre dene.';
    if (code === 'session_not_found' || code === 'session_expired' || status === 401 || status === 403) {
      return `Oturumun sona erdi. ${linkHint}`;
    }
    return 'Şifren güncellenemedi. Lütfen tekrar dene.';
  }
  // verify: geçersiz, kullanılmış ya da süresi dolmuş bağlantı
  return `Bu bağlantı geçersiz, daha önce kullanılmış ya da süresi dolmuş. ${linkHint}`;
}

export function show(element: HTMLElement | null, visible = true) {
  if (element) element.hidden = !visible;
}

export function setMessage(element: HTMLElement | null, text: string) {
  if (element) element.textContent = text;
}
