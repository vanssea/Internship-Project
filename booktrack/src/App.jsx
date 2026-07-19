import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import BookDetailPage from './pages/BookDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import { BOOKS, fetchPopularBooks } from './data/books';

const FAVORITES_KEY = 'booktrack-favorites';
const THEME_KEY = 'booktrack-theme';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'));
    } catch (error) {
      return new Set();
    }
  });
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') {
      return 'dark';
    }

    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    fetchPopularBooks().then(setBooks);
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  const favoriteCount = useMemo(() => favorites.size, [favorites]);

  const handleToggleFavorite = (bookId) => {
    setFavorites((currentFavorites) => {
      const nextFavorites = new Set(currentFavorites);

      if (nextFavorites.has(bookId)) {
        nextFavorites.delete(bookId);
      } else {
        nextFavorites.add(bookId);
      }

      return nextFavorites;
    });
  };

  const handleToggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleSearchSubmit = (query) => {
    const normalizedQuery = query.trim();

    setSearch(normalizedQuery);

    if (normalizedQuery) {
      navigate(`/search?q=${encodeURIComponent(normalizedQuery)}`);
      return;
    }

    navigate('/');
  };

  const searchQuery = new URLSearchParams(location.search).get('q') || search;
  const catalog = books.length > 0 ? books : BOOKS;

  return (
    <Layout
      favoritesCount={favoriteCount}
      theme={theme}
      onToggleTheme={handleToggleTheme}
      search={searchQuery}
      onSearchChange={setSearch}
      onSearchSubmit={handleSearchSubmit}
    >
      <Routes>
        <Route path="/" element={<HomePage books={catalog} favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
        <Route path="/favorites" element={<FavoritesPage books={catalog} favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
        <Route path="/search" element={<SearchResultsPage books={catalog} favorites={favorites} query={searchQuery} onToggleFavorite={handleToggleFavorite} />} />
        <Route path="/book/:bookId" element={<BookDetailPage books={catalog} favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}