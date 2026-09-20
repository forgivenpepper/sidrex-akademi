'use client';

import React, { useEffect, useRef } from 'react';

interface CapsuleConfig {
  xPct: number;        // Screen X % (0-100)
  yPct: number;        // Screen Y % (0-100)
  radius: number;      // Capsule radius
  bodyHeight: number;  // Body length
  scale: number;       // Base scale multiplier
  rotY: number;        // Initial Y rotation angle
  rotSpeed: number;    // Y rotation speed (rad/frame)
  tiltX: number;       // Fixed tilt X
  tiltZ: number;       // Fixed tilt Z
  floatSpeed: number;  // Floating bob frequency
  floatAmp: number;    // Floating amplitude in px
  floatPhase: number;  // Phase offset
  color: string;       // Color theme (hex/rgba)
  hideOnMobile?: boolean;
}

export function FloatingWireframeCapsules() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Define 4 Floating 3D Capsules in screen space
    const capsules: CapsuleConfig[] = [
      {
        xPct: 12,
        yPct: 22,
        radius: 26,
        bodyHeight: 65,
        scale: 1.0,
        rotY: 0,
        rotSpeed: 0.008,
        tiltX: 0.35,
        tiltZ: -0.2,
        floatSpeed: 0.0012,
        floatAmp: 18,
        floatPhase: 0,
        color: '#58b09c',
        hideOnMobile: true,
      },
      {
        xPct: 15,
        yPct: 78,
        radius: 22,
        bodyHeight: 52,
        scale: 0.9,
        rotY: 1.2,
        rotSpeed: -0.007,
        tiltX: -0.25,
        tiltZ: 0.3,
        floatSpeed: 0.001,
        floatAmp: 15,
        floatPhase: 2.5,
        color: '#58b09c',
        hideOnMobile: true,
      },
      {
        xPct: 86,
        yPct: 20,
        radius: 20,
        bodyHeight: 48,
        scale: 0.85,
        rotY: 2.1,
        rotSpeed: -0.009,
        tiltX: 0.3,
        tiltZ: 0.25,
        floatSpeed: 0.0014,
        floatAmp: 14,
        floatPhase: 1.2,
        color: '#58b09c',
        hideOnMobile: true,
      },
      {
        xPct: 87,
        yPct: 80,
        radius: 28,
        bodyHeight: 70,
        scale: 1.1,
        rotY: 0.5,
        rotSpeed: 0.0075,
        tiltX: -0.3,
        tiltZ: -0.25,
        floatSpeed: 0.0011,
        floatAmp: 20,
        floatPhase: 4.1,
        color: '#58b09c',
        hideOnMobile: true,
      },
    ];

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Pre-generate 3D Capsule Mesh template
    const buildCapsuleMesh = (radius: number, bodyHeight: number) => {
      const halfBody = bodyHeight / 2;
      const latRings = 2; // latitude rings on each dome
      const lonLines = 8; // longitude meridian lines
      const rings: { x: number; y: number; z: number }[][] = [];

      // 1. Top dome latitude rings
      for (let i = 1; i <= latRings; i++) {
        const phi = (Math.PI / 2) * (i / (latRings + 1));
        const r = radius * Math.sin(phi);
        const y = -halfBody - radius * Math.cos(phi);
        const ringPoints = [];
        for (let j = 0; j < lonLines; j++) {
          const theta = (2 * Math.PI * j) / lonLines;
          ringPoints.push({ x: r * Math.cos(theta), y, z: r * Math.sin(theta) });
        }
        rings.push(ringPoints);
      }

      // 2. Body rings (top equator, joint ring, bottom equator)
      const bodyYs = [-halfBody, -halfBody * 0.5, 0, halfBody * 0.5, halfBody];
      const jointRingIndex = 2; // Index of y = 0

      bodyYs.forEach((y) => {
        const ringPoints = [];
        for (let j = 0; j < lonLines; j++) {
          const theta = (2 * Math.PI * j) / lonLines;
          ringPoints.push({ x: radius * Math.cos(theta), y, z: radius * Math.sin(theta) });
        }
        rings.push(ringPoints);
      });

      // 3. Bottom dome latitude rings
      for (let i = latRings; i >= 1; i--) {
        const phi = (Math.PI / 2) * (i / (latRings + 1));
        const r = radius * Math.sin(phi);
        const y = halfBody + radius * Math.cos(phi);
        const ringPoints = [];
        for (let j = 0; j < lonLines; j++) {
          const theta = (2 * Math.PI * j) / lonLines;
          ringPoints.push({ x: r * Math.cos(theta), y, z: r * Math.sin(theta) });
        }
        rings.push(ringPoints);
      }

      const topPole = { x: 0, y: -halfBody - radius, z: 0 };
      const bottomPole = { x: 0, y: halfBody + radius, z: 0 };

      return { rings, topPole, bottomPole, lonLines, jointRingIndex: latRings + jointRingIndex };
    };

    // Cache mesh templates
    const meshes = capsules.map((c) => buildCapsuleMesh(c.radius, c.bodyHeight));

    let startTime = performance.now();

    const projectPoint = (
      p: { x: number; y: number; z: number },
      rotY: number,
      tiltX: number,
      tiltZ: number,
      cx: number,
      cy: number,
      scale: number
    ) => {
      // Model scale
      let x = p.x * scale;
      let y = p.y * scale;
      let z = p.z * scale;

      // Rotate Y (Spin around axis)
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      let x1 = x * cosY + z * sinY;
      let z1 = -x * sinY + z * cosY;
      let y1 = y;

      // Tilt X
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);
      let y2 = y1 * cosX - z1 * sinX;
      let z2 = y1 * sinX + z1 * cosX;
      let x2 = x1;

      // Tilt Z
      const cosZ = Math.cos(tiltZ);
      const sinZ = Math.sin(tiltZ);
      let x3 = x2 * cosZ - y2 * sinZ;
      let y3 = x2 * sinZ + y2 * cosZ;
      let z3 = z2;

      // Perspective Projection
      const fov = 450;
      const perspective = fov / (fov + z3);

      return {
        px: cx + x3 * perspective,
        py: cy + y3 * perspective,
        z: z3,
        perspective,
      };
    };

    const render = (time: number) => {
      const elapsed = time - startTime;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 640;

      ctx.clearRect(0, 0, width, height);

      capsules.forEach((capsule, cIdx) => {
        if (isMobile && capsule.hideOnMobile) return;

        const mesh = meshes[cIdx];

        // Rotation & Floating offset
        capsule.rotY += capsule.rotSpeed;
        const floatOffsetY = Math.sin(elapsed * capsule.floatSpeed + capsule.floatPhase) * capsule.floatAmp;

        const cx = (width * capsule.xPct) / 100;
        const cy = (height * capsule.yPct) / 100 + floatOffsetY;

        // Project all points
        const projectedRings = mesh.rings.map((ring) =>
          ring.map((p) =>
            projectPoint(p, capsule.rotY, capsule.tiltX, capsule.tiltZ, cx, cy, capsule.scale)
          )
        );

        const projTopPole = projectPoint(
          mesh.topPole,
          capsule.rotY,
          capsule.tiltX,
          capsule.tiltZ,
          cx,
          cy,
          capsule.scale
        );
        const projBottomPole = projectPoint(
          mesh.bottomPole,
          capsule.rotY,
          capsule.tiltX,
          capsule.tiltZ,
          cx,
          cy,
          capsule.scale
        );

        // Render Latitude Rings
        projectedRings.forEach((ring, rIdx) => {
          const isJoint = rIdx === mesh.jointRingIndex;

          ctx.beginPath();
          for (let i = 0; i < ring.length; i++) {
            const curr = ring[i];
            const next = ring[(i + 1) % ring.length];

            // Draw line segment with depth opacity calculation
            const avgZ = (curr.z + next.z) / 2;
            const depthAlpha = avgZ < 0 ? 0.75 : 0.28; // Front brighter, back softer

            ctx.beginPath();
            ctx.moveTo(curr.px, curr.py);
            ctx.lineTo(next.px, next.py);

            ctx.lineWidth = isJoint ? (avgZ < 0 ? 1.2 : 0.8) : (avgZ < 0 ? 0.75 : 0.5);
            ctx.strokeStyle = isJoint
              ? `rgba(88, 176, 156, ${depthAlpha * 1.2})`
              : `rgba(88, 176, 156, ${depthAlpha})`;
            ctx.stroke();
          }
        });

        // Render Longitude Lines (Meridians)
        for (let j = 0; j < mesh.lonLines; j++) {
          // Top Pole to First Ring
          const firstPoint = projectedRings[0][j];
          const topZ = (projTopPole.z + firstPoint.z) / 2;
          ctx.beginPath();
          ctx.moveTo(projTopPole.px, projTopPole.py);
          ctx.lineTo(firstPoint.px, firstPoint.py);
          ctx.lineWidth = topZ < 0 ? 0.75 : 0.5;
          ctx.strokeStyle = `rgba(88, 176, 156, ${topZ < 0 ? 0.65 : 0.25})`;
          ctx.stroke();

          // Connect Ring to Ring along longitude
          for (let r = 0; r < projectedRings.length - 1; r++) {
            const p1 = projectedRings[r][j];
            const p2 = projectedRings[r + 1][j];
            const avgZ = (p1.z + p2.z) / 2;

            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.lineWidth = avgZ < 0 ? 0.75 : 0.45;
            ctx.strokeStyle = `rgba(88, 176, 156, ${avgZ < 0 ? 0.65 : 0.25})`;
            ctx.stroke();
          }

          // Last Ring to Bottom Pole
          const lastPoint = projectedRings[projectedRings.length - 1][j];
          const botZ = (projBottomPole.z + lastPoint.z) / 2;
          ctx.beginPath();
          ctx.moveTo(lastPoint.px, lastPoint.py);
          ctx.lineTo(projBottomPole.px, projBottomPole.py);
          ctx.lineWidth = botZ < 0 ? 0.75 : 0.5;
          ctx.strokeStyle = `rgba(88, 176, 156, ${botZ < 0 ? 0.65 : 0.25})`;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
}
