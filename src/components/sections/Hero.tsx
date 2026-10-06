import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { homeContent } from "@/data/company";
import { MagneticButton } from "@/components/ui/MagneticButton";

const archiveImages = [
  { src: "/projects/napoleao/application-01.webp", longitude: 12, latitude: -64 },
  { src: "/projects/mayane-ferreira/hero.webp", longitude: 96, latitude: -52 },
  { src: "/projects/rossi/colors.webp", longitude: 188, latitude: -56 },
  { src: "/projects/napoleao/application-02.webp", longitude: 282, latitude: -45 },
  { src: "/projects/mayane-ferreira/application-02.webp", longitude: -20, latitude: -24 },
  { src: "/images/victor-delafiori.jpg", longitude: 40, latitude: -18, portrait: true },
  { src: "/projects/napoleao/hero.webp", longitude: 100, latitude: -16 },
  { src: "/projects/mayane-ferreira/symbol.webp", longitude: 158, latitude: -7 },
  { src: "/projects/rossi/application-01.webp", longitude: 218, latitude: -18 },
  { src: "/projects/mayane-ferreira/application-03.webp", longitude: 272, latitude: -5 },
  { src: "/projects/napoleao/symbol.webp", longitude: 328, latitude: -22 },
  { src: "/projects/rossi/hero.webp", longitude: 12, latitude: 24 },
  { src: "/projects/mayane-ferreira/construction.webp", longitude: 74, latitude: 31 },
  { src: "/projects/napoleao/application-03.webp", longitude: 138, latitude: 20 },
  { src: "/projects/rossi/application-02.webp", longitude: 208, latitude: 32 },
  { src: "/projects/mayane-ferreira/system.webp", longitude: 286, latitude: 25 },
] as const;

export function Hero({ loopClone = false }: { loopClone?: boolean }) {
  const content = homeContent.hero;
  return (
    <section
      className={`hero ${loopClone ? "hero--loop-clone" : ""}`}
      aria-labelledby={loopClone ? undefined : "hero-title"}
      aria-hidden={loopClone || undefined}
      data-hero-drag-surface={loopClone ? undefined : ""}
    >
      {loopClone ? null : (
        <div className="hero-eye" data-hero-eye aria-hidden="true">
          <div className="hero-eye__image" data-hero-eye-image>
            <Image
              src="/images/victor-eye-hero.png"
              alt=""
              fill
              sizes="100vw"
              preload
            />
          </div>
          <div className="hero-eye__target" data-hero-eye-target>
            <span />
            <span />
          </div>
          <div className="hero-eye__meta font-mono">
            <span>PERCEPÇÃO / 01</span>
            <span>ENTRE NO OLHAR</span>
          </div>
        </div>
      )}
      <div className="hero__archive" data-hero-archive aria-hidden="true">
        <div className="hero__archive-orbit" data-hero-orbit>
          {archiveImages.map((image) => (
            <figure
              className={`hero__archive-card${"portrait" in image ? " hero__archive-card--portrait" : ""}`}
              data-hero-card={loopClone ? undefined : ""}
              key={image.src}
              style={{
                "--orbit-longitude": `${image.longitude}deg`,
                "--orbit-latitude": `${image.latitude}deg`,
                "--orbit-longitude-inverse": `${-image.longitude}deg`,
                "--orbit-latitude-inverse": `${-image.latitude}deg`,
              } as CSSProperties}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(max-width: 767px) 28vw, 15vw"
              />
            </figure>
          ))}
        </div>
      </div>
      <div className="hero__archive-vignette" aria-hidden="true" />
      {loopClone ? null : (
        <div className="hero__drag-hint font-mono" data-hero-item aria-hidden="true">
          <span className="hero__drag-hint-dot" />
          <span>CLIQUE + ARRASTE PARA GIRAR</span>
        </div>
      )}
      <div className="page-shell hero__inner">
        <p className="hero__label font-mono" data-hero-item={loopClone ? undefined : ""}>{content.label}</p>
        <h1 id={loopClone ? undefined : "hero-title"} className="hero__title" data-hero-title={loopClone ? undefined : ""}>
          <span>{content.line1}</span>
          <span>{content.line2}</span>
          <em>{content.line3}</em>
        </h1>
        <div className="hero__lower" data-hero-item={loopClone ? undefined : ""}>
          <p>{content.body}</p>
          <div className="hero__actions">
            {loopClone ? (
              <>
                <span className="magnetic-button magnetic-button--light">
                  <span>{content.primaryCta}</span>
                  <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
                </span>
                <span className="text-link text-link--light">
                  {content.secondaryCta}
                  <ArrowDownRight aria-hidden="true" size={16} strokeWidth={1.5} />
                </span>
              </>
            ) : (
              <>
                <MagneticButton href="#contact">{content.primaryCta}</MagneticButton>
                <a className="text-link text-link--light" href="#work">
                  {content.secondaryCta}
                  <ArrowDownRight aria-hidden="true" size={16} strokeWidth={1.5} />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
