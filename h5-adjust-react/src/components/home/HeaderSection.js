import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(React.createElement);

export function HeaderSection({ user }) {
  return html`
    <section className="rounded-card border border-fxLine bg-white/[0.03] p-4 backdrop-blur-[12px]">
      <div className="flex items-center gap-3">
        <img src=${user.avatar} alt=${user.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-white/15" />
        <div className="min-w-0">
          <p className="truncate text-sm text-fxSub">最近评估：${user.latestAssessmentTime}</p>
          <h2 className="truncate text-lg font-semibold text-fxText">${user.name}，欢迎回来</h2>
          <p className="truncate text-xs text-fxSub">你今天离更稳的体态又近了一步</p>
        </div>
      </div>
    </section>
  `;
}
