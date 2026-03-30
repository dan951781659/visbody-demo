import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(React.createElement);

function TitleIcon({ icon }) {
  if (!icon) return null;
  return html`
    <span
      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-fxPrimary/90 via-fxPurple/80 to-fxPink/70 text-[13px] text-slate-950 shadow-[0_0_16px_rgba(0,229,255,0.22)]"
      aria-hidden="true"
    >
      ${icon}
    </span>
  `;
}

export function Card({ title, titleIcon, subtitle, children, onClick, footer, className = "" }) {
  return html`
    <section
      onClick=${onClick}
<<<<<<< HEAD
      className=${`group relative overflow-hidden rounded-card border border-fxCardBorder bg-fxCard p-4 shadow-card backdrop-blur-[12px] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-glow ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-fxPrimary/30 to-transparent opacity-80"></div>
      <div className="pointer-events-none absolute -inset-12 bg-[radial-gradient(circle,rgba(0,229,255,0.08)_0%,transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
=======
      className=${`group relative overflow-hidden rounded-card border border-fxCardBorder bg-[linear-gradient(180deg,rgba(20,30,60,0.72),rgba(14,22,46,0.74))] p-4 shadow-[0_14px_38px_rgba(0,0,0,0.26)] backdrop-blur-[14px] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-glow ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-fxPrimary/34 to-transparent opacity-90"></div>
      <div className="pointer-events-none absolute -inset-16 bg-[radial-gradient(circle_at_0%_0%,rgba(0,229,255,0.08)_0%,transparent_48%)] opacity-80"></div>
      <div className="pointer-events-none absolute -right-12 top-[-80px] h-40 w-40 rounded-full bg-fxPurple/10 blur-3xl opacity-70"></div>
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
      ${(title || subtitle) &&
      html`
        <header className="relative mb-3">
          ${title &&
          html`
            <div className="flex items-center gap-2">
              <${TitleIcon} icon=${titleIcon} />
              <h3
<<<<<<< HEAD
                className="bg-gradient-to-r from-white via-fxPrimary to-fxPurple bg-clip-text text-[17px] font-extrabold tracking-wide text-transparent"
=======
                className="bg-gradient-to-r from-white via-fxPrimary to-fxPurple bg-clip-text text-[17px] font-extrabold tracking-[0.04em] text-transparent"
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
              >
                ${title}
              </h3>
            </div>
            <div className="mt-1 h-[3px] w-7 rounded-sm bg-gradient-to-r from-fxPrimary to-fxPurple shadow-[0_0_10px_rgba(0,229,255,0.25)]"></div>
          `}
          ${subtitle && html`<p className="mt-2 text-[13px] leading-relaxed text-fxSub">${subtitle}</p>`}
        </header>
      `}
      <div>${children}</div>
      ${footer && html`<footer className="mt-3 border-t border-fxLine pt-3">${footer}</footer>`}
    </section>
  `;
}
