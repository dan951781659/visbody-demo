import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(React.createElement);

const items = [
  { key: "home", label: "首页", icon: "⌂" },
  { key: "my", label: "我的", icon: "◎" },
];

export function BottomNav({ currentTab, onChange }) {
  return html`
<<<<<<< HEAD
    <nav className="fixed bottom-0 left-0 right-0 z-20 mx-auto w-full max-w-md border-t border-fxLine bg-[#090f21]/85 backdrop-blur-[12px]">
=======
    <nav className="fx-navGlass fixed bottom-0 left-0 right-0 z-20 mx-auto w-full max-w-md">
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
      <div className="flex items-center justify-around pb-[max(env(safe-area-inset-bottom),12px)] pt-2">
        ${items.map(
          (item) => html`
            <button
              key=${item.key}
              onClick=${() => onChange(item.key)}
              className=${`flex min-w-20 flex-col items-center gap-1 rounded-card px-3 py-1 transition-all ${
<<<<<<< HEAD
                currentTab === item.key ? "text-white" : "text-fxSub hover:text-fxText"
=======
                currentTab === item.key
                  ? "bg-white/[0.04] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_18px_rgba(0,229,255,0.08)]"
                  : "text-fxSub hover:text-fxText"
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
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
