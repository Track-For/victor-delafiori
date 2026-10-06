import { homeContent } from "@/data/company";
import { AssetMedia } from "@/components/ui/AssetMedia";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitHeading } from "@/components/ui/SplitHeading";

export function SymbolStory() {
  const content = homeContent.symbol;
  return (
    <section className="symbol-story section-dark" data-symbol-section>
      <div className="page-shell symbol-story__intro">
        <SectionLabel>{content.label}</SectionLabel>
        <SplitHeading lines={content.title} className="display-title" />
        <div className="symbol-story__copy" data-reveal>
          {content.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
      <div className="symbol-story__scroll">
        <div className="symbol-story__stage" data-symbol-stage>
          <div className="symbol-frame symbol-frame--reference" data-symbol-frame="reference">
            <AssetMedia
              src="/images/stills/mayane-pesquisa.webp"
              alt="Pesquisa sobre a coruja jacurutu usada como referência para a identidade Mayane Ferreira"
              label="PESQUISA / REFERÊNCIA"
              sizes="(max-width: 768px) 78vw, 38vw"
              imageClassName="symbol-story__image--research"
            />
          </div>
          <div className="symbol-attributes" aria-hidden="true">
            {content.attributes.map((attribute) => <span className="font-mono" key={attribute}>{attribute}</span>)}
          </div>
          <div className="symbol-frame symbol-frame--final" data-symbol-frame="final">
            <AssetMedia
              src="/images/stills/mayane-simbolo.webp"
              alt="Símbolo dourado final da identidade Mayane Ferreira"
              label="SÍMBOLO FINAL / MAYANE"
              sizes="(max-width: 768px) 62vw, 24vw"
              imageClassName="symbol-story__image--final"
            />
            <p>{content.closing}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
