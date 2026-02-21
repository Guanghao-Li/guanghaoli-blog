"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TWEMOJI_CDN = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg";
const TWEMOJI_CODEPOINTS = [
  "1f602", // 😂 笑哭
  "1f60e", // 😎 墨镜
  "1f4b0", // 💰 发财
  "1f970", // 🥰 比心/爱心眼
  "1f525", // 🔥 火焰
  "1f4a1", // 💡 灯泡
  "1f680", // 🚀 火箭
  "1f389", // 🎉 庆祝
  "1f31f", // 🌟 星星
  "1f4aa", // 💪 强壮
  "1f44d", // 👍 点赞
  "1f60d", // 😍 花痴
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
  onRemove,
  emojiSize = 36,
  gravity,
  friction,
}: {
  particles: EmojiParticle[];
  onRemove: (id: string) => void;
  emojiSize?: number;
  gravity: number;
  friction: number;
}) {
  const stateRef = useRef<Map<string, EmojiParticle>>(new Map());
  const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(new Map());

  useEffect(() => {
    particles.forEach((p) => stateRef.current.set(p.id, { ...p }));
  }, [particles]);

  useEffect(() => {
    if (particles.length === 0) return;

    const run = () => {
      const next = new Map<string, { x: number; y: number }>();
      const toRemove: string[] = [];
      const viewH = window.innerHeight;
      const t = Date.now() / 300;

      stateRef.current.forEach((p, id) => {
        p.vx *= friction;
        p.vy *= friction;
        p.vy += gravity;
        const drift = Math.sin(t + p.phase) * p.driftAmplitude;
        p.x += p.vx + drift;
        p.y += p.vy;
        next.set(id, { x: p.x, y: p.y });
        if (p.y > viewH + 80) toRemove.push(id);
      });

      toRemove.forEach((id) => {
        stateRef.current.delete(id);
        onRemove(id);
      });

      setPositions(new Map(next));
    };

    let raf: number;
    const loop = () => {
      run();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [particles.length, gravity, friction, onRemove]);

  return (
    <>
      {particles.map((p) => {
        const pos = positions.get(p.id) ?? { x: p.x, y: p.y };
        return (
          <div
            key={p.id}
            className="fixed pointer-events-none z-[60] select-none"
            style={{
              left: pos.x,
              top: pos.y,
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
        );
      })}
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
  const [particles, setParticles] = useState<EmojiParticle[]>([]);

  const spawn = useCallback(
    (centerX: number, centerY: number, radius: number) => {
      const count = 1 + Math.floor(Math.random() * 4);
      const newParticles: EmojiParticle[] = [];

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

        newParticles.push({
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

      setParticles((prev) => [...prev, ...newParticles]);
    },
    [minAngle, maxAngle, minVelocity, maxVelocity]
  );

  const remove = useCallback((id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { particles, spawn, remove };
}
