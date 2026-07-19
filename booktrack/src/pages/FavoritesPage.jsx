import BookCard from '../components/BookCard';

export default function FavoritesPage({ books, favorites, onToggleFavorite }) {
  const favoriteBooks = books.filter((book) => favorites.has(book.id));

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="font-mono-label text-xs uppercase tracking-[0.28em] text-[var(--app-muted)]">Favorites</p>
        <h1 className="font-display text-4xl font-black tracking-tight text-[var(--app-text)] sm:text-5xl">Buku favorit</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--app-muted)] sm:text-base">Daftar semua buku yang Anda simpan di browser.</p>
      </div>

      {favoriteBooks.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteBooks.map((book) => (
            <BookCard key={book.id} book={book} isFavorite={favorites.has(book.id)} onToggleFavorite={onToggleFavorite} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-[var(--app-muted)] backdrop-blur-xl">
          <p className="text-lg font-semibold text-[var(--app-text)]">Belum ada favorit.</p>
          <p className="mt-2 text-sm text-[var(--app-muted)]">Tambahkan buku dari katalog untuk melihatnya di halaman ini.</p>
        </div>
      )}
    </section>
  );
}