'use client';

import { useState } from 'react';
import { registerAction } from '@/app/actions/auth';
import { useFormStatus, useFormState } from 'react-dom';
import Link from 'next/link';
import { Lock, Mail, User, Briefcase, MapPin, FileText, ArrowRight, Loader2, ShieldCheck, X } from 'lucide-react';
import { FloatingWireframeCapsules } from '@/components/WireframeCapsules';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#58b09c] hover:bg-[#449784] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-[#58b09c]/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Kayıt Oluşturuluyor...</span>
        </>
      ) : (
        <>
          <span>Müşteri Kaydı Oluştur</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerAction, null);
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [isKvkkAccepted, setIsKvkkAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#edf7f3] via-[#f8fafc] to-[#e2f3ec] relative overflow-hidden">
      {/* 3D Wireframe Rotating Capsules */}
      <FloatingWireframeCapsules />

      {/* Decorative Gradient Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#58b09c]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#58b09c]/20 blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl my-8 relative z-10">
        {/* Logo Header with Official Sidrex Logo (directly on background) */}
        <div className="text-center mb-6 flex flex-col items-center">
          <img
            src="https://sidrex.com/cdn/shop/files/logo.webp?v=1776667566&width=500"
            alt="Sidrex Akademi Logo"
            className="h-11 w-auto object-contain mb-2 drop-shadow-sm"
          />
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0b2545]">Sidrex Akademi</h1>
          <p className="text-slate-500 text-xs font-semibold mt-1">Müşteri Kayıt Formu</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-slate-200/90 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#58b09c] via-[#449784] to-[#0b2545]" />

          <h2 className="text-lg font-bold text-[#0b2545] mb-6">Müşteri Profil Bilgilerinizi Girin</h2>

          {state?.error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Ad Soyad *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Ahmet Yılmaz"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[#0b2545] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#58b09c] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Meslek / Ünvan
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    name="occupation"
                    placeholder="Makine Mühendisi, Satın Alma..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[#0b2545] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#58b09c] text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  E-posta Adresi *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="ornek@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[#0b2545] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#58b09c] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Giriş Şifresi *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="En az 6 karakter"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[#0b2545] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#58b09c] text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                İkamet Adresi / İl Şehir
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  placeholder="İstanbul, Türkiye / Kadıköy..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[#0b2545] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#58b09c] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Kısa Açıklama / Biyografi
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <textarea
                  name="bio"
                  rows={2}
                  placeholder="Firma veya ilgi duyulan ürün kategorileri hakkında kısa not..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-[#0b2545] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#58b09c] text-sm"
                />
              </div>
            </div>

            {/* KVKK Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="kvkk-reg"
                name="kvkk"
                required
                checked={isKvkkAccepted}
                onChange={(e) => setIsKvkkAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#58b09c] focus:ring-[#58b09c] cursor-pointer accent-[#58b09c]"
              />
              <label htmlFor="kvkk-reg" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowKvkkModal(true);
                  }}
                  className="text-[#58b09c] font-bold underline hover:text-[#449784] transition-colors inline-block mr-1"
                >
                  KVKK Aydınlatma Metni
                </button>
                'ni okudum ve kişisel verilerimin işlenmesini kabul ediyorum. <span className="text-rose-500 font-bold">*</span>
              </label>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="terms-reg"
                name="terms"
                required
                checked={isTermsAccepted}
                onChange={(e) => setIsTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#58b09c] focus:ring-[#58b09c] cursor-pointer accent-[#58b09c]"
              />
              <label htmlFor="terms-reg" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsModal(true);
                  }}
                  className="text-[#58b09c] font-bold underline hover:text-[#449784] transition-colors inline-block mr-1"
                >
                  Topluluk İş Birliği Programı Katılım ve Kullanım Şartları
                </button>
                'nı okudum, anladım ve kabul ediyorum. <span className="text-rose-500 font-bold">*</span>
              </label>
            </div>

            <SubmitButton />
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Zaten hesabınız var mı?{' '}
              <Link href="/login" className="text-[#58b09c] font-bold hover:underline transition-colors">
                Giriş Yapın
              </Link>
            </p>
          </div>
        </div>

        {/* Cemer Holding Logo Below Register Card (2x enlarged: h-16) */}
        <div className="mt-8 flex justify-center items-center">
          <img
            src="https://www.cemerholding.com/storage/files/1/logo-black.png"
            alt="Cemer Holding Logo"
            className="h-16 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity drop-shadow-sm"
          />
        </div>
      </div>

      {/* KVKK Aydınlatma Metni Modal */}
      {showKvkkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 relative max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-[#edf7f3] text-[#58b09c]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0b2545]">KVKK Aydınlatma Metni</h3>
                  <p className="text-xs text-slate-400 font-medium">Sidrex (Nproc Doğal Ürünler A.Ş. - Cemer Holding İştiraki)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowKvkkModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Text Content */}
            <div className="overflow-y-auto pr-2 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-b border-slate-100 pb-6 flex-1 custom-scrollbar">
              <p className="font-semibold text-slate-700">
                6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") Kapsamında Aydınlatma Metni
              </p>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">1. Veri Sorumlusunun Kimliği</h4>
                <p>
                  Cemer Holding iştiraki olan Nproc Doğal Ürünler A.Ş. ("Şirket" veya "Nproc") bünyesinde yer alan Sidrex markasına ait Sidrex Akademi platformu olarak, kişisel verilerinizin güvenliğine ve gizliliğine azami hassasiyet göstermekteyiz. 6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, veri sorumlusu sıfatıyla tarafımıza iletilen kişisel verileriniz işbu metinde açıklanan kapsamda işlenmektedir.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">2. Kişisel Verilerin İşlenme Amaçları</h4>
                <p>Toplanan kişisel verileriniz (Ad-Soyad, E-posta adresi, Şifre, İletişim bilgileri, Meslek/Ünvan bilgisi, Kullanıcı işlem ve IP kayıtları);</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-500">
                  <li>Sidrex Akademi platformuna üyelik kaydının oluşturulması ve kimlik doğrulaması yapılması,</li>
                  <li>Müşteri video galerisi, özel akademi eğitimleri ve ürün vitrini hizmetlerinin sunulması,</li>
                  <li>Platform erişim yetkilerinin tanımlanması ve kullanıcı deneyiminin kişiselleştirilmesi,</li>
                  <li>Sistem ve bilgi güvenliği süreçlerinin yürütülmesi ve kötüye kullanımların önlenmesi,</li>
                  <li>Mevzuattan kaynaklanan hukuki yükümlülüklerin yerine getirilmesi amaçlarıyla işlenmektedir.</li>
                </ul>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">3. Kişisel Verilerin Aktarılması</h4>
                <p>
                  Kişisel verileriniz; yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda, KVKK’nın 8. ve 9. maddelerine uygun olarak, ana ortaklığımız Cemer Holding A.Ş. ve bağlı iştiraklerine, yetkili kamu kurum ve kuruluşlarına, adli makamlara ve Şirketimizin hizmet aldığı güvenli sunucu/altyapı sağlayıcılarına aktarılabilecektir.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h4>
                <p>
                  Kişisel verileriniz, Sidrex Akademi web platformu ve dijital arayüzler üzerinden tamamen veya kısmen otomatik yollarla elektronik ortamda toplanmaktadır. İşleme faaliyetinin hukuki sebebi; KVKK Madde 5/2 (c) "Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması", (ç) "Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi" ve (f) "Veri sorumlusunun meşru menfaatleri" hükümleridir.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">5. KVKK Madde 11 Kapsamındaki Haklarınız</h4>
                <p>Veri sahibi olarak Şirketimize başvurarak;</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-500">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                  <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
                  <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                  <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
                  <li>Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
                  <li>KVKK 7. maddede öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,</li>
                  <li>İşlenen verilerin otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme haklarına sahipsiniz.</li>
                </ul>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">6. İletişim ve Başvuru</h4>
                <p>
                  KVKK kapsamındaki taleplerinizi ve başvurularınızı yazılı olarak veya onaylı e-posta adresiniz üzerinden <span className="font-semibold text-[#58b09c]">info@nproc.com.tr</span>, <span className="font-semibold text-[#58b09c]">destek@sidrex.com</span>, <span className="font-semibold text-[#58b09c]">kvkk@nproc.com.tr</span> veya <span className="font-semibold text-[#58b09c]">kvkk@cemerholding.com</span> adreslerine iletebilirsiniz.
                </p>
              </section>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsKvkkAccepted(true);
                  setShowKvkkModal(false);
                }}
                className="w-full sm:w-auto bg-[#58b09c] hover:bg-[#449784] text-white font-bold py-3 px-6 rounded-2xl shadow-md shadow-[#58b09c]/20 transition-all text-sm flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Okudum, Anladım ve Kabul Ediyorum</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Şartlar Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl border border-slate-100 relative max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-[#edf7f3] text-[#58b09c]">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0b2545]">Katılım ve Kullanım Şartları</h3>
                  <p className="text-xs text-slate-400 font-medium">Sidrex Topluluk İş Birliği Programı</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Text Content */}
            <div className="overflow-y-auto pr-2 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-b border-slate-100 pb-6 flex-1 custom-scrollbar">
              <p className="font-semibold text-slate-700">SIDREX TOPLULUK İŞ BİRLİĞİ PROGRAMI KATILIM VE KULLANIM ŞARTLARI</p>
              
              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">1. KONU VE KAPSAM</h4>
                <p>İşbu Sidrex Topluluk İş Birliği Programı Katılım ve Kullanım Şartları (“Şartlar”), Sidrex tarafından yürütülen topluluk/iş birliği programına (“Program”) katılan sağlık profesyonelleri, sosyal medya içerik üreticileri, influencerlar ve diğer iş ortaklarının (“İş Ortağı”) Program’a katılımına, kendilerine tanımlanan bağlantı ve/veya indirim kodlarının kullanımına, hak ediş ve ödeme esaslarına ve Sidrex ürünlerine ilişkin gerçekleştirecekleri tanıtım faaliyetlerine ilişkin koşulları düzenlemektedir.</p>
                <p>İş Ortağı, Program’a başvurmak ve işbu Şartlar’ı elektronik ortamda onaylamak suretiyle Şartlar’ın tamamını okuduğunu, anladığını ve kabul ettiğini beyan eder.</p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">2. BAŞVURU VE ÜYELİK</h4>
                <p><strong>2.1.</strong> Program’a yapılan başvurular Sidrex tarafından değerlendirilir. Başvurunun yapılması, başvuru sahibine Program’a kabul edilme yönünde kazanılmış herhangi bir hak sağlamaz.</p>
                <p><strong>2.2.</strong> Sidrex; başvuruları kendi değerlendirme kriterleri doğrultusunda kabul veya reddetme hakkını saklı tutar.</p>
                <p><strong>2.3.</strong> İş Ortağı, kayıt sırasında sunduğu tüm bilgi ve belgelerin doğru, güncel ve eksiksiz olduğunu; bu bilgilerde meydana gelen değişiklikleri gecikmeksizin Sidrex’e bildireceğini kabul eder.</p>
                <p><strong>2.4.</strong> İş Ortağı, kendisine tahsis edilen kullanıcı hesabı, indirim kodu ve bağlantıların güvenliğinden sorumludur. Bunların yetkisiz kişilerce kullanılmasından kaynaklanan sonuçlardan Sidrex sorumlu değildir.</p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">3. İŞ BİRLİĞİ BAĞLANTISI, KUPON KODU VE HAK EDİŞ</h4>
                <p><strong>3.1.</strong> Program kapsamında İş Ortağı’na Sidrex tarafından kişiye özel bağlantı ve/veya kupon kodu tanımlanabilir.</p>
                <p><strong>3.2.</strong> İş Ortağı’nın hak edişi, kendisine tanımlanan bağlantı ve/veya kupon kodu üzerinden sistem tarafından İş Ortağı ile ilişkilendirilebilen ve geçerli şekilde tamamlanan satışların KDV dâhil satış bedeli üzerinden %15 oranında hesaplanır.</p>
                <p><strong>3.3.</strong> Hak edişlerin tespitinde Sidrex’in elektronik sistemleri ve bu sistemlerde bulunan satış, iade, iptal ve yönlendirme kayıtları esas alınır.</p>
                <p><strong>3.4.</strong> Kullanıcının İş Ortağı’na ait bağlantıya tıkladıktan sonra tarayıcıyı kapatması, farklı bir tarayıcı veya cihaz üzerinden alışverişini tamamlaması ya da benzeri teknik nedenlerle satışın ilgili İş Ortağı ile sistem üzerinden ilişkilendirilememesi hâlinde söz konusu satış hak ediş hesabına yansımayabilir. Sidrex’in kusurundan kaynaklanmayan bu tür teknik veya kullanıcı kaynaklı durumlarda İş Ortağı komisyon veya sair ad altında herhangi bir talepte bulunamaz.</p>
                <p><strong>3.5.</strong> Bir satıştan doğan hak ediş, ilgili siparişin tamamlanmasını takip eden 14 günlük süre sonunda, ürünün iade veya siparişin iptal edilmemiş olması şartıyla İş Ortağı’nın paneline yansıtılır.</p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">4. ÖDEME ESASLARI</h4>
                <p><strong>4.1.</strong> İş Ortağı’nın ilgili aya ilişkin kesinleşen hak ediş tutarı hakkında, her ayın son günü İş Ortağı’na elektronik posta yoluyla bilgilendirme yapılır.</p>
                <p><strong>4.2.</strong> Hak ediş ödemeleri, İş Ortağı’nın tercihine göre MoneyPay uygulaması üzerinden veya İş Ortağı tarafından Sidrex’e fatura düzenlenmesi suretiyle gerçekleştirilir.</p>
                <p><strong>4.3.</strong> Hak ediş tutarları KDV dâhil olarak hesaplanır. Fatura ile ödeme yönteminin tercih edilmesi hâlinde İş Ortağı, hak ediş tutarına ilişkin faturayı KDV dâhil olacak şekilde ve yürürlükteki vergi mevzuatına uygun olarak düzenlemekle yükümlüdür. MoneyPay üzerinden gerçekleştirilecek ödemelerde ise hak ediş tutarı içerisindeki KDV dikkate alınarak gerekli kesintiler yapıldıktan sonra ödeme gerçekleştirilir.</p>
                <p><strong>4.4.</strong> İş Ortağı tarafından Sidrex’e fatura düzenlenmesi hâlinde, faturanın Sidrex’e iletilmesini takip eden 10 (on) gün içerisinde, hak ediş ödemesi faturada belirtilen ve İş Ortağı adına kayıtlı banka hesabına (IBAN) havale/EFT yoluyla gerçekleştirilir.</p>
                <p><strong>4.5.</strong> İş Ortağı, hak ediş ödemelerine ilişkin olarak kendi hukuki, mesleki ve vergisel statüsüne uygun fatura, serbest meslek makbuzu veya sair mali belgeyi doğru şekilde düzenlemekle yükümlüdür. Düzenlenen belgenin türü, içeriği, açıklaması, KDV ve sair vergisel unsurlarının mevzuata uygunluğundan münhasıran İş Ortağı sorumludur. İş Ortağı tarafından hatalı veya mevzuata aykırı belge düzenlenmesi nedeniyle Sidrex’in herhangi bir vergi, ceza, faiz, zarar veya masrafla karşılaşması hâlinde, Sidrex’in bunları İş Ortağı’ndan talep etme hakkı saklıdır.</p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">5. TANITIM VE REKLAM FAALİYETLERİ</h4>
                <p><strong>5.1.</strong> İş Ortağı, Sidrex ürünlerine ilişkin gerçekleştireceği her türlü reklam, tanıtım, paylaşım ve ticari iletişim faaliyetini yürürlükteki mevzuata, aşağıda belirtilen düzenlemelerle sınırlı olmamak üzere, Sağlık Ürünlerine İlişkin Uyum Kılavuzu, Türk Gıda Kodeksi Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği, Gıda ve Takviye Edici Gıdalarda Sağlık Beyanı Kullanımı Hakkında Yönetmelik, Takviye Edici Gıdaların Reklam Yönetmeliği ile reklam ve tanıtım faaliyetlerine ilişkin yürürlükte bulunan sair mevzuat, düzenleme ve kılavuzlara uygun hareket etmekle yükümlüdür.</p>
                <p><strong>5.2.</strong> İş Ortağı, Sidrex ile arasındaki ticari ilişkiyi gizleyemez. Sidrex ürünlerine ilişkin menfaat karşılığında gerçekleştirdiği sosyal medya paylaşımlarında, paylaşımın reklam niteliğinde olduğunu tüketicinin ilk bakışta anlayabileceği şekilde “#Reklam”, “#İşbirliği” veya yürürlükteki mevzuat uyarınca kabul edilen diğer uygun ibarelerle açıkça belirtmekle yükümlüdür.</p>
                <p><strong>5.3.</strong> İş Ortağı, takviye edici gıdalara ilişkin reklam ve tanıtımlarını yalnızca Sidrex tarafından kendisine iletilen tanıtım briefleri, onaylı içerikler ve sağlık beyanlarına uygun olarak gerçekleştirebilir ve bunların dışına çıkamaz.</p>
                <p>İş Ortağı’nın Sidrex tarafından bildirilen tanıtım briefleri, onaylı içerikler veya sağlık beyanlarının dışına çıkması ya da yukarıda belirtilen mevzuata aykırı reklam, tanıtım, paylaşım veya beyanda bulunması nedeniyle Sidrex hakkında herhangi bir idari para cezası veya sair yaptırım uygulanması hâlinde, İş Ortağı, Sidrex’in bu nedenle ödemek zorunda kaldığı tutarları, yaptırımın kesinleşmesi beklenmeksizin Sidrex’in ilk yazılı talebi üzerine derhâl karşılamakla yükümlüdür. Sidrex’in uğradığı sair zarar ve masrafları talep etme hakkı saklıdır.</p>
                <p>İş Ortağı’nın bu kapsamda uymakla yükümlü olduğu hususlar aşağıda sayılanlarla sınırlı olmayıp, İş Ortağı özellikle;</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Ürünün herhangi bir hastalığı önlediği, tedavi ettiği veya iyileştirdiği yönünde doğrudan veya dolaylı herhangi bir beyanda bulunamaz ve bu yönde izlenim oluşturamaz.</li>
                  <li>Kendi kişisel deneyimini, gözlemini veya üründen elde ettiğini ileri sürdüğü sonucu, ürünün herkes üzerinde aynı sonucu doğuracağı veya bilimsel olarak kanıtlanmış bir etki olduğu izlenimini verecek şekilde sunamaz.</li>
                  <li>Takviye edici gıdaların normal beslenme kapsamında tüketilen gıdaların yerine geçtiği izlenimini oluşturamaz.</li>
                </ul>
                <p><strong>5.4.</strong> İş Ortağı, Sidrex ürünlerine ilişkin kullanacağı her türlü sağlık beyanını Gıda ve Takviye Edici Gıdalarda Sağlık Beyanı Kullanımı Hakkında Yönetmelik ile ilgili kılavuz ve eklerine uygun olarak kullanmakla yükümlüdür. Sağlık beyanları belirsiz, yanlış veya yanıltıcı olamaz; ürünün aşırı tüketimini teşvik edemez, tüketicide kaygıya neden olabilecek nitelikte olamaz ve diğer ürünlerin yeterliliği veya güvenilirliği konusunda şüphe oluşturamaz. İş Ortağı, yalnızca Sidrex tarafından ilgili ürün özelinde kullanımına izin verilen sağlık beyanlarını, mevzuatta öngörülen koşul, açıklama ve uyarılarla birlikte ve ortalama tüketicinin anlayabileceği şekilde kullanabilir.</p>
                <p><strong>5.5.</strong> İş Ortağı, Sidrex tarafından kendisine iletilen tanıtım brieflerine, onaylı içeriklere ve ürün bazlı tanıtım kurallarına uygun hareket etmekle yükümlüdür. Sidrex tarafından sağlanan içerikleri anlamını değiştirecek veya yanıltıcı hâle getirecek şekilde değiştiremez ve bunlara Sidrex tarafından onaylanmamış sağlık, performans veya ürün beyanları ekleyemez.</p>
                <p><strong>5.6.</strong> İş Ortağı, Sidrex adına reklam veremez, herhangi bir açıklama veya taahhütte bulunamaz, üçüncü kişilerle Sidrex adına hukuki işlem gerçekleştiremez ve kendisini Sidrex’in çalışanı, temsilcisi veya yetkili satıcısı olarak tanıtamaz ya da bu yönde bir izlenim oluşturamaz.</p>
                <p><strong>5.7.</strong> Sağlık profesyoneli olan İş Ortakları, yukarıdaki yükümlülüklere ek olarak kendi mesleklerine ilişkin mevzuata, reklam ve tanıtım sınırlamalarına ve mesleki etik kurallarına uygun hareket etmekle yükümlüdür. Programa kabul edilmiş olmak, İş Ortağı’na mesleki mevzuat uyarınca yasaklanan bir reklam, tanıtım veya yönlendirme faaliyetinde bulunma hakkı vermez.</p>
                <p><strong>5.8.</strong> Sidrex, mevzuata, işbu Şartlar’a veya Sidrex tarafından belirlenen tanıtım kurallarına aykırı olduğunu değerlendirdiği herhangi bir reklam, tanıtım veya paylaşımın derhâl kaldırılmasını veya düzeltilmesini talep edebilir. İş Ortağı, Sidrex’in bu yöndeki talebini gecikmeksizin yerine getirmekle yükümlüdür.</p>
                <p><strong>5.9.</strong> İş Ortağı; özellikle deneyimlemediği bir ürün hakkında deneyimlemiş veya onaylamış izlenimi yaratmamak, mevzuata aykırı sağlık beyanında bulunmamak, ispatlanabilir olmayan bilimsel araştırma ve test sonuçlarına ilişkin iddialar kullanmamak, hediye edilen ürünü kendisi satın almış izlenimi yaratmamak, Sidrex ile arasındaki ticari ilişkiyi gizlememek, kullanılan efekt veya filtreleri gerektiğinde açıkça belirtmek ve sahte veya var olmayan kimlikler aracılığıyla reklam faaliyeti yürütmemekle yükümlü olduğunu kabul eder.</p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">6. MARKA, FİKRİ MÜLKİYET VE RAKİP MARKALARLA İŞ BİRLİĞİ</h4>
                <p><strong>6.1.</strong> Sidrex markası, logosu, ticaret unvanı, ürün görselleri, tanıtım materyalleri ve diğer fikri ve sınai mülkiyet unsurları yalnızca Program amacı kapsamında ve Sidrex tarafından izin verilen şekilde kullanılabilir. İş Ortağı’na bu unsurlar üzerinde herhangi bir mülkiyet veya sair hak devredilmiş sayılmaz.</p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">7. GİZLİLİK VE TOPLULUK MATERYALLERİ</h4>
                <p><strong>7.1.</strong> Sidrex tarafından Program kapsamında İş Ortağı ile paylaşılan tanıtım sunumları, briefler, eğitim ve bilgilendirme materyalleri, ürün ve pazarlama bilgileri, ticari bilgiler, kampanya planları, satış ve strateji bilgileri ile kamuya açık olmayan her türlü yazılı, görsel veya dijital bilgi ve içerik gizli bilgi niteliğindedir.</p>
                <p><strong>7.2.</strong> İş Ortağı, söz konusu bilgi ve materyalleri yalnızca Program kapsamında ve kendisine iletilme amacı doğrultusunda kullanabilir. İş Ortağı, Sidrex’in önceden yazılı izni olmaksızın bu bilgi ve materyalleri üçüncü kişilere açıklayamaz, aktaramaz, kopyalayamaz, çoğaltamaz, yayımlayamaz, sosyal medya veya sair mecralarda paylaşamaz ve Program amacı dışında doğrudan veya dolaylı olarak kullanamaz.</p>
                <p><strong>7.3.</strong> İş Ortağı, gizli bilgi ve materyallerin yetkisiz kişilerce erişilmesini veya kullanılmasını önlemek amacıyla gerekli özeni göstermekle yükümlüdür. Herhangi bir yetkisiz erişim, kullanım veya paylaşım hâlini öğrenmesi durumunda Sidrex’i gecikmeksizin bilgilendirir.</p>
                <p><strong>7.4.</strong> İşbu madde kapsamındaki gizlilik yükümlülüğü, İş Ortağı’nın Program üyeliğinin herhangi bir nedenle sona ermesinden sonra da devam eder.</p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">8. KİŞİSEL VERİLERİN KORUNMASI</h4>
                <p><strong>8.1.</strong> Sidrex, İş Ortağı’na ait kişisel verileri; Program’a başvuru ve üyelik işlemlerinin gerçekleştirilmesi, İş Ortağı hesabının oluşturulması ve yönetilmesi, bağlantı ve/veya kupon kodlarının tanımlanması ve takibi, satış ve hak edişlerin hesaplanması, ödemelerin gerçekleştirilmesi, finans ve muhasebe süreçlerinin yürütülmesi, iletişim faaliyetlerinin gerçekleştirilmesi, Program’ın güvenliğinin ve işleyişinin sağlanması, hukuki yükümlülüklerin yerine getirilmesi ve hukuki uyuşmazlıkların takibi amaçlarıyla, kimlik, iletişim, görsel ve işitsel veriler ve finansal veriler kategorilerindeki verileri 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) ve ilgili mevzuata uygun olarak işler.</p>
                <p><strong>8.2.</strong> İş Ortağı’nın kişisel verileri; KVKK’nın 5. ve gerektiğinde 6. maddelerinde öngörülen hukuki sebeplere dayanılarak ve ilgili mevzuatta öngörülen şartlar çerçevesinde işlenir. Kişisel verilerin işlenme amaçları, hukuki sebepleri, kimlere ve hangi amaçlarla aktarılabileceği, veri toplama yöntemleri ile İş Ortağı’nın KVKK’nın 11. maddesinden doğan haklarına ilişkin ayrıntılı bilgiler, Sidrex tarafından İş Ortağı’na sunulan ilgili aydınlatma metninde açıklanır.</p>
                <p><strong>8.3.</strong> Sidrex, Program’ın yürütülmesi kapsamında işlenen kişisel verileri; ödeme ve finans kuruluşları, bankalar, bilgi teknolojileri ve altyapı hizmeti sağlayıcıları, muhasebe ve mali müşavirlik hizmeti sağlayıcıları, hukuk danışmanları, yetkili kamu kurum ve kuruluşları ile hukuken yetkili özel kişilere, yalnızca ilgili aktarım amacıyla sınırlı olmak ve KVKK’nın 8. ve 9. maddelerinde öngörülen şartlara uygun olmak kaydıyla aktarabilir.</p>
                <p><strong>8.4.</strong> İş Ortağı, Program kapsamında Sidrex’e ilettiği kişisel verilerin doğru ve güncel olduğunu; üçüncü kişilere ait kişisel verileri Sidrex’e aktarmasının gerekmesi hâlinde ise söz konusu verileri hukuka uygun şekilde elde etmek ve Sidrex’e aktarmakla yükümlü olduğunu kabul eder.</p>
                <p><strong>8.5.</strong> İş Ortağı, Program kapsamında herhangi bir üçüncü kişiye ait kişisel veriye erişmesi veya bu nitelikte bir veriyi işlemesi hâlinde, söz konusu kişisel verileri yalnızca Program’ın yürütülmesi amacıyla ve kendisine verilen yetki kapsamında kullanmakla yükümlüdür. İş Ortağı, bu verileri Sidrex’in yazılı izni ve hukuka uygun bir işleme şartı bulunmaksızın üçüncü kişilere açıklayamaz, aktaramaz, çoğaltamaz veya Program amacı dışında kullanamaz.</p>
                <p><strong>8.6.</strong> Taraflar, kendi kontrollerinde bulunan kişisel verilerin hukuka aykırı olarak işlenmesini ve bunlara hukuka aykırı olarak erişilmesini önlemek ve kişisel verilerin muhafazasını sağlamak amacıyla KVKK’nın 12. maddesi kapsamında gerekli teknik ve idari tedbirleri almakla yükümlüdür.</p>
                <p><strong>8.7.</strong> İş Ortağı, Program kapsamında eriştiği kişisel verilere ilişkin herhangi bir yetkisiz erişim, ifşa, kayıp, değişiklik, hukuka aykırı işleme veya sair kişisel veri güvenliği ihlalini öğrenmesi hâlinde, Sidrex’in KVKK ve ilgili mevzuattan kaynaklanan yükümlülüklerini süresinde yerine getirebilmesini sağlamak amacıyla durumu gecikmeksizin Sidrex’e bildirir ve ihlalin etkilerinin sınırlandırılması ile giderilmesi konusunda Sidrex ile gerekli iş birliğini sağlar.</p>
                <p><strong>8.8.</strong> Program üyeliğinin sona ermesi, İş Ortağı’nın kişisel verilerin korunmasına ilişkin yükümlülüklerini ortadan kaldırmaz. İş Ortağı, üyeliğin sona ermesi hâlinde Program kapsamında kendisine aktarılan veya erişimine açılan kişisel verileri, bunların saklanmasını gerektiren hukuki bir yükümlülük bulunmadığı ölçüde, Sidrex’in talimatları doğrultusunda silmek, yok etmek veya Sidrex’e iade etmekle yükümlüdür.</p>
                <p><strong>8.9.</strong> İş Ortağı’nın işbu maddede düzenlenen yükümlülüklere veya kişisel verilerin korunmasına ilişkin mevzuata aykırı davranması nedeniyle Sidrex’in herhangi bir idari yaptırım, üçüncü kişi talebi, zarar veya masrafla karşılaşması hâlinde, Sidrex’in ilgili İş Ortağı’na rücu etme ve uğradığı zararları genel hükümler çerçevesinde talep etme hakkı saklıdır.</p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">9. KÖTÜYE KULLANIM VE HİLELİ İŞLEMLER</h4>
                <p><strong>9.1.</strong> İş Ortağı, Program’ı yalnızca gerçek ve hukuka uygun satışların yönlendirilmesi amacıyla kullanabilir. İş Ortağı; hak etmediği komisyon veya sair menfaatleri elde etmek amacıyla Program’ın işleyişini doğrudan veya dolaylı olarak manipüle edemez.</p>
                <p><strong>9.3.</strong> Sidrex, bir işlem veya hak ediş bakımından hile, kötüye kullanım, olağandışı işlem veya Program’ın manipüle edildiğine ilişkin makul şüphe bulunması hâlinde ilgili hak ediş ve ödemeleri inceleme sonuçlanıncaya kadar askıya alma hakkına sahiptir.</p>
                <p><strong>9.4.</strong> Hile veya kötüye kullanımın tespit edilmesi hâlinde Sidrex; ilgili hak edişleri iptal edebilir, daha önce ödenmiş tutarların iadesini talep edebilir veya bunları sonraki hak edişlerden mahsup edebilir ve İş Ortağı’nın Program üyeliğini derhâl sona erdirebilir.</p>
                <p><strong>9.5.</strong> İş Ortağı’nın hileli veya kötüye kullanım niteliğindeki işlemleri nedeniyle Sidrex’in herhangi bir zarara uğraması, üçüncü kişilere ödeme yapmak zorunda kalması veya idari/adli bir yaptırımla karşılaşması hâlinde Sidrex’in uğradığı zarar ve yaptığı masrafları İş Ortağı’ndan talep etme hakkı saklıdır.</p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">10. ÜYELİĞİN ASKIYA ALINMASI VE SONA ERDİRİLMESİ</h4>
                <p><strong>10.1.</strong> Sidrex; İş Ortağı’nın işbu Şartlar’a veya yürürlükteki mevzuata aykırı hareket etmesi, yanıltıcı veya hukuka aykırı reklam/tanıtım yapması, ürünün içeriği, bileşimi, niteliği, özellikleri veya etkileriyle bağdaşmayan beyanlarda bulunması, Sidrex marka ve itibarına zarar verebilecek davranışlarda bulunması, Programı kötüye kullanması veya Sidrex tarafından bildirilen tanıtım kurallarına aykırı hareket etmesi hâlinde İş Ortağı’nın üyeliğini askıya alabilir veya sona erdirebilir.</p>
                <p><strong>10.2.</strong> Mevzuata aykırı veya Sidrex’in marka itibarına zarar verebilecek bir içeriğin tespit edilmesi hâlinde Sidrex, İş Ortağı’ndan ilgili içeriğin derhâl kaldırılmasını veya düzeltilmesini talep edebilir. İş Ortağı bu talebi gecikmeksizin yerine getirmekle yükümlüdür.</p>
                <p><strong>10.3.</strong> Üyeliğin sona ermesi hâlinde İş Ortağı, Sidrex markası ve Program kapsamında kendisine sağlanan materyallerin kullanımını derhâl durdurur.</p>
                <p><strong>10.4.</strong> İş Ortağı, Program üyeliği süresince Sidrex’in marka değeri, ticari itibarı ve kurumsal kimliği ile bağdaşmayacak; hukuka, genel ahlaka ve kamu düzenine aykırı, toplum nezdinde Sidrex’in itibarını zedeleyebilecek veya Sidrex ile ilişkilendirilmesi nedeniyle marka değerini olumsuz etkileyebilecek nitelikte davranış, paylaşım veya faaliyette bulunamaz.</p>
                <p>İş Ortağı’nın bu nitelikte bir davranış veya faaliyette bulunduğunun Sidrex tarafından tespit edilmesi hâlinde Sidrex, ihlalin niteliğine göre ilgili içeriğin kaldırılmasını talep edebilir, İş Ortağı’nın üyeliğini askıya alabilir veya herhangi bir ihbar veya süre vermeksizin Program üyeliğini derhâl sona erdirebilir.</p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">11. SAĞLIK MESLEK MENSUPLARINA İLİŞKİN ÖZEL HÜKÜMLER</h4>
                <p><strong>11.1.</strong> Doktor, diş hekimi, eczacı, diyetisyen ve sair sağlık profesyoneli niteliğindeki İş Ortakları, Program kapsamındaki faaliyetlerini kendi mesleklerine ilişkin mevzuat, reklam ve tanıtım yasakları ile mesleki etik kurallarına uygun olarak yürütmekle yükümlüdür.</p>
                <p><strong>11.2.</strong> Sağlık profesyoneli olan İş Ortağı, mesleki mevzuatı uyarınca reklam veya tanıtımının yasaklandığı ürün veya hizmetlere ilişkin reklam, tanıtım, tavsiye, yönlendirme veya özendirici nitelikte paylaşım yapamaz. Programa üyelik veya Sidrex tarafından bağlantı/kupon kodu tanımlanmış olması, İş Ortağı’na mevzuat uyarınca yasaklanan herhangi bir reklam veya tanıtım faaliyetinde bulunma hakkı vermez.</p>
                <p><strong>11.3.</strong> Sağlık profesyoneli olan İş Ortağı’nın kendi mesleki mevzuatına aykırı reklam, tanıtım, paylaşım veya yönlendirmede bulunması nedeniyle Sağlık Bakanlığı, meslek kuruluşları, Reklam Kurulu veya sair yetkili kurum ve kuruluşlar tarafından uygulanabilecek idari, mesleki veya sair yaptırımlardan İş Ortağı sorumludur.</p>
                <p><strong>11.4.</strong> İş Ortağı’nın bu kapsamdaki mevzuata aykırı faaliyetleri nedeniyle Sidrex hakkında herhangi bir idari para cezası veya sair yaptırım uygulanması ya da Sidrex’in herhangi bir zarar, masraf veya üçüncü kişi talebiyle karşılaşması hâlinde, Sidrex’in ödediği tutarlar ile uğradığı zarar ve masrafları ilgili İş Ortağı’ndan talep ve tahsil etme hakkı saklıdır.</p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-[#0b2545]">12. SAİR HÜKÜMLER</h4>
                <p><strong>12.1.</strong> İşbu Şartlar, İş Ortağı tarafından elektronik ortamda onaylandığı tarihte yürürlüğe girer ve İş Ortağı’nın Program üyeliği devam ettiği sürece uygulanır.</p>
                <p><strong>12.2.</strong> Sidrex, mevzuat değişiklikleri, Program’ın işleyişi veya ticari gereklilikler doğrultusunda işbu Şartlar’da değişiklik yapma hakkını saklı tutar. Değişiklikler İş Ortağı’na elektronik ortamda bildirilir ve bildirilen tarihten itibaren hüküm doğurur.</p>
                <p><strong>12.3.</strong> İşbu Şartlar’ın herhangi bir hükmünün geçersiz veya uygulanamaz hâle gelmesi, diğer hükümlerin geçerliliğini etkilemez.</p>
                <p><strong>12.4.</strong> İşbu Şartlar’dan kaynaklanan veya Şartlar ile bağlantılı her türlü uyuşmazlıkta Türk Hukuku uygulanır.</p>
                <p><strong>12.5.</strong> İşbu Şartlar’dan doğan uyuşmazlıkların çözümünde, dava şartı arabuluculuğa ilişkin hükümler saklı kalmak kaydıyla, İzmir Mahkemeleri ve İcra Daireleri yetkilidir.</p>
                <p><strong>12.6.</strong> İş Ortağı, Program’a kayıt sırasında işbu Şartlar’ı elektronik ortamda onaylamak suretiyle Şartlar’ın tamamını okuduğunu, anladığını ve kabul ettiğini beyan ve taahhüt eder.</p>
              </section>
            </div>

            {/* Footer / Actions */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="px-6 py-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors font-semibold text-sm"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsTermsAccepted(true);
                    setShowTermsModal(false);
                  }}
                  className="px-6 py-2 bg-[#58b09c] hover:bg-[#449784] text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-[#58b09c]/20"
                >
                  Okudum, Kabul Ediyorum
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* E-posta Doğrulama Linki Pop-Up Modal */}
      {state?.success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 relative text-center overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-[#58b09c]/15 text-[#58b09c] flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Mail className="w-8 h-8 animate-bounce" />
            </div>

            <h3 className="text-xl font-extrabold text-[#0b2545] mb-2">
              Lütfen E-postanızdaki Linke Tıklayın!
            </h3>

            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Kayıt işleminiz başarıyla alındı. Hesabınızı aktifleştirmek için{' '}
              <strong className="text-[#0b2545] underline">{state.email || 'e-posta'}</strong> adresinize gönderdiğimiz <span className="text-[#58b09c] font-bold">doğrulama linkine tıklamanız</span> gerekmektedir.
            </p>

            <div className="p-4 rounded-2xl bg-[#edf7f3] border border-[#d1eae1] mb-6 text-xs text-[#449784] font-medium flex items-center space-x-2 text-left">
              <span className="text-base">💡</span>
              <span>Spam / İstenmeyen e-posta klasörünüzü kontrol etmeyi unutmayın.</span>
            </div>

            <Link
              href="/login"
              className="block w-full bg-[#58b09c] hover:bg-[#449784] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-[#58b09c]/25 transition-all text-center text-sm"
            >
              Giriş Ekranına Git
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

