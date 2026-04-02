import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { FxIconFilled } from "./FxIcons.js";

const html = htm.bind(React.createElement);

/** 旧 emoji 入口兼容 → 图标 key */
const LEGACY_TITLE_ICON = {
  "✨": "sparkle",
  "📈": "trend",
  "📊": "chart",
  "⚡": "bolt",
  "📄": "doc",
  "⚙": "gear",
  "◎": "user",
  "🧩": "puzzle",
  "📅": "calendar",
  "🧭": "compass",
  "🎯": "target",
  "🛤": "train",
  "🗂": "folder",
  "▶": "play",
  "✅": "check",
  "🧍": "person",
};

function resolveTitleIcon(icon) {
  if (!icon) return null;
  if (LEGACY_TITLE_ICON[icon]) return LEGACY_TITLE_ICON[icon];
  return icon;
}

function TitleIcon({ icon }) {
  const key = resolveTitleIcon(icon);
  if (!key) return null;
  return html`
    <span
      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-fxPrimary/90 via-fxPurple/80 to-fxPink/70 shadow-[0_0_16px_rgba(0,229,255,0.22)]"
      aria-hidden="true"
    >
      <${FxIconFilled} name=${key} className="h-[14px] w-[14px]" />
    </span>
  `;
}

export function Card({
  title,
  titleIcon,
  subtitle,
  children,
  onClick,
  footer,
  headerRight,
  className = "",
  selected = false,
}) {
  return html`
    <section
      onClick=${onClick}
      className=${`group relative overflow-hidden rounded-none border-x-0 border-b border-t-0 border-white/[0.06] bg-[linear-gradient(180deg,rgba(20,30,60,0.55),rgba(14,22,46,0.5))] px-3 py-4 shadow-none backdrop-blur-[12px] transition-all duration-300 hover:bg-[linear-gradient(180deg,rgba(22,34,68,0.62),rgba(16,26,52,0.55))] ${
        selected ? "ring-0 ring-transparent shadow-[inset_0_0_0_1px_rgba(0,229,255,0.22)]" : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-fxPrimary/34 to-transparent opacity-90"></div>
      <div className="pointer-events-none absolute -inset-16 bg-[radial-gradient(circle_at_0%_0%,rgba(0,229,255,0.08)_0%,transparent_48%)] opacity-80"></div>
      <div className="pointer-events-none absolute -right-12 top-[-80px] h-40 w-40 rounded-full bg-fxPurple/10 blur-3xl opacity-70"></div>
      ${(title || subtitle || headerRight) &&
      html`
        <header className="relative mb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              ${title &&
              html`
                <div className="flex items-center gap-2">
                  <${TitleIcon} icon=${titleIcon} />
                  <h3
                    className="bg-gradient-to-r from-white via-fxPrimary to-fxPurple bg-clip-text text-[15px] font-bold tracking-[0.03em] text-transparent"
                  >
                    ${title}
                  </h3>
                </div>
                <div className="mt-1 h-[2px] w-6 rounded-sm bg-gradient-to-r from-fxPrimary to-fxPurple opacity-90"></div>
              `}
              ${subtitle && html`<p className="mt-1.5 text-[12px] leading-relaxed text-fxSub">${subtitle}</p>`}
            </div>
            ${headerRight && html`<div className="shrink-0 pt-0.5">${headerRight}</div>`}
          </div>
        </header>
      `}
      <div>${children}</div>
      ${footer && html`<footer className="mt-3 border-t border-white/[0.06] pt-3">${footer}</footer>`}
    </section>
  `;
}
