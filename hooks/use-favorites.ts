import { useState, useEffect } from "react";

const FAVORITES_KEY = "toolbox-favorites";
const RECENT_KEY = "toolbox-recent";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    const savedRecent = localStorage.getItem(RECENT_KEY);

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    if (savedRecent) {
      setRecent(JSON.parse(savedRecent));
    }
  }, []);

  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId];

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const addToRecent = (toolId: string) => {
    setRecent((prev) => {
      // Remove if exists, then add to front
      const filtered = prev.filter((id) => id !== toolId);
      const newRecent = [toolId, ...filtered].slice(0, 10); // Keep last 10

      localStorage.setItem(RECENT_KEY, JSON.stringify(newRecent));
      return newRecent;
    });
  };

  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem(RECENT_KEY);
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  return {
    favorites,
    recent,
    toggleFavorite,
    addToRecent,
    clearRecent,
    isFavorite,
  };
}
