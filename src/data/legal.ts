// ⚠️ BU DOSYA OTOMATİK ÜRETİLİR — ELLE DÜZENLEME.
// Kaynak: gelsene (uygulama) reposu → src/constants/legal.ts
// Güncellemek için: önce uygulamadaki legal.ts dosyasını değiştir, sonra `npm run sync:legal`.

export type LegalDocId = 'privacy' | 'terms';

export type LegalBulletItem = string | { label: string; text: string };

export type LegalBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: LegalBulletItem[] };

export type LegalDocument = {
  title: string;
  blocks: LegalBlock[];
};

export const LEGAL_CONTACT_EMAIL = 'destek@gelseneapp.com';
export const LEGAL_LAST_UPDATED = '6 Ekim 2026';

export const LEGAL_DOCUMENTS: Record<LegalDocId, LegalDocument> = {
  privacy: {
    title: 'Gizlilik Politikası',
    blocks: [
      { type: 'paragraph', text: 'KVKK Aydınlatma Metni' },
      { type: 'heading', text: '1. Veri Sorumlusu' },
      {
        type: 'paragraph',
        text: `Gelsene mobil uygulaması ("Uygulama", "Gelsene"), 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla işletilmektedir. Kişisel verilerinizle ilgili sorularınız için ${LEGAL_CONTACT_EMAIL} adresinden bize ulaşabilirsiniz.`,
      },
      { type: 'heading', text: '2. İşlenen Kişisel Veriler' },
      { type: 'paragraph', text: "Gelsene'yi kullanırken aşağıdaki kişisel verileriniz işlenebilir:" },
      {
        type: 'bullets',
        items: [
          {
            label: 'Kimlik ve iletişim bilgileri',
            text: 'Ad, soyad, kullanıcı adı, e-posta adresi, telefon numarası (varsa).',
          },
          {
            label: 'Profil bilgileri',
            text: 'Profil fotoğrafı, biyografi, ilgi alanları, doğum tarihi/yaş aralığı.',
          },
          {
            label: 'Doğrulama verisi (özel nitelikli kişisel veri)',
            text: `Hesap doğrulaması sırasında alınan selfie fotoğrafı. Bu veri, KVKK'nın 6. maddesi kapsamında "biyometrik veri" sayılabilecek özel nitelikli bir kişisel veridir; yalnızca kimlik doğrulama amacıyla, açık rızanıza dayanılarak işlenir, güvenli ve erişimi kısıtlı bir depolama alanında (private storage bucket) saklanır, yalnızca doğrulama süreci için yetkilendirilmiş inceleme amacıyla görüntülenir ve inceleme sonuçlandığında silinir.`,
          },
          {
            label: 'Konum/adres bilgisi',
            text: 'Oluşturduğunuz veya katıldığınız aktiviteler için girdiğiniz adres/konum metni.',
          },
          {
            label: 'İletişim içerikleri',
            text: 'Uygulama içi sohbet mesajları, gönderilen medya (fotoğraf/dosya).',
          },
          {
            label: 'Etkileşim verisi',
            text: "Katıldığınız/oluşturduğunuz aktiviteler, favoriler, bağlantılar, bildirim tercihleri, push bildirim token'ı.",
          },
          {
            label: 'Teknik veri',
            text: 'Cihaz ve uygulama kullanım bilgileri (uygulama sürümü, hata kayıtları gibi).',
          },
        ],
      },
      { type: 'heading', text: '3. Kişisel Verilerin İşlenme Amaçları ve Hukuki Sebepleri' },
      {
        type: 'paragraph',
        text: 'Verileriniz; hesabınızın oluşturulması ve yönetilmesi, kimliğinizin doğrulanması, aktivite eşleştirme ve öneri hizmetinin sunulması, kullanıcılar arası iletişimin sağlanması, uygulama güvenliğinin sağlanması (kötüye kullanımın önlenmesi, şikâyet/engelleme mekanizmaları), yasal yükümlülüklerin yerine getirilmesi ve hizmet kalitesinin iyileştirilmesi amaçlarıyla işlenir.',
      },
      {
        type: 'paragraph',
        text: `Bu işlemler KVKK'nın 5. ve 6. maddelerinde yer alan "sözleşmenin kurulması/ifası", "meşru menfaat" ve özel nitelikli veriler için aranan "açık rıza" hukuki sebeplerine dayanılarak gerçekleştirilir.`,
      },
      { type: 'heading', text: '4. Kişisel Verilerin Aktarılması' },
      {
        type: 'paragraph',
        text: "Verileriniz, Uygulama'nın altyapısını sağlayan hizmet sağlayıcılarla (örneğin Supabase — veritabanı, kimlik doğrulama ve depolama hizmeti; Expo/Firebase — push bildirim altyapısı) hizmetin gerektirdiği ölçüde paylaşılır. Bu sağlayıcılar, verilerinizi yalnızca Gelsene'ye hizmet sunmak amacıyla işler. Verileriniz, yasal zorunluluklar dışında üçüncü taraflarla pazarlama amacıyla paylaşılmaz veya satılmaz.",
      },
      { type: 'heading', text: '5. Kişisel Verilerin Saklanma Süresi' },
      {
        type: 'paragraph',
        text: `Verileriniz, hesabınız aktif olduğu sürece ve yukarıdaki amaçların gerektirdiği süre boyunca saklanır. Hesabınızı sildiğinizde, verileriniz Uygulama'nın "Hesabı Sil" özelliği aracılığıyla silinir veya anonimleştirilir; yasal saklama yükümlülüğü bulunan veriler ise ilgili mevzuatta öngörülen süre kadar saklanır. Hesap doğrulama selfie'niz ise inceleme sonuçlandığında (onay ya da red) kalıcı olarak silinir; hesabınızda yalnızca doğrulamanın sonucu ve açık rızanızın alındığı tarih tutulur.`,
      },
      { type: 'heading', text: '6. Veri Güvenliği' },
      {
        type: 'paragraph',
        text: "Verileriniz, veritabanı seviyesinde satır bazlı erişim politikaları (Row Level Security) ve doğrulama selfie'leri için özel olarak erişimi kısıtlanmış depolama alanları gibi teknik tedbirlerle korunur.",
      },
      { type: 'heading', text: '7. KVKK Madde 11 Kapsamındaki Haklarınız' },
      {
        type: 'paragraph',
        text: "KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içi/yurt dışı aktarıldığı üçüncü kişileri bilme, eksik/yanlış işlenmişse düzeltilmesini isteme, KVKK'da öngörülen şartlar çerçevesinde silinmesini/yok edilmesini isteme ve bu işlemlerin aktarıldığı kişilere bildirilmesini isteme haklarına sahipsiniz.",
      },
      {
        type: 'paragraph',
        text: `Silme/yok edilme hakkınızı, Uygulama içinde Ayarlar → Hesabı Sil adımını kullanarak doğrudan kendiniz uygulayabilirsiniz. Diğer talepleriniz için bize ${LEGAL_CONTACT_EMAIL} adresinden ulaşabilirsiniz.`,
      },
      {
        type: 'paragraph',
        text: 'Selfie doğrulaması için verdiğiniz açık rızayı dilediğiniz zaman geri çekebilirsiniz; bunun için aynı adrese yazabilir veya hesabınızı silebilirsiniz. Rızanın geri çekilmesi, geri çekmeden önce yapılan işlemin hukuka uygunluğunu etkilemez.',
      },
      { type: 'heading', text: '8. Değişiklikler' },
      {
        type: 'paragraph',
        text: "Bu Gizlilik Politikası'nda değişiklik yapma hakkımız saklıdır. Önemli değişikliklerde sizi Uygulama üzerinden bilgilendireceğiz.",
      },
    ],
  },
  terms: {
    title: 'Kullanım Şartları',
    blocks: [
      { type: 'heading', text: '1. Taraflar ve Kabul' },
      {
        type: 'paragraph',
        text: `Bu Kullanım Şartları ("Şartlar"), Gelsene mobil uygulamasını ("Uygulama") kullanan siz ("Kullanıcı") ile Uygulama'yı işleten Gelsene arasındaki ilişkiyi düzenler. Uygulama'ya kayıt olarak veya kullanarak bu Şartlar'ı ve Gizlilik Politikası'nı kabul etmiş sayılırsınız.`,
      },
      { type: 'heading', text: '2. Hizmetin Tanımı' },
      {
        type: 'paragraph',
        text: 'Gelsene, kullanıcıların ortak ilgi alanlarına dayalı sosyal aktiviteler oluşturabildiği, bu aktivitelere katılabildiği ve diğer katılımcılarla uygulama içi sohbet üzerinden iletişim kurabildiği bir sosyal eşleştirme platformudur.',
      },
      { type: 'heading', text: '3. Yaş Sınırı' },
      {
        type: 'paragraph',
        text: "Gelsene'yi kullanmak için 18 yaşını doldurmuş olmanız gerekmektedir. Uygulama'ya kayıt olarak 18 yaşını doldurduğunuzu beyan etmiş olursunuz.",
      },
      { type: 'heading', text: '4. Hesap ve Kimlik Doğrulama' },
      {
        type: 'paragraph',
        text: "Hesabınızın güvenliğinden siz sorumlusunuz. Gelsene, kullanıcı güvenliğini artırmak amacıyla selfie fotoğrafı yoluyla kimlik doğrulama isteğinde bulunabilir; doğrulama süreci Gizlilik Politikası'nda açıklandığı şekilde yürütülür. Gerçeğe aykırı bilgi veya başka bir kişiye ait görsel/kimlik kullanmak hesabın askıya alınmasına veya kapatılmasına neden olabilir.",
      },
      { type: 'heading', text: '5. Kullanıcı Sorumlulukları ve Yasaklı Davranışlar' },
      {
        type: 'paragraph',
        text: "Uygulama'yı kullanırken aşağıdaki davranışlardan kaçınmayı kabul edersiniz:",
      },
      {
        type: 'bullets',
        items: [
          'Başka kullanıcılara yönelik taciz, tehdit, nefret söylemi veya ayrımcılık içeren davranışlarda bulunmak,',
          'Yanlış, yanıltıcı veya başkasına ait kimlik/fotoğraf kullanmak,',
          "Uygulama'yı yasa dışı fiiller, dolandırıcılık veya başkalarının güvenliğini tehlikeye atacak amaçlarla kullanmak,",
          'İstenmeyen ticari ileti/spam göndermek,',
          "Uygulama'nın teknik altyapısına zarar verecek veya işleyişini bozacak girişimlerde bulunmak (tersine mühendislik, veri kazıma vb. dahil).",
        ],
      },
      { type: 'heading', text: '6. İçerik ve Moderasyon' },
      {
        type: 'paragraph',
        text: "Paylaştığınız profil bilgileri, mesajlar ve aktivite içerikleri sizin sorumluluğunuzdadır. Gelsene, Uygulama içindeki mevcut şikâyet ve engelleme mekanizmaları aracılığıyla bildirilen içerikleri inceleyebilir; bu Şartlar'a veya yürürlükteki mevzuata aykırı bulduğu içerikleri kaldırma ve ilgili hesabı kısıtlama veya kapatma hakkını saklı tutar.",
      },
      { type: 'heading', text: '7. Fikri Mülkiyet' },
      {
        type: 'paragraph',
        text: "Uygulama'nın tasarımı, logosu, markası ve yazılımı Gelsene'ye aittir ve ilgili fikri mülkiyet mevzuatı kapsamında korunur. Paylaştığınız içeriklerin (profil fotoğrafı, mesajlar vb.) mülkiyeti size aittir; ancak bu içeriklerin hizmetin sunulması amacıyla Uygulama içinde görüntülenmesine izin verirsiniz.",
      },
      { type: 'heading', text: '8. Sorumluluğun Sınırlandırılması' },
      {
        type: 'paragraph',
        text: 'Gelsene, kullanıcıların birbiriyle gerçekleştirdiği aktivitelerde aracı bir platform konumundadır. Kullanıcılar arası fiziksel buluşmalardan, aktivite sırasında yaşanabilecek anlaşmazlık, kayıp veya zararlardan Gelsene sorumlu tutulamaz. Kullanıcıların birbiriyle buluşurken temkinli olması önerilir.',
      },
      { type: 'heading', text: '9. Hesabın Sonlandırılması' },
      {
        type: 'paragraph',
        text: "Bu Şartlar'ı ihlal ettiğinizi tespit etmemiz halinde hesabınızı askıya alma veya kapatma hakkımızı saklı tutarız. Siz de istediğiniz zaman Ayarlar → Hesabı Sil adımını kullanarak hesabınızı kapatabilirsiniz.",
      },
      { type: 'heading', text: '10. Uygulanacak Hukuk' },
      {
        type: 'paragraph',
        text: "Bu Şartlar, Türkiye Cumhuriyeti kanunlarına tabidir. Bu Şartlar'dan kaynaklanan ihtilaflarda Türkiye Cumhuriyeti mahkemeleri ve icra daireleri yetkilidir.",
      },
      { type: 'heading', text: '11. İletişim' },
      {
        type: 'paragraph',
        text: `Bu Şartlar ile ilgili sorularınız için ${LEGAL_CONTACT_EMAIL} adresinden bize ulaşabilirsiniz.`,
      },
    ],
  },
};

export function isLegalDocId(value: unknown): value is LegalDocId {
  return value === 'privacy' || value === 'terms';
}
