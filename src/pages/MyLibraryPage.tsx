import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookCard } from "@/components/BookCard";
import { useLibrary } from "@/context/LibraryContext";
import { useAuth } from "@/context/AuthContext";
import * as api from "@/services/api";
import { Library, Info, Edit3, Save, X } from "lucide-react";
import type { Book } from "@/data/books";
import { toast } from "sonner";

interface LibraryEntry {
  id: number;
  bookId: string;
  notes: string;
  Book: Book;
}

export default function MyLibraryPage() {
  const { library, removeFromLibrary } = useLibrary();
  const { user } = useAuth();
  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const fetchLibrary = async () => {
    if (user) {
      setLoading(true);
      try {
        const data = await api.fetchUserLibrary(user.id);
        // Map backend Book data to coverUrl for frontend compatibility
        const mappedData = data.map((entry: any) => ({
          ...entry,
          Book: {
            ...entry.Book,
            coverUrl: entry.Book.cover_image
          }
        }));
        setEntries(mappedData);
      } catch (error) {
        console.error("Failed to fetch library:", error);
        toast.error("Could not load your library");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateNotes = async (entryId: number) => {
    try {
      await api.updateLibraryEntry(entryId.toString(), editNotes);
      setEntries(prev => prev.map(e => e.id === entryId ? { ...e, notes: editNotes } : e));
      setEditingId(null);
      toast.success("Notes updated");
    } catch (error) {
      toast.error("Failed to update notes");
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [user, library.length]); // Refresh when library size changes

  if (loading) {
    return <div className="flex items-center justify-center py-20">Loading your library...</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Library</h1>
          <p className="text-muted-foreground text-sm">{entries.length} books in your collection</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 glass rounded-2xl">
          <Library className="w-16 h-16 text-primary/20 mx-auto mb-4" />
          <p className="text-muted-foreground">Your library is empty. Add some books to get started!</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {entries.map((entry, i) => (
            <div key={entry.id} className="space-y-2 group">
              <div className="relative">
                <BookCard book={entry.Book} index={i} />
                <button 
                  onClick={() => { setEditingId(entry.id); setEditNotes(entry.notes || ""); }}
                  className="absolute top-2 left-2 p-1.5 rounded-full glass opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20"
                >
                  <Edit3 className="w-3 h-3 text-foreground" />
                </button>
              </div>
              
              {editingId === entry.id ? (
                <div className="space-y-2 p-2 glass rounded-lg border border-primary/20">
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add personal notes..."
                    className="w-full bg-transparent text-[10px] focus:outline-none resize-none"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setEditingId(null)} className="p-1 rounded hover:bg-destructive/10 text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleUpdateNotes(entry.id)} className="p-1 rounded hover:bg-primary/10 text-primary">
                      <Save className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : entry.notes ? (
                <div className="px-2 py-1 bg-primary/5 rounded text-[10px] text-muted-foreground flex items-center gap-1 group-hover:bg-primary/10 transition-colors">
                  <Info className="w-3 h-3 text-primary/40" />
                  <span className="truncate">{entry.notes}</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
