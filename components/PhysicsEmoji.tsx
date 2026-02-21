"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

const EMOJIS = ["⚡️", "💡", "🚀", "💻", "🎯", "✨", "🔥", "🌟"];

export interface EmojiParticle {
  id: string;
  emoji: string;
  originX: number;
  originY: number;
  deltaX: number;
  gravity: number;
  duration: number;
}

function randDeltaX() {
  return (Math.random() - 0.5) * 400;
}

export default function PhysicsEmoji({
  particles,
  onRemove,
  emojiSize = 28,
}: {
  particles: EmojiParticle[];
  onRemove: (id: string) => void;
  emojiSize?: number;
}) {
  return (
    <>
      {particles.map((p) => (
        <Particle
          key={p.id}
          particle={p}
          emojiSize={emojiSize}
          onComplete={() => onRemove(p.id)}
        />
      ))}
    </>
  );
}

function Particle({
  particle,
  emojiSize,
  onComplete,
}: {
  particle: EmojiParticle;
  emojiSize: number;
  onComplete: () => void;
}) {
  const { id, emoji, originX, originY, deltaX, gravity, duration } = particle;

  return (
    <motion.span
      className="fixed pointer-events-none z-[60] select-none"
      style={{
        left: originX,
        top: originY,
        fontSize: `${emojiSize}px`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ x: 0, y: 0 }}
      animate={{
        x: deltaX,
        y: [0, -150, gravity],
      }}
      transition={{
        duration,
        ease: ["easeOut", "easeOut", "easeIn"],
        times: [0, 0.2, 1],
      }}
      onAnimationComplete={onComplete}
    >
      {emoji}
    </motion.span>
  );
}

export function usePhysicsEmojis(
  emojiSize: number,
  minAngle: number,
  maxAngle: number,
  gravity = 1000,
  animationSpeed = 2
) {
  const [particles, setParticles] = useState<EmojiParticle[]>([]);

  const spawn = useCallback(
    (originX: number, originY: number) => {
      const count = 1 + Math.floor(Math.random() * 4);
      const newParticles: EmojiParticle[] = [];
      for (let i = 0; i < count; i++) {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        const deltaX = randDeltaX();
        newParticles.push({
          id,
          emoji,
          originX,
          originY,
          deltaX,
          gravity,
          duration: animationSpeed,
        });
      }
      setParticles((prev) => [...prev, ...newParticles]);
    },
    [gravity, animationSpeed]
  );

  const remove = useCallback((id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { particles, spawn, remove };
}
