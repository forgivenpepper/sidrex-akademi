'use client';

import React from 'react';

export function WireframeCapsuleSVG({
  className = '',
  size = 140,
  strokeColorCap = '#58b09c',
  strokeColorBody = '#0b2545',
}: {
  className?: string;
  size?: number;
  strokeColorCap?: string;
  strokeColorBody?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 1.8}
      viewBox="0 0 120 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-lg ${className}`}
    >
      <defs>
        <linearGradient id="capsuleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#58b09c" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#449784" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0b2545" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="capsuleGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0b2545" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#58b09c" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#a3d9ca" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Outer Capsule Contour */}
      <path
        d="M 25 60 A 35 35 0 0 1 95 60 L 95 160 A 35 35 0 0 1 25 160 Z"
        stroke="url(#capsuleGrad1)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Middle Separation Band (Capsule Joint) */}
      <ellipse
        cx="60"
        cy="110"
        rx="35"
        ry="14"
        stroke={strokeColorCap}
        strokeWidth="2.5"
        strokeDasharray="4 2"
        fill="none"
      />
      <ellipse
        cx="60"
        cy="110"
        rx="35"
        ry="8"
        stroke="url(#capsuleGrad2)"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Top Cap 3D Latitude Wireframe Rings */}
      <path
        d="M 30 45 A 30 10 0 0 0 90 45"
        stroke={strokeColorCap}
        strokeWidth="1.5"
        strokeOpacity="0.75"
        fill="none"
      />
      <path
        d="M 26 75 A 34 12 0 0 0 94 75"
        stroke={strokeColorCap}
        strokeWidth="1.5"
        strokeOpacity="0.8"
        fill="none"
      />
      <path
        d="M 25 92 A 35 13 0 0 0 95 92"
        stroke={strokeColorCap}
        strokeWidth="1.5"
        strokeOpacity="0.85"
        fill="none"
      />

      {/* Bottom Body 3D Latitude Wireframe Rings */}
      <path
        d="M 25 128 A 35 13 0 0 0 95 128"
        stroke={strokeColorBody}
        strokeWidth="1.5"
        strokeOpacity="0.75"
        fill="none"
      />
      <path
        d="M 26 145 A 34 12 0 0 0 94 145"
        stroke={strokeColorBody}
        strokeWidth="1.5"
        strokeOpacity="0.7"
        fill="none"
      />
      <path
        d="M 30 175 A 30 10 0 0 0 90 175"
        stroke={strokeColorBody}
        strokeWidth="1.5"
        strokeOpacity="0.65"
        fill="none"
      />

      {/* Longitudinal 3D Grid Curves (Kavisli Dikey Çizgiler) */}
      <path
        d="M 60 25 Q 40 110 60 195"
        stroke="url(#capsuleGrad1)"
        strokeWidth="1.5"
        strokeDasharray="6 3"
        strokeOpacity="0.85"
        fill="none"
      />
      <path
        d="M 60 25 Q 80 110 60 195"
        stroke="url(#capsuleGrad2)"
        strokeWidth="1.5"
        strokeDasharray="6 3"
        strokeOpacity="0.85"
        fill="none"
      />
      <path
        d="M 60 25 L 60 195"
        stroke={strokeColorCap}
        strokeWidth="1"
        strokeOpacity="0.5"
        fill="none"
      />

      {/* Decorative Glow Nodes */}
      <circle cx="60" cy="25" r="3" fill="#58b09c" />
      <circle cx="60" cy="195" r="3" fill="#0b2545" />
      <circle cx="25" cy="110" r="2.5" fill="#449784" />
      <circle cx="95" cy="110" r="2.5" fill="#449784" />
    </svg>
  );
}

export function FloatingWireframeCapsules() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Sol Üst Kapsül (Büyük, Yavaş Dönen & Süzülen) */}
      <div className="absolute top-12 left-4 md:left-12 opacity-85 animate-float-slow hidden sm:block">
        <div className="animate-capsule-spin">
          <WireframeCapsuleSVG size={130} />
        </div>
      </div>

      {/* 2. Sol Alt Kapsül (Orta Boy, Ters Yönde Dönen) */}
      <div className="absolute bottom-16 left-6 md:left-24 opacity-75 animate-float-reverse hidden sm:block">
        <div className="animate-capsule-spin-reverse">
          <WireframeCapsuleSVG size={100} strokeColorCap="#449784" />
        </div>
      </div>

      {/* 3. Sağ Üst Kapsül (Küçük/Orta Boy, Dönen) */}
      <div className="absolute top-16 right-6 md:right-20 opacity-80 animate-float-reverse hidden sm:block">
        <div className="animate-capsule-spin-reverse">
          <WireframeCapsuleSVG size={95} strokeColorBody="#58b09c" />
        </div>
      </div>

      {/* 4. Sağ Alt Kapsül (Büyük Boy, Yavaş Dönen) */}
      <div className="absolute bottom-12 right-4 md:right-14 opacity-85 animate-float-slow hidden sm:block">
        <div className="animate-capsule-spin">
          <WireframeCapsuleSVG size={140} />
        </div>
      </div>
    </div>
  );
}
