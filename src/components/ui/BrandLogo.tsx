"use client";

import Image from "next/image";
import { company } from "@/data/company";

type BrandLogoProps = {
  symbolOnly?: boolean;
  className?: string;
  preload?: boolean;
};

export function BrandLogo({ symbolOnly = false, className = "", preload = false }: BrandLogoProps) {
  return (
    <span className={`brand-logo ${className}`} data-brand-target={symbolOnly || undefined}>
      <Image
        className="brand-logo__symbol"
        src="/images/Logo.png"
        width={589}
        height={403}
        alt=""
        preload={preload}
      />
      {!symbolOnly && <span className="brand-logo__wordmark">{company.name}</span>}
    </span>
  );
}
