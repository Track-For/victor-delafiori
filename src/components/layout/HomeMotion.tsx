"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ContextSafe = ReturnType<typeof useGSAP>["contextSafe"];

function splitWordsOrFallback(
  element: HTMLElement,
  splitInstances: SplitText[],
  wordsClass: string,
  fallbackSelector = ":scope > span, :scope > em",
) {
  try {
    const split = SplitText.create(element, { type: "words", wordsClass });
    splitInstances.push(split);
    return split.words;
  } catch {
    const fallback = Array.from(element.querySelectorAll<HTMLElement>(fallbackSelector));
    return fallback.length ? fallback : [element];
  }
}

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
      // Synthetic pointers do not always expose pointer capture.
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
      onComplete: () => orbitTargets.forEach((target) => { target.style.willChange = "auto"; }),
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

function createHeroEntrance(rootElement: HTMLDivElement, splitInstances: SplitText[]) {
  const heroTitle = rootElement.querySelector<HTMLElement>("[data-hero-title]");
  if (!heroTitle) return;

  const titleWords = splitWordsOrFallback(heroTitle, splitInstances, "hero-word");
  const eye = rootElement.querySelector<HTMLElement>("[data-hero-eye]");
  const eyeImage = rootElement.querySelector<HTMLElement>("[data-hero-eye-image]");
  const eyeTarget = rootElement.querySelector<HTMLElement>("[data-hero-eye-target]");
  const archiveCards = gsap.utils.toArray<HTMLElement>("[data-hero-card]", rootElement);
  const heroItems = gsap.utils.toArray<HTMLElement>("[data-hero-item]", rootElement);
  const heroTimeline = gsap.timeline({ delay: 0.18, defaults: { ease: "power4.out" } });

  gsap.set(archiveCards, { autoAlpha: 0, scale: 0.34, transformOrigin: "50% 50%" });
  gsap.set(titleWords, { autoAlpha: 0, yPercent: 115 });
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
    .to(titleWords, { autoAlpha: 1, yPercent: 0, duration: 0.82, stagger: 0.04 }, "archiveReveal+=0.12")
    .to(heroItems, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 }, "archiveReveal+=0.35");
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

      const rootElement = root.current;
      const splitInstances: SplitText[] = [];
      const responsive = gsap.matchMedia();
      let disposed = false;

      ScrollTrigger.config({ ignoreMobileResize: true });
      createHeroEntrance(rootElement, splitInstances);

      const setupImpactCopy = (horizontalTween?: gsap.core.Tween) => {
        gsap.utils.toArray<HTMLElement>("[data-impact-panel]", rootElement).forEach((panel, panelIndex) => {
          const copy = panel.querySelector<HTMLElement>("[data-impact-copy]");
          const label = panel.querySelector<HTMLElement>(".impact-statement__label");
          const accent = panel.querySelector<HTMLElement>(".impact-statement__accent");
          const rule = panel.querySelector<HTMLElement>(".impact-statement__rule");
          if (!copy) return;

          const words = splitWordsOrFallback(copy, splitInstances, "impact-word", ":scope > span");
          const trigger = horizontalTween
            ? { trigger: panel, containerAnimation: horizontalTween, start: "left 82%", end: "left 42%", scrub: 0.75 }
            : { trigger: panel, start: "top 78%", end: "top 26%", scrub: 0.75 };

          gsap.timeline({ scrollTrigger: { ...trigger, invalidateOnRefresh: true } })
            .fromTo(
              words,
              { yPercent: panelIndex % 2 === 0 ? 120 : -120, autoAlpha: 0, rotation: panelIndex === 1 ? -3 : 0 },
              { yPercent: 0, autoAlpha: 1, rotation: 0, stagger: 0.035, duration: 0.72, ease: "none", force3D: true },
              0,
            )
            .fromTo(label, { x: -34, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.22 }, 0.05)
            .fromTo(accent, { xPercent: 18, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.42 }, 0.32)
            .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.52, transformOrigin: "left center" }, 0.14);

          if (panelIndex === 1) {
            gsap.fromTo(
              words,
              { color: "rgba(241, 239, 233, 0)" },
              {
                color: "rgba(241, 239, 233, 1)",
                stagger: 0.04,
                ease: "none",
                scrollTrigger: {
                  ...trigger,
                  start: horizontalTween ? "left 66%" : "top 58%",
                  end: horizontalTween ? "left 38%" : "top 22%",
                },
              },
            );
          }
        });
      };

      const setupCurtains = (horizontalTween?: gsap.core.Tween) => {
        gsap.utils.toArray<HTMLElement>("[data-curtain-reveal]", rootElement).forEach((mask) => {
          const image = mask.querySelector<HTMLElement>(".project-card__zoom-image");
          const trigger = horizontalTween
            ? { trigger: mask, containerAnimation: horizontalTween, start: "left 92%", end: "left 48%", scrub: 0.8 }
            : { trigger: mask, start: "top 92%", end: "top 34%", scrub: 0.72 };
          const timeline = gsap.timeline({
            scrollTrigger: {
              ...trigger,
              invalidateOnRefresh: true,
              onEnter: () => { mask.style.willChange = "clip-path"; },
              onLeave: () => { mask.style.willChange = "auto"; },
              onEnterBack: () => { mask.style.willChange = "clip-path"; },
              onLeaveBack: () => { mask.style.willChange = "auto"; },
            },
          });
          timeline.fromTo(mask, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" });
          if (image) timeline.fromTo(image, { scale: 1.16, yPercent: -4 }, { scale: 1, yPercent: 0, duration: 1, ease: "none", force3D: true }, 0);
        });
      };

      const setupAboutReveal = (horizontalTween?: gsap.core.Tween) => {
        const media = rootElement.querySelector<HTMLElement>("[data-column-reveal]");
        const image = media?.querySelector<HTMLElement>(".about__zoom-image");
        if (!media) return;
        const trigger = horizontalTween
          ? { trigger: media, containerAnimation: horizontalTween, start: "left 90%", end: "left 42%", scrub: 0.8 }
          : { trigger: media, start: "top 88%", end: "top 28%", scrub: 0.75 };
        const timeline = gsap.timeline({
          scrollTrigger: {
            ...trigger,
            invalidateOnRefresh: true,
            onEnter: () => { media.style.willChange = "clip-path"; },
            onLeave: () => { media.style.willChange = "auto"; },
            onEnterBack: () => { media.style.willChange = "clip-path"; },
            onLeaveBack: () => { media.style.willChange = "auto"; },
          },
        });
        timeline.fromTo(media, { clipPath: "inset(0% 45% 0% 45%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" });
        if (image) timeline.fromTo(image, { scale: 1.2 }, { scale: 1, duration: 1, ease: "none", force3D: true }, 0);
      };

      responsive.add("(min-width: 901px)", () => {
        const shell = rootElement.querySelector<HTMLElement>("[data-home-horizontal]");
        const track = rootElement.querySelector<HTMLElement>("[data-home-track]");
        const progressBar = rootElement.querySelector<HTMLElement>("[data-horizontal-progress]");
        if (!shell || !track) return;

        shell.setAttribute("data-horizontal-enabled", "");
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        let snapPoints: number[] = [];
        const layoutOffset = (element: HTMLElement) => {
          let offset = 0;
          let current: HTMLElement | null = element;
          while (current) {
            offset += current.offsetLeft;
            current = current.offsetParent as HTMLElement | null;
          }
          return offset;
        };
        const rebuildSnapPoints = () => {
          const scrollDistance = Math.max(1, distance());
          const trackOffset = layoutOffset(track);
          const candidates = gsap.utils.toArray<HTMLElement>(
            [
              ".hero",
              ".philosophy",
              ".understanding__copy",
              ".essence-map",
              "[data-horizontal-snap]",
              ".studio-journal__intro",
              ".studio-stills__heading",
              ".studio-stills__viewport",
              ".studio-journal__grid",
              ".symbol-story__intro",
              "[data-symbol-stage]",
              "[data-impact-panel]",
              "[data-manifesto-frame]",
              ".process__intro",
              "[data-process-card]",
              ".services__title",
              ".services__list",
              ".differentiation .display-title",
              ".differentiation__principles",
              ".about",
              ".provocation__prompt",
              ".provocation__question",
              ".contact__intro",
              ".contact__form-wrap",
            ].join(", "),
            track,
          );

          snapPoints = Array.from(new Set([
            0,
            ...candidates.map((element) => gsap.utils.clamp(
              0,
              1,
              (layoutOffset(element) - trackOffset + element.offsetWidth / 2 - window.innerWidth / 2) / scrollDistance,
            )),
            1,
          ].map((point) => Number(point.toFixed(5))))).sort((a, b) => a - b);
        };
        const snapToScene = (value: number) => {
          if (!snapPoints.length) rebuildSnapPoints();
          return snapPoints.reduce((nearest, point) => (
            Math.abs(point - value) < Math.abs(nearest - value) ? point : nearest
          ), snapPoints[0] ?? value);
        };
        const horizontalTween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          force3D: true,
          scrollTrigger: {
            id: "home-horizontal",
            trigger: shell,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            snap: {
              snapTo: snapToScene,
              duration: { min: 0.16, max: 0.42 },
              delay: 0.08,
              ease: "power2.inOut",
              inertia: false,
              directional: false,
            },
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: rebuildSnapPoints,
            onUpdate: (self) => {
              if (progressBar) gsap.set(progressBar, { scaleX: self.progress, transformOrigin: "left center" });
            },
            onEnter: () => { track.style.willChange = "transform"; },
            onLeave: () => { track.style.willChange = "auto"; },
            onEnterBack: () => { track.style.willChange = "transform"; },
            onLeaveBack: () => { track.style.willChange = "auto"; },
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal-line]", rootElement).forEach((line) => {
          gsap.fromTo(line, { yPercent: 105, autoAlpha: 0 }, {
            yPercent: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: line, containerAnimation: horizontalTween, start: "left 90%", end: "left 68%", scrub: 0.62 },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-split-heading]", rootElement).forEach((heading) => {
          const lines = heading.querySelectorAll<HTMLElement>(".split-heading__line > span");
          gsap.fromTo(lines, { yPercent: 108, autoAlpha: 0 }, {
            yPercent: 0,
            autoAlpha: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: heading, containerAnimation: horizontalTween, start: "left 90%", end: "left 60%", scrub: 0.7 },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal]", rootElement).forEach((element) => {
          gsap.fromTo(element, { x: 48, autoAlpha: 0 }, {
            x: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: element, containerAnimation: horizontalTween, start: "left 92%", end: "left 72%", scrub: 0.55 },
          });
        });

        const identityPreviews = gsap.utils.toArray<HTMLElement>("[data-identity-preview]", rootElement);
        identityPreviews.forEach((preview) => {
          const frame = preview.querySelector<HTMLElement>(".identity-preview__frame");
          const image = preview.querySelector<HTMLElement>(".identity-preview__image");
          const setScale = gsap.quickSetter(preview, "scale");
          const setOpacity = gsap.quickSetter(preview, "opacity");
          const setClip = frame ? gsap.quickSetter(frame, "clipPath") : null;
          const setImageScale = image ? gsap.quickSetter(image, "scale") : null;
          const renderFocus = (progress: number) => {
            const focus = 1 - Math.min(1, Math.abs(progress - 0.5) * 2);
            setScale(0.78 + focus * 0.22);
            setOpacity(0.42 + focus * 0.58);
            setClip?.(`inset(0% ${(1 - focus) * 28}% 0% ${(1 - focus) * 28}%)`);
            setImageScale?.(1.12 - focus * 0.12);
            preview.style.zIndex = String(Math.round(focus * 10) + 1);
          };

          ScrollTrigger.create({
            trigger: preview,
            containerAnimation: horizontalTween,
            start: "left right",
            end: "right left",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => renderFocus(self.progress),
            onRefresh: (self) => renderFocus(self.progress),
            onEnter: () => { preview.style.willChange = "transform, opacity"; },
            onEnterBack: () => { preview.style.willChange = "transform, opacity"; },
            onLeave: () => { preview.style.willChange = "auto"; },
            onLeaveBack: () => { preview.style.willChange = "auto"; },
          });
        });

        const identityEditorial = rootElement.querySelector<HTMLElement>("[data-identity-editorial]");
        const editorialMedia = identityEditorial?.querySelector<HTMLElement>("[data-identity-editorial-media]");
        const editorialCopy = identityEditorial?.querySelector<HTMLElement>("[data-identity-editorial-copy]");
        if (identityEditorial && editorialMedia && editorialCopy) {
          gsap.timeline({
            scrollTrigger: {
              trigger: identityEditorial,
              containerAnimation: horizontalTween,
              start: "left 88%",
              end: "right 18%",
              scrub: 0.85,
              invalidateOnRefresh: true,
            },
          })
            .fromTo(editorialMedia, { yPercent: 10 }, { yPercent: -10, duration: 1, ease: "none", force3D: true }, 0)
            .fromTo(editorialCopy, { yPercent: -10 }, { yPercent: 10, duration: 1, ease: "none", force3D: true }, 0);
        }

        const essenceMap = rootElement.querySelector<HTMLElement>("[data-essence-map]");
        const essenceWords = gsap.utils.toArray<HTMLElement>("[data-essence-word]", rootElement);
        const essenceResult = rootElement.querySelector<HTMLElement>("[data-essence-result]");
        if (essenceMap && essenceResult) {
          const selectedWords = essenceWords.filter((_, index) => [1, 3, 4, 6].includes(index));
          const supportingWords = essenceWords.filter((_, index) => ![1, 3, 4, 6].includes(index));
          const lines = essenceMap.querySelectorAll(".essence-lines line");
          gsap.set(essenceResult, { scale: 0.55, autoAlpha: 0 });
          gsap.timeline({
            scrollTrigger: { trigger: essenceMap, containerAnimation: horizontalTween, start: "left 82%", end: "center 50%", scrub: 0.8, invalidateOnRefresh: true },
          })
            .to(supportingWords, { autoAlpha: 0.08, scale: 0.82, stagger: 0.025, duration: 0.35 }, 0)
            .to(selectedWords, { xPercent: (index) => index % 2 === 0 ? 16 : -16, autoAlpha: 0.25, stagger: 0.04, duration: 0.5 }, 0.18)
            .to(essenceMap.querySelector(".essence-lines"), { autoAlpha: 1, duration: 0.16 }, 0.18)
            .fromTo(lines, { strokeDashoffset: 520 }, { strokeDashoffset: 0, stagger: 0.04, duration: 0.5, ease: "none" }, 0.2)
            .to(essenceResult, { scale: 1, autoAlpha: 1, duration: 0.32 }, 0.58);
        }

        const symbolStage = rootElement.querySelector<HTMLElement>("[data-symbol-stage]");
        const reference = symbolStage?.querySelector<HTMLElement>('[data-symbol-frame="reference"]');
        const final = symbolStage?.querySelector<HTMLElement>('[data-symbol-frame="final"]');
        const attributes = symbolStage ? gsap.utils.toArray<HTMLElement>(".symbol-attributes span", symbolStage) : [];
        if (symbolStage && reference && final) {
          gsap.set(reference, { autoAlpha: 0.68, scale: 1.06, clipPath: "inset(9% 0% 9% 0%)" });
          gsap.set(attributes, { autoAlpha: 0, x: 16 });
          gsap.set(final, { autoAlpha: 1, scale: 1.08, clipPath: "inset(50% 0% 50% 0%)" });
          gsap.timeline({
            scrollTrigger: { trigger: symbolStage, containerAnimation: horizontalTween, start: "left 82%", end: "center 48%", scrub: 0.82, invalidateOnRefresh: true },
          })
            .to(reference, { autoAlpha: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.24, ease: "none" }, 0)
            .to(attributes, { autoAlpha: 1, x: 0, stagger: 0.025, duration: 0.24 }, 0.14)
            .to(reference, { xPercent: -13, scale: 0.86, autoAlpha: 0.2, duration: 0.4, ease: "none" }, 0.38)
            .to(final, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.42, ease: "none" }, 0.46)
            .to(attributes, { autoAlpha: 0, duration: 0.18 }, 0.7);
        }

        gsap.utils.toArray<HTMLElement>("[data-manifesto-frame]", rootElement).forEach((frame) => {
          const split = SplitText.create(frame, { type: "words", wordsClass: "manifesto-word" });
          splitInstances.push(split);
          gsap.fromTo(split.words, { yPercent: 105, autoAlpha: 0 }, {
            yPercent: 0,
            autoAlpha: 1,
            stagger: 0.04,
            ease: "none",
            scrollTrigger: { trigger: frame, containerAnimation: horizontalTween, start: "left 82%", end: "left 44%", scrub: 0.74 },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-process-card]", rootElement).forEach((card) => {
          const numeral = card.querySelector<HTMLElement>(".process-card__background");
          if (!numeral) return;
          gsap.fromTo(numeral, { xPercent: 18 }, {
            xPercent: -12,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: horizontalTween, start: "left right", end: "right left", scrub: true },
          });
        });

        gsap.utils.toArray<HTMLElement>(".studio-still__zoom-image, .studio-video video", rootElement).forEach((media) => {
          gsap.fromTo(media, { scale: 1.12 }, {
            scale: 1,
            ease: "none",
            force3D: true,
            scrollTrigger: { trigger: media, containerAnimation: horizontalTween, start: "left 94%", end: "right 20%", scrub: 0.8 },
          });
        });

        gsap.utils.toArray<HTMLElement>(".service-row", rootElement).forEach((row, index) => {
          gsap.fromTo(row, { y: index % 2 === 0 ? 28 : -28, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: row, containerAnimation: horizontalTween, start: "left 92%", end: "left 74%", scrub: 0.5 },
          });
        });

        const question = rootElement.querySelector<HTMLElement>("[data-provocation-question]");
        if (question) {
          gsap.fromTo(question, { xPercent: 14, autoAlpha: 0 }, {
            xPercent: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: question, containerAnimation: horizontalTween, start: "left 88%", end: "left 50%", scrub: 0.75 },
          });
        }

        setupImpactCopy(horizontalTween);
        setupCurtains(horizontalTween);
        setupAboutReveal(horizontalTween);

        return () => {
          shell.removeAttribute("data-horizontal-enabled");
          track.style.willChange = "auto";
          identityPreviews.forEach((preview) => {
            preview.style.removeProperty("opacity");
            preview.style.removeProperty("transform");
            preview.style.removeProperty("will-change");
            preview.style.removeProperty("z-index");
            preview.querySelector<HTMLElement>(".identity-preview__frame")?.style.removeProperty("clip-path");
            preview.querySelector<HTMLElement>(".identity-preview__image")?.style.removeProperty("transform");
          });
          editorialMedia?.style.removeProperty("transform");
          editorialCopy?.style.removeProperty("transform");
        };
      });

      responsive.add("(max-width: 900px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal-line]", rootElement).forEach((line) => {
          gsap.from(line, { yPercent: 110, autoAlpha: 0, duration: 0.9, ease: "power4.out", scrollTrigger: { trigger: line, start: "top 86%", once: true } });
        });

        gsap.utils.toArray<HTMLElement>("[data-split-heading]", rootElement).forEach((heading) => {
          const lines = heading.querySelectorAll<HTMLElement>(".split-heading__line > span");
          gsap.from(lines, { yPercent: 108, autoAlpha: 0, duration: 0.86, stagger: 0.1, ease: "power4.out", scrollTrigger: { trigger: heading, start: "top 82%", once: true } });
        });

        ScrollTrigger.batch(gsap.utils.toArray<HTMLElement>("[data-reveal]", rootElement), {
          start: "top 88%",
          once: true,
          onEnter: (elements) => gsap.fromTo(
            elements,
            { y: 30, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.08, ease: "power3.out", overwrite: "auto" },
          ),
        });

        gsap.utils.toArray<HTMLElement>("[data-identity-preview]", rootElement).forEach((preview) => {
          const frame = preview.querySelector<HTMLElement>(".identity-preview__frame");
          const image = preview.querySelector<HTMLElement>(".identity-preview__image");
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: preview,
              start: "top 92%",
              end: "top 48%",
              scrub: 0.55,
              invalidateOnRefresh: true,
            },
          });
          timeline.fromTo(
            preview,
            { y: 54, autoAlpha: 0.38, scale: 0.955 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 1, ease: "none", force3D: true },
          );
          if (frame) {
            timeline.fromTo(
              frame,
              { clipPath: "inset(0% 9% 0% 9%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" },
              0,
            );
          }
          if (image) {
            timeline.fromTo(image, { scale: 1.1 }, { scale: 1, duration: 1, ease: "none", force3D: true }, 0);
          }
        });

        const identityEditorial = rootElement.querySelector<HTMLElement>("[data-identity-editorial]");
        const editorialMedia = identityEditorial?.querySelector<HTMLElement>("[data-identity-editorial-media]");
        const editorialCopy = identityEditorial?.querySelector<HTMLElement>("[data-identity-editorial-copy]");
        if (identityEditorial && editorialMedia && editorialCopy) {
          gsap.timeline({
            scrollTrigger: {
              trigger: identityEditorial,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          })
            .fromTo(editorialMedia, { yPercent: 5 }, { yPercent: -5, duration: 1, ease: "none", force3D: true }, 0)
            .fromTo(editorialCopy, { yPercent: -4 }, { yPercent: 4, duration: 1, ease: "none", force3D: true }, 0);
        }

        const essenceMap = rootElement.querySelector<HTMLElement>("[data-essence-map]");
        const essenceResult = rootElement.querySelector<HTMLElement>("[data-essence-result]");
        const essenceWords = gsap.utils.toArray<HTMLElement>("[data-essence-word]", rootElement);
        if (essenceMap && essenceResult) {
          const selectedWords = essenceWords.filter((_, index) => [1, 3, 4, 6].includes(index));
          const supportingWords = essenceWords.filter((_, index) => ![1, 3, 4, 6].includes(index));
          gsap.timeline({
            scrollTrigger: {
              trigger: essenceMap,
              start: "top 78%",
              end: "center 42%",
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          })
            .fromTo(supportingWords, { autoAlpha: 0.7 }, { autoAlpha: 0.16, scale: 0.9, stagger: 0.025, duration: 0.55 }, 0)
            .fromTo(selectedWords, { scale: 0.88 }, { scale: 1.08, autoAlpha: 1, stagger: 0.035, duration: 0.58 }, 0.06)
            .fromTo(essenceResult, { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35 }, 0.5);
        }

        const symbolStage = rootElement.querySelector<HTMLElement>("[data-symbol-stage]");
        const reference = symbolStage?.querySelector<HTMLElement>('[data-symbol-frame="reference"]');
        const final = symbolStage?.querySelector<HTMLElement>('[data-symbol-frame="final"]');
        const attributes = symbolStage ? gsap.utils.toArray<HTMLElement>(".symbol-attributes span", symbolStage) : [];
        if (symbolStage && reference && final) {
          gsap.set(reference, { autoAlpha: 0.62, scale: 1.055, clipPath: "inset(18% 0% 18% 0%)" });
          gsap.set(attributes, { autoAlpha: 0, y: 10 });
          gsap.set(final, { autoAlpha: 1, clipPath: "inset(50% 0% 50% 0%)", scale: 1.08 });
          gsap.timeline({
            scrollTrigger: { trigger: ".symbol-story__scroll", start: "top top", end: "bottom bottom", pin: symbolStage, scrub: 0.72, anticipatePin: 1, invalidateOnRefresh: true },
          })
            .to(reference, { autoAlpha: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.24, ease: "none" }, 0)
            .to(attributes, { y: 0, autoAlpha: 1, stagger: 0.025, duration: 0.24 }, 0.15)
            .to(reference, { scale: 0.94, autoAlpha: 0.22, duration: 0.3, ease: "none" }, 0.38)
            .to(final, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.42, ease: "none" }, 0.42)
            .to(attributes, { autoAlpha: 0, duration: 0.16 }, 0.72);
        }

        gsap.utils.toArray<HTMLElement>("[data-manifesto-frame]", rootElement).forEach((frame) => {
          const words = splitWordsOrFallback(frame, splitInstances, "manifesto-word", ":scope > span");
          gsap.fromTo(words, { yPercent: 80, autoAlpha: 0 }, {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.82,
            stagger: 0.035,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: { trigger: frame, start: "top 84%", once: true, invalidateOnRefresh: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-process-card]", rootElement).forEach((card, index) => {
          const numeral = card.querySelector<HTMLElement>(".process-card__background");
          const content = card.querySelector<HTMLElement>(".process-card__content");
          if (numeral) {
            gsap.fromTo(numeral, { xPercent: 12 }, {
              xPercent: -10,
              ease: "none",
              force3D: true,
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
            });
          }
          if (content) {
            gsap.fromTo(content, { y: 26, autoAlpha: 0.72 }, {
              y: 0,
              autoAlpha: 1,
              duration: 0.68,
              delay: Math.min(index * 0.02, 0.08),
              ease: "power3.out",
              overwrite: "auto",
              scrollTrigger: { trigger: card, start: "top 82%", once: true, invalidateOnRefresh: true },
            });
          }
        });

        gsap.utils.toArray<HTMLElement>(".studio-still__zoom-image, .studio-video video", rootElement).forEach((media) => {
          gsap.fromTo(media, { scale: 1.1 }, {
            scale: 1,
            ease: "none",
            force3D: true,
            scrollTrigger: { trigger: media, start: "top 94%", end: "bottom 30%", scrub: 0.65, invalidateOnRefresh: true },
          });
        });

        ScrollTrigger.batch(gsap.utils.toArray<HTMLElement>(".service-row", rootElement), {
          start: "top 90%",
          once: true,
          onEnter: (rows) => gsap.fromTo(
            rows,
            { y: 34, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.065, ease: "power3.out", overwrite: "auto" },
          ),
        });

        const question = rootElement.querySelector<HTMLElement>("[data-provocation-question]");
        if (question) gsap.from(question, { yPercent: 24, autoAlpha: 0, scrollTrigger: { trigger: question, start: "top 78%", end: "top 32%", scrub: 0.72 } });

        setupImpactCopy();
        setupCurtains();
        setupAboutReveal();
      });

      const refresh = () => {
        if (!disposed) ScrollTrigger.refresh();
      };
      const refreshAfterPageRestore = (event: PageTransitionEvent) => {
        if (event.persisted) requestAnimationFrame(refresh);
      };
      void document.fonts.ready.then(refresh);
      window.addEventListener("load", refresh, { once: true });
      window.addEventListener("pageshow", refreshAfterPageRestore);
      window.addEventListener("orientationchange", refresh);
      requestAnimationFrame(refresh);

      return () => {
        disposed = true;
        window.removeEventListener("load", refresh);
        window.removeEventListener("pageshow", refreshAfterPageRestore);
        window.removeEventListener("orientationchange", refresh);
        responsive.revert();
        gsap.utils.toArray<HTMLElement>("[data-curtain-reveal], [data-column-reveal]", rootElement)
          .forEach((element) => { element.style.willChange = "auto"; });
        splitInstances.forEach((split) => split.revert());
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={root}>
      <div className="home-horizontal" data-home-horizontal>
        <div className="home-horizontal__track" data-home-track>
          {children}
        </div>
        <div className="home-horizontal__meter" aria-hidden="true">
          <span className="home-horizontal__meter-label font-mono">SCROLL / EAST</span>
          <span className="home-horizontal__meter-line"><span data-horizontal-progress /></span>
        </div>
      </div>
    </div>
  );
}
