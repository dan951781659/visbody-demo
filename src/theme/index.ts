export type ColorSchemeId = "classic" | "deviceBlue";

export type ColorPalette = {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  border: string;
  glass: string;
  glassStrong: string;
  glassBorder: string;
  glassHighlight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentDark: string;
  accentBright: string;
  accentGlass: string;
  accentText: string;
  /** Primary glass button fill (native tint / web fallback). */
  accentButtonFill: string;
  accentButtonFillStrong: string;
  orange: string;
  blue: string;
  cyan: string;
  green: string;
  red: string;
  tabInactive: string;
  overlay: string;
  cardGradientStart: string;
  cardGradientEnd: string;
};

const sharedNeutral = {
  background: "#000000",
  surface: "#1C1C1E",
  surfaceElevated: "#2C2C2E",
  surfaceMuted: "#3A3A3C",
  border: "rgba(255,255,255,0.08)",
  glass: "rgba(28,28,30,0.34)",
  glassStrong: "rgba(44,44,46,0.44)",
  glassBorder: "rgba(255,255,255,0.12)",
  glassHighlight: "rgba(255,255,255,0.06)",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.65)",
  textMuted: "rgba(255,255,255,0.45)",
  orange: "#F97316",
  blue: "#3B82F6",
  cyan: "#22D3EE",
  green: "#22C55E",
  red: "#EF4444",
  tabInactive: "rgba(255,255,255,0.5)",
  overlay: "rgba(0,0,0,0.55)",
  cardGradientStart: "rgba(28,28,30,0.2)",
  cardGradientEnd: "rgba(0,0,0,0.85)",
} as const;

/** 经典荧光 — 当前整体配色（强调色 #B8FF00） */
export const classicColors: ColorPalette = {
  ...sharedNeutral,
  accent: "#B8FF00",
  accentDark: "#8FCC00",
  accentBright: "#B8FF00",
  accentGlass: "rgba(184,255,0,0.14)",
  accentText: "#000000",
  accentButtonFill: "rgba(184,255,0,0.68)",
  accentButtonFillStrong: "rgba(184,255,0,0.76)",
};

/** 设备蓝 — 与设备端 Plan B 主色 #007AFF 对齐 */
export const deviceBlueColors: ColorPalette = {
  ...sharedNeutral,
  accent: "#007AFF",
  accentDark: "#0056B3",
  accentBright: "#64B5FF",
  accentGlass: "rgba(0,122,255,0.24)",
  accentText: "#FFFFFF",
  accentButtonFill: "rgba(0,122,255,0.72)",
  accentButtonFillStrong: "rgba(0,122,255,0.82)",
};

export const colorSchemes: Record<
  ColorSchemeId,
  {
    id: ColorSchemeId;
    name: string;
    description: string;
    colors: ColorPalette;
  }
> = {
  classic: {
    id: "classic",
    name: "经典荧光",
    description: "保留当前 App 荧光绿强调色，适合高对比活力风格",
    colors: classicColors,
  },
  deviceBlue: {
    id: "deviceBlue",
    name: "设备蓝",
    description: "与设备端主色一致的蓝色系主题，视觉体验更统一",
    colors: deviceBlueColors,
  },
};

export const DEFAULT_COLOR_SCHEME: ColorSchemeId = "deviceBlue";

export function getColorPalette(schemeId: ColorSchemeId): ColorPalette {
  return colorSchemes[schemeId]?.colors ?? deviceBlueColors;
}

/** Prefer useTheme().colors for runtime theming. Static fallback stays on device blue. */
export const colors = deviceBlueColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const typography = {
  hero: { fontSize: 32, fontWeight: "700" as const, letterSpacing: -0.5 },
  title: { fontSize: 26, fontWeight: "700" as const, letterSpacing: -0.3 },
  sectionTitle: { fontSize: 24, fontWeight: "700" as const },
  subtitle: { fontSize: 19, fontWeight: "600" as const },
  body: { fontSize: 19, fontWeight: "400" as const, lineHeight: 26 },
  caption: { fontSize: 17, fontWeight: "400" as const, lineHeight: 22 },
  label: { fontSize: 15, fontWeight: "600" as const, letterSpacing: 0.4 },
  tab: { fontSize: 14, fontWeight: "500" as const },
};

/** Archivo Black Regular — use for Latin numerals / metric figures. */
export const fonts = {
  archivoBlack: "ArchivoBlack_400Regular",
} as const;

export const numericType = {
  fontFamily: fonts.archivoBlack,
  fontWeight: "400" as const,
} as const;

export const glass = {
  blurIntensity: 56,
  tabBlurIntensity: 80,
  buttonBlurIntensity: 44,
} as const;

export const layout = {
  screenPadding: spacing.lg,
  cardWidth: 280,
  sceneCardSize: 140,
  bottomNavHeight: 84,
  /** Tab 悬浮在内容上方，滚动区域需留出导航高度 */
  tabScreenBottomInset: 84,
} as const;

/** 登录注册与「我的」共用的氛围渐变，随主题切换 */
export const atmosphereGradients: Record<ColorSchemeId, readonly [string, string, string]> = {
  classic: ["#003C4B", "#141417", "#000000"],
  deviceBlue: ["#071429", "#050B16", "#000000"],
};

export function getAtmosphereGradient(schemeId: ColorSchemeId) {
  return atmosphereGradients[schemeId] ?? atmosphereGradients.classic;
}
