import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { AssetMedia } from "@/components/ui/AssetMedia";
import { CaseMotion } from "@/components/layout/CaseMotion";
import { caseContent, company } from "@/data/company";
import { getNextProject, getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.client} | ${company.name}`,
    description: project.description,
    alternates: { canonical: `/projetos/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projetos/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const nextProject = getNextProject(slug);
  const folder = `/projects/${project.slug}`;

  return (
    <CaseMotion>
      <article className="case-page">
        <section className="case-hero">
          <div className="case-hero__media" style={{ viewTransitionName: `project-${project.slug}` }}>
            <AssetMedia src={project.image} alt={`Imagem principal de ${project.client}`} label="PROJECT HERO" priority sizes="100vw" />
          </div>
          <div className="case-hero__overlay" />
          <div className="case-hero__copy page-shell" data-case-hero-copy>
            <Link href="/#work" className="case-back">
              <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.5} />
              {caseContent.back}
            </Link>
            <p className="font-mono">{project.number} / {String(projects.length).padStart(2, "0")}</p>
            <h1>{project.client}</h1>
            <div className="case-hero__meta font-mono">
              <span>{project.industry}</span>
              {project.year ? <span>{project.year}</span> : null}
            </div>
            <span className="case-scroll font-mono">{caseContent.scroll}</span>
          </div>
        </section>

        <section className="case-overview section-light">
          <div className="page-shell case-overview__grid">
            <CaseText number="01" title={caseContent.client} body={project.client} />
            <CaseText number="02" title={caseContent.context} body={caseContent.placeholders.context} />
            <CaseText number="03" title={caseContent.challenge} body={project.challenge} />
            <CaseText number="04" title={caseContent.concept} body={project.concept} large />
          </div>
        </section>

        <CaseMediaSection
          number="05"
          title={caseContent.research}
          body={caseContent.placeholders.research}
          items={[
            { src: project.research, label: "PROCESSO 01" },
            { src: `${folder}/process-02.webp`, label: "PROCESSO 02" },
          ]}
        />

        <CaseMediaSection
          number="06"
          title={caseContent.construction}
          body={caseContent.placeholders.construction}
          dark
          items={[
            { src: project.construction, label: "CONSTRUÇÃO" },
            { src: `${folder}/grid.webp`, label: "GRID / PROPORÇÕES" },
          ]}
        />

        <section className="case-symbol section-light">
          <div className="page-shell" data-case-reveal>
            <CaseHeading number="07" title={caseContent.symbol} />
            <AssetMedia src={project.symbol} alt={`Símbolo de ${project.client}`} label="SÍMBOLO FINAL" sizes="(max-width: 768px) 80vw, 48vw" />
          </div>
        </section>

        <section className="case-system section-dark">
          <div className="page-shell">
            <div className="case-system__block" data-case-reveal>
              <CaseHeading number="08" title={caseContent.typography} />
              <p>{caseContent.placeholders.typography}</p>
              <AssetMedia src={`${folder}/typography.webp`} alt={`Sistema tipográfico de ${project.client}`} label="TIPOGRAFIA" sizes="100vw" />
            </div>
            <div className="case-system__block" data-case-reveal>
              <CaseHeading number="09" title={caseContent.colors} />
              <p>{caseContent.placeholders.colors}</p>
              <AssetMedia src={`${folder}/colors.webp`} alt={`Paleta cromática de ${project.client}`} label="CORES" sizes="100vw" />
            </div>
            <div className="case-system__block" data-case-reveal>
              <CaseHeading number="10" title={caseContent.visualSystem} />
              <p>{caseContent.placeholders.visualSystem}</p>
              <AssetMedia src={`${folder}/system.webp`} alt={`Sistema visual de ${project.client}`} label="SISTEMA VISUAL" sizes="100vw" />
            </div>
          </div>
        </section>

        <CaseMediaSection
          number="11"
          title={caseContent.applications}
          items={[
            { src: project.application, label: "APLICAÇÃO 01" },
            { src: `${folder}/application-02.webp`, label: "APLICAÇÃO 02" },
            { src: `${folder}/application-03.webp`, label: "APLICAÇÃO 03" },
          ]}
        />

        <section className="case-result section-light">
          <div className="page-shell" data-case-reveal>
            <CaseHeading number="12" title={caseContent.result} />
            <p>{caseContent.placeholders.result}</p>
          </div>
        </section>

        <section className="next-project section-dark">
          <Link href={`/projetos/${nextProject.slug}`} data-cursor="VIEW">
            <span className="font-mono">{caseContent.next}</span>
            <strong>{nextProject.client}</strong>
            <ArrowRight aria-hidden="true" size={40} strokeWidth={1} />
          </Link>
        </section>
      </article>
    </CaseMotion>
  );
}

function CaseText({ number, title, body, large = false }: { number: string; title: string; body: string; large?: boolean }) {
  return (
    <div className={`case-text ${large ? "case-text--large" : ""}`} data-case-reveal>
      <CaseHeading number={number} title={title} />
      <p>{body}</p>
    </div>
  );
}

function CaseHeading({ number, title }: { number: string; title: string }) {
  return <h2 className="case-heading"><span className="font-mono">{number}</span>{title}</h2>;
}

function CaseMediaSection({
  number,
  title,
  body,
  dark = false,
  items,
}: {
  number: string;
  title: string;
  body?: string;
  dark?: boolean;
  items: { src: string; label: string }[];
}) {
  return (
    <section className={`case-media-section ${dark ? "section-dark" : "section-light"}`}>
      <div className="page-shell" data-case-reveal>
        <CaseHeading number={number} title={title} />
        {body ? <p className="case-media-section__body">{body}</p> : null}
        <div className={`case-media-grid case-media-grid--${items.length}`}>
          {items.map((item) => (
            <AssetMedia key={item.src} src={item.src} alt={`${title} de projeto`} label={item.label} sizes={items.length > 1 ? "(max-width: 768px) 100vw, 50vw" : "100vw"} />
          ))}
        </div>
      </div>
    </section>
  );
}
