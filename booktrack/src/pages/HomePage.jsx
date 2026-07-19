import { useEffect, useState } from 'react';
import GenreRow from '../components/GenreRow';
import SpotlightHero from '../components/SpotlightHero';
import { fetchSpotlightBooks, GENRE_SECTIONS } from '../data/books';

export default function HomePage({ books, favorites, onToggleFavorite }) {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    fetchSpotlightBooks().then((result) => {
      if (mounted) {
        setFeaturedBooks(result);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-10">
      <SpotlightHero books={featuredBooks.length > 0 ? featuredBooks : books} activeIndex={activeIndex} onSelectIndex={setActiveIndex} />

      <section className="space-y-8">
        {GENRE_SECTIONS.map((section) => (
          <GenreRow
            key={section.key}
            title={section.label}
            genreKey={section.key}
            books={books}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </section>
    </div>
  );
}