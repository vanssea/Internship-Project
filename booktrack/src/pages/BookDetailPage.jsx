import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function BookDetailPage({ books, favorites, onToggleFavorite }) {
  const { bookId } = useParams();
  const initialBook = books.find((item) => item.id === bookId);
  const [detailedBook, setDetailedBook] = useState(initialBook);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchRealDetails() {
      if (!bookId) return;
      setIsLoading(true);

      try {
        const workRes = await fetch(`https://openlibrary.org/works/${bookId}.json`);
        const workData = await workRes.json();

        const editionsRes = await fetch(`https://openlibrary.org/works/${bookId}/editions.json?limit=1`);
        const editionsData = await editionsRes.json();
        const edition = editionsData.entries?.[0] || {};

        // Ambil teks asli bahasa Inggris
        let rawDesc = typeof workData.description === 'string'
          ? workData.description
          : workData.description?.value || '';

        let finalDesc = 'Deskripsi lengkap tidak tersedia di katalog Open Library untuk buku ini.';

        // Proses Terjemahan Otomatis
        if (rawDesc) {
          try {
            // Potong maksimal 450 huruf biar API translator gratisannya ga error
            const safeText = encodeURIComponent(rawDesc.substring(0, 450));
            const transRes = await fetch(`https://api.mymemory.translated.net/get?q=${safeText}&langpair=en|id`);
            const transData = await transRes.json();
            
            // Cek apakah hasil terjemahan sukses
            if (transData.responseData?.translatedText && !transData.responseData.translatedText.includes('WARNING')) {
              finalDesc = transData.responseData.translatedText + (rawDesc.length > 450 ? '...' : '');
            } else {
              finalDesc = rawDesc; // Kalo limit habis, balikin ke Inggris
            }
          } catch (err) {
            finalDesc = rawDesc; // Kalo internet error, balikin ke Inggris
          }
        }

        if (isMounted) {
          setDetailedBook(prev => ({
            ...prev,
            description: finalDesc,
            subjects: Array.isArray(workData.subjects) 
              ? workData.subjects.slice(0, 5) 
              : prev?.subjects || ['Literatur Umum'],
            pages: edition.number_of_pages || prev?.pages || '-',
            publisher: edition.publishers?.[0] || prev?.publisher || 'Tidak diketahui',
            languages: edition.languages 
              ? edition.languages.map(lang => lang.key.replace('/languages/', '').toUpperCase()) 
              : prev?.languages || ['-']
          }));
        }
      } catch (error) {
        console.error('Gagal mengambil detail ekstra:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchRealDetails();

    return () => {
      isMounted = false;
    };
  }, [bookId]);

  if (!detailedBook) {
    return (
      <section className="rounded-[2rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-[var(--app-muted)] backdrop-blur-xl">
        <h1 className="font-display text-2xl font-black text-[var(--app-text)]">Buku tidak ditemukan</h1>
        <p className="mt-2 text-sm text-[var(--app-muted)]">Buku yang dipilih tidak tersedia di katalog.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-[var(--app-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(225,29,122,0.22)] transition-all hover:scale-[1.05]"
        >
          Kembali ke beranda
        </Link>
      </section>
    );
  }

  const isFavorite = favorites.has(detailedBook.id);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] shadow-[0_40px_120px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
      <div className="relative grid gap-8 p-5 sm:p-6 lg:grid-cols-[0.75fr_1.25fr] lg:p-8">
        <div className="relative">
          <div className="absolute inset-0 -z-10 scale-110 rounded-[2rem] bg-cover bg-center blur-3xl opacity-70" style={{ backgroundImage: `url(${detailedBook.coverUrl})` }} />
          <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/20 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
            <img src={detailedBook.coverUrl} alt={detailedBook.title} className="aspect-[3/4] w-full object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onToggleFavorite(detailedBook.id)}
            className="mt-4 w-full rounded-full bg-[image:var(--app-accent)] px-5 py-4 text-sm font-semibold text-white shadow-[0_0_28px_rgba(168,85,247,0.24)] transition-all hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(225,29,122,0.4)]"
          >
            {isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="font-mono-label text-xs uppercase tracking-[0.28em] text-[var(--app-muted)]">Detail Buku</p>
            <h1 className="font-display max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">{detailedBook.title}</h1>
            <p className="text-lg text-[var(--app-muted)]">{detailedBook.author}</p>
            <div className="flex items-center gap-2 text-[var(--app-text)]">
              {'★★★★★'.split('').map((star, index) => (
                <span key={`${detailedBook.id}-detail-${index}`} className={index < Math.round(detailedBook.rating || 0) - 1 ? 'opacity-100' : 'opacity-35'}>
                  {star}
                </span>
              ))}
              <span className="ml-2 text-sm text-[var(--app-muted)]">{detailedBook.votes || 0} rating</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 relative overflow-hidden">
              {isLoading && <div className="absolute inset-0 bg-[var(--app-text)] opacity-5 animate-pulse" />}
              <p className="font-mono-label text-[10px] uppercase tracking-[0.24em] text-[var(--app-muted)]">Halaman</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--app-text)]">{detailedBook.pages}</p>
            </div>
            <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 relative overflow-hidden">
              {isLoading && <div className="absolute inset-0 bg-[var(--app-text)] opacity-5 animate-pulse" />}
              <p className="font-mono-label text-[10px] uppercase tracking-[0.24em] text-[var(--app-muted)]">Penerbit</p>
              <p className="mt-2 text-lg font-semibold text-[var(--app-text)] line-clamp-1" title={detailedBook.publisher}>
                {detailedBook.publisher}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 relative overflow-hidden">
              {isLoading && <div className="absolute inset-0 bg-[var(--app-text)] opacity-5 animate-pulse" />}
              <p className="font-mono-label text-[10px] uppercase tracking-[0.24em] text-[var(--app-muted)]">Bahasa</p>
              <p className="mt-2 text-lg font-semibold text-[var(--app-text)]">
                {detailedBook.languages?.join(', ')}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-mono-label text-xs uppercase tracking-[0.28em] text-[var(--app-muted)]">Topik</p>
            <div className="flex flex-wrap gap-2">
              {(detailedBook.subjects || []).map((subject) => (
                <span key={subject} className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 text-sm text-[var(--app-text)] backdrop-blur-xl">
                  {subject}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
             {isLoading ? (
               <div className="space-y-2 animate-pulse">
                 <div className="h-4 bg-[var(--app-border)] rounded w-full"></div>
                 <div className="h-4 bg-[var(--app-border)] rounded w-5/6"></div>
                 <div className="h-4 bg-[var(--app-border)] rounded w-4/6"></div>
               </div>
             ) : (
               <p className="max-w-3xl text-base leading-8 text-[var(--app-muted)]">{detailedBook.description}</p>
             )}
          </div>
          
          <Link to="/" className="inline-flex rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-3 text-sm font-medium text-[var(--app-text)] backdrop-blur-xl transition-colors hover:bg-[var(--app-surface-strong)]">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </section>
  );
}