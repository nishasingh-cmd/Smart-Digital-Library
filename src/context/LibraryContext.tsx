import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Book } from "@/data/books";

interface LibraryContextType {
  favorites: string[];
  library: string[];
  recentlyViewed: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addToLibrary: (id: string) => void;
  removeFromLibrary: (id: string) => void;
  isInLibrary: (id: string) => boolean;
  addToRecentlyViewed: (id: string) => void;
}

const LibraryContext = createContext<LibraryContextType | null>(null);

function loadArray(key: string): string[] {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => loadArray("biblio_favorites"));
  const [library, setLibrary] = useState<string[]>(() => loadArray("biblio_library"));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => loadArray("biblio_recent"));

  useEffect(() => { localStorage.setItem("biblio_favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("biblio_library", JSON.stringify(library)); }, [library]);
  useEffect(() => { localStorage.setItem("biblio_recent", JSON.stringify(recentlyViewed)); }, [recentlyViewed]);

  const toggleFavorite = (id: string) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  const isFavorite = (id: string) => favorites.includes(id);
  const addToLibrary = (id: string) => setLibrary(prev => prev.includes(id) ? prev : [...prev, id]);
  const removeFromLibrary = (id: string) => setLibrary(prev => prev.filter(l => l !== id));
  const isInLibrary = (id: string) => library.includes(id);
  const addToRecentlyViewed = (id: string) => setRecentlyViewed(prev => [id, ...prev.filter(r => r !== id)].slice(0, 20));

  return (
    <LibraryContext.Provider value={{ favorites, library, recentlyViewed, toggleFavorite, isFavorite, addToLibrary, removeFromLibrary, isInLibrary, addToRecentlyViewed }}>
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
};
