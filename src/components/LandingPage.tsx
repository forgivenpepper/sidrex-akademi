'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, ShieldCheck, HelpCircle, ArrowRight, User } from 'lucide-react';
import VideoModal from './VideoModal';
import Header from './Header';
import { Profile } from '@/lib/types/database';

export default function LandingPage({ products, profile, sections }: { products?: any[], profile?: Profile | null, sections?: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  const productsRef = useRef<HTMLDivElement>(null);

  const displayItems = products && products.length > 0 
    ? products
    : [];

  const itemsToRender = displayItems.filter(p => selectedSectionId === 'all' || p.section_id === selectedSectionId);
    
  const placeholderItems = [
    { name: "Örnek Ürün", description: "Lütfen ürün ekleyin.", image_url: "/images/product_placeholder.png" }
  ];

  const finalItems = displayItems.length > 0 ? itemsToRender : placeholderItems;

  const handleCategoryClick = (id: string) => {
    setSelectedSectionId(id);
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
          <Image
            src="/images/hero_bg.png"
            alt="Sidrex Akademi"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b2545]/90 via-[#0b2545]/50 to-transparent mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 mt-16">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight drop-shadow-xl">
            Sidrex<br />Akademi
          </h1>
          
          {/* Categories in Hero - Netflix Style Boxes */}
          {sections && sections.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-12 max-w-5xl mx-auto pb-4">
              <button 
                onClick={() => handleCategoryClick('all')}
                className={`relative group w-32 h-20 md:w-40 md:h-24 rounded-xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:z-20 ${selectedSectionId === 'all' ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0b2545]' : ''}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 ${selectedSectionId === 'all' ? 'from-[#58b09c] to-[#3a7567] opacity-90' : 'from-slate-800 to-slate-900 opacity-70 group-hover:opacity-90'}`} />
                <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
                  <span className="text-white font-bold text-sm md:text-base drop-shadow-md leading-tight">
                    Tüm Kategoriler
                  </span>
                </div>
              </button>

              {sections.map(sec => (
                <button 
                  key={sec.id}
                  onClick={() => handleCategoryClick(sec.id)}
                  className={`relative group w-32 h-20 md:w-40 md:h-24 rounded-xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:z-20 ${selectedSectionId === sec.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0b2545]' : ''}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 ${selectedSectionId === sec.id ? 'from-[#58b09c] to-[#3a7567] opacity-90' : 'from-slate-800 to-slate-900 opacity-60 group-hover:opacity-80'}`} />
                  {/* Subtle placeholder image effect behind gradient */}
                  <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                  
                  <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
                    <span className="text-white font-bold text-sm md:text-base drop-shadow-md leading-tight">
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
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2545] mb-4 tracking-tight leading-tight">
                Hızlı Başlangıç & <br /> Panel Oryantasyonu
              </h2>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                Bu bölüm, tarafımıza ileten içeriklerin (video, görseller) sistemine pratik, 
                platformun en iyi şekilde kullanılmasını sağlar.
              </p>
              
              {/* Video Thumbnail Placeholder */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer aspect-video bg-gradient-to-br from-slate-200 to-slate-300">
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all duration-300">
                  <PlayCircle className="w-16 h-16 text-white drop-shadow-lg opacity-90 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-xl drop-shadow-md">GLOBAL ACADEMY</h3>
                  <p className="text-sm opacity-90 font-medium drop-shadow-md">FUTURE OF LEARNING</p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-8 pl-0 md:pl-8">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#58b09c] text-[#58b09c] font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-[#0b2545] text-lg mb-2">Nasıl Üye Olunur?</h4>
                  <p className="text-slate-600 mb-3 text-sm leading-relaxed">
                    Sisteme kayıt olma şartlarını inceleyin. <span className="font-semibold text-[#58b09c]">Kayıt ol butonuna</span> tıklayarak formu doldurun.
                  </p>
                  <Link href="/register">
                    <button className="bg-[#0b2545] hover:bg-[#153661] text-white text-sm font-semibold py-2 px-6 rounded-full transition-colors">
                      Yönergeyi İncele
                    </button>
                  </Link>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#58b09c] text-[#58b09c] font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-[#0b2545] text-lg mb-2">Panel Nasıl Kullanılır?</h4>
                  <p className="text-slate-600 mb-3 text-sm leading-relaxed">
                    Özel firma kodunuzla, size tanınan fırsatlarla ürünleri öğrenmeye başlayın.
                  </p>
                  <Link href="/login">
                    <button className="bg-[#0b2545] hover:bg-[#153661] text-white text-sm font-semibold py-2 px-6 rounded-full transition-colors">
                      Yönergeyi İncele
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section ref={productsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {selectedSectionId === 'all' && sections && sections.length > 0 ? (
            <div className="space-y-16">
              <div className="mb-8 border-b border-slate-200 pb-6">
                <h2 className="text-3xl font-extrabold text-[#0b2545] mb-2 tracking-tight">Tüm Ürünler</h2>
                <p className="text-slate-500">
                  Aşağıda tüm ürünlerimizi kategorilerine göre sıralanmış şekilde inceleyebilirsiniz.
                </p>
              </div>
              
              {sections.map(sec => {
                const secItems = finalItems.filter(p => p.section_id === sec.id);
                if (secItems.length === 0) return null;
                
                return (
                  <div key={sec.id} className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2.5 h-6 rounded-full bg-[#58b09c]" />
                        <h3 className="text-2xl font-bold text-[#0b2545] tracking-tight">{sec.title}</h3>
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-[#edf7f3] border border-[#d1eae1] px-3 py-1 rounded-full">
                        {secItems.length} Ürün
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {secItems.map((product, idx) => {
                        const title = product.title || product.name;
                        const desc = product.description || 'Bu ürün hakkında detaylı bilgi bulunmamaktadır.';
                        const image = product.image_url || '/images/product_placeholder.png';
                        
                        return (
                          <div key={idx} className="group cursor-pointer" onClick={() => setSelectedProduct({
                            id: product.id || String(idx),
                            title: title,
                            description: desc,
                            image_url: image,
                            video_url: product.video_url
                          })}>
                            <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-[#e8eceb]">
                              <Image 
                                src={image}
                                alt={title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              {product.video_url && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all duration-300">
                                  <PlayCircle className="w-12 h-12 text-white drop-shadow-md opacity-90 group-hover:scale-110 transition-transform duration-300" />
                                </div>
                              )}
                            </div>
                            <h4 className="font-bold text-[#0b2545] mb-1 line-clamp-1">{title}</h4>
                            <p className="text-xs text-slate-500 mb-3 min-h-[32px] line-clamp-2">{desc}</p>
                            <button className="bg-[#0b2545] hover:bg-[#153661] text-white text-xs font-semibold py-1.5 px-5 rounded-full transition-colors">
                              İncele
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6">
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-extrabold text-[#0b2545] mb-2 tracking-tight">
                    {selectedSectionId === 'all' ? 'Tüm Ürünler' : sections?.find(s => s.id === selectedSectionId)?.title}
                  </h2>
                  <p className="text-slate-500">
                    Bu alanda ürünlerin uygulanması ve kullanım detaylarına ulaşabilirsiniz.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="text-xs font-bold text-slate-500 bg-[#edf7f3] border border-[#d1eae1] px-4 py-2 rounded-full">
                    {finalItems.length} İçerik
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {finalItems.map((product, idx) => {
                  const title = product.title || product.name;
                  const desc = product.description || 'Bu ürün hakkında detaylı bilgi bulunmamaktadır.';
                  const image = product.image_url || '/images/product_placeholder.png';
                  
                  return (
                    <div key={idx} className="group cursor-pointer" onClick={() => setSelectedProduct({
                      id: product.id || String(idx),
                      title: title,
                      description: desc,
                      image_url: image,
                      video_url: product.video_url
                    })}>
                      <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-[#e8eceb]">
                        <Image 
                          src={image}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.video_url && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all duration-300">
                            <PlayCircle className="w-12 h-12 text-white drop-shadow-md opacity-90 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-[#0b2545] mb-1 line-clamp-1">{title}</h4>
                      <p className="text-xs text-slate-500 mb-3 min-h-[32px] line-clamp-2">{desc}</p>
                      <button className="bg-[#0b2545] hover:bg-[#153661] text-white text-xs font-semibold py-1.5 px-5 rounded-full transition-colors">
                        İncele
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CATALOG & AGREEMENTS SECTION */}
      <section className="py-20 bg-[#f7f9ec]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0b2545] mb-4 tracking-tight">
              Sidrex Ürün Kataloğu <br /> ve Sözleşme Merkezi
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Bu bölümde, güncel Ürün Kataloğumuzu inceleyebilir, Topluluk İş Birliği metni ve hukuki şartnameleri inceleyebilirsiniz.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-white/60 p-4 rounded-2xl flex items-center justify-between border border-[#58b09c]/20 hover:border-[#58b09c]/40 transition-colors">
              <div>
                <h4 className="font-bold text-[#0b2545] text-sm mb-1">Sidrex Güncel Ürün Kataloğu</h4>
                <p className="text-xs text-slate-500">Tüm ürün çeşitlerimizi, teknik detayları ve vizyonu yakından tanıyın.</p>
              </div>
              <button className="bg-white border border-[#58b09c] text-[#58b09c] hover:bg-[#58b09c] hover:text-white text-xs font-semibold py-2 px-4 rounded-full transition-colors whitespace-nowrap ml-4 shadow-sm">
                Kataloğu İncele
              </button>
            </div>
            
            <div className="bg-white/60 p-4 rounded-2xl flex items-center justify-between border border-[#58b09c]/20 hover:border-[#58b09c]/40 transition-colors">
              <div>
                <h4 className="font-bold text-[#0b2545] text-sm mb-1">Sidrex Topluluk İş Birliği Şartları & Sözleşmesi</h4>
                <p className="text-xs text-slate-500">Kayıt aşamasında kabul etmeniz gereken resmi sözleşme metnini okuyun.</p>
              </div>
              <button className="bg-white border border-[#58b09c] text-[#58b09c] hover:bg-[#58b09c] hover:text-white text-xs font-semibold py-2 px-4 rounded-full transition-colors whitespace-nowrap ml-4 shadow-sm">
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
            {/* FAQ Item 1 */}
            <div className="border-b border-slate-300 pb-4">
              <button className="flex justify-between items-center w-full text-left font-bold text-[#0b2545] group">
                Sidrex Topluluk'a kimler üye olabilir?
                <span className="text-xl font-light text-slate-400 group-hover:text-[#58b09c] transition-colors">-</span>
              </button>
              <div className="mt-3 text-slate-600 leading-relaxed text-xs pr-8">
                Sidrex Topluluk (Akademi) platformuna, sağlık profesyonelleri, diyetisyenler, eczacılar, sağlıkla ilgili içerik üretenler (sosyal medya hesapları/sayfa yöneticileri) ve uzman sağlık çalışanları üye olabilir. Kayıt sayfamız üzerinden ilgili evrakları doldurarak başvurunuzu gerçekleştirebilirsiniz.
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="border-b border-slate-300 pb-4 pt-2">
              <button className="flex justify-between items-center w-full text-left font-bold text-[#0b2545] group">
                Üyelik için herhangi bir ücret ödemem gerekiyor mu?
                <span className="text-xl font-light text-slate-400 group-hover:text-[#58b09c] transition-colors">+</span>
              </button>
            </div>
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
    </div>
  );
}
