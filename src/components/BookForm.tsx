import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Book as BookIcon, User as UserIcon, Type, Layers, Image as ImageIcon, Star, Hash, Calendar, Globe, Music } from "lucide-react";
import type { Book } from "@/data/books";
import { toast } from "sonner";
import * as api from "@/services/api";

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bookToEdit?: Book;
}

export function BookForm({ isOpen, onClose, onSuccess, bookToEdit }: BookFormProps) {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: "",
    author: "",
    category: "fiction",
    description: "",
    cover_image: "",
    isbn: "",
    rating: 4.5,
    pages: 300,
    year: new Date().getFullYear(),
    language: "English",
    hasAudio: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookToEdit) {
      setFormData(bookToEdit);
    } else {
      setFormData({
        title: "",
        author: "",
        category: "fiction",
        description: "",
        cover_image: "",
        isbn: "",
        rating: 4.5,
        pages: 300,
        year: new Date().getFullYear(),
        language: "English",
        hasAudio: false
      });
    }
  }, [bookToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author) {
      toast.error("Required fields missing");
      return;
    }

    setLoading(true);
    try {
      if (bookToEdit) {
        await api.updateBook(bookToEdit.id, formData);
        toast.success("Book updated!");
      } else {
        await api.createBook(formData);
        toast.success("New book added!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save book");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value
    }));
  };

  const sectionClass = "space-y-4 p-4 rounded-xl bg-background/30 border border-border/50";
  const labelClass = "text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-1.5";
  const inputClass = "w-full bg-background/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-primary/40 focus:border-primary/50 outline-none hover:bg-background/80";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/40 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ x: "-50%", y: "-45%", opacity: 0, scale: 0.9 }}
            animate={{ x: "-50%", y: "-50%", opacity: 1, scale: 1 }}
            exit={{ x: "-50%", y: "-45%", opacity: 0, scale: 0.9 }}
            className="fixed left-[50%] top-[50%] w-full max-w-4xl bg-card/95 backdrop-blur-2xl rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] z-[101] overflow-hidden border border-white/10"
          >
            <div className="flex items-center justify-between p-8 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/20 text-primary">
                  <BookIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    {bookToEdit ? "Refine Catalog" : "Add to Library"}
                  </h2>
                  <p className="text-sm text-muted-foreground">Manage your digital assets and metadata.</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2.5 rounded-xl hover:bg-white/5 text-muted-foreground transition-all hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row h-[75vh]">
              {/* Form Side */}
              <form onSubmit={handleSubmit} className="flex-1 p-8 space-y-8 overflow-y-auto scrollbar-hide">
                {/* Section: Identity */}
                <div className={sectionClass}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}><Type className="w-3 h-3" /> Book Title</label>
                      <input name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="e.g. The Pragmatic Programmer" required />
                    </div>
                    <div>
                      <label className={labelClass}><UserIcon className="w-3 h-3" /> Primary Author</label>
                      <input name="author" value={formData.author} onChange={handleChange} className={inputClass} placeholder="e.g. Andrew Hunt" required />
                    </div>
                  </div>
                </div>

                {/* Section: Metadata */}
                <div className={sectionClass}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}><Layers className="w-3 h-3" /> Genre</label>
                      <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                        <option value="fiction">Fiction</option>
                        <option value="science">Science</option>
                        <option value="technology">Technology</option>
                        <option value="philosophy">Philosophy</option>
                        <option value="history">History</option>
                        <option value="business">Business</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}><Hash className="w-3 h-3" /> ISBN Code</label>
                      <input name="isbn" value={formData.isbn} onChange={handleChange} className={inputClass} placeholder="978-0..." />
                    </div>
                    <div>
                      <label className={labelClass}><ImageIcon className="w-3 h-3" /> Cover Image URL</label>
                      <input name="cover_image" value={formData.cover_image} onChange={handleChange} className={inputClass} placeholder="https://..." />
                    </div>
                  </div>
                </div>

                {/* Section: Narrative */}
                <div className={sectionClass}>
                  <label className={labelClass}>Synopsis / About the Book</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className={`${inputClass} min-h-[120px] resize-none overflow-hidden`} placeholder="Write a brief overview..." />
                </div>

                {/* Section: Stats */}
                <div className={sectionClass}>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className={labelClass}><Star className="w-3 h-3" /> Score</label>
                      <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}><BookIcon className="w-3 h-3" /> Pages</label>
                      <input type="number" name="pages" value={formData.pages} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}><Calendar className="w-3 h-3" /> Released</label>
                      <input type="number" name="year" value={formData.year} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}><Globe className="w-3 h-3" /> Lang</label>
                      <input name="language" value={formData.language} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Section: Media */}
                <div className="flex items-center justify-between p-6 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${formData.hasAudio ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Audio Support</p>
                      <p className="text-xs text-muted-foreground">Does this book have an audio narrator?</p>
                    </div>
                  </div>
                  <div 
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.hasAudio ? "bg-primary" : "bg-muted"}`}
                    onClick={() => setFormData(p => ({ ...p, hasAudio: !p.hasAudio }))}
                  >
                    <motion.div 
                      animate={{ x: formData.hasAudio ? 24 : 0 }}
                      className="w-4 h-4 bg-white rounded-full shadow-sm" 
                    />
                  </div>
                </div>
              </form>

              {/* Preview Side */}
              <div className="hidden lg:flex w-80 bg-black/20 border-l border-white/5 flex-col items-center justify-center p-8 text-center space-y-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Instant Preview</p>
                <div className="w-full max-w-[200px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl relative group">
                  <img 
                    src={formData.cover_image || "https://images.unsplash.com/photo-1543004218-ee141104975a?q=80&w=1000"} 
                    className="w-full h-full object-cover" 
                    alt="Preview"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-left">
                    <p className="text-white font-bold text-sm truncate">{formData.title || "Untitled"}</p>
                    <p className="text-white/60 text-xs truncate">{formData.author || "Unknown Author"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/80 italic">"Looks great!"</p>
                  <p className="text-xs text-muted-foreground">This is how your book will appear in the library.</p>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-background/50 flex items-center justify-between">
              <button onClick={onClose} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Discard Draft</button>
              <div className="flex gap-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-10 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-[0_10px_20px_-5px_rgba(139,92,246,0.5)] hover:shadow-[0_15px_30px_-5px_rgba(139,92,246,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Processing..." : (
                    <>
                      <Save className="w-5 h-5" />
                      {bookToEdit ? "Update Entry" : "Establish Book"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

