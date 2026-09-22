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

    // (Screenshot prevention moved down)

    // 3. Block all right-clicks on the page while video is open
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // 4. Intercept any anchor tag clicks that might open new tabs
    const blockNewTab = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && (anchor.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('contextmenu', blockContextMenu, true);
      container.addEventListener('click', blockNewTab, true);
    }

    // Use capture phase (true) to intercept before any other script/browser defaults
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Screenshot shortcuts
      const isMacScreenshot = e.metaKey && e.shiftKey && ['s', '3', '4', '5'].includes(e.key.toLowerCase());
      const isWinScreenshot = (e.metaKey && e.shiftKey && e.key.toLowerCase() === 's') || e.key === 'PrintScreen';
      
      // 2. DevTools & Source Code shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Cmd+Opt+I, Cmd+Opt+U)
      const isDevTools = 
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.key.toLowerCase() === 'u') ||
        (e.metaKey && e.altKey && ['i', 'j', 'u'].includes(e.key.toLowerCase())) ||
        (e.metaKey && e.key.toLowerCase() === 'u');

      if (isMacScreenshot || isWinScreenshot || e.key === 'PrintScreen' || (e.metaKey && e.shiftKey) || isDevTools) {
        e.preventDefault(); 
        if (!isDevTools) {
          setIsScreenshotting(true);
          setTimeout(() => setIsScreenshotting(false), 4000);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown, true);

    // MULTI-LAYER DEVTOOLS DETECTION TRAP
    const devToolsCheck = setInterval(() => {
      let devToolsOpen = false;

      // 1. Window size check (detects docked DevTools)
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        devToolsOpen = true;
      }

      // 2. Debugger execution time check (detects undocked DevTools if breakpoints are active)
      const start = performance.now();
      // Literal debugger statement - no eval() so CSP won't block it
      debugger; 
      const end = performance.now();
      if (end - start > 100) {
        devToolsOpen = true;
      }

      if (devToolsOpen) {
        setIsScreenshotting(true); // Unmount video DOM
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(devToolsCheck);
      window.removeEventListener('keydown', handleKeyDown, true);
      if (container) {
        container.removeEventListener('contextmenu', blockContextMenu, true);
        container.removeEventListener('click', blockNewTab, true);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center"
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
      style={{ isolation: 'isolate', userSelect: 'none' }}
    >
      {/* Target Content (Video or Iframe) - UNMOUNT completely when devtools/screenshot triggers so source code disappears! */}
      <div className="w-full h-full" style={{ pointerEvents: 'auto' }}>
        {!isScreenshotting && children}
      </div>

      {/* FORENSIC HIDDEN WATERMARK (Almost invisible, repeating grid) */}
      {email && (
        <div 
          className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden"
          style={{ opacity: 0.03, mixBlendMode: 'overlay' }} 
        >
          {/* Create a dense grid of the user's email rotated - hidden from plain sight but retrievable via contrast tweaks */}
          <div className="w-[200%] h-[200%] -ml-[50%] -mt-[50%] flex flex-wrap gap-8 transform -rotate-12 justify-center items-center">
            {Array.from({ length: 150 }).map((_, i) => (
              <span key={i} className="text-white text-[10px] sm:text-xs font-mono font-bold whitespace-nowrap">
                {email} • SIDREX
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Anti-Piracy Watermark Overlay (The visible moving one) */}
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
