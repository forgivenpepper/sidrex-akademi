'use client';

import { Product } from '@/lib/types/database';
import { X, Mail, Video, ShieldCheck, CheckCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

interface VideoModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function VideoModal({ product, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  // Extract Model Code or ID for pre-filled email
  const modelCode = product.specs ? product.specs['Model Kodu'] || product.slug : product.slug;
  const emailSubject = encodeURIComponent(`Ürün Bilgi Talebi: ${product.title} (Kod: ${modelCode})`);
  const emailBody = encodeURIComponent(
    `Merhaba Sidrex Ekibi,\n\n"${product.title}" (Model/Kod: ${modelCode}) ürününüz hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.\n\nİyi çalışmalar.`
  );
  const mailtoLink = `mailto:info@sidrex.com?subject=${emailSubject}&body=${emailBody}`;

  // Helper to resolve video embed source
  const renderVideoPlayer = () => {
    if (product.video_type === 'youtube' && product.video_url) {
      let embedUrl = product.video_url;
      const ytMatch = product.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (ytMatch && ytMatch[1]) {
        embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
      }
      return (
        <iframe
          src={embedUrl}
          title={product.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-2xl"
        />
      );
    }

    if (product.video_type === 'vimeo' && product.video_url) {
      let embedUrl = product.video_url;
      const vimeoMatch = product.video_url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (vimeoMatch && vimeoMatch[1]) {
        embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
      }
      return (
        <iframe
          src={embedUrl}
          title={product.title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-2xl"
        />
      );
    }

    if (product.video_type === 'upload' && (product.video_url || product.storage_video_path)) {
      return (
        <video
          controls
          autoPlay
          className="w-full h-full object-cover rounded-2xl"
          src={product.video_url || ''}
        >
          Tarayıcınız video oynatmayı desteklemiyor.
        </video>
      );
    }

    if (product.video_type === 'embed' && product.video_url) {
      // If full iframe string provided
      if (product.video_url.includes('<iframe')) {
        return (
          <div
            className="w-full h-full flex items-center justify-center rounded-2xl overflow-hidden [&>iframe]:w-full [&>iframe]:h-full"
            dangerouslySetInnerHTML={{ __html: product.video_url }}
          />
        );
      }
      return (
        <iframe
          src={product.video_url}
          title={product.title}
          allowFullScreen
          className="w-full h-full rounded-2xl"
        />
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-2xl text-gray-400 p-8 text-center">
        <Video className="w-12 h-12 mb-3 text-gray-600" />
        <p>Bu ürün için önizleme videosu bulunmamaktadır.</p>
      </div>
    );
  };

  const specsList = product.specs ? Object.entries(product.specs) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 text-blue-400">
              {product.sections?.title || 'Ürün Galerisi'}
            </span>
            <h2 className="text-lg font-bold text-white truncate max-w-md">{product.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Video Container */}
          <div className="relative w-full aspect-video rounded-2xl bg-black shadow-2xl border border-white/10 overflow-hidden">
            {renderVideoPlayer()}
          </div>

          {/* Details & Specs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            {/* Description & Contact CTA */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Ürün Detayı ve Açıklaması
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-white/5">
                  {product.description || 'Bu ürün hakkında henüz detaylı açıklama eklenmedi.'}
                </p>
              </div>

              {/* Pre-filled Email Contact Button */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-white text-sm">Ürün Hakkında Detaylı Bilgi Alın</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Otomatik ürün adı ve künye kodu içeren e-posta ile uzman ekibimizle iletişime geçin.
                  </p>
                </div>

                <a
                  href={mailtoLink}
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <Mail className="w-4 h-4" />
                  <span>İletişime Geç (Pre-filled Mail)</span>
                </a>
              </div>
            </div>

            {/* Technical Specs Table / Card */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                Teknik Künye
              </h3>

              <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 divide-y divide-white/5 space-y-2">
                {specsList.length > 0 ? (
                  specsList.map(([key, value]) => (
                    <div key={key} className="pt-2 flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium">{key}</span>
                      <span className="text-white font-semibold text-right pl-2">{value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic text-center py-2">
                    Teknik künye bilgisi girilmedi.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
