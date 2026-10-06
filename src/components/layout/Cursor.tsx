"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SMOKE_PARTICLE_COUNT = 28;

type SmokeSpawner = (x: number, y: number, directionX: number, directionY: number) => void;

export function Cursor() {
  const layerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const smokeRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!isDesktop || reduced || !layerRef.current || !dotRef.current || !ringRef.current) return;
    const smoke = smokeRefs.current.filter((particle): particle is HTMLSpanElement => Boolean(particle));
    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.08, ease: "none" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.08, ease: "none" });
    const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.34, ease: "power3.out" });
    const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.34, ease: "power3.out" });
    const pointer = { x: 0, y: 0, active: false };
    const previous = { x: 0, y: 0 };
    const particleIndex = gsap.utils.wrap(0, smoke.length);
    let index = 0;

    const context = gsap.context((self) => {
      gsap.set(smoke, { autoAlpha: 0, xPercent: -50, yPercent: -50 });
      gsap.set([dotRef.current, ringRef.current], { autoAlpha: 0 });

      self.add("spawnSmoke", ((x: number, y: number, directionX: number, directionY: number) => {
        const particle = smoke[particleIndex(index)];
        if (!particle) return;

        const sideways = gsap.utils.random(-13, 13, 1);
        const lift = gsap.utils.random(14, 30, 1);
        const peakOpacity = gsap.utils.random(0.18, 0.3, 0.01);
        const openingScale = gsap.utils.random(0.82, 1.16, 0.01);
        const finalScale = gsap.utils.random(2.7, 3.7, 0.01);

        gsap.killTweensOf(particle);
        gsap.set(particle, {
          autoAlpha: 0,
          x,
          y,
          xPercent: -50,
          yPercent: -50,
          scale: 0.28,
          rotation: gsap.utils.random(-24, 24, 1),
          force3D: true,
          willChange: "transform, opacity",
        });

        gsap.timeline({
          onComplete: () => {
            particle.style.willChange = "auto";
          },
        })
          .to(particle, {
            autoAlpha: peakOpacity,
            scale: openingScale,
            duration: 0.16,
            ease: "power2.out",
            force3D: true,
            overwrite: "auto",
          })
          .to(particle, {
            autoAlpha: 0,
            x: `+=${sideways - directionX * 0.08}`,
            y: `-=${lift + Math.abs(directionY) * 0.04}`,
            scale: finalScale,
            rotation: `+=${gsap.utils.random(-28, 28, 1)}`,
            duration: 1.32,
            ease: "power1.out",
            force3D: true,
            overwrite: "auto",
          }, 0.08);

        index += 1;
      }) as SmokeSpawner);
    }, layerRef);

    const spawnSmoke = context.spawnSmoke as SmokeSpawner;

    const move = (event: PointerEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);

      if (!pointer.active) {
        pointer.active = true;
        previous.x = event.clientX;
        previous.y = event.clientY;
        gsap.set([dotRef.current, ringRef.current], { autoAlpha: 1 });
      }

      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const over = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      const value = target?.dataset.cursor ?? "";
      if (labelRef.current) labelRef.current.textContent = value;
      ringRef.current?.toggleAttribute("data-active", Boolean(value));
    };
    const leave = () => {
      pointer.active = false;
      gsap.set([dotRef.current, ringRef.current], { autoAlpha: 0 });
    };
    const smokeTrail = () => {
      if (!pointer.active) return;

      const deltaX = pointer.x - previous.x;
      const deltaY = pointer.y - previous.y;
      const distance = Math.hypot(deltaX, deltaY);
      const gap = 16;
      if (distance < gap) return;

      const steps = Math.min(Math.floor(distance / gap), 3);
      for (let step = 1; step <= steps; step += 1) {
        const progress = step / steps;
        spawnSmoke(
          previous.x + deltaX * progress,
          previous.y + deltaY * progress,
          deltaX,
          deltaY,
        );
      }

      previous.x = pointer.x;
      previous.y = pointer.y;
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    document.addEventListener("pointerover", over);
    gsap.ticker.add(smokeTrail);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      document.removeEventListener("pointerover", over);
      gsap.ticker.remove(smokeTrail);
      gsap.killTweensOf(smoke);
      context.revert();
    };
  }, [isDesktop, reduced]);

  if (!isDesktop || reduced) return null;
  return (
    <div className="cursor-layer" ref={layerRef} aria-hidden="true">
      <div className="cursor-smoke-field">
        {Array.from({ length: SMOKE_PARTICLE_COUNT }, (_, particle) => (
          <span
            className="cursor-smoke"
            key={particle}
            ref={(element) => {
              smokeRefs.current[particle] = element;
            }}
          />
        ))}
      </div>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef}>
        <span ref={labelRef} />
      </div>
    </div>
  );
}
