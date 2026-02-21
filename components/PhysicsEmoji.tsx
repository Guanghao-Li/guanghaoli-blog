"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TWEMOJI_CDN = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg";
const TWEMOJI_CODEPOINTS = [
  "1f602", "1f60e", "1f4b0", "1f970", "1f525", "1f4a1", "1f680",
  "1f389", "1f31f", "1f4aa", "1f44d", "1f60d",
];
const TWEMOJI_URLS = TWEMOJI_CODEPOINTS.map((cp) => `${TWEMOJI_CDN}/${cp}.svg`);

export interface EmojiParticle {
  id: string;
  imgUrl: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  driftAmplitude: number;
}

function rad(deg: number) {
  return (deg * Math.PI) / 180;
}

export default function PhysicsEmoji({
  particles,
  emojiSize = 36,
}: {
  particles: EmojiParticle[];
  emojiSize?: number;
}) {
  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-[60] select-none"
          style={{
            left: p.x,
            top: p.y,
            width: emojiSize,
            height: emojiSize,
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src={p.imgUrl}
            alt=""
            draggable={false}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </>
  );
}

export function usePhysicsEmojis(
  emojiSize: number,
  minAngle: number,
  maxAngle: number,
  minVelocity: number,
  maxVelocity: number,
  gravity: number,
  friction: number
) {
  const particlesRef = useRef<EmojiParticle[]>([]);
  const rafRef = useRef<number | null>(null);
  const [renderParticles, setRenderParticles] = useState<EmojiParticle[]>([]);

  const gravityRef = useRef(gravity);
  const frictionRef = useRef(friction);
  gravityRef.current = gravity;
  frictionRef.current = friction;

  const scheduleRender = useCallback(() => {
    setRenderParticles(particlesRef.current.map((p) => ({ ...p })));
  }, []);

  useEffect(() => {
    const loop = () => {
      const g = gravityRef.current;
      const f = frictionRef.current;
      const viewH = window.innerHeight;
      const t = Date.now() / 300;

      const arr = particlesRef.current;
      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i];
        p.vx *= f;
        p.vy *= f;
        p.vy += g;
        const drift = Math.sin(t + p.phase) * p.driftAmplitude;
        p.x += p.vx + drift;
        p.y += p.vy;
        if (p.y > viewH + 80) arr.splice(i, 1);
      }

      scheduleRender();
      rafRef.current = requestAnimationFrame(loop);
    };

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [scheduleRender]);

  const spawn = useCallback(
    (centerX: number, centerY: number, radius: number) => {
      const count = 1 + Math.floor(Math.random() * 4);

      for (let i = 0; i < count; i++) {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const imgUrl = TWEMOJI_URLS[Math.floor(Math.random() * TWEMOJI_URLS.length)];

        const aLo = Math.min(minAngle, maxAngle);
        const aHi = Math.max(minAngle, maxAngle);
        const thetaDeg = aLo + Math.random() * (aHi - aLo || 1);
        const theta = rad(thetaDeg);

        const offsetX = radius * Math.cos(theta);
        const offsetY = -radius * Math.sin(theta);
        const startX = centerX + offsetX;
        const startY = centerY + offsetY;

        const lo = Math.min(minVelocity, maxVelocity);
        const hi = Math.max(minVelocity, maxVelocity);
        const v0 = lo + Math.random() * (hi - lo || 1);
        const vx = v0 * Math.cos(theta);
        const vy = -v0 * Math.sin(theta);

        particlesRef.current.push({
          id,
          imgUrl,
          x: startX,
          y: startY,
          vx,
          vy,
          phase: Math.random() * Math.PI * 2,
          driftAmplitude: 0.3 + Math.random() * 0.7,
        });
      }

      scheduleRender();
    },
    [minAngle, maxAngle, minVelocity, maxVelocity, scheduleRender]
  );

  return { particles: renderParticles, spawn };
}
