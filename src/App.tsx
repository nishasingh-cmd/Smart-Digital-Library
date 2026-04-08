import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { LibraryProvider } from "@/context/LibraryContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import DiscoverPage from "@/pages/DiscoverPage";
import LoginPage from "@/pages/LoginPage";
import CategoriesPage from "@/pages/CategoriesPage";
import BookDetailPage from "@/pages/BookDetailPage";
import AudiobooksPage from "@/pages/AudiobooksPage";
import MyLibraryPage from "@/pages/MyLibraryPage";
import FavoritesPage from "@/pages/FavoritesPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";
import ReadBookPage from "@/pages/ReadBookPage";
import ReadBooksPage from "@/pages/ReadBooksPage";

const queryClient = new QueryClient();

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <PageTransition>
            <Routes>
              <Route path="/" element={<ProtectedRoute><DiscoverPage /></ProtectedRoute>} />
              <Route path="/discover" element={<ProtectedRoute><DiscoverPage /></ProtectedRoute>} />
              <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
              <Route path="/book/:id" element={<ProtectedRoute><BookDetailPage /></ProtectedRoute>} />
              <Route path="/audiobooks" element={<ProtectedRoute><AudiobooksPage /></ProtectedRoute>} />
              <Route path="/read-books" element={<ProtectedRoute><ReadBooksPage /></ProtectedRoute>} />
              <Route path="/library" element={<ProtectedRoute><MyLibraryPage /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </main>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <LibraryProvider>
          <TooltipProvider>
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/read/:id" element={<ProtectedRoute><ReadBookPage /></ProtectedRoute>} />
                <Route path="/*" element={<AppLayout />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LibraryProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
