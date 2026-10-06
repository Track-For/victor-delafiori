import { homeContent } from "@/data/company";
import { AssetMedia } from "@/components/ui/AssetMedia";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitHeading } from "@/components/ui/SplitHeading";

export function About() {
  const content = homeContent.about;
  return (
    <section className="about section-dark" id="about">
      <div className="page-shell about__grid">
        <div className="about__media" data-reveal>
          <AssetMedia
            src="/images/victor-delafiori.jpg"
            alt="Retrato de Victor Delafiori usando óculos escuros"
            label="FOTO DO DESIGNER"
            sizes="(max-width: 768px) 100vw, 46vw"
          />
        </div>
        <div className="about__content">
          <SectionLabel>{content.label}</SectionLabel>
          <SplitHeading lines={content.title} className="display-title" />
          <p data-reveal>{content.body}</p>
          <ul>
            {content.details.map((detail) => <li className="font-mono" key={detail}>{detail}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
