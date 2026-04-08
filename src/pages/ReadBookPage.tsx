import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Settings2, Moon, Sun,
  Minus, Plus, AlignLeft, BookOpen, List, X
} from "lucide-react";
import { fetchBookById } from "@/services/api";
import type { Book } from "@/data/books";

// ─── Sample chapter content generator ───────────────────────────────────────
function generateChapters(book: Book) {
  const intros: Record<string, string[]> = {
    fiction: [
      `The world had not always been this way. ${book.author} opens the novel with a quiet sense of unease — the kind that settles into your bones before you understand why. Our protagonist stands at the threshold of something enormous, unaware of the forces already in motion.`,
      `The first light of morning came like an apology. Thin, uncertain, barely reaching beyond the horizon. Yet it was enough to cast long shadows across the landscape, and in those shadows, the story of ${book.title} truly begins.`,
    ],
    science: [
      `Before we can understand the answers, we must first appreciate the depth of the questions. ${book.author} begins by inviting us to consider the universe not merely as a setting for our lives, but as the very fabric of existence itself.`,
      `Science is not simply a collection of facts. It is a way of seeing — a lens through which the extraordinary reveals itself within the ordinary. In ${book.title}, we embark on a journey that challenges every assumption we hold about the world around us.`,
    ],
    technology: [
      `Code, at its core, is communication. It is a conversation between human intent and machine execution. ${book.author} argues that the quality of that conversation determines not just functionality, but the entire trajectory of a software system.`,
      `Every great piece of software begins with a single line. But between that line and a finished product lies a vast terrain of decisions — technical, philosophical, and deeply human. ${book.title} is your map for navigating that terrain.`,
    ],
    philosophy: [
      `The examined life is not merely worth living — it is the only life truly lived. ${book.author} understood this with a clarity that transcends centuries. These pages offer not answers, but the more valuable gift of better questions.`,
      `What does it mean to live well? What constitutes virtue? What is the nature of the self? These are not idle queries for idle hours. In ${book.title}, we encounter a mind wrestling earnestly with the questions that define our humanity.`,
    ],
    history: [
      `History is not the past. History is the story we tell about the past — and those stories shape everything. ${book.author} brings this truth to life in ${book.title} by examining the threads that connect ancient decisions to modern consequences.`,
      `Every civilization believes itself to be the pinnacle of human achievement. Every civilization has been wrong. ${book.title} chronicles not simply events, but the relentless, humbling, extraordinary arc of human ambition across millennia.`,
    ],
    psychology: [
      `The human mind is the most complex object in the known universe — and yet we carry it with us everywhere, rarely pausing to understand how it works. ${book.author} changes that in ${book.title} by illuminating the invisible machinery of thought.`,
      `We believe ourselves to be rational creatures. The evidence, as ${book.author} meticulously demonstrates in ${book.title}, suggests otherwise — and understanding this gap between belief and reality is perhaps the most important insight psychology has ever offered.`,
    ],
    business: [
      `Every business begins with a belief: that something could be better. ${book.author} explores what separates the businesses that act on that belief successfully from the many that do not. The answer, as ${book.title} reveals, is both simpler and more counterintuitive than you might expect.`,
      `The most dangerous assumption in business is that past success predicts future success. ${book.title} dismantles this assumption methodically, offering a framework for thinking differently about markets, customers, and growth.`,
    ],
    arts: [
      `Design is everywhere — in the objects we use, the spaces we inhabit, and the interfaces we navigate daily. ${book.author} reveals in ${book.title} that what feels intuitive is rarely accidental, and what frustrates us is rarely inevitable.`,
      `The line between art and function is thinner than we imagine. ${book.title} explores how the greatest design transcends that line entirely, creating not just utility but meaning, not just form but feeling.`,
    ],
  };

  const category = book.category.toLowerCase();
  const paragraphs = intros[category] || intros.fiction;

  const lorem = `${book.title} continues to unfold with the kind of depth that rewards patient readers. ${book.author}'s prose is precise where precision is needed and expansive where imagination should roam freely. The themes at the heart of this work — identity, power, knowledge, and the nature of truth — are woven together with remarkable craft.

What sets this chapter apart is the way small details accumulate meaning. A glance held a moment too long. A word chosen over another. A silence that speaks volumes. ${book.author} trusts the reader to feel the weight of these choices, and that trust is itself a form of respect.

The narrative here is not simply moving forward — it is spiraling deeper. Each page peels back another layer, revealing that what seemed certain at the outset is far more complex. This is not a book that gives itself up easily, and that is precisely its greatest strength.

As we approach the end of this chapter, the central tension crystallizes in a way that feels both inevitable and surprising — a mark of masterful storytelling. The reader is left not merely wanting to know what happens next, but genuinely uncertain of what they believe, and why.`;

  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: i === 0
      ? "Prologue"
      : i === 7
        ? "Epilogue"
        : `Chapter ${i}: ${["The Beginning", "Rising Tension", "Revelations", "The Turn", "Into the Dark", "Through the Storm"][i - 1] || "Convergence"}`,
    content: i === 0
      ? `${paragraphs[0]}\n\n${paragraphs[1] || paragraphs[0]}\n\n${lorem}`
      : `${lorem}\n\n${paragraphs[i % paragraphs.length]}\n\n${lorem}`,
  }));
}

