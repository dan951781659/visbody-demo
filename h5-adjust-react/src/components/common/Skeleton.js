import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(React.createElement);

export function SkeletonBlock({ className = "" }) {
  return html`<div className=${`animate-pulse rounded-card bg-white/10 ${className}`}></div>`;
}

export function HomeSkeleton() {
  return html`
    <div className="space-y-3 px-4 pt-4">
      <${SkeletonBlock} className="h-20 w-full" />
      <${SkeletonBlock} className="h-28 w-full" />
      <${SkeletonBlock} className="h-40 w-full" />
      <${SkeletonBlock} className="h-32 w-full" />
      <${SkeletonBlock} className="h-28 w-full" />
    </div>
  `;
}
