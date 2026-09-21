"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SecureVideoPlayerProps {
  productId: string;
  userEmail?: string;
}

export default function SecureVideoPlayer({ productId, userEmail: propUserEmail }: SecureVideoPlayerProps) {
  const [watermarkPos, setWatermarkPos] = useState({ top: 10, left: 10 });
  const [email, setEmail] = useState<string>(propUserEmail || '');
  const [isScreenshotting, setIsScreenshotting] = useState(false);
  const [tokenUrl, setTokenUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Fetch user email if not provided via props
  useEffect(() => {
    if (!propUserEmail) {
      const fetchUser = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setEmail(user.email);
        }
      };
      fetchUser();
    }
  }, [propUserEmail]);

  // Fetch expiring token URL
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(`/api/video-stream/sign?productId=${productId}`);
        if (!res.ok) throw new Error('Video başlatılamadı');
        const data = await res.json();
        setTokenUrl(`/api/secure-media?token=${data.token}`);
      } catch (err) {
        setError('Video bağlantısı kurulamadı. Lütfen sayfayı yenileyin.');
      }
    };
    fetchToken();
  }, [productId]);

  useEffect(() => {
    // 1. Watermark movement
    const interval = setInterval(() => {
      if (containerRef.current) {
        const randomTop = Math.floor(Math.random() * 70) + 10;
        const randomLeft = Math.floor(Math.random() * 70) + 10;
        setWatermarkPos({ top: randomTop, left: randomLeft });
      }
    }, 5000);

    // 2. Screenshot & Snipping Tool Prevention Listener
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key or Win+Shift+S or Cmd+Shift+S / Cmd+Shift+3 / Cmd+Shift+4
      const isMacScreenshot = e.metaKey && e.shiftKey && ['s', '3', '4', '5'].includes(e.key.toLowerCase());
      const isWinScreenshot = (e.metaKey && e.shiftKey && e.key.toLowerCase() === 's') || e.key === 'PrintScreen';
      
      if (isMacScreenshot || isWinScreenshot || e.key === 'PrintScreen') {
        setIsScreenshotting(true);
        setTimeout(() => setIsScreenshotting(false), 4000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-slate-900 rounded-xl border border-red-500/30">
        <p className="text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl flex items-center justify-center"
      onContextMenu={(e) => e.preventDefault()}
      style={{ isolation: 'isolate' }}
    >
      {/* Video Element */}
      {tokenUrl ? (
        <video
          src={tokenUrl}
          controls
          controlsList="nodownload"
          disablePictureInPicture
          autoPlay
          className="w-full h-auto max-h-[70vh]"
          style={{ pointerEvents: 'auto' }}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Dynamic Anti-Piracy Watermark Overlay */}
      <div 
        className="absolute z-10 pointer-events-none transition-all duration-1000 ease-in-out select-none flex flex-col items-center justify-center opacity-50"
        style={{ 
          top: `${watermarkPos.top}%`, 
          left: `${watermarkPos.left}%`,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
          color: 'rgba(255, 255, 255, 0.7)'
        }}
      >
        <span className="font-bold text-lg md:text-xl tracking-wider text-center drop-shadow-md">
          PAYLAŞIM YASAKTIR
        </span>
        {email && (
          <span className="text-xs md:text-sm font-medium tracking-wide drop-shadow-md">
            {email}
          </span>
        )}
      </div>

      {/* Massive Black Overlay on Screenshot Attempt */}
      {isScreenshotting && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center text-red-500 font-bold p-8 text-center animate-pulse">
          <span className="text-3xl md:text-5xl mb-4">PAYLAŞIM YASAKTIR</span>
          <span className="text-xl md:text-2xl text-white">Bu içerik telif hakları ile korunmaktadır.</span>
          {email && (
            <span className="mt-8 text-lg text-gray-400">Kayıtlı Kullanıcı: {email}</span>
          )}
        </div>
      )}
    </div>
  );
}
