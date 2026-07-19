import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export default function SpotlightHero({ books, activeIndex, onSelectIndex }) {
  const featuredBooks = useMemo(() => books.slice(0, 6), [books]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (activeIndex != null) {
      setIndex(activeIndex);
    }
  }, [activeIndex]);

  useEffect(() => {
    if (featuredBooks.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % featuredBooks.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, [featuredBooks.length]);

  const currentBook = featuredBooks[index] ?? featuredBooks[0];

  if (!currentBook) {
    return null;
  }

  return (
    <section className="booktrack-hero relative overflow-hidden rounded-[2rem] border border-[var(--app-border)] bg-[var(--app-bg-soft)] text-[var(--app-text)] shadow-[0_40px_120px_rgba(0,0,0,0.24)]">
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl brightness-75 saturate-125"
        style={{ backgroundImage: `url(${currentBook.coverUrl})` }}
      />
      <div className="booktrack-hero-overlay absolute inset-0 bg-[linear-gradient(135deg,rgba(13,13,20,0.92),rgba(13,13,20,0.66)_45%,rgba(168,85,247,0.16)_100%)]" />

      <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
        <div className="max-w-2xl space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-[var(--app-muted)]">
            <span>{currentBook.tag}</span>
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-7xl">
              {currentBook.title}
            </h1>
            <p className="max-w-xl text-sm leading-6 text-[var(--app-muted)] sm:text-base sm:leading-7">{currentBook.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/book/${currentBook.id}`}
              className="rounded-full bg-[var(--app-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(225,29,122,0.28)] transition hover:scale-[1.02]"
            >
              Buka detail
            </Link>
            <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm text-[var(--app-text)] backdrop-blur-xl">
              {currentBook.author}
            </span>
            <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm text-[var(--app-text)] backdrop-blur-xl">
              {currentBook.year}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {featuredBooks.map((book, bookIndex) => (
              <button
                key={book.id}
                type="button"
                onClick={() => onSelectIndex(bookIndex)}
                className={[
                  'h-2.5 rounded-full transition-all',
                  bookIndex === index ? 'w-8 bg-[var(--app-text)] shadow-[0_0_18px_rgba(0,0,0,0.15)]' : 'w-2.5 bg-[var(--app-muted)]/35 hover:bg-[var(--app-muted)]/60',
                ].join(' ')}
                aria-label={`Tampilkan ${book.title}`}
              />
            ))}
          </div>
        </div>

        <div className="relative flex items-end justify-center lg:justify-end">
          <div className="absolute inset-x-8 bottom-6 top-6 rounded-[2rem] bg-[linear-gradient(135deg,rgba(168,85,247,0.18),rgba(225,29,122,0.18))] blur-3xl" />
          <div className="relative w-full max-w-xs overflow-hidden rounded-[2rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl sm:max-w-sm">
            <img src={currentBook.coverUrl} alt={currentBook.title} className="aspect-[3/4] w-full rounded-[1.35rem] object-cover shadow-[0_16px_50px_rgba(0,0,0,0.4)]" />
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-[var(--app-muted)]">
              <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
                <p className="font-mono-label uppercase tracking-[0.22em] text-[var(--app-muted)]">Rating</p>
                <p className="mt-2 text-lg font-semibold text-[var(--app-text)]">{currentBook.rating}</p>
              </div>
              <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
                <p className="font-mono-label uppercase tracking-[0.22em] text-[var(--app-muted)]">Favorit</p>
                <p className="mt-2 text-lg font-semibold text-[var(--app-text)]">{currentBook.votes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}