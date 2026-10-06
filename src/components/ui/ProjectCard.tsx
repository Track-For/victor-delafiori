import { ArrowUpRight } from "lucide-react";
import { Link } from "next-view-transitions";
import { projects, type Project } from "@/data/projects";
import { homeContent } from "@/data/company";
import { AssetMedia } from "./AssetMedia";
import { ProjectNumber } from "./ProjectNumber";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`project-card ${index % 2 ? "project-card--reverse" : ""}`} data-project-card>
      <Link
        href={`/projetos/${project.slug}`}
        className="project-card__media-link"
        data-cursor="VIEW"
        aria-label={`Ver ${project.client}`}
      >
        <div style={{ viewTransitionName: `project-${project.slug}` }}>
          <div className="project-card__curtain" data-curtain-reveal>
            <AssetMedia
              src={project.image}
              alt={`Imagem principal de ${project.client}`}
              label={`PROJECT IMAGE ${project.number}`}
              sizes="(max-width: 768px) 100vw, 62vw"
              className="project-card__media"
              imageClassName="project-card__zoom-image"
            />
          </div>
        </div>
      </Link>
      <div className="project-card__info">
        <ProjectNumber current={project.number} total={projects.length} />
        <div>
          <h3>{project.client}</h3>
          <p className="project-card__meta font-mono">
            {project.industry}{project.year ? ` / ${project.year}` : ""}
          </p>
        </div>
        <p className="project-card__concept">{project.concept}</p>
        <Link className="text-link" href={`/projetos/${project.slug}`} data-cursor="VIEW">
          {homeContent.work.cta}
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
        </Link>
      </div>
    </article>
  );
}
