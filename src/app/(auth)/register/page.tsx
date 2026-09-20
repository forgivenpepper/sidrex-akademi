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
                  KVKK kapsamındaki taleplerinizi yazılı olarak veya onaylı e-posta adresiniz üzerinden <span className="font-semibold text-[#58b09c]">kvkk@nproc.com.tr</span> veya <span className="font-semibold text-[#58b09c]">kvkk@cemerholding.com</span> adresine iletebilirsiniz.
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

