// Sitedeki tanıtım metinleri. Buradaki her özellik uygulama reposunda gerçekten var olan bir
// ekrana/özelliğe karşılık gelir; yeni bir şey eklerken önce uygulamada olduğundan emin ol.
import { CONTACT_EMAIL } from './site';

export type Faq = { question: string; answer: string };

export const STEPS = [
  {
    title: 'Profilini oluştur',
    text: 'İlgi alanlarını, müsait olduğun zamanları, nasıl bir grup ve tempo sevdiğini seç. İlgi alanın, tercih ettiğin grup büyüklüğü ve tempo, Keşfet\'te sana uygun aktiviteleri öne çıkarır.',
  },
  {
    title: 'Aktivite bul ya da kendin aç',
    text: 'Keşfet\'te aktivite türüne, tarihe ve konum adına göre arayabilirsin. Aradığını bulamazsan birkaç dokunuşla kendi aktiviteni aç: ne zaman, nerede, kaç kişi, kimlerle.',
  },
  {
    title: 'Katıl, sohbet et, buluş',
    text: 'Katılım isteğini gönder; organizatör onaylayınca aktivitenin grup sohbetine katılırsın. Aktiviteden 24 saat ve 2 saat önce hatırlatma bildirimi gelir.',
  },
] as const;

export const FEATURES = [
  {
    icon: 'sparkles',
    title: 'Sana uygun öneriler',
    text: 'Keşfet\'te aktiviteler ilgi alanına, tarihine ne kadar az kaldığına, tercih ettiğin tempo ve grup büyüklüğüne ve yaşına göre sıralanır.',
  },
  {
    icon: 'sliders',
    title: 'Ne istediğin baştan belli',
    text: 'Her aktivitede süre, kişi sayısı, yaş aralığı, ücretli mi ücretsiz mi, enerji seviyesi (sakin, orta tempo, yüksek enerji) ve katılımcı tercihi (karma, sadece kadın, sadece erkek) yazar.',
  },
  {
    icon: 'check',
    title: 'Katılımı organizatör yönetir',
    text: 'Gelen istekleri tek tek onaylayabilir ya da otomatik onayı açıp herkesin anında katılmasını sağlayabilirsin. Gerekirse katılımcı çıkarabilir veya aktiviteyi iptal edebilirsin.',
  },
  {
    icon: 'chat',
    title: 'Her aktivitenin kendi sohbeti',
    text: 'Katılımcılarla yazışır, fotoğraf ve sesli mesaj gönderirsin. Mesajlarını düzenleyebilir veya silebilir, sohbeti sessize alabilirsin.',
  },
  {
    icon: 'badge',
    title: 'Selfie ile hesap doğrulama',
    text: 'Ön kamerayla çektiğin selfie incelenir; onaylanırsa isminin yanında doğrulanmış hesap rozeti görünür. Selfie profilinde gösterilmez ve inceleme bitince silinir.',
  },
  {
    icon: 'shield',
    title: 'Engelle ve şikâyet et',
    text: 'Rahatsız olduğun bir kullanıcıyı engelleyebilir, kullanıcıları ve aktiviteleri şikâyet edebilirsin. Engellediğin kişilerin aktivitelerini görmezsin.',
  },
  {
    icon: 'people',
    title: 'Bağlantılar ve favoriler',
    text: 'Birlikte aktiviteye katıldığın kişiler bağlantıların arasında listelenir; tekrar görüşmek istediklerini favorilerine ekleyebilirsin.',
  },
  {
    icon: 'bell',
    title: 'Hatırlatmalar',
    text: 'Katıldığın ya da düzenlediğin aktiviteden 24 saat ve 2 saat önce bildirim alırsın. Bildirimleri ayarlardan tek dokunuşla kapatabilirsin.',
  },
] as const;

/** Uygulamadaki aktivite türleri (gelsene/src/constants/activity-types.ts). */
export const ACTIVITY_TYPES = [
  { label: 'Yürüyüş', emoji: '🚶' },
  { label: 'Koşu', emoji: '🏃' },
  { label: 'Bisiklet', emoji: '🚴' },
  { label: 'Halı Saha', emoji: '⚽' },
  { label: 'Basketbol', emoji: '🏀' },
  { label: 'Yoga/Pilates', emoji: '🧘' },
  { label: 'Kahve', emoji: '☕' },
  { label: 'Sinema', emoji: '🎬' },
  { label: 'Konser', emoji: '🎤' },
  { label: 'Kutu Oyunu', emoji: '🎲' },
  { label: 'Piknik', emoji: '🧺' },
  { label: 'Kitap Kulübü', emoji: '📚' },
  { label: 'Müze/Sergi', emoji: '🏛️' },
  { label: 'Yemek Buluşması', emoji: '🍽️' },
  { label: 'Dil Değişimi', emoji: '🗣️' },
  { label: 'Kamp', emoji: '🏕️' },
  { label: 'Trekking', emoji: '🥾' },
  { label: 'Video Oyunu', emoji: '🎮' },
] as const;

