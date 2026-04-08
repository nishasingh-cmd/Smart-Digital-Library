import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { fetchAudiobooks } from "@/services/api";
import type { Book } from "@/data/books";

export default function AudiobooksPage() {
  const [audiobooks, setAudiobooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<Book | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => { fetchAudiobooks().then(a => { setAudiobooks(a); if (a.length) setCurrent(a[0]); setLoading(false); }); }, []);

  useEffect(() => {
    let interval: number;
    if (playing) interval = window.setInterval(() => setProgress(p => p >= 100 ? 0 : p + 0.5), 200);
    return () => clearInterval(interval);
  }, [playing]);

  const playBook = (book: Book) => { setCurrent(book); setPlaying(true); setProgress(0); };

  return (
    <div className="space-y-8 pb-32">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Audiobooks</h1>
        <p className="text-muted-foreground text-sm">Listen anywhere, anytime</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {audiobooks.map((book, i) => (
          <motion.button
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6 }}
            onClick={() => playBook(book)}
            className={`text-left group ${current?.id === book.id ? "ring-2 ring-primary rounded-lg" : ""}`}
          >
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/300x300/1a1a2e/8b5cf6?text=${encodeURIComponent(book.title)}`; }} />
              <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                </div>
              </div>
            </div>
            <div className="mt-2 px-1">
              <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
              <p className="text-xs text-muted-foreground">{book.audioDuration}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Player bar */}
      {current && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/30 p-4"
        >
          <div className="max-w-4xl mx-auto">
            {/* Progress */}
            <div className="w-full h-1 bg-secondary rounded-full mb-3 cursor-pointer" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress(((e.clientX - rect.left) / rect.width) * 100);
            }}>
              <motion.div className="h-full bg-gradient-to-r from-primary to-pink-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex items-center gap-4">
              <img src={current.coverUrl} alt={current.title} className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/48x48/1a1a2e/8b5cf6?text=B`; }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{current.title}</p>
                <p className="text-xs text-muted-foreground truncate">{current.author}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => {
                  const idx = audiobooks.findIndex(a => a.id === current.id);
                  if (idx > 0) playBook(audiobooks[idx - 1]);
                }} className="text-muted-foreground hover:text-foreground transition-colors">
                  <SkipBack className="w-5 h-5" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPlaying(!playing)}
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
                >
                  {playing ? <Pause className="w-5 h-5 text-primary-foreground" /> : <Play className="w-5 h-5 text-primary-foreground ml-0.5" />}
                </motion.button>
                <button onClick={() => {
                  const idx = audiobooks.findIndex(a => a.id === current.id);
                  if (idx < audiobooks.length - 1) playBook(audiobooks[idx + 1]);
                }} className="text-muted-foreground hover:text-foreground transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
              <Volume2 className="w-4 h-4 text-muted-foreground hidden sm:block" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
