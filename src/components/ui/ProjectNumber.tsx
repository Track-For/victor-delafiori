export function ProjectNumber({ current, total }: { current: string; total: number }) {
  return (
    <span className="project-number font-mono" aria-label={`Projeto ${current} de ${total}`}>
      <span>{current}</span>
      <span aria-hidden="true">/</span>
      <span>{String(total).padStart(2, "0")}</span>
    </span>
  );
}
