export function EmptyState({ title, text, action }) {
  return (
    <div className="empty">
      <h4>{title}</h4>
      <p>{text}</p>
      {action ? <div className="block-action">{action}</div> : null}
    </div>
  );
}

export function LockedState({ title, text }) {
  return (
    <div className="locked-block">
      <h4>{title}</h4>
      <p>{text}</p>
      <div className="block-action">
        <button className="primary-btn">升级 Pro 查看</button>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="skeletons">
      <div className="skeleton-grid">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
      <div className="panel-grid">
        <div className="skeleton-panel" />
        <div className="skeleton-panel" />
      </div>
    </div>
  );
}
