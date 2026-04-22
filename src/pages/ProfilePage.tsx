import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLibrary } from "@/context/LibraryContext";
import { User, BookOpen, Heart, Calendar, Mail, LogOut, Edit2, Trash2, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, logout, updateAccount, deleteAccount } = useAuth();
  const { favorites, library } = useLibrary();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user.name) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    const success = await updateAccount(newName);
    setIsLoading(false);

    if (success) {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } else {
      toast.error("Failed to update profile.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsLoading(true);
      const success = await deleteAccount();
      setIsLoading(false);

      if (success) {
        toast.success("Account deleted.");
        navigate("/login");
      } else {
        toast.error("Failed to delete account.");
      }
    }
  };

  const stats = [
    { label: "In Library", value: library.length, icon: BookOpen },
    { label: "Favorites", value: favorites.length, icon: Heart },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 relative flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-3xl font-bold text-primary-foreground mb-4 shadow-lg">
          {user.avatar}
        </div>
        
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div 
              key="editing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-2 mb-2"
            >
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-background/50 border border-primary/20 rounded px-3 py-1 text-center text-xl font-display font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              />
              <button onClick={handleUpdateName} disabled={isLoading} className="p-1.5 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => { setIsEditing(false); setNewName(user.name); }} className="p-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="viewing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-3 mb-2"
            >
              <h1 className="text-2xl font-display font-bold text-foreground">{user.name}</h1>
              <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted transition-colors">
                <Edit2 className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
          <Mail className="w-4 h-4" /> {user.email}
        </p>
        <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
          <Calendar className="w-3 h-3" /> Joined {new Date(user.joinDate || Date.now()).toLocaleDateString()}
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

      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full py-3 rounded-lg glass text-foreground font-medium text-sm flex items-center justify-center gap-2 hover:bg-muted/30 transition-colors"
        >
          <LogOut className="w-4 h-4 text-muted-foreground" /> Sign Out
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleDeleteAccount}
          disabled={isLoading}
          className="w-full py-3 rounded-lg glass text-destructive font-medium text-sm flex items-center justify-center gap-2 hover:bg-destructive/10 transition-colors border border-destructive/20"
        >
          <Trash2 className="w-4 h-4" /> Delete Account
        </motion.button>
      </div>
    </div>
  );
}
