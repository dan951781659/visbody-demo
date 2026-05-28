#!/usr/bin/env python3
"""Generate isometric turntable + footprint + electrode alignment SVG for VAPro7 demo."""

from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "assets" / "bodycomp-prep" / "footprint-turntable-alignment.svg"


def iso(x: float, y: float, z: float = 0) -> tuple[float, float]:
    """Simple isometric projection (x right, y into screen, z up)."""
    return (200 + (x - y) * 0.866, 220 + (x + y) * 0.5 - z)


def path_from_points(points: list[tuple[float, float, float]]) -> str:
    pts = [iso(*p) for p in points]
    d = "M " + " L ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    return d + " Z"


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)

    # Platform top (diamond)
    platform_top = path_from_points([
        (-70, -50, 0), (70, -50, 0), (70, 50, 0), (-70, 50, 0),
    ])
    platform_side_l = path_from_points([
        (-70, -50, 0), (-70, 50, 0), (-70, 50, -14), (-70, -50, -14),
    ])
    platform_side_r = path_from_points([
        (70, -50, 0), (70, 50, 0), (70, 50, -14), (70, -50, -14),
    ])
    platform_front = path_from_points([
        (-70, 50, 0), (70, 50, 0), (70, 50, -14), (-70, 50, -14),
    ])

    # Alignment zone (dashed guide on platform)
    align_zone = path_from_points([
        (-52, -38, 1), (52, -38, 1), (52, 38, 1), (-52, 38, 1),
    ])

    def foot_outline(cx: float, cy: float, mirror: float = 1) -> str:
        w, h = 22 * mirror, 38
        return path_from_points([
            (cx - w * 0.35, cy - h * 0.45, 2),
            (cx + w * 0.35, cy - h * 0.45, 2),
            (cx + w * 0.42, cy + h * 0.35, 2),
            (cx, cy + h * 0.48, 2),
            (cx - w * 0.42, cy + h * 0.35, 2),
        ])

    left_foot = foot_outline(-28, 0, 1)
    right_foot = foot_outline(28, 0, -1)

    def electrode(cx: float, cy: float, w: float, h: float) -> str:
        return path_from_points([
            (cx - w, cy - h, 3),
            (cx + w, cy - h, 3),
            (cx + w, cy + h, 3),
            (cx - w, cy + h, 3),
        ])

    electrodes = [
        electrode(-28, -12, 8, 5),
        electrode(-28, 14, 7, 5),
        electrode(28, -12, 8, 5),
        electrode(28, 14, 7, 5),
        electrode(-28, 1, 6, 4),
        electrode(28, 1, 6, 4),
    ]

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 360" role="img" aria-label="转台脚印与电极片对准示意">
  <defs>
    <linearGradient id="platformTop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3d4a5c"/>
      <stop offset="100%" stop-color="#252d3a"/>
    </linearGradient>
    <linearGradient id="platformSide" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2a3344"/>
      <stop offset="100%" stop-color="#1a2029"/>
    </linearGradient>
    <linearGradient id="electrodeMetal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c8d4e8"/>
      <stop offset="50%" stop-color="#8fa3c4"/>
      <stop offset="100%" stop-color="#5c6d88"/>
    </linearGradient>
    <linearGradient id="electrodeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6eb0ff"/>
      <stop offset="100%" stop-color="#2b7cff"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <style>
      .label {{ font-family: system-ui, sans-serif; font-size: 11px; fill: #b8c9e8; }}
      .label-bg {{ fill: rgba(0,0,0,0.45); }}
      .align-guide {{ fill: none; stroke: rgba(43,124,255,0.45); stroke-width: 1.5; stroke-dasharray: 6 4; }}
      .footprint {{ fill: rgba(43,124,255,0.12); stroke: rgba(110,176,255,0.55); stroke-width: 1.2; }}
      .electrode {{ fill: url(#electrodeMetal); stroke: rgba(200,212,232,0.6); stroke-width: 0.8; }}
      .electrode-glow {{ fill: url(#electrodeGlow); stroke: #6eb0ff; stroke-width: 1.2; filter: url(#glow); }}
      .platform-edge {{ stroke: rgba(255,255,255,0.08); stroke-width: 1; }}
    </style>
  </defs>
  <rect width="400" height="360" fill="#0a0c10"/>
  <ellipse cx="200" cy="300" rx="120" ry="28" fill="rgba(43,124,255,0.06)"/>
  <g class="turntable-platform">
    <path d="{platform_side_l}" fill="url(#platformSide)" class="platform-edge"/>
    <path d="{platform_side_r}" fill="url(#platformSide)" class="platform-edge"/>
    <path d="{platform_front}" fill="#1e2530" class="platform-edge"/>
    <path d="{platform_top}" fill="url(#platformTop)" class="platform-edge"/>
  </g>
  <path d="{align_zone}" class="align-guide" data-align-zone="true"/>
  <g class="electrodes" data-electrodes="true">
    {chr(10).join(f'    <path d="{e}" class="electrode"/>' for e in electrodes)}
  </g>
  <g class="footprints" data-footprints="true">
    <path d="{left_foot}" class="footprint"/>
    <path d="{right_foot}" class="footprint"/>
  </g>
  <g class="labels">
    <rect x="118" y="72" width="36" height="18" rx="6" class="label-bg"/>
    <text x="136" y="85" text-anchor="middle" class="label">脚印</text>
    <rect x="246" y="248" width="44" height="18" rx="6" class="label-bg"/>
    <text x="268" y="261" text-anchor="middle" class="label">电极片</text>
  </g>
  <g class="aligned-overlay" opacity="0" data-aligned-overlay="true">
    {chr(10).join(f'    <path d="{e}" class="electrode-glow"/>' for e in electrodes)}
  </g>
</svg>
'''
    OUT.write_text(svg, encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
