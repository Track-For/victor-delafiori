"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ContextSafe = ReturnType<typeof useGSAP>["contextSafe"];

function setupHeroGlobeInteraction(rootElement: HTMLDivElement, contextSafe: ContextSafe) {
  const orbit = rootElement.querySelector<HTMLElement>("[data-hero-orbit]");
  const heroSurface = rootElement.querySelector<HTMLElement>("[data-hero-drag-surface]");
  if (!orbit || !heroSurface) return;

  const loopOrbit = document.querySelector<HTMLElement>(".hero--loop-clone [data-hero-orbit]");
  const orbitTargets = [orbit];
  if (loopOrbit) orbitTargets.push(loopOrbit);

  gsap.set(orbitTargets, { force3D: true });
  const setRotationX = gsap.quickSetter(orbit, "rotationX", "deg");
  const setRotationY = gsap.quickSetter(orbit, "rotationY", "deg");
  const setLoopRotationX = loopOrbit ? gsap.quickSetter(loopOrbit, "rotationX", "deg") : null;
  const setLoopRotationY = loopOrbit ? gsap.quickSetter(loopOrbit, "rotationY", "deg") : null;
  let dragging = false;
  let pointerId = -1;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  let velocityX = 0;
  let velocityY = 0;
  let rotationX = Number(gsap.getProperty(orbit, "rotationX")) || -6;
  let rotationY = Number(gsap.getProperty(orbit, "rotationY")) || -14;

  const applyRotation = (x: number, y: number) => {
    setRotationX(x);
    setRotationY(y);
    setLoopRotationX?.(x);
    setLoopRotationY?.(y);
  };

  const onPointerDown = contextSafe((event: PointerEvent) => {
    const eye = rootElement.querySelector<HTMLElement>("[data-hero-eye]");
    const eyeVisible = eye && getComputedStyle(eye).display !== "none" && Number(getComputedStyle(eye).opacity) > 0.01;
    if (eyeVisible || !event.isPrimary || event.button > 0) return;
    if (event.target instanceof Element && event.target.closest("a, button, input, textarea")) return;

    dragging = true;
    pointerId = event.pointerId;
    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = performance.now();
    velocityX = 0;
    velocityY = 0;
    rotationX = Number(gsap.getProperty(orbit, "rotationX"));
    rotationY = Number(gsap.getProperty(orbit, "rotationY"));
    gsap.killTweensOf(orbitTargets);
    orbitTargets.forEach((target) => { target.style.willChange = "transform"; });
    heroSurface.dataset.dragging = "";
    try {
      heroSurface.setPointerCapture(event.pointerId);
    } catch {
      // Some embedded browsers do not expose pointer capture for synthetic pointers.
    }
  });

  const onPointerMove = contextSafe((event: PointerEvent) => {
    if (!dragging || event.pointerId !== pointerId) return;
    if (event.cancelable) event.preventDefault();

    const now = performance.now();
    const elapsed = Math.max(8, now - lastTime);
    const deltaRotationX = (lastY - event.clientY) * 0.22;
    const deltaRotationY = (event.clientX - lastX) * 0.28;
    rotationX = gsap.utils.clamp(-68, 68, rotationX + deltaRotationX);
    rotationY += deltaRotationY;
    velocityX = deltaRotationX / elapsed;
    velocityY = deltaRotationY / elapsed;
    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = now;
    applyRotation(rotationX, rotationY);
  });

  const onPointerEnd = contextSafe((event: PointerEvent) => {
    if (!dragging || event.pointerId !== pointerId) return;
    dragging = false;
    delete heroSurface.dataset.dragging;
    if (heroSurface.hasPointerCapture(event.pointerId)) heroSurface.releasePointerCapture(event.pointerId);

    rotationX = gsap.utils.clamp(-68, 68, rotationX + velocityX * 180);
    rotationY += velocityY * 220;
    gsap.to(orbitTargets, {
      rotationX,
      rotationY,
      duration: gsap.utils.clamp(0.65, 1.35, 0.78 + Math.hypot(velocityX, velocityY) * 1.6),
      ease: "power3.out",
      overwrite: "auto",
      force3D: true,
      onComplete: () => {
        orbitTargets.forEach((target) => { target.style.willChange = "auto"; });
      },
    });
  });

  heroSurface.addEventListener("pointerdown", onPointerDown);
  heroSurface.addEventListener("pointermove", onPointerMove);
  heroSurface.addEventListener("pointerup", onPointerEnd);
  heroSurface.addEventListener("pointercancel", onPointerEnd);
  heroSurface.addEventListener("lostpointercapture", onPointerEnd);

  return () => {
    delete heroSurface.dataset.dragging;
    heroSurface.removeEventListener("pointerdown", onPointerDown);
    heroSurface.removeEventListener("pointermove", onPointerMove);
    heroSurface.removeEventListener("pointerup", onPointerEnd);
    heroSurface.removeEventListener("pointercancel", onPointerEnd);
    heroSurface.removeEventListener("lostpointercapture", onPointerEnd);
  };
}

