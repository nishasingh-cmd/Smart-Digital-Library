import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookCard } from "@/components/BookCard";
import { useLibrary } from "@/context/LibraryContext";
import { fetchBooks } from "@/services/api";
import { Heart } from "lucide-react";
import type { Book } from "@/data/books";

export default function FavoritesPage() {
  const { favorites } = useLibrary();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks().then(all => setBooks(all.filter(b => favorites.includes(b.id))));
  }, [favorites]);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Favorites</h1>
        <p className="text-muted-foreground text-sm">{books.length} books</p>
      </div>

      {books.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No favorites yet. Tap the heart on any book!</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {books.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
        </div>
      )}
    </div>
  );
}
