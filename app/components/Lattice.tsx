"use client";

import { motion, useReducedMotion } from "motion/react";

const TOTAL_CELLS = 100;
const STAGGER_SECONDS = 0.008;
const START_DELAY_SECONDS = 0.4;

interface LatticeProps {
  filled: number;
  removed: number;
}

export function Lattice({ filled, removed }: LatticeProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      role="img"
      aria-label={`Human Stupidity Index: ${filled} out of 100 cells filled. Zero is large-scale cooperation for shared benefit. One hundred is self-annihilation of the species.`}
      className="grid w-full max-w-[360px] grid-cols-10 gap-[2px]"
    >
      {Array.from({ length: TOTAL_CELLS }, (_, index) => {
        const isFilled = index < filled;
        const isRemoved = !isFilled && index < filled + removed;

        if (isFilled) {
          return (
            <motion.div
              key={index}
              aria-hidden="true"
              className="bg-ink aspect-square"
              initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.15,
                      ease: "easeOut",
                      delay: START_DELAY_SECONDS + index * STAGGER_SECONDS,
                    }
              }
            />
          );
        }

        return (
          <div
            key={index}
            aria-hidden="true"
            className={
              isRemoved
                ? "border-klein aspect-square border"
                : "border-rule aspect-square border"
            }
          />
        );
      })}
    </div>
  );
}
