'use client';

import React from 'react';

export function VerticalWireframeCapsuleSVG({
  className = '',
  size = 120,
  color = '#58b09c',
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 2}
      viewBox="0 0 100 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
    >
      {/* Outer Fine Capsule Outline (Dikey İlaç Kapsülü) */}
      <path
        d="M 20 50 A 30 30 0 0 1 80 50 L 80 150 A 30 30 0 0 1 20 150 Z"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.85"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Middle Separation Joint (Orta Birleşim Çizgisi) */}
      <ellipse
        cx="50"
        cy="100"
        rx="30"
        ry="9"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.9"
        fill="none"
      />

      {/* Horizontal Wireframe Latitude Rings (İnce İçi Çemberler) */}
      <path
        d="M 23 65 A 27 8 0 0 0 77 65"
        stroke={color}
        strokeWidth="0.8"
        strokeOpacity="0.6"
        fill="none"
      />
      <path
        d="M 20 82.5 A 30 9 0 0 0 80 82.5"
        stroke={color}
        strokeWidth="0.8"
        strokeOpacity="0.6"
        fill="none"
      />
      <path
        d="M 20 117.5 A 30 9 0 0 0 80 117.5"
        stroke={color}
        strokeWidth="0.8"
        strokeOpacity="0.6"
        fill="none"
      />
      <path
        d="M 23 135 A 27 8 0 0 0 77 135"
        stroke={color}
        strokeWidth="0.8"
        strokeOpacity="0.6"
        fill="none"
      />

      {/* Vertical Curved Longitude Wireframe Lines (Kavisli Dikey Çizgiler) */}
      <path
        d="M 50 20 Q 34 100 50 180"
        stroke={color}
        strokeWidth="0.8"
        strokeDasharray="4 3"
        strokeOpacity="0.65"
        fill="none"
      />
      <path
        d="M 50 20 Q 66 100 50 180"
        stroke={color}
        strokeWidth="0.8"
        strokeDasharray="4 3"
        strokeOpacity="0.65"
        fill="none"
      />
      <path
        d="M 50 20 L 50 180"
        stroke={color}
        strokeWidth="0.75"
        strokeOpacity="0.35"
        fill="none"
      />
    </svg>
  );
}

export function FloatingWireframeCapsules() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Sol Üst Dikey Kapsül (Büyük) */}
      <div className="absolute top-10 left-6 md:left-14 opacity-75 animate-float-vertical hidden sm:block">
        <div className="animate-capsule-y-spin">
          <VerticalWireframeCapsuleSVG size={110} color="#58b09c" />
        </div>
      </div>

      {/* 2. Sol Alt Dikey Kapsül (Orta Boy) */}
      <div className="absolute bottom-12 left-8 md:left-24 opacity-65 animate-float-vertical-reverse hidden sm:block">
        <div className="animate-capsule-y-spin-reverse">
          <VerticalWireframeCapsuleSVG size={85} color="#58b09c" />
        </div>
      </div>

      {/* 3. Sağ Üst Dikey Kapsül (Orta/Küçük Boy) */}
      <div className="absolute top-14 right-8 md:right-20 opacity-70 animate-float-vertical-reverse hidden sm:block">
        <div className="animate-capsule-y-spin-reverse">
          <VerticalWireframeCapsuleSVG size={80} color="#58b09c" />
        </div>
      </div>

      {/* 4. Sağ Alt Dikey Kapsül (Büyük Boy) */}
      <div className="absolute bottom-10 right-6 md:right-16 opacity-75 animate-float-vertical hidden sm:block">
        <div className="animate-capsule-y-spin">
          <VerticalWireframeCapsuleSVG size={120} color="#58b09c" />
        </div>
      </div>
    </div>
  );
}
