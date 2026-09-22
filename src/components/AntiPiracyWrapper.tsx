"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface AntiPiracyWrapperProps {
  children: React.ReactNode;
  userEmail?: string;
}

export default function AntiPiracyWrapper({ children, userEmail: propUserEmail }: AntiPiracyWrapperProps) {
  const [watermarkPos, setWatermarkPos] = useState({ top: 10, left: 10 });
  const [email, setEmail] = useState<string>(propUserEmail || '');
  const [isScreenshotting, setIsScreenshotting] = useState(false);
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

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center"
      onContextMenu={(e) => e.preventDefault()}
      style={{ isolation: 'isolate' }}
    >
      {/* Target Content (Video or Iframe) */}
      <div className="w-full h-full" style={{ pointerEvents: 'auto' }}>
        {children}
      </div>

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
