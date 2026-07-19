import BookCard from '../components/BookCard';

export default function SearchResultsPage({ books, favorites, query, onToggleFavorite }) {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredBooks = books.filter((book) => {
    const haystack = [book.title, book.author, book.genre, book.description, ...(book.subjects || [])].join(' ').toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="font-mono-label text-xs uppercase tracking-[0.28em] text-[var(--app-muted)]">Search Results</p>
        <h1 className="font-display text-4xl font-black tracking-tight text-[var(--app-text)] sm:text-5xl">Hasil pencarian</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--app-muted)] sm:text-base">
          {normalizedQuery ? `Menampilkan hasil untuk "${query}"` : 'Masukkan kata kunci untuk mulai mencari.'}
        </p>
      </div>

      {normalizedQuery ? (
        filteredBooks.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} isFavorite={favorites.has(book.id)} onToggleFavorite={onToggleFavorite} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-[var(--app-muted)] backdrop-blur-xl">
            <p className="text-lg font-semibold text-[var(--app-text)]">Tidak ada hasil yang cocok.</p>
            <p className="mt-2 text-sm text-[var(--app-muted)]">Coba kata kunci lain atau gunakan genre yang berbeda.</p>
          </div>
        )
      ) : (
        <div className="rounded-[2rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-[var(--app-muted)] backdrop-blur-xl">
          <p className="text-lg font-semibold text-[var(--app-text)]">Mulai pencarian Anda.</p>
          <p className="mt-2 text-sm text-[var(--app-muted)]">Ketik judul, penulis, atau subjek di kotak pencarian atas.</p>
        </div>
      )}
    </section>
  );
}