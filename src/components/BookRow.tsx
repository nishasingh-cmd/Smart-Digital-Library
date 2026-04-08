import { BookCard } from "./BookCard";
import { SkeletonRow } from "./Skeleton";
import type { Book } from "@/data/books";

interface BookRowProps {
  title: string;
  subtitle?: string;
  books: Book[];
  loading?: boolean;
}

export function BookRow({ title, subtitle, books, loading }: BookRowProps) {
  if (loading) return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-display font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <SkeletonRow />
    </section>
  );

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-display font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {books.map((book, i) => (
          <div key={book.id} className="min-w-[140px] max-w-[160px] flex-shrink-0">
            <BookCard book={book} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
