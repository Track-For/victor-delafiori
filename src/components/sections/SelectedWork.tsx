import { ArrowUpRight } from "lucide-react";
import { Link } from "next-view-transitions";
import { homeContent } from "@/data/company";
import { projects } from "@/data/projects";
import { AssetMedia } from "@/components/ui/AssetMedia";
import { ProjectNumber } from "@/components/ui/ProjectNumber";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function SelectedWork() {
  return (
    <section className="selected-work section-dark" id="work">
      <div className="page-shell">
        <SectionLabel>{homeContent.work.label}</SectionLabel>
        <h2 className="selected-work__title" data-reveal data-horizontal-snap>
          <span>{homeContent.work.title}</span>
          <em>{homeContent.work.titleAccent}</em>
        </h2>

        <div className="identity-reel" aria-label="Identidades selecionadas">
          {projects.map((project) => (
            <article className="identity-preview" data-identity-preview data-horizontal-snap key={project.slug}>
              <Link
                href={`/projetos/${project.slug}`}
                className="identity-preview__media-link"
                data-cursor="VIEW"
                aria-label={`Ver ${project.client}`}
              >
                <div className="identity-preview__frame" style={{ viewTransitionName: `project-${project.slug}` }}>
                  <AssetMedia
                    src={project.image}
                    alt={`Imagem principal de ${project.client}`}
                    label={`PROJECT IMAGE ${project.number}`}
                    sizes="(max-width: 900px) 100vw, 62vw"
                    className="identity-preview__media"
                    imageClassName="identity-preview__image"
                  />
                </div>
              </Link>

              <div className="identity-preview__info">
                <ProjectNumber current={project.number} total={projects.length} />
                <div>
                  <h3>{project.client}</h3>
                  <p className="identity-preview__meta font-mono">{project.industry}</p>
                </div>
                <p className="identity-preview__concept">{project.concept}</p>
                <Link className="text-link text-link--light" href={`/projetos/${project.slug}`} data-cursor="VIEW">
                  {homeContent.work.cta}
                  <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="identity-editorial" data-identity-editorial data-horizontal-snap>
          <div className="identity-editorial__media-rail" data-identity-editorial-media>
            <AssetMedia
              src={projects[0].application}
              alt={`Aplicação da identidade ${projects[0].client}`}
              label="IDENTITY / APPLICATION"
              sizes="(max-width: 900px) 100vw, 50vw"
              className="identity-editorial__image identity-editorial__image--wide"
            />
            <AssetMedia
              src={projects[1].image}
              alt={`Sistema visual de ${projects[1].client}`}
              label="IDENTITY / SYSTEM"
              sizes="(max-width: 900px) 100vw, 50vw"
              className="identity-editorial__image identity-editorial__image--detail"
            />
          </div>

          <div className="identity-editorial__copy" data-identity-editorial-copy>
            <span className="identity-editorial__eyebrow font-mono">02.4 — IDENTIDADE EM MOVIMENTO</span>
            <h3>
              A FORMA CHAMA.
              <span>A ESTRATÉGIA FAZ FICAR.</span>
            </h3>
            <p>
              Uma identidade não vive em uma apresentação. Ela precisa sustentar reconhecimento,
              desejo e coerência em cada ponto de contato.
            </p>
            <strong>Não desenhamos para preencher espaço. Desenhamos para ocupar memória.</strong>
          </div>

          <span className="identity-editorial__direction font-mono" aria-hidden="true">SCROLL / SOUTH → EAST</span>
        </div>
      </div>
    </section>
  );
}
