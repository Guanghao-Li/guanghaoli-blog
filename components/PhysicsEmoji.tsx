"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const EMOJIS = ["⚡️", "💡", "🚀", "💻", "🎯", "✨", "🔥", "🌟"];

export interface EmojiParticle {
  id: string;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function rad(deg: number) {
  return (deg * Math.PI) / 180;
}

export default function PhysicsEmoji({
  particles,
  onRemove,
  emojiSize = 28,
  gravity,
}: {
  particles: EmojiParticle[];
  onRemove: (id: string) => void;
  emojiSize?: number;
  gravity: number;
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

      stateRef.current.forEach((p, id) => {
        p.vy += gravity;
        p.x += p.vx;
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
  }, [particles.length, gravity, onRemove]);

  return (
    <>
      {particles.map((p) => {
        const pos = positions.get(p.id) ?? { x: p.x, y: p.y };
        return (
          <span
            key={p.id}
            className="fixed pointer-events-none z-[60] select-none"
            style={{
              left: pos.x,
              top: pos.y,
              fontSize: `${emojiSize}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {p.emoji}
          </span>
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
  gravity: number
) {
  const [particles, setParticles] = useState<EmojiParticle[]>([]);

  const spawn = useCallback(
    (centerX: number, centerY: number, radius: number) => {
      const count = 1 + Math.floor(Math.random() * 4);
      const newParticles: EmojiParticle[] = [];

      for (let i = 0; i < count; i++) {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

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
          emoji,
          x: startX,
          y: startY,
          vx,
          vy,
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