export function HomeMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { contextSafe: safeGlobeInteraction } = useGSAP({ scope: root });

  useEffect(() => {
    if (!root.current) return;
    return setupHeroGlobeInteraction(root.current, safeGlobeInteraction);
  }, [safeGlobeInteraction]);

  useGSAP(
    () => {
      if (!root.current || reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const splitInstances: SplitText[] = [];

      const heroTitle = root.current.querySelector<HTMLElement>("[data-hero-title]");
      if (heroTitle) {
        const split = SplitText.create(heroTitle, { type: "words", wordsClass: "hero-word" });
        splitInstances.push(split);
        const eye = root.current.querySelector<HTMLElement>("[data-hero-eye]");
        const eyeImage = root.current.querySelector<HTMLElement>("[data-hero-eye-image]");
        const eyeTarget = root.current.querySelector<HTMLElement>("[data-hero-eye-target]");
        const archiveCards = gsap.utils.toArray<HTMLElement>("[data-hero-card]");
        const heroItems = gsap.utils.toArray<HTMLElement>("[data-hero-item]");
        const heroTimeline = gsap.timeline({ delay: 0.18, defaults: { ease: "power4.out" } });

        gsap.set(archiveCards, { autoAlpha: 0, scale: 0.34, transformOrigin: "50% 50%" });
        gsap.set(split.words, { autoAlpha: 0, yPercent: 115 });
        gsap.set(heroItems, { autoAlpha: 0, y: 18 });

        if (eye && eyeImage && eyeTarget) {
          heroTimeline
            .fromTo(eyeImage, { autoAlpha: 0.65, scale: 1.035 }, { autoAlpha: 1, scale: 1, duration: 0.72, ease: "power2.out" })
            .fromTo(eyeTarget, { autoAlpha: 0, scale: 0.72 }, { autoAlpha: 1, scale: 1, duration: 0.58 }, "-=0.38")
            .to(eyeTarget, { autoAlpha: 0, scale: 1.32, duration: 0.48, ease: "power2.in" }, "+=0.12")
            .to(eyeImage, { scale: 9, duration: 1.42, ease: "power3.in" }, "-=0.2")
            .addLabel("archiveReveal", "-=0.3")
            .to(eye, { autoAlpha: 0, duration: 0.52, ease: "power2.out" }, "archiveReveal")
            .set(eye, { display: "none" });
        } else {
          heroTimeline.addLabel("archiveReveal");
        }

        heroTimeline
          .to(archiveCards, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.86,
            stagger: { each: 0.055, from: "center" },
            ease: "power3.out",
          }, "archiveReveal")
          .to(split.words, { autoAlpha: 1, yPercent: 0, duration: 0.82, stagger: 0.04 }, "archiveReveal+=0.12")
          .to(heroItems, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 }, "archiveReveal+=0.35");
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal-line]").forEach((line) => {
        gsap.from(line, {
          yPercent: 110,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: line, start: "top 86%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-split-heading]").forEach((heading) => {
        const lines = heading.querySelectorAll(".split-heading__line > span");
        gsap.from(lines, {
          yPercent: 108,
          opacity: 0,
          duration: 0.86,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: heading, start: "top 82%", once: true },
        });
      });

      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (elements) => gsap.from(elements, { y: 30, opacity: 0, duration: 0.72, stagger: 0.08, ease: "power3.out" }),
      });

      const essenceSection = root.current.querySelector<HTMLElement>("[data-essence-section]");
      const essenceMap = root.current.querySelector<HTMLElement>("[data-essence-map]");
      const essenceWords = gsap.utils.toArray<HTMLElement>("[data-essence-word]");
      const essenceResult = root.current.querySelector<HTMLElement>("[data-essence-result]");
      if (essenceSection && essenceMap && essenceResult && window.innerWidth >= 768) {
        gsap.set(essenceResult, { scale: 0.6, autoAlpha: 0 });
        const essenceTl = gsap.timeline({
          scrollTrigger: {
            trigger: essenceMap,
            start: "top top",
            end: "+=1700",
            pin: true,
            scrub: 1,
          },
        });
        essenceTl
          .to(essenceWords.filter((_, index) => ![1, 3, 4, 6].includes(index)), { autoAlpha: 0, scale: 0.8, stagger: 0.025 }, 0)
          .to(essenceWords.filter((_, index) => [1, 3, 4, 6].includes(index)), {
            x: (index, element) => essenceMap.clientWidth / 2 - (element as HTMLElement).offsetLeft - (element as HTMLElement).offsetWidth / 2,
            y: (index, element) => essenceMap.clientHeight / 2 - (element as HTMLElement).offsetTop - (element as HTMLElement).offsetHeight / 2,
            scale: 0.7,
            autoAlpha: 0,
            stagger: 0.05,
            ease: "none",
          }, 0.28)
          .to(".essence-lines", { autoAlpha: 1, duration: 0.18 }, 0.15)
          .fromTo(".essence-lines line", { strokeDashoffset: 520 }, { strokeDashoffset: 0, stagger: 0.04, ease: "none" }, 0.18)
          .to(essenceResult, { scale: 1, autoAlpha: 1, duration: 0.24 }, 0.72);
      }

      const symbolSection = root.current.querySelector<HTMLElement>("[data-symbol-section]");
      const symbolStage = root.current.querySelector<HTMLElement>("[data-symbol-stage]");
      if (symbolSection && symbolStage && window.innerWidth >= 768) {
        const reference = symbolStage.querySelector('[data-symbol-frame="reference"]');
        const final = symbolStage.querySelector('[data-symbol-frame="final"]');
        const attributes = symbolStage.querySelectorAll(".symbol-attributes span");
        gsap.set([final, attributes], { autoAlpha: 0 });
        gsap.timeline({
          scrollTrigger: {
            trigger: ".symbol-story__scroll",
            start: "top top",
            end: "bottom bottom",
            pin: symbolStage,
            scrub: 1,
          },
        })
          .to(reference, { scale: 0.72, duration: 0.2, ease: "none" })
          .to(attributes, { autoAlpha: 1, stagger: 0.025, duration: 0.18 }, 0.12)
          .to(reference, { autoAlpha: 0, duration: 0.16 }, 0.38)
          .to(attributes, { autoAlpha: 0, duration: 0.12 }, 0.42)
          .fromTo(final, { autoAlpha: 0, scale: 0.82 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, 0.5);
      }

      const manifesto = root.current.querySelector<HTMLElement>("[data-manifesto]");
      if (manifesto && window.innerWidth >= 768) {
        const frames = gsap.utils.toArray<HTMLElement>("[data-manifesto-frame]");
        const manifestoTl = gsap.timeline({
          scrollTrigger: { trigger: manifesto, start: "top top", end: "+=1800", pin: true, scrub: 1 },
        });
        frames.forEach((frame, index) => {
          const split = SplitText.create(frame, { type: "words", wordsClass: "manifesto-word" });
          splitInstances.push(split);
          gsap.set(frame, { autoAlpha: index === 0 ? 1 : 0 });
          if (index > 0) manifestoTl.to(frames[index - 1], { autoAlpha: 0, duration: 0.12 }, index);
          manifestoTl.to(frame, { autoAlpha: 1, duration: 0.08 }, index).from(split.words, { yPercent: 100, autoAlpha: 0, stagger: 0.035, duration: 0.3 }, index + 0.04);
        });
        manifestoTl.from(manifesto.querySelector("p"), { autoAlpha: 0, y: 16, duration: 0.2 }, frames.length - 0.25);
      }

      const processCards = gsap.utils.toArray<HTMLElement>("[data-process-card]");
      if (window.innerWidth >= 768) {
        processCards.slice(0, -1).forEach((card, index) => {
          gsap.to(card, {
            scale: 0.93,
            filter: "blur(3px)",
            opacity: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: processCards[index + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          });
        });
      }

      gsap.from("[data-provocation-question]", {
        yPercent: 36,
        autoAlpha: 0,
        scrollTrigger: { trigger: "[data-provocation]", start: "top 30%", end: "bottom 65%", scrub: 1 },
      });

      gsap.utils.toArray<HTMLElement>("[data-project-card] .asset-media").forEach((media) => {
        gsap.fromTo(media, { yPercent: -3 }, { yPercent: 3, ease: "none", scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true } });
      });

      ScrollTrigger.refresh();
      return () => {
        splitInstances.forEach((split) => split.revert());
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return <div ref={root}>{children}</div>;
}
