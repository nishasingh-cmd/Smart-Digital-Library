import { Heart, BookPlus, Star, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "@/context/LibraryContext";
import type { Book } from "@/data/books";
import { toast } from "sonner";
import * as api from "@/services/api";
import { BookForm } from "./BookForm";

interface BookCardProps {
  book: Book;
  index?: number;
  onRefresh?: () => void;
}

export function BookCard({ book, index = 0, onRefresh }: BookCardProps) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, addToLibrary, isInLibrary, removeFromLibrary } = useLibrary();
  const fav = isFavorite(book.id);
  const inLib = isInLibrary(book.id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      setIsDeleting(true);
      try {
        await api.deleteBook(book.id);
        toast.success("Book deleted");
        if (onRefresh) onRefresh();
      } catch (error) {
        toast.error("Failed to delete book");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className={`group relative cursor-pointer ${isDeleting ? "opacity-50 grayscale" : ""}`}
        onClick={() => navigate(`/book/${book.id}`)}
      >
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
          <img
            src={book.coverUrl}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/300x450/1a1a2e/8b5cf6?text=${encodeURIComponent(book.title)}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Hover actions */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(book.id); toast(fav ? "Removed from favorites" : "Added to favorites"); }}
              className="p-2 rounded-full glass hover:bg-primary/20 transition-colors"
              title="Toggle Favorite"
            >
              <Heart className={`w-3.5 h-3.5 ${fav ? "fill-primary text-primary" : "text-foreground"}`} />
            </button>
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                if (inLib) {
                  removeFromLibrary(book.id);
                  toast.info("Removed from library");
                } else {
                  addToLibrary(book.id);
                  toast.success("Added to library");
                }
              }}
              className="p-2 rounded-full glass hover:bg-primary/20 transition-colors"
              title={inLib ? "Remove from Library" : "Add to Library"}
            >
              <BookPlus className={`w-3.5 h-3.5 ${inLib ? "text-primary fill-primary/20" : "text-foreground"}`} />
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="p-2 rounded-full glass hover:bg-amber-500/20 transition-colors"
              title="Edit Book"
            >
              <Edit2 className="w-3.5 h-3.5 text-foreground" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 rounded-full glass hover:bg-destructive/20 transition-colors"
              title="Delete Book"
            >
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </button>
          </div>

          {book.hasAudio && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full glass text-[10px] font-medium text-foreground">
              🎧 Audio
            </div>
          )}
        </div>

        <div className="mt-2 px-1">
          <h3 className="font-medium text-sm text-foreground truncate">{book.title}</h3>
          <p className="text-xs text-muted-foreground truncate">{book.author}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-muted-foreground">{book.rating}</span>
          </div>
        </div>
      </motion.div>

      <BookForm
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSuccess={() => onRefresh && onRefresh()}
        bookToEdit={book}
      />
    </>
  );
}
