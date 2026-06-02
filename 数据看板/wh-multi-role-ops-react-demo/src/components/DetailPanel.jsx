export default function DetailPanel({ title, subtitle, sections, actions }) {
  return (
    <aside className="detail-panel">
      <h3>{title}</h3>
      {subtitle ? <div className="sub">{subtitle}</div> : null}

      {sections.map((section) => (
        <div key={section.title || section.type} className="detail-section">
          {section.title ? <h3 className="detail-title">{section.title}</h3> : null}

          {section.kv
            ? section.kv.map((item) => (
                <div key={item.label} className="kv">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))
            : null}

          {section.bullets ? (
            <div className="bullet-list">
              {section.bullets.map((bullet) => (
                <div key={bullet} className="bullet">
                  <i />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          ) : null}

          {section.body ? <p>{section.body}</p> : null}
        </div>
      ))}

      {actions ? <div className="detail-actions">{actions}</div> : null}
    </aside>
  );
}
