import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, BookPlus, ArrowLeft, Headphones, BookOpen, Calendar, Globe } from "lucide-react";
import { fetchBookById, fetchReviews, fetchRecommendations } from "@/services/api";
import { useLibrary } from "@/context/LibraryContext";
import { BookRow } from "@/components/BookRow";
import { SkeletonRow } from "@/components/Skeleton";
import type { Book, Review } from "@/data/books";
import { toast } from "sonner";

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, addToLibrary, isInLibrary, addToRecentlyViewed } = useLibrary();
  const [book, setBook] = useState<Book | null>(null);
  const [bookReviews, setBookReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([fetchBookById(id), fetchReviews(id), fetchRecommendations(id)])
      .then(([b, r, rel]) => {
        setBook(b || null);
        setBookReviews(r);
        setRelated(rel);
        setLoading(false);
        if (b) addToRecentlyViewed(b.id);
      });
  }, [id]);

  if (loading) return <div className="space-y-6 pb-8"><SkeletonRow count={1} /></div>;
  if (!book) return <div className="text-center py-20 text-muted-foreground">Book not found.</div>;

  const fav = isFavorite(book.id);
  const inLib = isInLibrary(book.id);

  return (
    <div className="space-y-8 pb-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Cover */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-shrink-0">
          <div className="w-48 md:w-56 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl glow">
            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/300x450/1a1a2e/8b5cf6?text=${encodeURIComponent(book.title)}`; }} />
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">{book.title}</h1>
            <p className="text-lg text-muted-foreground">by {book.author}</p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
              ))}
              <span className="ml-1 text-sm font-medium text-foreground">{book.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">{bookReviews.length} reviews</span>
          </div>

          <div className="flex gap-3 flex-wrap text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {book.pages} pages</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {book.year}</span>
            <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {book.language}</span>
            {book.hasAudio && <span className="flex items-center gap-1"><Headphones className="w-4 h-4 text-primary" /> {book.audioDuration}</span>}
          </div>

          <p className="text-foreground/80 leading-relaxed">{book.description}</p>

          <div className="flex gap-3 pt-2 flex-wrap">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { toggleFavorite(book.id); toast(fav ? "Removed from favorites" : "Added to favorites"); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${fav ? "bg-primary/20 text-primary" : "glass text-foreground hover:bg-accent"}`}
            >
              <Heart className={`w-4 h-4 ${fav ? "fill-primary" : ""}`} /> {fav ? "Favorited" : "Favorite"}
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { if (!inLib) { addToLibrary(book.id); toast("Added to library"); } }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${inLib ? "bg-primary text-primary-foreground" : "bg-gradient-to-r from-primary to-pink-500 text-primary-foreground"}`}
            >
              <BookPlus className="w-4 h-4" /> {inLib ? "In Library" : "Add to Library"}
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/read/${book.id}`)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition-opacity"
            >
              <BookOpen className="w-4 h-4" /> Read Book
            </motion.button>
            {book.hasAudio && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/audiobooks")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg glass font-medium text-sm text-foreground hover:bg-accent transition-colors"
              >
                <Headphones className="w-4 h-4" /> Listen
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      {bookReviews.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-foreground">Reviews</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {bookReviews.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-xs font-bold text-primary-foreground">{r.avatar}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.user}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5">
                    {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
                <p className="text-sm text-foreground/80">{r.comment}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <BookRow title="You Might Also Like" books={related} />
    </div>
  );
}
