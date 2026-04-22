import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Clock, BookOpen, Plus } from "lucide-react";
import { BookRow } from "@/components/BookRow";
import { BookCard } from "@/components/BookCard";
import { fetchBooks, fetchTrending, fetchRecommendations } from "@/services/api";
import { useLibrary } from "@/context/LibraryContext";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "react-router-dom";
import type { Book } from "@/data/books";
import { BookForm } from "@/components/BookForm";

export default function DiscoverPage() {
  const [trending, setTrending] = useState<Book[]>([]);
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { recentlyViewed } = useLibrary();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([fetchTrending(), fetchRecommendations(), fetchBooks(query || undefined)])
      .then(([t, r, a]) => {
        setTrending(t);
        setRecommended(r);
        setAllBooks(a);
        setLoading(false);
      });
  }, [query]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (recentlyViewed.length > 0) {
      fetchBooks().then(all => {
        setRecentBooks(all.filter(b => recentlyViewed.includes(b.id)).slice(0, 8));
      });
    }
  }, [recentlyViewed]);

  return (
    <div className="space-y-8 pb-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden p-8 md:p-12"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
        <div className="relative z-10 max-w-lg">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            {user ? `Welcome back, ${user.name}` : "Discover Your Next Read"}
          </h1>
          <p className="text-muted-foreground mb-6">
            Explore thousands of books, audiobooks, and AI-curated recommendations tailored for you.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-foreground">
                <BookOpen className="w-4 h-4" /> 12k+ Books
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-foreground">
                <Sparkles className="w-4 h-4 text-primary" /> AI Powered
              </span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsBookFormOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-bold shadow-lg shadow-primary/20 transition-all ml-auto md:ml-0"
            >
              <Plus className="w-5 h-5" />
              Add New
            </motion.button>
          </div>
        </div>
      </motion.div>

      <BookForm 
        isOpen={isBookFormOpen} 
        onClose={() => setIsBookFormOpen(false)} 
        onSuccess={loadData}
      />

      {query && (
        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">
            Results for "{query}"
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allBooks.map((b, i) => <BookCard key={b.id} book={b} index={i} onRefresh={loadData} />)}
          </div>
          {allBooks.length === 0 && !loading && (
            <p className="text-muted-foreground text-center py-12">No books found.</p>
          )}
        </div>
      )}

      {!query && (
        <>
          <BookRow title="🔥 Trending Now" subtitle="Most popular this week" books={trending} loading={loading} />

          <BookRow
            title="✨ Recommended for You"
            subtitle="AI-curated based on your taste"
            books={recommended}
            loading={loading}
          />

          {recentBooks.length > 0 && (
            <BookRow title="🕐 Recently Viewed" books={recentBooks} />
          )}

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-4">📚 All Books</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allBooks.map((b, i) => <BookCard key={b.id} book={b} index={i} onRefresh={loadData} />)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
