import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchBooks } from "@/services/api";
import type { Book } from "@/data/books";
import { SkeletonRow } from "@/components/Skeleton";

export default function ReadBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="space-y-6 pb-8"><SkeletonRow count={2} /></div>;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Read Books</h1>
        <p className="text-muted-foreground text-sm">Explore our library and start reading today</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {books.map((book, i) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group cursor-pointer"
            onClick={() => navigate(`/book/${book.id}`)}
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-primary/20 group-hover:-translate-y-2">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/300x450/1a1a2e/8b5cf6?text=${encodeURIComponent(book.title)}`; }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/read/${book.id}`);
                  }}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Now
                </button>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{book.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
