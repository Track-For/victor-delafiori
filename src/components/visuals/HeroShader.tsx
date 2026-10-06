"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const HeroShaderScene = dynamic(() => import("./HeroShaderScene"), {
  ssr: false,
  loading: () => null,
});

function canRenderShader() {
  const canvas = document.createElement("canvas");
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;

  if (connection?.saveData) return false;

  try {
    return Boolean(canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

export function HeroShader() {
  const root = useRef<HTMLDivElement>(null);
  const [capable, setCapable] = useState(false);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );

    const updateCapability = () => setCapable(media.matches && canRenderShader());
    updateCapability();
    media.addEventListener("change", updateCapability);

    return () => media.removeEventListener("change", updateCapability);
  }, []);

  useEffect(() => {
    if (!root.current || !capable) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px" },
    );

    observer.observe(root.current);
    return () => observer.disconnect();
  }, [capable]);

  if (!capable) return null;

  return (
    <div
      ref={root}
      className="hero__shader"
      data-ready={ready || undefined}
      aria-hidden="true"
    >
      {visible ? <HeroShaderScene onReady={() => setReady(true)} /> : null}
    </div>
  );
}
