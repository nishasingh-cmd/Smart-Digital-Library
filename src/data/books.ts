export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  rating: number;
  pages: number;
  year: number;
  language: string;
  hasAudio: boolean;
  audioDuration?: string;
  coverUrl: string;
}

export interface Review {
  id: string;
  bookId: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}

export const categories: Category[] = [
  { id: "fiction", name: "Fiction", icon: "📖", count: 128, color: "from-violet-500 to-purple-600" },
  { id: "science", name: "Science", icon: "🔬", count: 94, color: "from-cyan-500 to-blue-600" },
  { id: "technology", name: "Technology", icon: "💻", count: 76, color: "from-emerald-500 to-green-600" },
  { id: "philosophy", name: "Philosophy", icon: "🧠", count: 53, color: "from-amber-500 to-orange-600" },
  { id: "history", name: "History", icon: "🏛️", count: 89, color: "from-rose-500 to-red-600" },
  { id: "psychology", name: "Psychology", icon: "🧩", count: 67, color: "from-pink-500 to-fuchsia-600" },
  { id: "business", name: "Business", icon: "📊", count: 112, color: "from-sky-500 to-indigo-600" },
  { id: "arts", name: "Arts & Design", icon: "🎨", count: 45, color: "from-teal-500 to-cyan-600" },
];

export const books: Book[] = [
  {
    id: "1", title: "Dune", author: "Frank Herbert", isbn: "9780441013593",
    category: "fiction", description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world. A stunning blend of adventure and mysticism, environmentalism and politics.",
    rating: 4.8, pages: 688, year: 1965, language: "English", hasAudio: true, audioDuration: "21h 2m",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg"
  },
  {
    id: "2", title: "1984", author: "George Orwell", isbn: "9780451524935",
    category: "fiction", description: "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its dystopian proscriptions have become combated combated combating increasingly combated reality.",
    rating: 4.7, pages: 328, year: 1949, language: "English", hasAudio: true, audioDuration: "11h 26m",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg"
  },
  {
    id: "3", title: "A Brief History of Time", author: "Stephen Hawking", isbn: "9780553380163",
    category: "science", description: "A landmark volume in science writing by one of the great minds of our time, Stephen Hawking's book explores such profound questions as: How did the universe begin? What made its start possible?",
    rating: 4.6, pages: 256, year: 1988, language: "English", hasAudio: true, audioDuration: "5h 46m",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg"
  },
  {
    id: "4", title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884",
    category: "technology", description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. This book is a must for any developer, software engineer, project manager, team lead, or systems analyst.",
    rating: 4.5, pages: 464, year: 2008, language: "English", hasAudio: false,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg"
  },
  {
    id: "5", title: "Sapiens", author: "Yuval Noah Harari", isbn: "9780062316110",
    category: "history", description: "100,000 years ago, at least six human species inhabited the earth. Today there is just one. Us. Homo sapiens. How did our species succeed in the battle for dominance?",
    rating: 4.7, pages: 443, year: 2011, language: "English", hasAudio: true, audioDuration: "15h 17m",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062316110-L.jpg"
  },
  {
    id: "6", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", isbn: "9780374533557",
    category: "psychology", description: "In this international bestseller, Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.",
    rating: 4.6, pages: 499, year: 2011, language: "English", hasAudio: true, audioDuration: "20h 2m",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg"
  },
  {
    id: "7", title: "The Lean Startup", author: "Eric Ries", isbn: "9780307887894",
    category: "business", description: "Most startups fail. But many of those failures are preventable. The Lean Startup is a new approach being adopted across the globe, changing the way companies are built and new products are launched.",
    rating: 4.3, pages: 336, year: 2011, language: "English", hasAudio: true, audioDuration: "8h 38m",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg"
  },
  {
    id: "8", title: "Meditations", author: "Marcus Aurelius", isbn: "9780140449334",
    category: "philosophy", description: "Written in Greek by the only Roman emperor who was also a philosopher, without any intention of publication, the Meditations of Marcus Aurelius offer a remarkable series of challenging spiritual reflections.",
    rating: 4.8, pages: 304, year: 180, language: "English", hasAudio: true, audioDuration: "6h 12m",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780140449334-L.jpg"
  },
  {
    id: "9", title: "The Design of Everyday Things", author: "Don Norman", isbn: "9780465050659",
    category: "arts", description: "The ultimate guide to human-centered design. Even the smartest among us can feel inept as we fail to figure out which light switch or oven burner to turn on.",
    rating: 4.4, pages: 368, year: 1988, language: "English", hasAudio: false,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780465050659-L.jpg"
  },
  {
    id: "10", title: "Brave New World", author: "Aldous Huxley", isbn: "9780060850524",
    category: "fiction", description: "Aldous Huxley's profoundly important classic of world literature, Brave New World is a searching vision of an unequal, technologically-advanced future.",
    rating: 4.5, pages: 288, year: 1932, language: "English", hasAudio: true, audioDuration: "8h 0m",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg"
  },
  {
    id: "11", title: "Cosmos", author: "Carl Sagan", isbn: "9780345539434",
    category: "science", description: "Cosmos retraces the fourteen billion years of cosmic evolution that have transformed matter into consciousness, exploring such topics as the origin of life.",
    rating: 4.7, pages: 396, year: 1980, language: "English", hasAudio: true, audioDuration: "14h 31m",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780345539434-L.jpg"
  },
  {
    id: "12", title: "Zero to One", author: "Peter Thiel", isbn: "9780804139298",
    category: "business", description: "The next Bill Gates will not build an operating system. The next Larry Page won't make a search engine. If you are copying these guys, you aren't learning from them.",
    rating: 4.4, pages: 224, year: 2014, language: "English", hasAudio: true, audioDuration: "4h 50m",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg"
  },
];

export const reviews: Review[] = [
  { id: "r1", bookId: "1", user: "Sarah K.", avatar: "SK", rating: 5, comment: "An absolute masterpiece. The world-building is unparalleled.", date: "2024-01-15" },
  { id: "r2", bookId: "1", user: "James L.", avatar: "JL", rating: 5, comment: "Changed how I think about science fiction forever.", date: "2024-02-03" },
  { id: "r3", bookId: "1", user: "Maya P.", avatar: "MP", rating: 4, comment: "Dense but incredibly rewarding. A must-read.", date: "2024-03-12" },
  { id: "r4", bookId: "2", user: "Alex T.", avatar: "AT", rating: 5, comment: "Terrifyingly relevant. Orwell was a prophet.", date: "2024-01-22" },
  { id: "r5", bookId: "2", user: "Diana R.", avatar: "DR", rating: 4, comment: "Dark and thought-provoking. Essential reading.", date: "2024-02-18" },
  { id: "r6", bookId: "3", user: "Chris M.", avatar: "CM", rating: 5, comment: "Makes complex physics accessible and thrilling.", date: "2024-03-05" },
  { id: "r7", bookId: "5", user: "Elena V.", avatar: "EV", rating: 5, comment: "Fascinating journey through human history.", date: "2024-01-30" },
  { id: "r8", bookId: "8", user: "Marcus W.", avatar: "MW", rating: 5, comment: "Timeless wisdom. I read it every year.", date: "2024-02-14" },
];
