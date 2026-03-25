import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(React.createElement);

export function EmptyState({ title, desc, actionText, onAction }) {
  return html`
    <div className="rounded-card border border-dashed border-white/25 bg-white/[0.03] p-6 text-center backdrop-blur-[12px]">
      <p className="text-base font-semibold text-fxText">${title}</p>
      <p className="mt-2 text-sm text-fxSub">${desc}</p>
      ${actionText &&
      html`
        <button
          onClick=${onAction}
          className="mt-4 fx-cta px-4 py-2 text-sm font-medium"
        >
          ${actionText}
        </button>
      `}
    </div>
  `;
}
