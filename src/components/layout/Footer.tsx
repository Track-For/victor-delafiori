import { ArrowUpRight } from "lucide-react";
import { company, homeContent } from "@/data/company";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Hero } from "@/components/sections/Hero";
import { LoopHeroTransition } from "@/components/layout/LoopHeroTransition";

export function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="site-footer__content">
        <a className="site-footer__invitation" href="#contact">
          <span>{homeContent.footer.invitation}</span>
          <ArrowUpRight aria-hidden="true" size={22} strokeWidth={1.5} />
        </a>
        <div className="site-footer__mark" aria-hidden="true">
          <BrandLogo symbolOnly />
        </div>
        <div className="site-footer__meta font-mono">
          <div>
            <a href={company.instagram}>Instagram</a>
            <a href={company.behance}>Behance</a>
            <a href={`mailto:${company.email}`}>E-mail</a>
            <a href="#contact">WhatsApp</a>
          </div>
          <div>
            <span>{company.location}</span>
            <span>© {new Date().getFullYear()} {company.name}</span>
          </div>
        </div>
      </div>
      <LoopHeroTransition>
        <Hero loopClone />
      </LoopHeroTransition>
    </footer>
  );
}
