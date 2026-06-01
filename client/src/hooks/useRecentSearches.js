import { useState } from "react";

const key = "shopx_recent_searches_v1";

export const useRecentSearches = () => {
  const [searches, setSearches] = useState(() => JSON.parse(localStorage.getItem(key) || "[]"));

  const addSearch = (query) => {
    const normalized = query.trim();
    if (!normalized) return;
    const next = [normalized, ...searches.filter((item) => item !== normalized)].slice(0, 6);
    setSearches(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  const clearSearches = () => {
    setSearches([]);
    localStorage.removeItem(key);
  };

  return { searches, addSearch, clearSearches };
};
