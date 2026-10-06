"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "next-view-transitions";
import { navigation, uiCopy } from "@/data/company";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { MenuOverlay } from "./MenuOverlay";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header" style={{ viewTransitionName: "site-header" }}>
        <Link href="/" aria-label="Ir para o início" className="site-header__brand">
          <BrandLogo preload />
        </Link>
        <nav className="site-header__nav" aria-label={uiCopy.navigation.mainLabel}>
          {navigation.map((item) => (
            <Link key={item.href} href={`/${item.href}`}>
              {item.label}
            </Link>
          ))}
          <Link href="/#contact" className="site-header__cta" data-cursor="CONTACT">
            {uiCopy.navigation.projectCta} <span aria-hidden="true">↗</span>
          </Link>
        </nav>
        <button className="site-header__menu" onClick={() => setMenuOpen(true)} aria-label={uiCopy.navigation.open}>
          <Menu aria-hidden="true" size={24} strokeWidth={1.5} />
        </button>
      </header>
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
