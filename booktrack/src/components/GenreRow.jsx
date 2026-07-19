import { useMemo } from 'react';
import { Link } from 'react-router-dom';

function GenreRailCard({ book, onToggleFavorite, isFavorite }) {
  return (
    <article className="booktrack-genre-card group relative w-[160px] shrink-0 overflow-hidden rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface)] shadow-[0_18px_55px_rgba(0,0,0,0.18)] sm:w-[190px]">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="booktrack-genre-overlay absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,20,0.08),rgba(13,13,20,0.82))] opacity-80 transition group-hover:opacity-100" />
        <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xl">
          ★ {book.rating}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
          <p className="font-mono-label text-[10px] uppercase tracking-[0.24em] text-white/55">{book.tag}</p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug sm:text-base">{book.title}</h3>
          <p className="mt-1 line-clamp-1 text-xs text-white/70">{book.author}</p>

          <div className="mt-3 flex items-center justify-between gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            <Link
              to={`/book/${book.id}`}
              className="rounded-full bg-[var(--app-accent)] px-3 py-2 text-[11px] font-semibold text-white shadow-[0_0_18px_rgba(168,85,247,0.3)]"
            >
              Detail
            </Link>
            <button
              type="button"
              onClick={() => onToggleFavorite(book.id)}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-semibold text-white backdrop-blur-xl"
            >
              {isFavorite ? '♥' : '♡'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function GenreRow({ title, genreKey, books, favorites, onToggleFavorite }) {
  const items = useMemo(() => {
    const haystackFor = (book) => [book.title, book.author, book.genre, book.tag, ...(book.subjects || [])].join(' ').toLowerCase();

    switch (genreKey) {
      case 'Trending':
        return [...books].sort((left, right) => right.votes - left.votes).slice(0, 8);
      case 'Classics':
        return books.filter((book) => /klasik|classics|drama|distopia|fiksi sejarah|fantasi/i.test(haystackFor(book))).slice(0, 8);
      case 'Sci-Fi':
        return books.filter((book) => /fiksi ilmiah|science fiction|distopia|alam semesta|antariksa/i.test(haystackFor(book))).slice(0, 8);
      case 'Mystery':
        return books.filter((book) => /misteri|thriller|pengawasan|hilang|rahasia|sihir/i.test(haystackFor(book))).slice(0, 8);
      case 'Philosophy':
        return books.filter((book) => /filsafat|philosophy|fabel modern|pilihan hidup|spiritualitas|makna hidup|peradaban/i.test(haystackFor(book))).slice(0, 8);
      case 'Biography':
        return books.filter((book) => /memoar|biography|kepemimpinan|keluarga|pendidikan|peradaban|sains populer/i.test(haystackFor(book))).slice(0, 8);
      default:
        return [];
    }
  }, [books, genreKey]);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono-label text-xs uppercase tracking-[0.28em] text-[var(--app-muted)]">{genreKey}</p>
          <h2 className="mt-1 text-xl font-semibold text-[var(--app-text)] sm:text-2xl">{title}</h2>
        </div>
        <p className="text-sm text-[var(--app-muted)]">{items.length} buku</p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[var(--app-bg)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--app-bg)] to-transparent" />
        <div className="flex gap-3 overflow-x-auto pb-3 pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
          {items.map((book) => (
            <GenreRailCard key={book.id} book={book} onToggleFavorite={onToggleFavorite} isFavorite={favorites.has(book.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}