"use client";

import { useGSAP } from "@gsap/react";
import { RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

export function useParallax(ref: RefObject<HTMLElement | null>, amount = 6) {
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.fromTo(
        ref.current,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      return () => ScrollTrigger.refresh();
    },
    { dependencies: [amount, reduced], scope: ref },
  );
}
