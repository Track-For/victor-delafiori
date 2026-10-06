import { homeContent } from "@/data/company";

export function Manifesto() {
  return (
    <section className="manifesto section-light" data-manifesto>
      <div className="manifesto__stage">
        {homeContent.manifesto.frames.map((frame, frameIndex) => (
          <div className="manifesto__frame" data-manifesto-frame key={frameIndex}>
            {frame.map((line) => <span key={line}>{line}</span>)}
          </div>
        ))}
        <p>{homeContent.manifesto.body}</p>
      </div>
    </section>
  );
}
