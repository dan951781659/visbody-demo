import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(React.createElement);

const items = [
  { key: "home", label: "首页", icon: "⌂" },
  { key: "my", label: "我的", icon: "◎" },
];

export function BottomNav({ currentTab, onChange }) {
  return html`
    <nav className="fixed bottom-0 left-0 right-0 z-20 mx-auto w-full max-w-md border-t border-fxLine bg-[#090f21]/85 backdrop-blur-[12px]">
      <div className="flex items-center justify-around pb-[max(env(safe-area-inset-bottom),12px)] pt-2">
        ${items.map(
          (item) => html`
            <button
              key=${item.key}
              onClick=${() => onChange(item.key)}
              className=${`flex min-w-20 flex-col items-center gap-1 rounded-card px-3 py-1 transition-all ${
                currentTab === item.key ? "text-white" : "text-fxSub hover:text-fxText"
              }`}
            >
              <span className="text-lg leading-none">${item.icon}</span>
              <span className="text-xs">${item.label}</span>
              ${currentTab === item.key &&
              html`<span className="h-1 w-8 rounded-full bg-gradient-to-r from-fxBlue via-fxPurple to-fxPink"></span>`}
            </button>
          `,
        )}
      </div>
    </nav>
  `;
}
