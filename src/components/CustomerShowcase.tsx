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
    // Track user click analytics
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
    <div className="min-h-screen bg-[#090d16] text-gray-100 flex flex-col">
      <Header
        profile={profile}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="relative overflow-hidden rounded-3xl glass-panel p-8 md:p-12 border border-white/10 shadow-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-950">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Sidrex Premium Galeri</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Endüstriyel Ürün & Video Kataloğu
            </h1>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Teknik detaylar, yüksek çözünürlüklü tanıtım videoları ve doğrudan künye kodlu iletişim imkanı ile ürünlerimizi keşfedin.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
            <Package className="w-96 h-96 text-blue-500" />
          </div>
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => handleSectionClick('all', 'Tüm Kategoriler')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSectionId === 'all'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 border border-slate-800 text-gray-400 hover:text-white hover:border-slate-700'
            }`}
          >
            Tüm Kategoriler ({products.length})
          </button>

          {sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => handleSectionClick(sec.id, sec.title)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSectionId === sec.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 border border-slate-800 text-gray-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {sec.title}
            </button>
          ))}
        </div>

        {isDefaultView ? (
          <div className="space-y-12">
            {sectionsWithProducts.map((sec) => (
              <section key={sec.id} className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-6 rounded-full bg-blue-500" />
                    <h2 className="text-xl font-bold text-white tracking-tight">{sec.title}</h2>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
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
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-6 rounded-full bg-indigo-500" />
                    <h2 className="text-xl font-bold text-white tracking-tight">Diğer Ürünler</h2>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white">
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
              <div className="glass-panel p-12 rounded-3xl text-center text-gray-400 space-y-3">
                <Package className="w-12 h-12 mx-auto text-gray-600" />
                <p className="text-base font-semibold text-white">Aramanıza Uygun Ürün Bulunamadı</p>
                <p className="text-xs text-gray-400">
                  Farklı bir kelime ile aramayı deneyebilir veya tüm kategorileri listeleyebilirsiniz.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <VideoModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
