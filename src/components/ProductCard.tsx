'use client';

import { Product } from '@/lib/types/database';
import { Play, Info, Video } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  // Top 2 specs for quick badges
  const topSpecs = product.specs ? Object.entries(product.specs).slice(0, 2) : [];

  return (
    <div
      onClick={() => onSelect(product)}
      className="group glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full border border-white/10 hover:border-blue-500/50 transition-all duration-300"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        {product.thumbnail_url ? (
          <img
            src={product.thumbnail_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-slate-900">
            <Video className="w-10 h-10 mb-2" />
            <span className="text-xs">Görsel Bulunmuyor</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Video Type Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-black/60 backdrop-blur-md border border-white/10 text-blue-400">
          {product.video_type}
        </span>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {product.description || 'Teknik ayrıntıları ve tanıtım videosunu izlemek için tıklayın.'}
          </p>
        </div>

        {/* Quick Specs Badges */}
        {topSpecs.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
            {topSpecs.map(([k, v]) => (
              <span
                key={k}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-gray-300"
              >
                <strong className="text-blue-400 font-medium">{k}:</strong> {v}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
