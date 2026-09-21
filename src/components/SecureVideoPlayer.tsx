"use client";

import React, { useState, useEffect, useRef } from 'react';

interface SecureVideoPlayerProps {
  videoUrl: string;
  userEmail?: string;
}

export default function SecureVideoPlayer({ videoUrl, userEmail }: SecureVideoPlayerProps) {
  const [watermarkPos, setWatermarkPos] = useState({ top: 10, left: 10 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Change watermark position every 5 seconds to prevent static screen recording
    const interval = setInterval(() => {
      if (containerRef.current) {
        // We use percentages to keep it responsive, avoiding edges (10% to 80%)
        const randomTop = Math.floor(Math.random() * 70) + 10;
        const randomLeft = Math.floor(Math.random() * 70) + 10;
        
        setWatermarkPos({ top: randomTop, left: randomLeft });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Use the proxy API route instead of the raw URL
  const secureStreamUrl = `/api/video-stream?url=${encodeURIComponent(videoUrl)}`;

  return (
    <div 
      ref={containerRef} 
      className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl shadow-lg bg-black group"
      // Prevent right click entirely on the container
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        src={secureStreamUrl}
        controls
        controlsList="nodownload"
        disablePictureInPicture
        className="w-full h-auto max-h-[70vh]"
        style={{ pointerEvents: 'auto' }}
      >
        Your browser does not support the video tag.
      </video>

      {/* Dynamic Anti-Piracy Watermark Overlay */}
      <div 
        className="absolute z-10 pointer-events-none transition-all duration-1000 ease-in-out select-none flex flex-col items-center justify-center opacity-50"
        style={{ 
          top: `${watermarkPos.top}%`, 
          left: `${watermarkPos.left}%`,
          transform: 'translate(-50%, -50%)',
          // Mix-blend-mode makes the text readable regardless of video background color
          mixBlendMode: 'difference',
          color: 'rgba(255, 255, 255, 0.7)'
        }}
      >
        <span className="font-bold text-lg md:text-xl tracking-wider text-center drop-shadow-md">
          PAYLAŞIM YASAKTIR
        </span>
        {userEmail && (
          <span className="text-xs md:text-sm font-medium tracking-wide drop-shadow-md">
            {userEmail}
          </span>
        )}
      </div>
    </div>
  );
}
