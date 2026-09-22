'use client';

import { useState, useEffect } from 'react';
import { Cookie, X, ShieldCheck } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const hasConsent = localStorage.getItem('sidrex_cookie_consent');
    if (!hasConsent) {
      // Small delay to ensure smooth entry animation after page load
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sidrex_cookie_consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner && !showModal) return null;

  return (
    <>
      {/* Bottom Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-in slide-in-from-bottom-full duration-500">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
              {/* Decorative top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#58b09c] via-[#449784] to-[#0b2545]" />
              
              <div className="flex items-start md:items-center gap-4 flex-1">
                <div className="p-3 rounded-2xl bg-[#edf7f3] text-[#58b09c] hidden sm:flex shrink-0">
                  <Cookie className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0b2545] mb-1">Çerez (Cookie) Kullanımı</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                    Size daha iyi bir kullanıcı deneyimi sunabilmek, platformun güvenliğini sağlamak ve tercihlerinizi hatırlamak amacıyla çerezler (cookies) kullanmaktayız. Sitemizi kullanmaya devam ederek çerez kullanımını kabul etmiş sayılırsınız.{' '}
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-[#58b09c] font-bold underline hover:text-[#449784] transition-colors whitespace-nowrap inline-block mt-1 sm:mt-0"
                    >
                      Detaylı Bilgi İçin Tıklayın
                    </button>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                <button
                  onClick={handleAccept}
                  className="w-full md:w-auto bg-[#58b09c] hover:bg-[#449784] text-white font-bold py-2.5 px-6 rounded-2xl shadow-md shadow-[#58b09c]/20 transition-all text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Kabul Et ve Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Policy Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-100 relative max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-[#edf7f3] text-[#58b09c]">
                  <Cookie className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0b2545]">Çerez (Cookie) Politikası</h3>
                  <p className="text-xs text-slate-400 font-medium">Sidrex (Nproc Doğal Ürünler A.Ş. - Cemer Holding İştiraki)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto pr-2 space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed pb-6 flex-1 custom-scrollbar">
              <p>
                İşbu Çerez Politikası; Cemer Holding iştiraki olan Nproc Doğal Ürünler A.Ş. (“Şirket” veya “Sidrex”) tarafından yönetilen Sidrex Akademi web platformunun kullanımı sırasında elde edilen çerezler hakkında bilgilendirme sağlamak amacıyla hazırlanmıştır.
              </p>

              <section className="space-y-2">
                <h4 className="font-bold text-[#0b2545]">1. Çerez (Cookie) Nedir?</h4>
                <p>
                  Çerezler, bir internet sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza (bilgisayar, telefon, tablet vb.) depolanan küçük metin dosyalarıdır. Bu dosyalar, siteyi kullanımınıza dair verileri saklayarak bir sonraki ziyaretinizde sizi tanımamızı, dil vb. tercihlerinizi hatırlamamızı ve sitenin daha güvenli/hızlı çalışmasını sağlar.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#0b2545]">2. Platformumuzda Hangi Çerezleri Kullanıyoruz?</h4>
                <p>Sidrex Akademi üzerinde yalnızca sitenin doğru çalışması ve temel işlevlerini yerine getirmesi için gerekli olan çerezler kullanılmaktadır.</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500">
                  <li><strong className="text-slate-700">Zorunlu (Temel) Çerezler:</strong> Sitenin düzgün şekilde çalışması, güvenliğin sağlanması ve kullanıcıların sisteme giriş yaptıktan sonra oturumlarının sürdürülmesi için zorunlu olan çerezlerdir (Oturum yönetimi, token saklama vb.).</li>
                  <li><strong className="text-slate-700">İşlevsel ve Analitik Çerezler:</strong> Ziyaretçilerin siteyi nasıl kullandığına dair anonim veriler toplayarak (sayfa görüntülenme sayısı, geçirilen süre vb.) sistem altyapısını geliştirmemizi sağlayan çerezlerdir.</li>
                  <li><strong className="text-slate-700">Reklam ve Pazarlama Çerezleri:</strong> Platformumuz temel olarak kapalı bir müşteri akademisi olduğundan, kullanıcıları profillemeye yönelik reklam çerezleri kullanılmamaktadır.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#0b2545]">3. Çerezlerin Kullanım Amaçları</h4>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-500">
                  <li>Sisteme giriş yapan yetkili kullanıcıların (bayiler/müşteriler) kimlik doğrulamasını yapmak,</li>
                  <li>Oturumların güvenliğini sağlamak ve yetkisiz erişimleri tespit etmek,</li>
                  <li>Sitenin performansını analiz etmek ve hataları tespit edip gidermek.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#0b2545]">4. Çerez Tercihlerinizi Nasıl Yönetebilirsiniz?</h4>
                <p>
                  Tarayıcınızın ayarlarını değiştirerek çerezlere ilişkin tercihlerinizi kişiselleştirme imkanına sahipsiniz. Çerezleri tamamen reddedebilir veya cihazınıza bir çerez kaydedilmeden önce uyarı alabilirsiniz. Ancak belirtmek isteriz ki, <strong className="font-semibold text-slate-700">zorunlu çerezleri engellemeniz halinde platforma giriş yapamayabilir veya bazı temel fonksiyonlardan (video izleme, sepet yönetimi vb.) faydalanamayabilirsiniz.</strong>
                </p>
                <p>Çerez yönetimi ayarlarınızı tarayıcınızın "Ayarlar" veya "Gizlilik ve Güvenlik" sekmeleri altından gerçekleştirebilirsiniz.</p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#0b2545]">5. Kişisel Verilerin Korunması</h4>
                <p>
                  Çerezler vasıtasıyla toplanan ve kişisel veri niteliği taşıyan verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca Aydınlatma Metnimizde belirtilen şartlar dahilinde işlenmektedir. Detaylı bilgi için Aydınlatma Metnimizi inceleyebilirsiniz.
                </p>
              </section>
            </div>

            {/* Footer / Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-[#0b2545] hover:bg-[#153661] text-white font-bold py-2.5 px-8 rounded-2xl shadow-md transition-all text-sm"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
