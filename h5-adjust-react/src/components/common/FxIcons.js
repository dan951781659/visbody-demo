/**
 * 一级标题：面性（实心 fill + currentColor）
 * 二级/辅助：线性（stroke，无填充）
 */
import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";

const html = htm.bind(React.createElement);

const svgBase = {
  filled: "shrink-0 text-white",
  linear: "shrink-0 text-fxSub/90",
};

/** 一级标题旁：实心图标，置于渐变圆内 */
export function FxIconFilled({ name, className = "" }) {
  const c = `${svgBase.filled} ${className}`;
  switch (name) {
    case "sparkle":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 2l1.2 4.2L18 8l-4.8 1.8L12 14l-1.2-4.2L6 8l4.8-1.8L12 2z" />
      </svg>`;
    case "chart":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M4 20h16v2H2V4h2v16zm3-6h2v4H7v-4zm4-4h2v8h-2v-8zm4-6h2v14h-2V4z" />
      </svg>`;
    case "trend":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 17h2v4H1V3h2v14zm4-6h2v10H5V11zm4-4h2v14H9V7zm4-6h2v20h-2V1zm4 4h2v16h-2V5z"
        />
      </svg>`;
    case "bolt":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M11 21h4l2-10h5L13 3v6H9l-1 12z" />
      </svg>`;
    case "doc":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
      </svg>`;
    case "gear":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.07-.98l2.11-1.65c.2-.15.25-.42.13-.64l-2-3.46a.51.51 0 00-.61-.22l-2.49 1a7.87 7.87 0 00-1.69-.98l-.38-2.65A.5.5 0 0014 2h-4c-.25 0-.46.18-.5.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.52.52 0 00-.61.22l-2 3.46c-.12.22-.07.49.12.64L4.57 11c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.2.15-.25.42-.13.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5A3.5 3.5 0 1112 8a3.5 3.5 0 010 7.5z"
        />
      </svg>`;
    case "clipboard":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16 4h-1V2h-6v2H8a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2zM10 4h4v2h-4V4zm6 18H8V6h8v16z"
        />
      </svg>`;
    case "user":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
      </svg>`;
    case "puzzle":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M11 4a2 2 0 012-2h2v3a2 2 0 002 2 2 2 0 002-2V2h2a2 2 0 012 2v2h-3a2 2 0 00-2 2 2 2 0 002 2h3v2h-2a2 2 0 00-2 2 2 2 0 002 2h2v2a2 2 0 01-2 2h-2v-3a2 2 0 00-2-2 2 2 0 00-2 2v3h-2v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2H4v-2a2 2 0 012-2h3a2 2 0 002-2 2 2 0 00-2-2H4V8h2a2 2 0 002-2 2 2 0 00-2-2H4V4h3a2 2 0 002-2z"
        />
      </svg>`;
    case "calendar":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
      </svg>`;
    case "compass":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5l3 8-8-3 5-5zm-1 7.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
      </svg>`;
    case "target":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14a6 6 0 100 12 6 6 0 000-12z" />
      </svg>`;
    case "train":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 2c-4 0-8 .5-8 4v9.5A3.5 3.5 0 007.5 19L6 20.5V21h2l1.5-1.5h5L16 21h2v-.5L16.5 19A3.5 3.5 0 0020 15.5V6c0-3.5-4-4-8-4zm0 2c3.5 0 6.5.4 6.5 2H5.5c0-1.6 3-2 6.5-2zm0 14a2 2 0 110-4 2 2 0 010 4z" />
      </svg>`;
    case "folder":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" />
      </svg>`;
    case "play":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M8 5v14l11-7L8 5z" />
      </svg>`;
    case "check":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>`;
    case "person":
      return html`<svg className=${c} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>`;
    default:
      return html`<span className=${`text-[10px] font-bold ${className}`}>•</span>`;
  }
}

/** 列表/图表行内：线性图标 */
export function FxIconLinear({ name, className = "" }) {
  const c = `${svgBase.linear} ${className}`;
  const stroke = "currentColor";
  switch (name) {
    case "chart":
      return html`<svg className=${c} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path stroke=${stroke} stroke-width="1.75" stroke-linecap="round" d="M4 20V10M10 20V4M16 20v-6M22 20V8" />
      </svg>`;
    case "flame":
      return html`<svg className=${c} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          stroke=${stroke}
          stroke-width="1.75"
          stroke-linecap="round"
          d="M12 22c4.5 0 6-3 6-6 0-3-2-5-4-7-.5 3-2 4-2 4s-1-2-1-5c-3 2-5 5-5 9 0 4 2.5 7 6 7z"
        />
      </svg>`;
    case "bone":
      return html`<svg className=${c} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path stroke=${stroke} stroke-width="1.75" stroke-linecap="round" d="M8 8l8 8M9 4l4 4M11 16l4 4M4 9l4 4M16 11l4 4" />
      </svg>`;
    case "ruler":
      return html`<svg className=${c} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path stroke=${stroke} stroke-width="1.75" d="M4 20L20 4M8 4l2 2M12 8l2 2M16 12l2 2" />
      </svg>`;
    case "lineTrend":
      return html`<svg className=${c} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path stroke=${stroke} stroke-width="1.75" stroke-linecap="round" d="M4 16l4-6 4 3 8-9" />
      </svg>`;
    case "alert":
      return html`<svg className=${c} width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path stroke=${stroke} stroke-width="1.5" stroke-linecap="round" d="M12 9v4M12 17h.01M10.3 4.8L2.6 18.2c-.5.9.1 2 1.2 2h16.4c1.1 0 1.7-1.1 1.2-2L13.7 4.8c-.5-1-1.9-1-2.4 0z" />
      </svg>`;
    case "checkCircle":
      return html`<svg className=${c} width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path stroke=${stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z" />
      </svg>`;
    case "docHelp":
      return html`<svg className=${c} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path stroke=${stroke} stroke-width="1.5" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
        <circle cx="17" cy="17" r="3.5" fill="rgba(0,229,255,0.15)" stroke=${stroke} stroke-width="1.25" />
        <path stroke=${stroke} stroke-width="1.25" stroke-linecap="round" d="M17 15.5v.01M17 17.2v.8" />
      </svg>`;
    default:
      return html`<svg className=${c} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke=${stroke} stroke-width="1.75" />
      </svg>`;
  }
}

export function trendLinearIconForMetric(metricName) {
  const m = String(metricName || "");
  if (/体脂|脂肪/.test(m)) return "flame";
  if (/骨盆|倾角|脊柱/.test(m)) return "bone";
  if (/围|腰/.test(m)) return "ruler";
  return "lineTrend";
}
