'use client';

import React, { useState } from 'react';
import { Product, Section, Profile } from '@/lib/types/database';
import Header from './Header';
import ProductCard from './ProductCard';
import VideoModal from './VideoModal';
import { Package, Sparkles } from 'lucide-react';
import { logSectionClickAction } from '@/app/actions/analytics';

interface CustomerShowcaseProps {
  products: Product[];
  sections: Section[];
  profile: Profile | null;
}

export default function CustomerShowcase({ products, sections, profile }: CustomerShowcaseProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');

  const handleSectionClick = (secId: string, title: string) => {
    setSelectedSectionId(secId);
    logSectionClickAction(secId, title);
  };

  const filteredProducts = products.filter((product) => {
    if (selectedSectionId !== 'all' && product.section_id !== selectedSectionId) {
      return false;
    }

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const matchTitle = product.title.toLowerCase().includes(q);
    const matchDesc = Boolean(product.description && product.description.toLowerCase().includes(q));

    let matchSpecs = false;
    if (product.specs && typeof product.specs === 'object') {
      const entries = Object.entries(product.specs);
      for (let i = 0; i < entries.length; i++) {
        const k = entries[i][0].toLowerCase();
        const v = String(entries[i][1]).toLowerCase();
        if (k.includes(q) || v.includes(q)) {
          matchSpecs = true;
          break;
        }
      }
    }

    return matchTitle || matchDesc || matchSpecs;
  });

  const sectionsWithProducts = sections
    .map((sec) => {
      const items = filteredProducts.filter((p) => p.section_id === sec.id);
      return {
        id: sec.id,
        title: sec.title,
        slug: sec.slug,
        sort_order: sec.sort_order,
        is_active: sec.is_active,
        created_at: sec.created_at,
        items: items,
      };
    })
    .filter((sec) => sec.items.length > 0);

  const uncategorizedItems = filteredProducts.filter((p) => !p.section_id);
  const isDefaultView = selectedSectionId === 'all' && !searchQuery;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0b2545] flex flex-col">
      {/* Header */}
      <Header
        profile={profile}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero & Category Tabs */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Sidrex Mint Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 border border-[#d1eae1] shadow-md bg-gradient-to-r from-[#edf7f3] via-[#e2f3ec] to-[#edf7f3]">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#d1eae1] text-[#58b09c] text-xs font-extrabold shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Sidrex Premium Galeri</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[#0b2545] tracking-tight leading-tight">
              Endüstriyel Ürün & Video Kataloğu
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
              Teknik detaylar, yüksek çözünürlüklü tanıtım videoları ve doğrudan künye kodlu iletişim imkanı ile ürünlerimizi keşfedin.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-8 translate-y-8">
            <Package className="w-96 h-96 text-[#58b09c]" />
          </div>
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => handleSectionClick('all', 'Tüm Kategoriler')}
            className={`px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
              selectedSectionId === 'all'
                ? 'bg-[#58b09c] text-white shadow-md shadow-[#58b09c]/30'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-[#58b09c] hover:text-[#58b09c]'
            }`}
          >
            Tüm Kategoriler ({products.length})
          </button>

          {sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => handleSectionClick(sec.id, sec.title)}
              className={`px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                selectedSectionId === sec.id
                  ? 'bg-[#58b09c] text-white shadow-md shadow-[#58b09c]/30'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-[#58b09c] hover:text-[#58b09c]'
              }`}
            >
              {sec.title}
            </button>
          ))}
        </div>

        {/* SECTION BAZLI VİTRİN */}
        {isDefaultView ? (
          <div className="space-y-12">
            {sectionsWithProducts.map((sec) => (
              <section key={sec.id} className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-6 rounded-full bg-[#58b09c]" />
                    <h2 className="text-xl font-extrabold text-[#0b2545] tracking-tight">{sec.title}</h2>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-[#edf7f3] border border-[#d1eae1] px-3 py-1 rounded-full">
                    {sec.items.length} Ürün
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sec.items.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={setSelectedProduct}
                    />
                  ))}
                </div>
              </section>
            ))}

            {uncategorizedItems.length > 0 ? (
              <section className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-6 rounded-full bg-slate-400" />
                    <h2 className="text-xl font-extrabold text-[#0b2545] tracking-tight">Diğer Ürünler</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {uncategorizedItems.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={setSelectedProduct}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-[#0b2545]">
                Filtrelenmiş Sonuçlar ({filteredProducts.length})
              </h2>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={setSelectedProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl text-center text-slate-500 border border-slate-200 space-y-3 shadow-sm">
                <Package className="w-12 h-12 mx-auto text-[#58b09c]" />
                <p className="text-base font-bold text-[#0b2545]">Aramanıza Uygun Ürün Bulunamadı</p>
                <p className="text-xs text-slate-500">
                  Farklı bir kelime ile aramayı deneyebilir veya tüm kategorileri listeleyebilirsiniz.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Video Modal Popup */}
      <VideoModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
