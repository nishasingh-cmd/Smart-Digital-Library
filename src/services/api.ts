// Mock API service — mirrors Flask backend structure
// Replace base URL with your Flask server to go live
import { books, categories, reviews, type Book, type Review, type Category } from "@/data/books";

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// GET /books
export async function fetchBooks(query?: string, category?: string): Promise<Book[]> {
  await delay(300);
  let result = [...books];
  if (category) result = result.filter(b => b.category === category);
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }
  return result;
}

// GET /books/:id
export async function fetchBookById(id: string): Promise<Book | undefined> {
  await delay(200);
  return books.find(b => b.id === id);
}

// GET /categories
export async function fetchCategories(): Promise<Category[]> {
  await delay(200);
  return categories;
}

// GET /reviews/:bookId
export async function fetchReviews(bookId: string): Promise<Review[]> {
  await delay(250);
  return reviews.filter(r => r.bookId === bookId);
}

// GET /recommendations
export async function fetchRecommendations(currentBookId?: string): Promise<Book[]> {
  await delay(300);
  const pool = currentBookId ? books.filter(b => b.id !== currentBookId) : books;
  return pool.sort(() => Math.random() - 0.5).slice(0, 6);
}

// GET /trending
export async function fetchTrending(): Promise<Book[]> {
  await delay(200);
  return [...books].sort((a, b) => b.rating - a.rating).slice(0, 8);
}

// GET /audiobooks
export async function fetchAudiobooks(): Promise<Book[]> {
  await delay(200);
  return books.filter(b => b.hasAudio);
}
