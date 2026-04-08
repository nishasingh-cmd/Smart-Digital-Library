import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "@/services/api";
import type { Category } from "@/data/books";

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchCategories().then(c => { setCats(c); setLoading(false); }); }, []);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Categories</h1>
        <p className="text-muted-foreground text-sm">Browse by genre</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cats.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => navigate(`/discover?category=${cat.id}`)}
            className="relative overflow-hidden rounded-xl p-6 text-left glass group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className="relative z-10">
              <span className="text-3xl mb-3 block">{cat.icon}</span>
              <h3 className="font-display font-bold text-foreground">{cat.name}</h3>
              <p className="text-sm text-muted-foreground">{cat.count} books</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
