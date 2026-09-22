'use client';

import { Product } from '@/lib/types/database';
import { X, Mail, Video, Info } from 'lucide-react';
import { useEffect } from 'react';
import AntiPiracyWrapper from './AntiPiracyWrapper';

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

  const modelCode = product.specs ? product.specs['Model Kodu'] || product.slug : product.slug;
  const emailSubject = encodeURIComponent(`Ürün Bilgi Talebi: ${product.title} (Kod: ${modelCode})`);
  const emailBody = encodeURIComponent(
    `Merhaba Sidrex Ekibi,\n\n"${product.title}" (Model/Kod: ${modelCode}) ürününüz hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.\n\nİyi çalışmalar.`
  );
  const mailtoLink = `mailto:info@sidrex.com?subject=${emailSubject}&body=${emailBody}`;

  const renderVideoPlayer = () => {
    if (!product.video_url && !product.storage_video_path) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#edf7f3] rounded-2xl text-[#58b09c] p-8 text-center">
          <Video className="w-12 h-12 mb-3 opacity-80" />
          <p className="font-semibold text-slate-600 text-sm">Bu ürün için önizleme videosu bulunmamaktadır.</p>
        </div>
      );
    }

    const url = (product.video_url || '').trim();

    // 1. Embed iframe raw kodu
    if (product.video_type === 'embed' && url) {
      return (
        <AntiPiracyWrapper>
          <div
            className="w-full h-full flex items-center justify-center [&>iframe]:w-full [&>iframe]:h-full"
            dangerouslySetInnerHTML={{ __html: url }}
          />
        </AntiPiracyWrapper>
      );
    }

    // 2. YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/|watch\?.+&v=))([\w-]{11})/) ||
      (url.length === 11 && url.match(/^[\w-]{11}$/) ? [null, url] : null);

    if (product.video_type === 'youtube' || ytMatch) {
      const videoId = ytMatch ? ytMatch[1] : null;
      const embedUrl = videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
        : url;
      return (
        <AntiPiracyWrapper>
          <iframe
            src={embedUrl}
            title={product.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-2xl"
          />
        </AntiPiracyWrapper>
      );
    }

    // 3. Link tipi (MP4, WebM veya herhangi bir doğrudan video linki)
    if (product.video_type === 'link' || product.video_type === 'upload' || url.endsWith('.mp4') || url.endsWith('.webm') || product.storage_video_path) {
      const videoSrc = url || product.storage_video_path || '';
      return (
        <AntiPiracyWrapper>
          <video
            key={videoSrc}
            controls
            controlsList="nodownload nofullscreen noremoteplayback"
            onContextMenu={(e) => e.preventDefault()}
            disablePictureInPicture
            autoPlay
            playsInline
            className="w-full h-full object-contain rounded-2xl"
          >
            <source src={videoSrc} type="video/mp4" />
            <source src={videoSrc} type="video/webm" />
            <source src={videoSrc} />
            Tarayıcınız video oynatmayı desteklemiyor.
          </video>
        </AntiPiracyWrapper>
      );
    }

    // 4. Genel fallback — herhangi bir URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return (
        <AntiPiracyWrapper>
          <iframe
            src={url}
            title={product.title}
            allowFullScreen
            className="w-full h-full rounded-2xl"
          />
        </AntiPiracyWrapper>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#edf7f3] rounded-2xl text-[#58b09c] p-8 text-center">
        <Video className="w-12 h-12 mb-3 opacity-80" />
        <p className="font-semibold text-slate-600 text-sm">Bu ürün için önizleme videosu bulunmamaktadır.</p>
      </div>
    );
  };

  const specsList = product.specs ? Object.entries(product.specs) : [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fade-in select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#edf7f3]/50">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white border border-[#d1eae1] text-[#58b09c] shadow-sm">
              {product.sections?.title || 'Ürün Galerisi'}
            </span>
            <h2 className="text-lg font-extrabold text-[#0b2545] truncate max-w-md">{product.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#0b2545] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Video Container */}
          <div className="relative w-full aspect-video rounded-2xl bg-slate-900 shadow-lg border border-slate-200 overflow-hidden">
            {renderVideoPlayer()}
          </div>



          {/* Details & Specs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            {/* Description & Contact CTA */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ürün Detayı ve Açıklaması
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {product.description || 'Bu ürün hakkında henüz detaylı açıklama eklenmedi.'}
                </p>
              </div>

              {/* Pre-filled Email Contact Button */}
              <div className="p-5 rounded-3xl bg-[#edf7f3] border border-[#d1eae1] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <h4 className="font-bold text-[#0b2545] text-sm">Ürün Hakkında Bilgi Alın</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ürün adı ve künye kodu otomatik doldurulmuş e-posta ile ekibimizle iletişime geçin.
                  </p>
                </div>

                <a
                  href={mailtoLink}
                  className="w-full sm:w-auto px-6 py-3 bg-[#58b09c] hover:bg-[#449784] text-white font-bold text-xs rounded-2xl shadow-md shadow-[#58b09c]/30 transition-all flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <Mail className="w-4 h-4" />
                  <span>Sepete Ekle / İletişim</span>
                </a>
              </div>
            </div>

            {/* Technical Specs Table / Card */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#58b09c]" />
                Teknik Künye
              </h3>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 divide-y divide-slate-200/80 space-y-2">
                {specsList.length > 0 ? (
                  specsList.map(([key, value]) => (
                    <div key={key} className="pt-2 flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">{key}</span>
                      <span className="text-[#0b2545] font-bold text-right pl-2">{value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-2">
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
