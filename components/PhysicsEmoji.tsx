"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const EMOJIS = ["⚡️", "💡", "🚀", "💻", "🎯", "✨", "🔥", "🌟"];

export interface EmojiParticle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function PhysicsEmoji({
  particles,
  onRemove,
  emojiSize = 28,
}: {
  particles: EmojiParticle[];
  onRemove: (id: number) => void;
  emojiSize?: number;
}) {
  const stateRef = useRef<Map<number, EmojiParticle>>(new Map());
  const g = 0.6;

  useEffect(() => {
    particles.forEach((p) => stateRef.current.set(p.id, { ...p }));
  }, [particles]);

  const [positions, setPositions] = useState<Map<number, { x: number; y: number }>>(new Map());

  useEffect(() => {
    if (particles.length === 0) return;

    const run = () => {
      const next = new Map<number, { x: number; y: number }>();
      const toRemove: number[] = [];
      const viewH = window.innerHeight;

      stateRef.current.forEach((p, id) => {
        const vy = p.vy + g;
        const x = p.x + p.vx;
        const y = p.y + vy;
        p.x = x;
        p.y = y;
        p.vx = p.vx;
        p.vy = vy;
        next.set(id, { x, y });
        if (y > viewH + 80) toRemove.push(id);
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
  }, [particles.length, onRemove]);

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
  maxAngle: number
) {
  const [particles, setParticles] = useState<EmojiParticle[]>([]);
  const idRef = useRef(0);

  const spawn = useCallback(
    (originX: number, originY: number) => {
      const angleDeg = minAngle + Math.random() * (maxAngle - minAngle);
      const angleRad = (angleDeg * Math.PI) / 180;
      const speed = 8 + Math.random() * 6;
      const vx = Math.cos(angleRad) * speed * (Math.random() > 0.5 ? 1 : -1);
      const vy = -Math.sin(angleRad) * speed;

      const id = ++idRef.current;
      const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      setParticles((prev) => [
        ...prev,
        { id, emoji, x: originX, y: originY, vx, vy },
      ]);
    },
    [minAngle, maxAngle]
  );

  const remove = useCallback((id: number) => {
    setParticles((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { particles, spawn, remove };
}
