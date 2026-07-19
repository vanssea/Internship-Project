import { Link } from 'react-router-dom';

export default function BookCard({ book, isFavorite, onToggleFavorite }) {
  // Fungsi penahan galat profesional untuk menangkap gambar 404
  const handleImageError = (e) => {
    e.target.onerror = null; // Mencegah infinite loop jika gambar fallback juga gagal
    e.target.src = 'https://placehold.co/400x600/10101a/f4f4f8?text=Tidak+Ada+Cover';
  };

  return (
    <article className="booktrack-card group overflow-hidden rounded-[1.5rem] border border-[var(--app-border)] bg-[var(--app-surface)] shadow-[0_20px_60px_rgba(0,0,0,0.16)] transition hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(168,85,247,0.12)] backdrop-blur-xl">
      <div className="relative aspect-[3/4] overflow-hidden bg-black/30">
        
        {/* Implementasi onError fallback pada tag img */}
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          onError={handleImageError}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <button
          type="button"
          onClick={() => onToggleFavorite(book.id)}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white shadow-sm backdrop-blur-xl transition hover:bg-black/55"
          aria-label={isFavorite ? `Hapus ${book.title} dari favorit` : `Tambah ${book.title} ke favorit`}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
        
        <div className="absolute left-3 top-3 rounded-full bg-[image:var(--app-accent)] px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_0_18px_rgba(168,85,247,0.3)]">
          ★ {book.rating}
        </div>
        
        <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4 z-10">
          <p className="font-mono-label text-[10px] uppercase tracking-[0.26em] text-gray-300">{book.tag}</p>
          <div className="mt-2 space-y-1">
            <h3 className="font-display text-lg font-bold leading-tight text-white drop-shadow-lg sm:text-2xl">{book.title}</h3>
            <p className="line-clamp-1 text-xs text-gray-300 drop-shadow-md sm:text-sm">{book.author}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 px-3 py-3 text-[var(--app-text)] sm:px-4 sm:py-4">
        <p className="text-xs text-[var(--app-muted)] sm:text-sm">
          {book.author} · {book.year}
        </p>
        <div className="flex items-center gap-1 text-[var(--app-text)]">
          {'★★★★★'.split('').map((star, index) => (
            <span key={`${book.id}-${index}`} className={index < Math.round(book.rating) - 1 ? 'opacity-100' : 'opacity-35'}>
              {star}
            </span>
          ))}
          <span className="ml-2 text-xs text-[var(--app-muted)] sm:text-sm">{book.votes}</span>
        </div>
        <div className="flex items-center justify-between gap-2 pt-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <Link
            to={`/book/${book.id}`}
            className="inline-flex items-center rounded-full bg-[image:var(--app-accent)] px-3 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(225,29,122,0.25)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(225,29,122,0.6)] sm:px-4 sm:text-sm"
          >
            Detail
          </Link>
          <button
            type="button"
            onClick={() => onToggleFavorite(book.id)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] transition hover:bg-[var(--app-surface-strong)] sm:h-10 sm:w-10"
            aria-label={isFavorite ? `Hapus ${book.title} dari favorit` : `Tambah ${book.title} ke favorit`}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>
      </div>
    </article>
  );
}