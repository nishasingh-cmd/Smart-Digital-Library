import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Home, Compass, Grid3X3, Headphones, Library, Heart, User, LogOut, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/", icon: Home, label: "Discover" },
  { to: "/categories", icon: Grid3X3, label: "Categories" },
  { to: "/read-books", icon: BookOpen, label: "Read Books" },
  { to: "/audiobooks", icon: Headphones, label: "Audiobooks" },
  { to: "/library", icon: Library, label: "My Library" },
  { to: "/favorites", icon: Heart, label: "Favorites" },
  { to: "/profile", icon: User, label: "Profile" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-64 glass-strong border-r border-border/30 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="font-display font-bold text-lg text-foreground">Biblio</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 mb-2">Menu</p>
          {links.map(link => {
            const active = location.pathname === link.to;
            return (
              <RouterNavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
                {active && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </RouterNavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        {isAuthenticated && (
          <div className="p-3 border-t border-border/30">
            <button
              onClick={() => { logout(); onClose(); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
}
