import axios from "axios";
import { books as demoBooks, categories, reviews, type Book, type Review, type Category } from "@/data/books";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add interceptor to include JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GET /books
export async function fetchBooks(query?: string, category?: string): Promise<Book[]> {
  try {
    const response = await api.get("/books", {
      params: { query, category, limit: 100 }
    });
    
    const backendBooks: Book[] = response.data.books.map((b: any) => ({
      ...b,
      coverUrl: b.cover_image // Map cover_image to coverUrl for frontend compatibility
    }));

    // Merge demo books with backend books
    let allBooks = [...demoBooks, ...backendBooks];

    // Filter merged list if query or category is provided (frontend side fallback/refinement)
    if (category && category !== 'all') {
      allBooks = allBooks.filter(b => b.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      allBooks = allBooks.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }

    return allBooks;
  } catch (error) {
    console.error("Error fetching books from backend, falling back to demo books:", error);
    return demoBooks;
  }
}

// GET /books/:id
export async function fetchBookById(id: string): Promise<Book | undefined> {
  // Check if it's a demo book first
  const demoBook = demoBooks.find(b => b.id === id);
  if (demoBook) return demoBook;

  try {
    const response = await api.get(`/books/${id}`);
    return {
      ...response.data,
      coverUrl: response.data.cover_image
    };
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return undefined;
  }
}

// POST /books
export async function createBook(bookData: Partial<Book>): Promise<Book> {
  const response = await api.post("/books", bookData);
  return response.data;
}

// PUT /books/:id
export async function updateBook(id: string, bookData: Partial<Book>): Promise<Book> {
  const response = await api.put(`/books/${id}`, bookData);
  return response.data;
}

// DELETE /books/:id
export async function deleteBook(id: string): Promise<void> {
  await api.delete(`/books/${id}`);
}

// GET /categories
export async function fetchCategories(): Promise<Category[]> {
  return categories; // Keep local categories for now as they have specific icons/colors
}

// GET /reviews/:bookId
export async function fetchReviews(bookId: string): Promise<Review[]> {
  // Currently reviews are still mock, so we return mock data
  return reviews.filter(r => r.bookId === bookId);
}

// GET /recommendations
export async function fetchRecommendations(currentBookId?: string): Promise<Book[]> {
  const allBooks = await fetchBooks();
  const pool = currentBookId ? allBooks.filter(b => b.id !== currentBookId) : allBooks;
  return pool.sort(() => Math.random() - 0.5).slice(0, 6);
}

// GET /trending
export async function fetchTrending(): Promise<Book[]> {
  const allBooks = await fetchBooks();
  return [...allBooks].sort((a, b) => b.rating - a.rating).slice(0, 8);
}

// GET /audiobooks
export async function fetchAudiobooks(): Promise<Book[]> {
  const allBooks = await fetchBooks();
  return allBooks.filter(b => b.hasAudio);
}

// Favorite operations
export async function addFavorite(bookId: string) {
  return api.post("/favorites", { bookId });
}

export async function removeFavorite(bookId: string) {
  return api.delete("/favorites", { data: { bookId } });
}

export async function fetchUserFavorites(userId: string) {
  const response = await api.get(`/favorites/${userId}`);
  return response.data;
}

// User Library operations
export async function addToUserLibrary(bookId: string, notes?: string) {
  return api.post("/library", { bookId, notes });
}

export async function removeFromUserLibrary(bookId: string) {
  return api.delete("/library", { data: { bookId } });
}

export async function fetchUserLibrary(userId: string) {
  const response = await api.get(`/library/${userId}`);
  return response.data;
}

export async function updateLibraryEntry(id: string, notes: string) {
  return api.put(`/library/${id}`, { notes });
}

// Auth operations
export async function register(name: string, email: string, password: string) {
  const response = await api.post("/users/register", { name, email, password });
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await api.post("/users/login", { email, password });
  return response.data;
}

export async function fetchUserProfile(id: string) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function updateUserProfile(id: string, name: string) {
  const response = await api.put(`/users/${id}`, { name });
  return response.data;
}

export async function deleteUser(id: string) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}

