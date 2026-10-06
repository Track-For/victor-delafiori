"use client";

import Image from "next/image";
import { useState } from "react";

type AssetMediaProps = {
  src: string;
  alt: string;
  label: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

export function AssetMedia({
  src,
  alt,
  label,
  sizes = "100vw",
  priority = false,
  className = "",
  imageClassName = "",
}: AssetMediaProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`asset-media ${className}`} data-loaded={loaded || undefined}>
      <div className="asset-placeholder" aria-hidden={loaded}>
        <span>{label}</span>
        <small>{src}</small>
      </div>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`asset-image ${imageClassName}`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />
    </div>
  );
}
