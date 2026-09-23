'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, ShieldCheck, HelpCircle, ArrowRight, User } from 'lucide-react';
import VideoModal from './VideoModal';
import DocumentViewerModal from './DocumentViewerModal';
import Header from './Header';
import { Profile, SiteSettings, Faq } from '@/lib/types/database';

export default function LandingPage({ products, profile, sections, settings, faqs }: { products?: any[], profile?: Profile | null, sections?: any[], settings?: SiteSettings | null, faqs?: Faq[] }) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewerDocUrl, setViewerDocUrl] = useState<{url: string, title: string} | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  const [activeSliderId, setActiveSliderId] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    if (sections && sections.length > 0) {
      return { [sections[0].id]: true };
    }
    return {};
  });
  const productsRef = useRef<HTMLDivElement>(null);

  const displayItems = products && products.length > 0 
    ? products
    : [];

  const itemsToRender = displayItems;
    
  const placeholderItems = [
    { name: "Örnek Ürün", description: "Lütfen ürün ekleyin.", image_url: "/images/product_placeholder.png" }
  ];

  const finalItems = displayItems.length > 0 ? itemsToRender : placeholderItems;

  const handleCategoryClick = (id: string) => {
    setSelectedSectionId(id);
    if (id !== 'all') {
      setOpenSections({ [id]: true });
    } else {
      // If 'all' is clicked, maybe keep the first one open
      if (sections && sections.length > 0) {
        setOpenSections({ [sections[0].id]: true });
      }
    }
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getSectionImage = (secId: string) => {
    if (secId === 'all') return products?.[0]?.thumbnail_url || products?.[0]?.image_url || '/images/product_placeholder.png';
    const p = products?.find(p => p.section_id === secId);
    return p?.thumbnail_url || p?.image_url || '/images/product_placeholder.png';
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#0b2545] selection:bg-[#58b09c] selection:text-white">
      {/* HEADER */}
      {profile ? (
        <Header 
          profile={profile} 
          searchQuery="" 
          onSearchChange={() => {}} 
        />
      ) : (
        <header className="absolute top-0 w-full z-50">
          {/* Top bar */}
          <div className="bg-[#0b2545] text-white py-1 px-4 sm:px-8 text-xs flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="opacity-80">Üye olanlar için giriş paneli</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-[#58b09c] transition-colors">Giriş Yap</Link>
              <span className="opacity-40">|</span>
              <Link href="/register" className="hover:text-[#58b09c] transition-colors">Kayıt Ol</Link>
            </div>
          </div>
          
          {/* Main Navbar */}
          <div className="px-4 sm:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="text-white font-bold text-xl tracking-tight">Sidrex Akademi</span>
            </div>
          </div>
        </header>
      )}

      {/* HERO SECTION */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          {settings?.hero_bg_image ? (
            // Dış URL - standart img tag ile tam esneklik
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.hero_bg_image}
              alt={settings.hero_title || "Sidrex Akademi"}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src="/images/hero_bg.png"
              alt="Sidrex Akademi"
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b2545]/90 via-[#0b2545]/50 to-transparent mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 mt-16">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-xl whitespace-pre-line font-fraunces">
            {settings?.hero_title || "Sidrex\nAkademi"}
          </h1>
          {settings?.hero_subtitle && (
            <p className="text-xl text-white/80 font-medium mb-8 drop-shadow-md">
              {settings.hero_subtitle}
            </p>
          )}
          
          {/* Categories in Hero - Minimal Glassmorphism Boxes */}
          {sections && sections.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-12 max-w-5xl mx-auto pb-8">
              <button 
                onClick={() => handleCategoryClick('all')}
                className={`relative group w-36 h-20 md:w-44 md:h-24 rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${selectedSectionId === 'all' ? 'ring-2 ring-[#58b09c] ring-offset-2 ring-offset-[#0b2545]/50' : 'ring-1 ring-white/20'}`}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${getSectionImage('all')})` }}
                />
                <div className={`absolute inset-0 transition-colors duration-300 ${selectedSectionId === 'all' ? 'bg-[#0b2545]/70' : 'bg-[#0b2545]/60 group-hover:bg-[#0b2545]/40'}`} />
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                  <span className="text-white font-bold text-sm md:text-base tracking-wide transition-colors duration-300 drop-shadow-md">
                    Tüm Kategoriler
                  </span>
                </div>
              </button>

              {sections.map(sec => (
                <button 
                  key={sec.id}
                  onClick={() => handleCategoryClick(sec.id)}
                  className={`relative group w-36 h-20 md:w-44 md:h-24 rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${selectedSectionId === sec.id ? 'ring-2 ring-[#58b09c] ring-offset-2 ring-offset-[#0b2545]/50' : 'ring-1 ring-white/20'}`}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${getSectionImage(sec.id)})` }}
                  />
                  <div className={`absolute inset-0 transition-colors duration-300 ${selectedSectionId === sec.id ? 'bg-[#0b2545]/70' : 'bg-[#0b2545]/60 group-hover:bg-[#0b2545]/40'}`} />
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                    <span className="text-white font-bold text-sm md:text-base tracking-wide transition-colors duration-300 drop-shadow-md">
                      {sec.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* QUICK START & VIDEO SECTION */}
      <section className="py-20 bg-[#eef7f3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2545] mb-4 tracking-tight leading-tight whitespace-pre-line font-fraunces">
                {settings?.quick_start_title || "Hızlı Başlangıç & \n Panel Oryantasyonu"}
              </h2>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed whitespace-pre-line">
                {settings?.quick_start_desc || "Bu bölüm, tarafımıza ileten içeriklerin (video, görseller) sistemine pratik, platformun en iyi şekilde kullanılmasını sağlar."}
              </p>
              
              {/* Video Thumbnail Placeholder */}
              <a 
                href={settings?.quick_start_video_url || "#"} 
                target={settings?.quick_start_video_url ? "_blank" : "_self"}
                rel="noreferrer"
                className="block relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer aspect-video bg-gradient-to-br from-slate-200 to-slate-300"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all duration-300">
                  <PlayCircle className="w-16 h-16 text-white drop-shadow-lg opacity-90 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-xl drop-shadow-md font-fraunces">GLOBAL ACADEMY</h3>
                  <p className="text-sm opacity-90 font-medium drop-shadow-md font-poppins">FUTURE OF LEARNING</p>
                </div>
              </a>
            </div>

            {/* Right */}
            <div className="space-y-8 pl-0 md:pl-8">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#58b09c] text-[#58b09c] font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-[#0b2545] text-lg mb-2 font-fraunces">Nasıl Üye Olunur?</h4>
                  <p className="text-slate-600 mb-3 text-sm leading-relaxed font-light">
                    Sisteme kayıt olma şartlarını inceleyin. <span className="font-semibold text-[#58b09c]">Kayıt ol butonuna</span> tıklayarak formu doldurun.
                  </p>
                  <button 
                    onClick={() => {
                      if (settings?.register_guide_url) {
                        setViewerDocUrl({ url: settings.register_guide_url, title: 'Nasıl Üye Olunur?' });
                      } else {
                        window.location.href = '/register';
                      }
                    }}
                    className="bg-[#0b2545] hover:bg-[#153661] text-white text-sm font-semibold py-2 px-6 rounded-full transition-colors"
                  >
                    Yönergeyi İncele
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#58b09c] text-[#58b09c] font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-[#0b2545] text-lg mb-2 font-fraunces">Panel Nasıl Kullanılır?</h4>
                  <p className="text-slate-600 mb-3 text-sm leading-relaxed font-light">
                    Özel firma kodunuzla, size tanınan fırsatlarla ürünleri öğrenmeye başlayın.
                  </p>
                  <button 
                    onClick={() => {
                      if (settings?.panel_guide_url) {
                        setViewerDocUrl({ url: settings.panel_guide_url, title: 'Panel Nasıl Kullanılır?' });
                      } else {
                        window.location.href = '/login';
                      }
                    }}
                    className="bg-[#0b2545] hover:bg-[#153661] text-white text-sm font-semibold py-2 px-6 rounded-full transition-colors"
                  >
                    Yönergeyi İncele
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section ref={productsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {sections && sections.length > 0 ? (
            <div className="space-y-16">
              <div className="mb-8 border-b border-slate-200 pb-6">
                <h2 className="text-3xl font-extrabold text-[#0b2545] mb-2 tracking-tight font-fraunces">Tüm Ürünler</h2>
                <p className="text-slate-500 font-light">
                  Aşağıda tüm ürünlerimizi kategorilerine göre sıralanmış şekilde inceleyebilirsiniz.
                </p>
              </div>
              
              {sections.map(sec => {
                const secItems = finalItems.filter(p => p.section_id === sec.id);
                if (secItems.length === 0) return null;
                
                return (
                  <div key={sec.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div 
                      onClick={() => toggleSection(sec.id)}
                      className="flex items-center justify-between p-5 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2.5 h-6 rounded-full bg-[#58b09c]" />
                        <h3 className="text-2xl font-bold text-[#0b2545] tracking-tight font-fraunces">{sec.title}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-500 bg-[#edf7f3] border border-[#d1eae1] px-3 py-1 rounded-full">
                          {secItems.length} Ürün
                        </span>
                        <div className={`transform transition-transform duration-300 ${openSections[sec.id] ? 'rotate-180' : ''}`}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-500 ease-in-out ${openSections[sec.id] ? 'p-6 opacity-100' : 'h-0 opacity-0 overflow-hidden py-0 px-6'}`}>
                      {secItems.map((product, idx) => {
                        const title = product.title || product.name;
                        const desc = product.description || 'Bu ürün hakkında detaylı bilgi bulunmamaktadır.';
                        const image = product.thumbnail_url || product.image_url || '/images/product_placeholder.png';
                        
                        return (
                          <div key={idx} className="group cursor-pointer" onClick={() => setSelectedProduct({
                            ...product,
                            initialVideoId: 'main'
                          })}>
                            <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-[#e8eceb]">
                              <img 
                                src={image}
                                alt={title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              {product.video_url && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all duration-300">
                                  <PlayCircle className="w-12 h-12 text-white drop-shadow-md opacity-90 group-hover:scale-110 transition-transform duration-300" />
                                </div>
                              )}
                            </div>
                            <h4 className="font-bold text-[#0b2545] mb-1 line-clamp-1 font-fraunces">{title}</h4>
                            <p className="text-xs text-slate-500 mb-3 min-h-[32px] line-clamp-2">{desc}</p>
                            <div className="flex gap-2">
                              <button className="flex-1 bg-[#0b2545] hover:bg-[#153661] text-white text-xs font-semibold py-2 px-3 rounded-full transition-colors text-center">
                                İncele
                              </button>
                              {product.product_videos && product.product_videos.length > 0 && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveSliderId(activeSliderId === product.id ? null : product.id);
                                  }}
                                  className="flex-1 bg-white border border-[#0b2545] text-[#0b2545] hover:bg-slate-50 text-xs font-semibold py-2 px-3 rounded-full transition-colors text-center whitespace-nowrap flex items-center justify-center gap-1"
                                >
                                  <PlayCircle className="w-3 h-3" />
                                  Videolar ({product.product_videos.length})
                                </button>
                              )}
                            </div>

                            {/* Inline Video Slider */}
                            {activeSliderId === product.id && product.product_videos && product.product_videos.length > 0 && (
                              <div 
                                className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {product.product_videos.map((vid: any) => (
                                  <div 
                                    key={vid.id} 
                                    onClick={() => setSelectedProduct({
                                      ...product,
                                      initialVideoId: vid.id
                                    })}
                                    className="shrink-0 w-24 h-16 bg-slate-900 rounded-lg cursor-pointer overflow-hidden relative group border border-slate-200"
                                  >
                                    {vid.thumbnail_url ? (
                                      <img src={vid.thumbnail_url} alt={vid.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                                        <PlayCircle className="w-6 h-6" />
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                      <span className="text-white text-[9px] font-bold text-center px-1 truncate w-full shadow-sm">{vid.title}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <p>Henüz herhangi bir ürün veya kategori bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </section>

      {/* CATALOG & AGREEMENTS SECTION */}
      <section className="py-20 bg-[#f7f9ec]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0b2545] mb-4 tracking-tight font-fraunces">
              Sidrex Ürün Kataloğu <br /> ve Sözleşme Merkezi
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm font-light">
              Bu bölümde, güncel Ürün Kataloğumuzu inceleyebilir, Topluluk İş Birliği metni ve hukuki şartnameleri inceleyebilirsiniz.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-white/60 p-4 rounded-2xl flex items-center justify-between border border-[#58b09c]/20 hover:border-[#58b09c]/40 transition-colors">
              <div>
                <h4 className="font-bold text-[#0b2545] text-sm mb-1">Sidrex Güncel Ürün Kataloğu</h4>
                <p className="text-xs text-slate-500">Tüm ürün çeşitlerimizi, teknik detayları ve vizyonu yakından tanıyın.</p>
              </div>
              <button 
                onClick={() => {
                  if (settings?.product_catalog_url) {
                    setViewerDocUrl({ url: settings.product_catalog_url, title: 'Ürün Kataloğu' });
                  } else {
                    alert('Katalog linki henüz eklenmedi.');
                  }
                }}
                className="bg-white border border-[#58b09c] text-[#58b09c] hover:bg-[#58b09c] hover:text-white text-xs font-semibold py-2 px-4 rounded-full transition-colors whitespace-nowrap ml-4 shadow-sm"
              >
                Kataloğu İncele
              </button>
            </div>
            
            <div className="bg-white/60 p-4 rounded-2xl flex items-center justify-between border border-[#58b09c]/20 hover:border-[#58b09c]/40 transition-colors">
              <div>
                <h4 className="font-bold text-[#0b2545] text-sm mb-1">Sidrex Topluluk İş Birliği Şartları & Sözleşmesi</h4>
                <p className="text-xs text-slate-500">Kayıt aşamasında kabul etmeniz gereken resmi sözleşme metnini okuyun.</p>
              </div>
              <button 
                onClick={() => {
                  if (settings?.contract_center_url) {
                    setViewerDocUrl({ url: settings.contract_center_url, title: 'Sözleşme Merkezi' });
                  } else {
                    alert('Sözleşme linki henüz eklenmedi.');
                  }
                }}
                className="bg-white border border-[#58b09c] text-[#58b09c] hover:bg-[#58b09c] hover:text-white text-xs font-semibold py-2 px-4 rounded-full transition-colors whitespace-nowrap ml-4 shadow-sm"
              >
                Sözleşmeyi İncele
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-[#e8e9e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <h2 className="text-2xl font-extrabold text-[#0b2545] mb-4 tracking-tight">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm mb-10">
            Sistemimiz, belgelerimiz ve ürünlerimiz hakkında en çok merak edilen ihtiyaçları 
            gidermek için hazırladığımız sıkça sorulan sorulara göz atabilirsiniz.
          </p>

          <div className="space-y-4 text-sm">
            {faqs && faqs.length > 0 ? (
              faqs.map((faq, index) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className={`border-b border-slate-300 pb-4 ${index !== 0 ? 'pt-2' : ''}`}>
                    <button 
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="flex justify-between items-center w-full text-left font-bold text-[#0b2545] group"
                    >
                      {faq.question}
                      <span className="text-xl font-light text-slate-400 group-hover:text-[#58b09c] transition-colors">
                        {isOpen ? '-' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="mt-3 text-slate-600 leading-relaxed text-xs pr-8 animate-in fade-in slide-in-from-top-2 duration-300">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-slate-500 text-sm">Henüz eklenmiş bir soru bulunmamaktadır.</p>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#e8e9e9] py-8 text-center border-t border-slate-300">
        <div className="flex justify-center gap-6 mb-4">
          <div className="w-8 h-8 rounded-full border border-slate-400 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
            <span className="text-sm font-bold">X</span>
          </div>
          <div className="w-8 h-8 rounded-full border border-slate-400 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
            <span className="text-sm font-bold">in</span>
          </div>
          <div className="w-8 h-8 rounded-full border border-slate-400 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
            <span className="text-sm font-bold">ig</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 font-medium">Sidrex Akademi 2026</p>
      </footer>
      
      {/* Video Modal */}
      {selectedProduct && (
        <VideoModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      {/* Document Viewer Modal */}
      {viewerDocUrl && (
        <DocumentViewerModal
          url={viewerDocUrl.url}
          title={viewerDocUrl.title}
          onClose={() => setViewerDocUrl(null)}
        />
      )}
    </div>
  );
}
