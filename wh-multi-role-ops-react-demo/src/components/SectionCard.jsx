export default function SectionCard({ title, subtitle, extra, children, flush }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {extra}
      </div>
      <div className={`panel-body ${flush ? "flush" : ""}`}>{children}</div>
    </section>
  );
}