export const HOME_FAQ: Faq[] = [
  {
    question: 'Gidelim nedir?',
    answer:
      'Gidelim, yalnız yapmak istemediğin şeyler için birlikte yapacak insan bulmanı sağlayan bir uygulama. Yürüyüş, halı saha, kitap kulübü ya da kahve gibi bir aktivite açarsın veya başkasının aktivitesine katılırsın. Aktivitenin grup sohbetinde tanışıp buluşursunuz.',
  },
  {
    question: 'Gidelim ücretsiz mi?',
    answer:
      'Evet. Gidelim’i kullanmak ücretsizdir; uygulamada abonelik veya uygulama içi satın alma yoktur. Bazı aktiviteler, organizatörün belirttiği bir katılım ücretine sahip olabilir; bu durumda ücret aktivitenin bilgilerinde açıkça yazar ve uygulama üzerinden ödeme alınmaz.',
  },
  {
    question: 'Gidelim güvenli mi, hesap doğrulama nasıl yapılıyor?',
    answer:
      'Gidelim’de hesabını selfie ile doğrulayabilirsin: ön kamerayla çektiğin selfie, açık rızan alınarak yalnızca doğrulama amacıyla incelenir ve inceleme bitince silinir. Onaylanan hesapların isminin yanında doğrulanmış hesap rozeti görünür. Ayrıca kullanıcıları engelleyebilir, kullanıcıları ve aktiviteleri şikâyet edebilirsin; aktivitenin katılımcı tercihi (karma, sadece kadın, sadece erkek) ve yaş aralığı da baştan belirtilir.',
  },
  {
    question: 'Gidelim’e kimler katılabilir?',
    answer:
      'Gidelim\'i 18 yaşını doldurmuş herkes kullanabilir. Kayıt olurken Gizlilik Politikası\'nı ve Kullanım Şartları\'nı kabul etmen gerekir. Kabul ederek 18 yaşından büyük olduğunu da beyan etmiş olursun.',
  },
  {
    question: 'Verilerim nasıl kullanılıyor?',
    answer:
      'Gidelim, kişisel verilerini 6698 sayılı KVKK kapsamında; hesabını yönetmek, aktivite önerilerini sunmak, kullanıcılar arası iletişimi sağlamak ve uygulamayı güvende tutmak için işler. Verilerin pazarlama amacıyla üçüncü taraflarla paylaşılmaz veya satılmaz; yalnızca altyapı sağlayıcılarıyla (Supabase, Expo/Firebase) hizmetin gerektirdiği ölçüde paylaşılır. Hesabını dilediğin an uygulamadaki “Hesabı Sil” adımıyla silebilirsin. Bu sitede de takip veya analitik aracı kullanılmaz.',
  },
  {
    question: 'Gidelim’i nereden indirebilirim?',
    answer:
      'Gidelim henüz uygulama mağazalarında yayında değil; App Store ve Google Play’e yakında geliyor. Yayına çıktığında indirme bağlantıları bu sayfada olacak.',
  },
];

export const SUPPORT_FAQ: Faq[] = [
  {
    question: 'Şifremi unuttum, ne yapmalıyım?',
    answer:
      'Giriş ekranında “Şifremi unuttum”a dokun ve kayıtlı e-posta adresini gir. Şifreni sıfırlaman için e-postana bir bağlantı gönderilir. Giriş yapmışken şifreni Ayarlar → Şifre Değiştir’den de değiştirebilirsin.',
  },
  {
    question: 'Hesabımı nasıl doğrularım?',
    answer:
      'Ayarlar → Hesabını Doğrula’ya git, ön kamerayla bir selfie çek, açık rıza kutucuğunu işaretleyip gönder. İnceleme tamamlanınca hesabın doğrulanmış olarak işaretlenir. Onaylanmazsa iyi ışıkta, yüzün net görünecek şekilde yeni bir selfie gönderebilirsin.',
  },
  {
    question: 'Bir kullanıcıyı ya da aktiviteyi nasıl şikâyet ederim?',
    answer:
      'Kullanıcının profilinde “Şikayet Et”e, bir aktivitenin detayında “Aktiviteyi Şikayet Et”e dokun ve nedenini seç (uygunsuz davranış, spam/sahte aktivite, taciz veya diğer). Aynı profilde “Engelle” ile kişiyi engelleyebilir, engeli Ayarlar → Engellenen Kullanıcılar’dan kaldırabilirsin.',
  },
  {
    question: 'Bildirimleri nasıl kapatırım?',
    answer:
      'Ayarlar → Bildirimler bölümündeki “Bildirimleri Aç” anahtarını kapat. Tek bir sohbeti susturmak istersen Sohbetler ekranından o sohbeti sessize alabilirsin.',
  },
  {
    question: 'Katıldığım bir aktiviteden nasıl ayrılırım?',
    answer:
      'Aktivitenin sohbet bilgileri ekranından veya Sohbetler listesinden “Aktiviteden ayrıl” seçeneğini kullanabilirsin.',
  },
  {
    question: 'Aktivitelerimi profilimde başkalarının görmesini istemiyorum.',
    answer:
      'Ayarlar → Aktiviteler bölümündeki “Aktivitelerimi profilimde göster” anahtarını kapat. Kapalıyken başkaları profilinde oluşturduğun ve katıldığın aktiviteleri göremez.',
  },
];

export const contactMailto = (subject?: string) =>
  `mailto:${CONTACT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
