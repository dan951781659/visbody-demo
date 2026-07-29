import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

export type AppLanguage = "zh" | "en";
export type AppRegion = "CN" | "US";

type LanguageOption = {
  id: AppLanguage;
  label: string;
  shortLabel: string;
};

type RegionOption = {
  id: AppRegion;
  label: string;
  shortLabel: string;
};

type LocaleContextValue = {
  language: AppLanguage;
  region: AppRegion;
  languageOptions: LanguageOption[];
  regionOptions: RegionOption[];
  languageLabel: string;
  regionLabel: string;
  setLanguage: (language: AppLanguage) => void;
  setRegion: (region: AppRegion) => void;
};

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: "zh", label: "中文", shortLabel: "中文" },
  { id: "en", label: "English", shortLabel: "EN" },
];

const REGION_OPTIONS: RegionOption[] = [
  { id: "CN", label: "中国（CN）", shortLabel: "CN" },
  { id: "US", label: "美国（US）", shortLabel: "US" },
];

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("zh");
  const [region, setRegionState] = useState<AppRegion>("US");

  const setLanguage = useCallback((next: AppLanguage) => {
    setLanguageState(next);
  }, []);

  const setRegion = useCallback((next: AppRegion) => {
    setRegionState(next);
  }, []);

  const value = useMemo(() => {
    const currentLanguage =
      LANGUAGE_OPTIONS.find((item) => item.id === language) ?? LANGUAGE_OPTIONS[0];
    const currentRegion = REGION_OPTIONS.find((item) => item.id === region) ?? REGION_OPTIONS[0];
    return {
      language,
      region,
      languageOptions: LANGUAGE_OPTIONS,
      regionOptions: REGION_OPTIONS,
      languageLabel: currentLanguage.shortLabel,
      regionLabel: currentRegion.shortLabel,
      setLanguage,
      setRegion,
    };
  }, [language, region, setLanguage, setRegion]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
