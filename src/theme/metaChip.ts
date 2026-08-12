/**
 * Meta chip palettes aligned with device-side MetaChipTheme.kt / ListMetaChip.kt.
 * Dark: translucent hue fill + bright text. Light: solid pastel fill + deepened text.
 */

export type MetaChipStyle =
  | "Scene"
  | "Difficulty"
  | "Equipment"
  | "Muscles"
  | "AI"
  | "Cycle"
  | "Count"
  | "Duration"
  | "RepairInterval"
  | "Weight"
  | "Personalized"
  | "Other";

export type MetaChipPalette = {
  background: string;
  text: string;
  border: string;
};

type MetaChipFamily = "dark" | "light";

/** Convert #RRGGBB + alpha (0–1) to rgba(). */
function hexAlpha(hex: string, alpha: number): string {
  const raw = hex.replace("#", "");
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Dark base hues (pre-alpha), matching Kotlin Color(0xFF…). */
const darkBases: Record<MetaChipStyle, { bg: string; text: string }> = {
  Scene: { bg: "#15331E", text: "#6FCF97" },
  Difficulty: { bg: "#383344", text: "#8B50F6" },
  Muscles: { bg: "#492D42", text: "#FA8BDB" },
  Equipment: { bg: "#4F372D", text: "#F86E38" },
  AI: { bg: "#2A3D50", text: "#0A84FF" },
  Cycle: { bg: "#3D1A1A", text: "#FB923C" },
  Count: { bg: "#332B08", text: "#B2972B" },
  Duration: { bg: "#133328", text: "#34D399" },
  RepairInterval: { bg: "#1A2630", text: "#94A3B8" },
  Weight: { bg: "#363859", text: "#969FFA" },
  Personalized: { bg: "#462B4B", text: "#882E98" },
  Other: { bg: "#1A2129", text: "#9CA3AF" },
};

const lightPalettes: Record<MetaChipStyle, MetaChipPalette> = {
  Scene: { background: "#E8F8EF", text: "#15803D", border: "#86EFAC" },
  Difficulty: { background: "#F3EEFF", text: "#7C3AED", border: "#C4B5FD" },
  Muscles: { background: "#FDF2F8", text: "#DB2777", border: "#F9A8D4" },
  Equipment: { background: "#FFF1E8", text: "#EA580C", border: "#FDBA74" },
  AI: { background: "#E8F4FF", text: "#007AFF", border: "#93C5FD" },
  Cycle: { background: "#FFEDD5", text: "#C2410C", border: "#FDBA74" },
  Count: { background: "#FEF9C3", text: "#A16207", border: "#FDE047" },
  Duration: { background: "#DCFCE7", text: "#047857", border: "#6EE7B7" },
  RepairInterval: { background: "#F1F5F9", text: "#64748B", border: "#CBD5E1" },
  Weight: { background: "#EEF2FF", text: "#4F46E5", border: "#A5B4FC" },
  Personalized: { background: "#FAE8FF", text: "#9333EA", border: "#D8B4FE" },
  Other: { background: "#F1F5F9", text: "#64748B", border: "#CBD5E1" },
};

function darkMetaChipPalette(style: MetaChipStyle): MetaChipPalette {
  const { bg, text } = darkBases[style];
  return {
    background: hexAlpha(bg, 0.5),
    text,
    // ListMetaChip applies border.copy(alpha = 0.72f), which replaces alpha (not multiplies).
    border: hexAlpha(bg, 0.72),
  };
}

export function getMetaChipPalette(
  style: MetaChipStyle,
  family: MetaChipFamily = "dark",
): MetaChipPalette {
  return family === "light" ? lightPalettes[style] : darkMetaChipPalette(style);
}
