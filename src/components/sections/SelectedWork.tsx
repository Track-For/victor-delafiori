import { homeContent } from "@/data/company";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function SelectedWork() {
  return (
    <section className="selected-work section-dark" id="work">
      <div className="page-shell">
        <SectionLabel>{homeContent.work.label}</SectionLabel>
        <h2 className="selected-work__title" data-reveal>
          <span>{homeContent.work.title}</span>
          <em>{homeContent.work.titleAccent}</em>
        </h2>
        <div className="selected-work__list">
          {projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
        </div>
      </div>
    </section>
  );
}
