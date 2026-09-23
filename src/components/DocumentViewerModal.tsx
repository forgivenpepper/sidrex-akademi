'use client';

import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Maximize, ExternalLink } from 'lucide-react';

interface DocumentViewerModalProps {
  url: string;
  title?: string;
  onClose: () => void;
}

export default function DocumentViewerModal({ url, title = 'Döküman Görüntüleyici', onClose }: DocumentViewerModalProps) {
  const [zoom, setZoom] = useState(1);
  const isPdf = url.toLowerCase().endsWith('.pdf') || url.includes('/pdf');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b2545]/90 backdrop-blur-sm p-4 md:p-8">
      <div 
        className="relative bg-white w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#58b09c]/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:px-6 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-[#0b2545] text-lg font-fraunces truncate pr-4">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            {!isPdf && (
              <div className="flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm mr-2 hidden sm:flex">
                <button onClick={handleZoomOut} className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors" title="Uzaklaştır">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button onClick={handleResetZoom} className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors" title="Orijinal Boyut">
                  <Maximize className="w-4 h-4" />
                </button>
                <button onClick={handleZoomIn} className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors" title="Yakınlaştır">
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            )}
            <a 
              href={url} 
              target="_blank" 
              rel="noreferrer"
              className="p-2 bg-[#edf7f3] text-[#58b09c] hover:bg-[#58b09c] hover:text-white rounded-xl transition-colors"
              title="Yeni Sekmede Aç"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button 
              onClick={onClose}
              className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-colors"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-slate-100/50 overflow-auto relative flex items-center justify-center p-4">
          {isPdf ? (
            <iframe 
              src={`${url}#toolbar=0`} 
              className="w-full h-full rounded-xl shadow-inner border border-slate-200"
              title={title}
            />
          ) : (
            <div 
              className="transition-transform duration-200 ease-out origin-center"
              style={{ transform: `scale(${zoom})` }}
            >
              <img 
                src={url} 
                alt={title} 
                className="max-w-full h-auto object-contain rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
