import { useEffect, useMemo, useState } from "react";
import {
  TAB_CONFIG,
  getFilterValue,
  getItemsForTab,
} from "@/data/exploreLibrary";
import type { LibraryItem, LibraryTab } from "@/types/content";

export type FilterMap = Record<string, Set<string>>;

function createEmptyFilterMap(tab: LibraryTab): FilterMap {
  const map: FilterMap = {};
  TAB_CONFIG[tab].filters.forEach(({ key }) => {
    map[key] = new Set();
  });
  return map;
}

function cloneFilterMaps(
  source: Record<LibraryTab, FilterMap>,
): Record<LibraryTab, FilterMap> {
  return {
    moves: Object.fromEntries(
      Object.entries(source.moves).map(([key, set]) => [key, new Set(set)]),
    ),
    aiMoves: Object.fromEntries(
      Object.entries(source.aiMoves).map(([key, set]) => [key, new Set(set)]),
    ),
    plans: Object.fromEntries(
      Object.entries(source.plans).map(([key, set]) => [key, new Set(set)]),
    ),
  };
}

export function useExploreFilters(initialTab: LibraryTab = "moves") {
  const [activeTab, setActiveTab] = useState<LibraryTab>(initialTab);
  const [keyword, setKeyword] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterMaps, setFilterMaps] = useState<Record<LibraryTab, FilterMap>>({
    moves: createEmptyFilterMap("moves"),
    aiMoves: createEmptyFilterMap("aiMoves"),
    plans: createEmptyFilterMap("plans"),
  });

  const activeFilters = filterMaps[activeTab];

  const filteredItems = useMemo(() => {
    const items = getItemsForTab(activeTab);
    const normalizedKeyword = keyword.trim().toLowerCase();

    return items.filter((item) => {
      const filterMatched = TAB_CONFIG[activeTab].filters.every(({ key }) => {
        const selected = activeFilters[key];
        if (!selected || selected.size === 0) return true;
        const value = getFilterValue(item, key);
        return value ? selected.has(value) : false;
      });

      if (!filterMatched) return false;
      if (!normalizedKeyword) return true;
      return item.name.toLowerCase().includes(normalizedKeyword);
    });
  }, [activeTab, activeFilters, keyword]);

  const toggleFilter = (key: string, value: string) => {
    setFilterMaps((prev) => {
      const next = cloneFilterMaps(prev);
      const set = next[activeTab][key] ?? new Set<string>();
      if (set.has(value)) set.delete(value);
      else set.add(value);
      next[activeTab][key] = set;
      return next;
    });
  };

  const clearFilterGroup = (key: string) => {
    setFilterMaps((prev) => {
      const next = cloneFilterMaps(prev);
      next[activeTab][key] = new Set();
      return next;
    });
  };

  const changeTab = (tab: LibraryTab) => {
    setActiveTab(tab);
    setFiltersOpen(false);
  };

  return {
    activeTab,
    keyword,
    filtersOpen,
    activeFilters,
    filteredItems,
    setKeyword,
    setFiltersOpen,
    changeTab,
    toggleFilter,
    clearFilterGroup,
  };
}

export type ExploreFiltersState = ReturnType<typeof useExploreFilters>;

export function isMoveLike(item: LibraryItem): item is LibraryItem & { equipment?: string } {
  return item.kind === "move" || item.kind === "aiMove";
}
