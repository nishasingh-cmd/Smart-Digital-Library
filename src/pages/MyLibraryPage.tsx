import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookCard } from "@/components/BookCard";
import { useLibrary } from "@/context/LibraryContext";
import { fetchBooks } from "@/services/api";
import { Library } from "lucide-react";
import type { Book } from "@/data/books";

export default function MyLibraryPage() {
  const { library } = useLibrary();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks().then(all => {
      setBooks(all.filter(b => library.includes(b.id)));
      setLoading(false);
    });
  }, [library]);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Library</h1>
        <p className="text-muted-foreground text-sm">{books.length} books</p>
      </div>

      {books.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <Library className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Your library is empty. Start adding books!</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {books.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
        </div>
      )}
    </div>
  );
}