// ─── Reading theme config ─────────────────────────────────────────────────────
const themes = {
  dark: {
    bg: "bg-[#0f0f12]",
    text: "text-[#e8e0d5]",
    label: "Dark",
    icon: <Moon className="w-4 h-4" />,
    surface: "bg-[#1a1a24]",
    border: "border-white/10",
    muted: "text-white/40",
  },
  sepia: {
    bg: "bg-[#f2e8d9]",
    text: "text-[#3b2f1e]",
    label: "Sepia",
    icon: <Sun className="w-4 h-4" />,
    surface: "bg-[#e8dcc8]",
    border: "border-black/10",
    muted: "text-black/40",
  },
  light: {
    bg: "bg-white",
    text: "text-gray-900",
    label: "Light",
    icon: <Sun className="w-4 h-4" />,
    surface: "bg-gray-50",
    border: "border-gray-200",
    muted: "text-gray-400",
  },
};

type ThemeKey = keyof typeof themes;

export default function ReadBookPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState<{ id: number; title: string; content: string }[]>([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [theme, setTheme] = useState<ThemeKey>("dark");
  const [showSettings, setShowSettings] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [readProgress, setReadProgress] = useState<number[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const t = themes[theme];

  useEffect(() => {
    if (!id) return;
    fetchBookById(id).then((b) => {
      setBook(b || null);
      if (b) {
        const chs = generateChapters(b);
        setChapters(chs);
        setReadProgress(Array(chs.length).fill(0));
      }
      setLoading(false);
    });
  }, [id]);

  // Track scroll progress per chapter
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = scrollHeight <= clientHeight ? 100 : Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      setScrollProgress(pct);
      setReadProgress((prev) => {
        const next = [...prev];
        next[currentChapter] = Math.max(next[currentChapter] || 0, pct);
        return next;
      });
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [currentChapter, chapters]);

  // Reset scroll when chapter changes
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setScrollProgress(0);
  }, [currentChapter]);

  const overallProgress = chapters.length
    ? Math.round(
        ((currentChapter + scrollProgress / 100) / chapters.length) * 100
      )
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f12]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f12]">
        <div className="text-center space-y-4">
          <p className="text-white/60 text-lg">Book not found.</p>
          <button onClick={() => navigate(-1)} className="text-primary hover:underline text-sm">
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const chapter = chapters[currentChapter];

  return (
    <div className={`min-h-screen flex flex-col ${t.bg} transition-colors duration-300`}>
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 border-b ${t.border} ${t.surface} backdrop-blur-md`}>
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/book/${id}`)}
            className={`p-2 rounded-lg hover:opacity-80 transition-opacity ${t.text}`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="hidden sm:block">
            <p className={`text-xs font-medium truncate max-w-[180px] ${t.text}`}>{book.title}</p>
            <p className={`text-[10px] ${t.muted}`}>{book.author}</p>
          </div>
        </div>

        {/* Center: progress */}
        <div className="flex items-center gap-2">
          <span className={`text-xs ${t.muted}`}>{overallProgress}%</span>
          <div className={`w-32 h-1 rounded-full ${t.surface} border ${t.border}`}>
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setShowToc(true); setShowSettings(false); }}
            className={`p-2 rounded-lg hover:opacity-80 transition-opacity ${t.text}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setShowSettings(true); setShowToc(false); }}
            className={`p-2 rounded-lg hover:opacity-80 transition-opacity ${t.text}`}
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Reading Progress Bar ─────────────────────────────────────── */}
      <div className="fixed top-14 left-0 right-0 z-40 h-0.5">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── Table of Contents Panel ──────────────────────────────────── */}
      <AnimatePresence>
        {showToc && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowToc(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col ${t.surface} border-r ${t.border}`}
            >
              <div className={`h-14 flex items-center justify-between px-5 border-b ${t.border}`}>
                <span className={`font-semibold text-sm ${t.text}`}>Table of Contents</span>
                <button onClick={() => setShowToc(false)} className={`p-1 ${t.text} hover:opacity-70`}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-3">
                {chapters.map((ch, i) => (
                  <button
                    key={ch.id}
                    onClick={() => { setCurrentChapter(i); setShowToc(false); }}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left text-sm transition-colors ${
                      i === currentChapter
                        ? "text-violet-500 bg-violet-500/10"
                        : `${t.text} hover:bg-white/5`
                    }`}
                  >
                    <span className={`text-[10px] w-5 shrink-0 ${t.muted}`}>{i + 1}</span>
                    <span className="truncate">{ch.title}</span>
                    {(readProgress[i] || 0) >= 100 && (
                      <span className="ml-auto text-[9px] text-emerald-500 shrink-0">✓</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Book info at bottom */}
              <div className={`p-4 border-t ${t.border} flex items-center gap-3`}>
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-10 h-14 rounded object-cover shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/80x120/1a1a2e/8b5cf6?text=B`; }}
                />
                <div>
                  <p className={`text-xs font-semibold ${t.text} line-clamp-1`}>{book.title}</p>
                  <p className={`text-[10px] ${t.muted}`}>{book.author}</p>
                  <p className={`text-[10px] text-violet-400 mt-1`}>{overallProgress}% complete</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Settings Panel ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed right-0 top-0 bottom-0 z-50 w-72 flex flex-col ${t.surface} border-l ${t.border}`}
            >
              <div className={`h-14 flex items-center justify-between px-5 border-b ${t.border}`}>
                <span className={`font-semibold text-sm ${t.text}`}>Reading Settings</span>
                <button onClick={() => setShowSettings(false)} className={`p-1 ${t.text} hover:opacity-70`}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-8">
                {/* Font Size */}
                <div>
                  <p className={`text-[10px] uppercase tracking-widest font-semibold mb-3 ${t.muted}`}>Font Size</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                      className={`p-2 rounded-lg border ${t.border} ${t.text} hover:opacity-70 transition-opacity`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className={`text-2xl font-bold ${t.text} flex-1 text-center`}>{fontSize}px</span>
                    <button
                      onClick={() => setFontSize(Math.min(30, fontSize + 2))}
                      className={`p-2 rounded-lg border ${t.border} ${t.text} hover:opacity-70 transition-opacity`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Line Height */}
                <div>
                  <p className={`text-[10px] uppercase tracking-widest font-semibold mb-3 ${t.muted}`}>Line Spacing</p>
                  <div className="flex gap-2">
                    {[1.4, 1.7, 2.0, 2.4].map((lh) => (
                      <button
                        key={lh}
                        onClick={() => setLineHeight(lh)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                          lineHeight === lh
                            ? "border-violet-500 text-violet-500 bg-violet-500/10"
                            : `${t.border} ${t.text} hover:opacity-70`
                        }`}
                      >
                        <AlignLeft className="w-3 h-3 mx-auto mb-1" style={{ transform: `scaleY(${lh / 1.4})` }} />
                        {lh}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme */}
                <div>
                  <p className={`text-[10px] uppercase tracking-widest font-semibold mb-3 ${t.muted}`}>Reading Theme</p>
                  <div className="space-y-2">
                    {(Object.keys(themes) as ThemeKey[]).map((th) => (
                      <button
                        key={th}
                        onClick={() => setTheme(th)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                          theme === th
                            ? "border-violet-500 bg-violet-500/10"
                            : `${t.border} hover:opacity-80`
                        } ${themes[th].bg} ${themes[th].text}`}
                      >
                        {themes[th].icon}
                        <span className="text-sm font-medium">{themes[th].label}</span>
                        {theme === th && <span className="ml-auto text-violet-500 text-xs">✓ Active</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Reading Area ────────────────────────────────────────── */}
      <div ref={contentRef} className="flex-1 pt-16 overflow-y-auto scroll-smooth">
        <div className="max-w-[680px] mx-auto px-6 py-12">
          {/* Chapter header */}
          <motion.div
            key={currentChapter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <p className={`text-xs uppercase tracking-widest font-semibold mb-2 text-violet-500`}>
              {book.title}
            </p>
            <h1 className={`text-3xl font-bold leading-snug ${t.text}`}>{chapter?.title}</h1>
            <div className={`mt-4 w-12 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full`} />
          </motion.div>

          {/* Chapter body */}
          <motion.div
            key={`content-${currentChapter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {chapter?.content.split("\n\n").map((para, i) => (
              <p
                key={i}
                className={`mb-6 ${t.text} text-justify`}
                style={{ fontSize: `${fontSize}px`, lineHeight }}
              >
                {i === 0 && (
                  <span className="float-left text-6xl font-bold leading-none mr-2 mt-1 text-violet-500">
                    {para[0]}
                  </span>
                )}
                {i === 0 ? para.slice(1) : para}
              </p>
            ))}
          </motion.div>

          {/* Chapter navigation */}
          <div className={`mt-16 pt-8 border-t ${t.border} flex items-center justify-between`}>
            <button
              onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
              disabled={currentChapter === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed
                ${theme === "dark" ? "bg-white/8 hover:bg-white/12 text-white" : "bg-black/8 hover:bg-black/12 text-black"}`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <span className={`text-xs ${t.muted}`}>
              {currentChapter + 1} / {chapters.length}
            </span>

            <button
              onClick={() => setCurrentChapter(Math.min(chapters.length - 1, currentChapter + 1))}
              disabled={currentChapter === chapters.length - 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Finished reading */}
          {currentChapter === chapters.length - 1 && scrollProgress >= 90 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <p className={`text-xl font-bold ${t.text}`}>You've finished reading!</p>
              <p className={`text-sm ${t.muted}`}>"{book.title}" by {book.author}</p>
              <button
                onClick={() => navigate(`/book/${id}`)}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Back to Book Details
              </button>
            </motion.div>
          )}

          <div className="h-16" />
        </div>
      </div>
    </div>
  );
}
