"use client";

import React, { useState, useEffect } from 'react';
import AntiPiracyWrapper from './AntiPiracyWrapper';

interface SecureVideoPlayerProps {
  productId: string;
  userEmail?: string;
}

export default function SecureVideoPlayer({ productId, userEmail }: SecureVideoPlayerProps) {
  const [tokenUrl, setTokenUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
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

  if (error) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-slate-900 rounded-xl border border-red-500/30">
        <p className="text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <AntiPiracyWrapper userEmail={userEmail}>
      {tokenUrl ? (
        <video
          src={tokenUrl}
          controls
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          disablePictureInPicture
          autoPlay
          className="w-full h-auto max-h-[70vh] mx-auto"
          style={{ pointerEvents: 'auto' }}
        />
      ) : (
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AntiPiracyWrapper>
  );
}
