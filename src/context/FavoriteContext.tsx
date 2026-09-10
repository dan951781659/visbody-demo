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
import { getItemById } from "@/data/exploreLibrary";
import type { LibraryItem, LibraryTab } from "@/types/content";

const STORAGE_KEY = "motionstation.favorites";

export type FavoriteEntry = {
  type: LibraryTab;
  id: string;
  favoritedAt: number;
};

const DEMO_SEED_FAVORITES: FavoriteEntry[] = [
  { type: "moves", id: "move-kettlebell-squat", favoritedAt: Date.now() - 4000 },
  { type: "moves", id: "move-shoulder-press", favoritedAt: Date.now() - 3000 },
  { type: "moves", id: "move-battle-rope-burn", favoritedAt: Date.now() - 2000 },
  { type: "aiMoves", id: "ai-cardio-pulse-trainer", favoritedAt: Date.now() - 1000 },
  { type: "aiMoves", id: "ai-smart-squat-coach", favoritedAt: Date.now() },
];

type FavoriteContextValue = {
  favorites: FavoriteEntry[];
  isReady: boolean;
  isFavorite: (type: LibraryTab, id: string) => boolean;
  toggleFavorite: (type: LibraryTab, id: string) => boolean;
  getFavoritesForTab: (tab: LibraryTab) => LibraryItem[];
};

const FavoriteContext = createContext<FavoriteContextValue | null>(null);

function favoriteKey(type: LibraryTab, id: string): string {
  return `${type}:${id}`;
}

function isLibraryTab(value: unknown): value is LibraryTab {
  return value === "moves" || value === "aiMoves" || value === "plans";
}

function parseFavorites(raw: string | null): FavoriteEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is FavoriteEntry => {
      if (!item || typeof item !== "object") return false;
      const entry = item as Partial<FavoriteEntry>;
      return (
        isLibraryTab(entry.type) &&
        typeof entry.id === "string" &&
        entry.id.length > 0 &&
        typeof entry.favoritedAt === "number"
      );
    });
  } catch {
    return [];
  }
}

function persistFavorites(favorites: FavoriteEntry[]) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch(() => undefined);
}

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        const parsed = parseFavorites(raw);
        if (parsed.length > 0) {
          setFavorites(parsed);
          return;
        }
        setFavorites(DEMO_SEED_FAVORITES);
        persistFavorites(DEMO_SEED_FAVORITES);
      })
      .catch(() => {
        if (!cancelled) {
          setFavorites(DEMO_SEED_FAVORITES);
          persistFavorites(DEMO_SEED_FAVORITES);
        }
      })
      .finally(() => {
        if (!cancelled) setIsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isFavorite = useCallback(
    (type: LibraryTab, id: string) =>
      favorites.some((entry) => entry.type === type && entry.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (type: LibraryTab, id: string) => {
      const key = favoriteKey(type, id);
      const exists = favorites.some((entry) => favoriteKey(entry.type, entry.id) === key);
      const nextFavorited = !exists;
      setFavorites((prev) => {
        const currentlyExists = prev.some((entry) => favoriteKey(entry.type, entry.id) === key);
        const next = currentlyExists
          ? prev.filter((entry) => favoriteKey(entry.type, entry.id) !== key)
          : [{ type, id, favoritedAt: Date.now() }, ...prev];
        persistFavorites(next);
        return next;
      });
      return nextFavorited;
    },
    [favorites],
  );

  const getFavoritesForTab = useCallback(
    (tab: LibraryTab) => {
      const items: LibraryItem[] = [];
      favorites
        .filter((entry) => entry.type === tab)
        .sort((a, b) => b.favoritedAt - a.favoritedAt)
        .forEach((entry) => {
          const item = getItemById(entry.type, entry.id);
          if (item) items.push(item);
        });
      return items;
    },
    [favorites],
  );

  const value = useMemo<FavoriteContextValue>(
    () => ({
      favorites,
      isReady,
      isFavorite,
      toggleFavorite,
      getFavoritesForTab,
    }),
    [favorites, isReady, isFavorite, toggleFavorite, getFavoritesForTab],
  );

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoriteProvider");
  }
  return context;
}
