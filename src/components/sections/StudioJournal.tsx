import { AssetMedia } from "@/components/ui/AssetMedia";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { studioStills, studioVideos } from "@/data/studioVideos";

export function StudioJournal() {
  return (
    <section className="studio-journal section-dark" aria-labelledby="studio-journal-title">
      <div className="page-shell">
        <div className="studio-journal__intro">
          <div>
            <SectionLabel>FILM 01—05 / STUDIO JOURNAL</SectionLabel>
            <h2 id="studio-journal-title" data-reveal>
              IDEIAS EM
              <em>movimento</em>
            </h2>
          </div>
          <p data-reveal>
            Projetos, processo e visão de negócio vistos de perto, sem separar o pensamento da forma
          </p>
        </div>

        <div className="studio-stills">
          <div className="studio-stills__heading" data-reveal>
            <p className="font-mono">SELECTED FRAMES / 01—03</p>
            <p>Recortes em que o processo deixa de ser explicação e passa a ser imagem</p>
          </div>
          <div className="studio-stills__grid">
            {studioStills.map((still) => (
              <figure className="studio-still" data-reveal key={still.src}>
                <AssetMedia
                  src={still.src}
                  alt={still.alt}
                  label={still.title}
                  sizes="(max-width: 767px) 82vw, 38vw"
                  className="studio-still__media"
                />
                <figcaption>
                  <span className="font-mono">{still.number}</span>
                  <strong>{still.title}</strong>
                  <span className="font-mono">{still.context}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="studio-journal__grid" aria-label="Vídeos do estúdio">
          {studioVideos.map((video) => (
            <figure className="studio-video" data-reveal key={video.src}>
              <div className="studio-video__frame">
                <video
                  controls
                  playsInline
                  preload="none"
                  poster={video.poster}
                  aria-label={video.title}
                >
                  <source src={video.src} type="video/mp4" />
                  Seu navegador não oferece suporte à reprodução de vídeo.
                </video>
              </div>
              <figcaption>
                <span className="studio-video__number font-mono">{video.number}</span>
                <div>
                  <h3>{video.title}</h3>
                  <p className="font-mono">{video.category}</p>
                </div>
                <span className="studio-video__duration font-mono">{video.duration}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
