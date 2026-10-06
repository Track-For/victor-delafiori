"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const infinite = pathname === "/";
    const lenis = new Lenis({
      infinite,
      lerp: 0.08,
      overscroll: !infinite,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      syncTouch: infinite,
    });
    const update = (time: number) => lenis.raf(time * 1000);
    const handleClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
      if (!link) return;
      const id = link.getAttribute("href")?.replace(/^\//, "");
      if (!id || id === "#") return;
      const target = document.querySelector<HTMLElement>(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -72 });
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    document.addEventListener("click", handleClick);
    document.documentElement.toggleAttribute("data-infinite-scroll", infinite);

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      document.removeEventListener("click", handleClick);
      gsap.ticker.remove(update);
      lenis.destroy();
      document.documentElement.removeAttribute("data-infinite-scroll");
    };
  }, [pathname]);

  return null;
}
