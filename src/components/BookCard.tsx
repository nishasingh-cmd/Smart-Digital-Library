import { Heart, BookPlus, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "@/context/LibraryContext";
import type { Book } from "@/data/books";
import { toast } from "sonner";

interface BookCardProps {
  book: Book;
  index?: number;
}

export function BookCard({ book, index = 0 }: BookCardProps) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, addToLibrary, isInLibrary } = useLibrary();
  const fav = isFavorite(book.id);
  const inLib = isInLibrary(book.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative cursor-pointer"
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
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(book.id); toast(fav ? "Removed from favorites" : "Added to favorites"); }}
            className="p-2 rounded-full glass hover:bg-primary/20 transition-colors"
          >
            <Heart className={`w-4 h-4 ${fav ? "fill-primary text-primary" : "text-foreground"}`} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); if (!inLib) { addToLibrary(book.id); toast("Added to library"); } }}
            className="p-2 rounded-full glass hover:bg-primary/20 transition-colors"
          >
            <BookPlus className={`w-4 h-4 ${inLib ? "text-primary" : "text-foreground"}`} />
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
  );
}
