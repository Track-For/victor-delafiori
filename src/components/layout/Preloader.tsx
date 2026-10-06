"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("studio-intro-seen")) return;
    let cancelled = false;

    fetch("/brand/logo-symbol.svg")
      .then((response) => (response.ok ? response.text() : Promise.reject()))
      .then((svg) => {
        if (cancelled || !markRef.current || !rootRef.current) return;
        setVisible(true);
        markRef.current.innerHTML = svg;
        const parts = markRef.current.querySelectorAll<SVGGeometryElement>("path, line, circle, polyline, polygon");
        parts.forEach((part) => {
          const length = typeof part.getTotalLength === "function" ? part.getTotalLength() : 300;
          part.style.strokeDasharray = `${length}`;
          part.style.strokeDashoffset = `${length}`;
        });

        const target = document.querySelector<HTMLElement>("[data-brand-target]");
        const tl = gsap.timeline({
          onComplete: () => {
            sessionStorage.setItem("studio-intro-seen", "true");
            setVisible(false);
          },
        });
        tl.to(parts, { strokeDashoffset: 0, opacity: 1, duration: 0.9, stagger: 0.035, ease: "power2.inOut" })
          .to(markRef.current, {
            x: () => {
              if (!target || !markRef.current) return 0;
              return target.getBoundingClientRect().left - markRef.current.getBoundingClientRect().left;
            },
            y: () => {
              if (!target || !markRef.current) return 0;
              return target.getBoundingClientRect().top - markRef.current.getBoundingClientRect().top;
            },
            scale: 0.26,
            duration: 0.65,
            ease: "studio",
          },
          "+=0.12",
          )
          .to(rootRef.current, { autoAlpha: 0, duration: 0.35, ease: "power2.out" });
      })
      .catch(() => setVisible(false));

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={rootRef} className="preloader" data-visible={visible || undefined} aria-hidden="true">
      <div ref={markRef} className="preloader__mark" />
    </div>
  );
}
