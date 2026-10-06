"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CaseMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-case-hero-copy] > *", { y: 26, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power4.out", delay: 0.18 });
      ScrollTrigger.batch("[data-case-reveal]", {
        start: "top 86%",
        once: true,
        onEnter: (elements) => gsap.from(elements, { y: 32, opacity: 0, duration: 0.75, stagger: 0.08, ease: "power3.out" }),
      });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return <div ref={root}>{children}</div>;
}
