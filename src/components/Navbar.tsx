import { useState, useCallback, useEffect } from "react";
import { Search, Moon, Sun, Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/discover?q=${encodeURIComponent(query.trim())}`);
  }, [query, navigate]);

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center gap-4 px-4 md:px-6 glass-strong border-b border-border/30">
      <button onClick={onToggleSidebar} className="p-2 rounded-lg hover:bg-accent transition-colors lg:hidden">
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      <div className="flex-1 flex items-center">
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search books, authors, categories..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${focused ? "ring-2 ring-primary/50" : ""}`}
          />
        </form>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors">
          {theme === "dark" ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
        </button>
        <button className="p-2 rounded-lg hover:bg-accent transition-colors relative">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>
        {user && (
          <button onClick={() => navigate("/profile")} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-sm font-semibold text-primary-foreground">
            {user.avatar}
          </button>
        )}
      </div>
    </header>
  );
}
