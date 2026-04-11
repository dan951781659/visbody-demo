export default function AppShell({
  roles,
  currentRole,
  currentPage,
  onRoleChange,
  onPageChange,
  children
}) {
  const role = roles[currentRole];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">W</div>
            <div>
              <div className="brand-title">Visbody WellnessHub</div>
              <div className="brand-sub">运营分析</div>
            </div>
          </div>

        <div className="nav-group">
          <div className="side-section-title">角色视图</div>
          <div className="nav-list">
            {Object.entries(roles).map(([key, item]) => (
              <button
                key={key}
                className={`side-btn ${key === currentRole ? "active" : ""}`}
                onClick={() => onRoleChange(key)}
              >
                <span className="left">
                  <span className="dot" />
                  <span>{item.label}</span>
                </span>
                <span className="side-meta">{key === currentRole ? "当前" : ""}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="nav-group">
          <div className="side-section-title">当前页面</div>
          <div className="nav-list">
            {role.pages.map((page) => (
              <button
                key={page.key}
                className={`side-btn ${page.key === currentPage ? "active" : ""}`}
                onClick={() => onPageChange(page.key)}
              >
                <span className="left">
                  <span className="dot" />
                  <span>{page.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="global-bar">
          <div className="crumbs">Visbody WellnessHub / 运营工作台 / 多角色演示</div>
          <div className="global-right">
            <span className="tiny-pill">Web 后台</span>
            <span className="tiny-pill">更新时间 2026-04-11 10:30:00</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
