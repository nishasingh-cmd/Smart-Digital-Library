import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus, Sun, Moon, Type, Bookmark } from "lucide-react";
import { fetchBookById } from "@/services/api";
import type { Book } from "@/data/books";
import { toast } from "sonner";

// Simulated book content chapters
const generateChapters = (book: Book) => [
  {
    title: "Chapter 1: The Beginning",
    content: `${book.description}\n\nThe story of "${book.title}" by ${book.author} begins here. This is a masterfully crafted narrative that draws readers into a world of imagination and wonder.\n\nAs we turn the first pages, we discover a rich tapestry of characters and settings that ${book.author} has woven together with remarkable skill. The prose flows naturally, carrying us along through scenes of vivid detail and emotional depth.\n\nEvery paragraph reveals something new about the world the author has created. The attention to detail is extraordinary, with each sentence building upon the last to create a compelling narrative that keeps readers engaged from the very first word.\n\nThe themes explored in this opening chapter set the foundation for the entire novel. Questions of identity, purpose, and human connection are subtly introduced, hinting at the deeper exploration that awaits in subsequent chapters.\n\nAs the first chapter draws to a close, we find ourselves already invested in the journey ahead, eager to discover what lies beyond the next page.`
  },
  {
    title: "Chapter 2: Rising Action",
    content: `The narrative deepens as ${book.author} introduces new layers of complexity to the story. Characters begin to reveal their true motivations, and the plot takes unexpected turns that challenge our initial assumptions.\n\nIn this chapter, we see the protagonist face their first real challenge. The conflict that has been simmering beneath the surface erupts into a pivotal moment that changes everything.\n\nThe writing here is particularly strong, with ${book.author} demonstrating a masterful control of pacing. Moments of quiet reflection are balanced with scenes of intense drama, creating a reading experience that is both thoughtful and thrilling.\n\nNew characters are introduced, each bringing their own perspectives and complications to the narrative. The relationships between characters become more nuanced, adding emotional weight to every interaction.\n\nBy the end of this chapter, the stakes have been raised significantly, and the path forward is anything but certain.`
  },
  {
    title: "Chapter 3: The Journey",
    content: `${book.author} takes us on a journey that spans both physical and emotional landscapes. The protagonist ventures into unfamiliar territory, both literally and figuratively, discovering truths that reshape their understanding of the world.\n\nThe descriptive passages in this chapter are breathtaking. Every setting is rendered with such precision and beauty that readers can practically feel the wind on their faces and hear the sounds of distant places.\n\nCharacter development reaches new heights as internal conflicts mirror external challenges. The protagonist's growth feels organic and earned, a testament to ${book.author}'s skill at creating authentic, relatable characters.\n\nSubplots weave in and out of the main narrative, enriching the story without distracting from its central thrust. Each thread contributes to the larger tapestry, adding depth and complexity.\n\nAs this chapter concludes, we sense that a turning point is approaching—one that will test everything the protagonist has learned.`
  },
  {
    title: "Chapter 4: The Climax",
    content: `Everything builds to this moment. ${book.author} has been carefully constructing the architecture of this story, and now all the pieces fall into place with devastating precision.\n\nThe tension is palpable as characters confront their greatest fears and most cherished hopes. Every decision carries weight, every word spoken echoes with significance.\n\nThe climactic sequence is a tour de force of storytelling. Action and emotion blend seamlessly, creating scenes that are simultaneously heart-pounding and deeply moving.\n\nLong-held secrets are revealed, alliances are tested, and the true nature of the central conflict becomes clear. Nothing is quite what it seemed, and yet everything makes perfect sense in retrospect.\n\nThis is ${book.author} at their finest—bold, compassionate, and unflinching in their commitment to telling a story that matters.`
  },
  {
    title: "Chapter 5: Resolution",
    content: `The final chapter brings the story to a satisfying conclusion while leaving room for reflection. ${book.author} resists the temptation to tie up every loose end neatly, instead offering an ending that feels true to the characters and themes.\n\nThe protagonist emerges from their journey transformed, carrying the lessons learned and the scars earned along the way. Their growth is visible in every decision they make, every word they speak.\n\nRelationships that were tested by the events of the story find new equilibrium. Some bonds have strengthened; others have changed irreversibly. But all feel authentic and earned.\n\nThe final pages are both an ending and a beginning—closing this particular chapter while suggesting that the characters' stories will continue beyond the last page.\n\n"${book.title}" is a remarkable achievement, a novel that entertains, enlightens, and moves in equal measure. ${book.author} has created something truly special here—a book that will stay with readers long after the last word has been read.\n\n— THE END —`
  }
];

export default function ReaderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [chapter, setChapter] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [darkReader, setDarkReader] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [bookmarked, setBookmarked] = useState<number[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchBookById(id).then(b => { setBook(b || null); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!book) return <div className="text-center py-20 text-muted-foreground">Book not found.</div>;

  const chapters = generateChapters(book);
  const currentChapter = chapters[chapter];
  const progress = ((chapter + 1) / chapters.length) * 100;

  return (
    <div className={`min-h-screen ${darkReader ? "bg-[#1a1a2e] text-[#e0e0e0]" : "bg-[#faf8f5] text-[#2a2a2a]"} transition-colors duration-300`}>
      {/* Top bar */}
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: showControls ? 0 : -80 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between backdrop-blur-xl border-b"
        style={{
          backgroundColor: darkReader ? "rgba(26,26,46,0.9)" : "rgba(250,248,245,0.9)",
          borderColor: darkReader ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
        }}
      >
        <button onClick={() => navigate(`/book/${id}`)} className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="text-sm font-medium truncate max-w-[40%]">{book.title}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFontSize(s => Math.max(14, s - 2))} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Minus className="w-4 h-4" />
          </button>
          <Type className="w-4 h-4 opacity-50" />
          <button onClick={() => setFontSize(s => Math.min(28, s + 2))} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={() => setDarkReader(d => !d)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-2">
            {darkReader ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setBookmarked(prev => prev.includes(chapter) ? prev.filter(b => b !== chapter) : [...prev, chapter]);
              toast(bookmarked.includes(chapter) ? "Bookmark removed" : "Chapter bookmarked!");
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked.includes(chapter) ? "fill-primary text-primary" : ""}`} />
          </button>
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="fixed top-[52px] left-0 right-0 z-50 h-1" style={{ backgroundColor: darkReader ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-pink-500 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-32" onClick={() => setShowControls(s => !s)}>
        <motion.div key={chapter} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
          <h2 className="text-2xl font-display font-bold mb-8 text-center" style={{ fontSize: fontSize + 6 }}>
            {currentChapter.title}
          </h2>
          <div className="leading-relaxed whitespace-pre-line" style={{ fontSize, lineHeight: 1.8 }}>
            {currentChapter.content}
          </div>
        </motion.div>
      </div>

      {/* Bottom navigation */}
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: showControls ? 0 : 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4 flex items-center justify-between backdrop-blur-xl border-t"
        style={{
          backgroundColor: darkReader ? "rgba(26,26,46,0.9)" : "rgba(250,248,245,0.9)",
          borderColor: darkReader ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
        }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setChapter(c => Math.max(0, c - 1)); window.scrollTo(0, 0); }}
          disabled={chapter === 0}
          className="flex items-center gap-1 text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-30 hover:bg-white/10"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <span className="text-sm opacity-60">
          {chapter + 1} / {chapters.length}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setChapter(c => Math.min(chapters.length - 1, c + 1)); window.scrollTo(0, 0); }}
          disabled={chapter === chapters.length - 1}
          className="flex items-center gap-1 text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-30 hover:bg-white/10"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
