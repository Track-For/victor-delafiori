"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function LoopHeroTransition({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (pathname !== "/" || reduced || !root.current) return;

      const surface = root.current.querySelector<HTMLElement>("[data-loop-hero-surface]");
      const footerContent = root.current.previousElementSibling as HTMLElement | null;
      if (!surface) return;

      gsap.set(surface, {
        yPercent: 10,
        scale: 0.965,
        clipPath: "inset(12% 2.5% 0% 2.5% round 28px 28px 0 0)",
        transformOrigin: "50% 100%",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "top top",
          scrub: 0.55,
          invalidateOnRefresh: true,
          onEnter: () => gsap.set(surface, { willChange: "transform, clip-path" }),
          onEnterBack: () => gsap.set(surface, { willChange: "transform, clip-path" }),
          onLeaveBack: () => gsap.set(surface, { clearProps: "willChange" }),
        },
      });

      timeline.to(surface, {
        yPercent: 0,
        scale: 1,
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        ease: "none",
      });

      if (footerContent) {
        timeline.to(
          footerContent,
          {
            yPercent: -3,
            scale: 0.975,
            autoAlpha: 0.48,
            transformOrigin: "50% 0%",
            ease: "none",
          },
          0,
        );
      }

      return () => {
        gsap.set(surface, { clearProps: "willChange" });
      };
    },
    { scope: root, dependencies: [pathname, reduced], revertOnUpdate: true },
  );

  if (pathname !== "/") return null;

  return (
    <div ref={root} className="loop-hero-transition" aria-hidden="true">
      <div className="loop-hero-transition__surface" data-loop-hero-surface>
        {children}
      </div>
    </div>
  );
}
