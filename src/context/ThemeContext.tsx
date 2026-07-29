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

function isColorSchemeId(value: string | null): value is ColorSchemeId {
  return value === "classic" || value === "deviceBlue";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [schemeId, setSchemeId] = useState<ColorSchemeId>(DEFAULT_COLOR_SCHEME);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (cancelled) return;
        if (isColorSchemeId(stored)) {
          setSchemeId(stored);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setIsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setColorScheme = useCallback((id: ColorSchemeId) => {
    if (!colorSchemes[id]) return;
    setSchemeId(id);
    AsyncStorage.setItem(STORAGE_KEY, id).catch(() => undefined);
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
