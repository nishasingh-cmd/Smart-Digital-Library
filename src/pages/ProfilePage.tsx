import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLibrary } from "@/context/LibraryContext";
import { User, BookOpen, Heart, Calendar, Mail, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { favorites, library } = useLibrary();
  const navigate = useNavigate();

  if (!user) return null;

  const stats = [
    { label: "In Library", value: library.length, icon: BookOpen },
    { label: "Favorites", value: favorites.length, icon: Heart },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-3xl font-bold text-primary-foreground mx-auto mb-4">
          {user.avatar}
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">{user.name}</h1>
        <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-1">
          <Mail className="w-4 h-4" /> {user.email}
        </p>
        <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
          <Calendar className="w-3 h-3" /> Joined {new Date(user.joinDate).toLocaleDateString()}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-6 text-center">
            <s.icon className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => { logout(); navigate("/login"); }}
        className="w-full py-3 rounded-lg glass text-destructive font-medium text-sm flex items-center justify-center gap-2 hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </motion.button>
    </div>
  );
}
