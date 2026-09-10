import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ColorPalette,
  ColorSchemeId,
  colorSchemes,
  DEFAULT_COLOR_SCHEME,
  getColorPalette,
} from "@/theme";

const STORAGE_KEY = "motionstation.colorScheme";

type ThemeContextValue = {
  schemeId: ColorSchemeId;
  colors: ColorPalette;
  isReady: boolean;
  setColorScheme: (id: ColorSchemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [schemeId, setSchemeId] = useState<ColorSchemeId>(DEFAULT_COLOR_SCHEME);
  // 不阻塞首屏：reload 时 AsyncStorage 若变慢，避免一直 return null
  const [isReady] = useState(true);

  useEffect(() => {
    // 产品仅保留设备蓝主题，启动时强制收敛并写回存储。
    setSchemeId(DEFAULT_COLOR_SCHEME);
    AsyncStorage.setItem(STORAGE_KEY, DEFAULT_COLOR_SCHEME).catch(() => undefined);
  }, []);

  const setColorScheme = useCallback((_id: ColorSchemeId) => {
    // 对外仍保留 API，但始终落回设备蓝。
    setSchemeId(DEFAULT_COLOR_SCHEME);
    AsyncStorage.setItem(STORAGE_KEY, DEFAULT_COLOR_SCHEME).catch(() => undefined);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      schemeId,
      colors: getColorPalette(schemeId),
      isReady,
      setColorScheme,
    }),
    [schemeId, isReady, setColorScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
