import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import * as api from "@/services/api";
import { useAuth } from "./AuthContext";

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
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [library, setLibrary] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => loadArray("biblio_recent"));

  // Fetch favorites and library from backend when authenticated
  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && user) {
        try {
          const favs = await api.fetchUserFavorites(user.id);
          setFavorites(favs.map((f: any) => f.bookId));
          
          const libEntries = await api.fetchUserLibrary(user.id);
          setLibrary(libEntries.map((l: any) => l.bookId));
        } catch (error) {
          console.error("Failed to fetch library data:", error);
        }
      } else {
        setFavorites([]);
        setLibrary([]);
      }
    };
    fetchData();
  }, [isAuthenticated, user]);

  useEffect(() => { localStorage.setItem("biblio_recent", JSON.stringify(recentlyViewed)); }, [recentlyViewed]);

  const toggleFavorite = async (id: string) => {
    if (!isAuthenticated) return;
    
    const isFav = favorites.includes(id);
    try {
      if (isFav) {
        await api.removeFavorite(id);
        setFavorites(prev => prev.filter(f => f !== id));
      } else {
        await api.addFavorite(id);
        setFavorites(prev => [...prev, id]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addToLibrary = async (id: string) => {
    if (!isAuthenticated) return;
    if (library.includes(id)) return;

    try {
      await api.addToUserLibrary(id);
      setLibrary(prev => [...prev, id]);
    } catch (error) {
      console.error("Error adding to library:", error);
    }
  };

  const removeFromLibrary = async (id: string) => {
    if (!isAuthenticated) return;
    
    try {
      await api.removeFromUserLibrary(id);
      setLibrary(prev => prev.filter(l => l !== id));
    } catch (error) {
      console.error("Error removing from library:", error);
    }
  };

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
