'use client';

import { Product } from '@/lib/types/database';
import { Play, Video } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  // Top 3 specs for quick badges
  const topSpecs = product.specs ? Object.entries(product.specs).slice(0, 3) : [];

  return (
    <div
      onClick={() => onSelect(product)}
      className="group sidrex-card bg-white p-4 rounded-3xl cursor-pointer flex flex-col justify-between border border-slate-200/90 hover:border-[#58b09c] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#58b09c]/10"
    >
      <div>
        {/* Thumbnail Container with Mint Pastel Background */}
        <div className="relative aspect-square w-full bg-[#edf7f3] rounded-2xl overflow-hidden p-4 flex items-center justify-center border border-[#d1eae1]/60">
          {product.thumbnail_url ? (
            <img
              src={product.thumbnail_url}
              alt={product.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#58b09c]">
              <Video className="w-12 h-12 mb-2 opacity-80" />
              <span className="text-xs font-semibold text-slate-500">Ürün Görseli</span>
            </div>
          )}

          {/* Video Type Badge */}
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] uppercase font-extrabold tracking-wider bg-white/90 backdrop-blur-md border border-slate-200 text-[#0b2545] shadow-sm">
            {product.video_type}
          </span>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-[#58b09c] text-white flex items-center justify-center shadow-lg shadow-[#58b09c]/40 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-white ml-1" />
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-4 space-y-1.5">
          <h3 className="font-extrabold text-[#0b2545] text-lg leading-snug group-hover:text-[#58b09c] transition-colors line-clamp-2">
            {product.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description || 'Teknik künyeyi ve tanıtım videosunu izlemek için tıklayın.'}
          </p>
        </div>
      </div>

      {/* Quick Specs Badges (Pills) */}
      {topSpecs.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-4 mt-3 border-t border-slate-100">
          {topSpecs.map(([k, v]) => (
            <span
              key={k}
              className="px-2.5 py-1 rounded-full bg-[#edf7f3] border border-[#d1eae1] text-[11px] font-semibold text-[#0b2545]"
            >
              <strong className="text-[#58b09c]">{k}:</strong> {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
