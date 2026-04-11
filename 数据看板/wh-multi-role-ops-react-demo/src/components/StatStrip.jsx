export default function StatStrip({ items, tier }) {
  return (
    <section className="stat-strip">
      {items.map((item) => {
        const locked = item.proOnly && tier === "basic";
        return (
          <article key={item.label} className={`stat-card ${locked ? "locked" : ""}`}>
            <div>
              <div className="label">
                <span>{item.label}</span>
                {item.badge ? <span className={`pill ${item.badgeTone || "gray"}`}>{item.badge}</span> : null}
              </div>
              <div className="value">{locked ? "—" : item.value}</div>
              <div className="delta">
                <strong>{locked ? "Pro 指标" : item.delta}</strong>
                <span>{locked ? "升级后可见" : item.hint}</span>
              </div>
            </div>
            <div className="card-foot">
              <span>{item.ruleShort || "点击下钻查看明细"}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
