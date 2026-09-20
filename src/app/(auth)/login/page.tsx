'use client';

import { useState } from 'react';
import { loginAction } from '@/app/actions/auth';
import { useFormStatus, useFormState } from 'react-dom';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck, X } from 'lucide-react';
import { FloatingWireframeCapsules } from '@/components/WireframeCapsules';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#58b09c] hover:bg-[#449784] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-[#58b09c]/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Giriş Yapılıyor...</span>
        </>
      ) : (
        <>
          <span>Giriş Yap</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, null);
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [isKvkkAccepted, setIsKvkkAccepted] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#edf7f3] via-[#f8fafc] to-[#e2f3ec] relative overflow-hidden">
      {/* 3D Wireframe Rotating Capsules */}
      <FloatingWireframeCapsules />

      {/* Decorative Gradient Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#58b09c]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#58b09c]/20 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 my-6">
        {/* Logo Header with Official Sidrex Logo (directly on background) */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img
            src="https://sidrex.com/cdn/shop/files/logo.webp?v=1776667566&width=500"
            alt="Sidrex Akademi Logo"
            className="h-12 w-auto object-contain mb-3 drop-shadow-sm"
          />
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0b2545]">Sidrex Akademi</h1>
          <p className="text-slate-500 text-xs font-semibold mt-1">Müşteri Video Galeri & Ürün Vitrini Platformu</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-slate-200/90 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#58b09c] via-[#449784] to-[#0b2545]" />

          <h2 className="text-lg font-bold text-[#0b2545] mb-6">Hesabınıza Giriş Yapın</h2>

          {state?.error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="ornek@domain.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[#0b2545] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#58b09c] focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[#0b2545] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#58b09c] focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {/* KVKK Checkbox */}
            <div className="flex items-start space-x-3 pt-1">
              <input
                type="checkbox"
                id="kvkk"
                name="kvkk"
                required
                checked={isKvkkAccepted}
                onChange={(e) => setIsKvkkAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#58b09c] focus:ring-[#58b09c] cursor-pointer accent-[#58b09c]"
              />
              <label htmlFor="kvkk" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
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

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Hesabınız yok mu?{' '}
              <Link href="/register" className="text-[#58b09c] font-bold hover:underline transition-colors">
                Hemen Kaydolun
              </Link>
            </p>
          </div>
        </div>

        {/* Cemer Holding Logo Below Login Card (2x enlarged: h-16) */}
        <div className="mt-8 flex flex-col items-center justify-center">
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
                  <p className="text-xs text-slate-400 font-medium">Sidrex Akademi & Cemer Holding A.Ş.</p>
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
                  Cemer Holding A.Ş. bünyesinde faaliyet gösteren Sidrex Akademi ("Şirket" veya "Sidrex Akademi") olarak, kişisel verilerinizin güvenliğine ve gizliliğine azami hassasiyet göstermekteyiz. 6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, veri sorumlusu sıfatıyla tarafımıza iletilen kişisel verileriniz işbu metinde açıklanan kapsamda işlenmektedir.
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
                  Kişisel verileriniz; yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda, KVKK’nın 8. ve 9. maddelerine uygun olarak, yetkili kamu kurum ve kuruluşlarına, hukuki uyuşmazlıkların giderilmesi amacıyla adli makamlara ve Şirketimizin hizmet aldığı güvenli sunucu ve veri depolama altyapı sağlayıcılarına aktarılabilecektir.
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
                  KVKK kapsamındaki taleplerinizi yazılı olarak veya onaylı e-posta adresiniz üzerinden <span className="font-semibold text-[#58b09c]">kvkk@cemerholding.com</span> adresine iletebilirsiniz.
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
    </div>
  );
}

