export const BOOKS = [];

// 4 Kategori inti yang terbukti 100% stabil dengan gambar valid di Subject API
export const GENRE_SECTIONS = [
  { key: 'Trending', label: 'Trending' },
  { key: 'Classics', label: 'Classics' },
  { key: 'Philosophy', label: 'Philosophy' },
  { key: 'Biography', label: 'Biography' },
];

const getSubjectForGenre = (genreKey) => {
  const mapping = {
    'Trending': 'bestseller',
    'Classics': 'classic',
    'Philosophy': 'philosophy',
    'Biography': 'biography'
  };
  return mapping[genreKey] || 'fiction';
};

// Mengembalikan format awal mapper Subject API yang terbukti memiliki gambar valid
const formatOLBook = (work, genreKey = 'Buku') => {
  const id = work.key ? work.key.replace('/works/', '') : crypto.randomUUID();
  
  // Menggunakan cover_id (bukan cover_i) yang terbukti mengarah ke gambar valid dan aktif
  const coverUrl = work.cover_id 
    ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
    : 'https://placehold.co/400x600/10101a/f4f4f8?text=Cover+Tidak+Tersedia'; 

  const safeSubjects = Array.isArray(work.subject) 
    ? work.subject.slice(0, 3) 
    : [genreKey];

  return {
    id: id,
    title: work.title || 'Tanpa Judul',
    // Subject API mengembalikan array objects authors
    author: work.authors && work.authors.length > 0 ? work.authors[0].name : 'Penulis Tidak Diketahui',
    year: work.first_publish_year || 'Unknown',
    genre: genreKey,
    tag: genreKey,
    rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
    votes: Math.floor(Math.random() * 500) + 50, 
    coverUrl: coverUrl,
    description: 'Karya literatur pilihan dari koleksi katalog Open Library. Jelajahi detail lebih lanjut untuk membaca ringkasan komprehensif.', 
    subjects: safeSubjects 
  };
};

export async function fetchPopularBooks() {
  try {
    const endpoints = GENRE_SECTIONS.map(genre => ({
      key: genre.key,
      url: `https://openlibrary.org/subjects/${getSubjectForGenre(genre.key)}.json?limit=8`
    }));

    let allBooks = [];

    // Menggunakan pemrosesan sekuensial yang aman dari pembatasan server (Rate Limiting)
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint.url);
        if (!res.ok) throw new Error(`Status API: ${res.status}`);
        
        const data = await res.json();
        
        if (data && Array.isArray(data.works)) {
          const formatted = data.works.map(w => formatOLBook(w, endpoint.key));
          allBooks = allBooks.concat(formatted);
        }
      } catch (err) {
        console.warn(`Gagal memuat katalog subjek ${endpoint.key}, melanjutkan ke kategori berikutnya.`);
      }
    }

    // Penghapusan data duplikat berdasarkan Unique Identifier (ID)
    const uniqueBooksMap = new Map();
    allBooks.forEach(book => {
      if (!uniqueBooksMap.has(book.id)) uniqueBooksMap.set(book.id, book);
    });

    return Array.from(uniqueBooksMap.values());
  } catch (error) {
    console.error("Kegagalan fatal pada fungsi agregasi data populer:", error);
    return [];
  }
}

export async function fetchBooksByGenre(genreKey) {
  try {
    const subject = getSubjectForGenre(genreKey);
    const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=8`);
    
    if (!res.ok) throw new Error("Respons server tidak sukses");
    
    const data = await res.json();
    if (!data || !Array.isArray(data.works)) return [];
    
    return data.works.map(work => formatOLBook(work, genreKey));
  } catch (error) {
    console.error(`Gagal memuat katalog genre ${genreKey}:`, error);
    return [];
  }
}

export async function fetchSpotlightBooks() {
  try {
    // 1. Tarik 6 buku bestseller untuk Hero Spotlight
    const res = await fetch('https://openlibrary.org/subjects/bestseller.json?limit=6');
    const data = await res.json();
    
    if (!data || !Array.isArray(data.works)) return [];

    // 2. Format data dasar
    const basicBooks = data.works.map(work => formatOLBook(work, 'Sorotan'));

    // 3. Tarik deskripsi asli satu per satu dan terjemahkan ke Bahasa Indonesia
    const detailedSpotlightBooks = await Promise.all(
      basicBooks.map(async (book) => {
        try {
          // Tembak endpoint detail untuk mendapatkan sinopsis
          const workRes = await fetch(`https://openlibrary.org/works/${book.id}.json`);
          const workData = await workRes.json();
          
          let rawDesc = typeof workData.description === 'string' 
            ? workData.description 
            : (workData.description?.value || '');

          let finalDesc = book.description; // Gunakan teks default jika kosong

          // Proses Terjemahan Otomatis
          if (rawDesc) {
            try {
              // Potong teks agar tidak melebihi batas gratis API penerjemah
              const safeText = encodeURIComponent(rawDesc.substring(0, 450));
              const transRes = await fetch(`https://api.mymemory.translated.net/get?q=${safeText}&langpair=en|id`);
              const transData = await transRes.json();
              
              if (transData.responseData?.translatedText && !transData.responseData.translatedText.includes('WARNING')) {
                finalDesc = transData.responseData.translatedText + (rawDesc.length > 450 ? '...' : '');
              } else {
                finalDesc = rawDesc;
              }
            } catch (err) {
              finalDesc = rawDesc;
            }
          }
          
          // Gabungkan data buku lama dengan deskripsi baru yang sudah diterjemahkan
          return { ...book, description: finalDesc || book.description };
        } catch (err) {
          console.warn(`Gagal mengambil deskripsi untuk spotlight ${book.title}`, err);
          return book; 
        }
      })
    );

    return detailedSpotlightBooks;
  } catch (error) {
    console.error("Gagal memuat buku sorotan:", error);
    return [];
  }
}

export async function fetchBookById(bookId) {
  try {
    const res = await fetch(`https://openlibrary.org/works/${bookId}.json`);
    const data = await res.json();
    
    let authorName = 'Penulis Tidak Diketahui';
    if (data.authors && data.authors.length > 0) {
       const authorKey = typeof data.authors[0].author === 'object' 
         ? data.authors[0].author.key 
         : data.authors[0].key;
         
       if (authorKey) {
         const authorRes = await fetch(`https://openlibrary.org${authorKey}.json`);
         const authorData = await authorRes.json();
         authorName = authorData.name;
       }
    }

    const descriptionData = typeof data.description === 'string' 
      ? data.description 
      : (data.description?.value || 'Deskripsi lengkap tidak tersedia.');

    const detailSubjects = Array.isArray(data.subjects) ? data.subjects : ['Literatur Umum'];

    return {
      id: bookId,
      title: data.title || 'Tanpa Judul',
      author: authorName,
      year: data.first_publish_date || 'Unknown',
      genre: detailSubjects[0] || 'Umum',
      tag: 'Koleksi',
      rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
      votes: Math.floor(Math.random() * 500) + 200,
      coverUrl: data.covers && data.covers.length > 0 
        ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` 
        : 'https://placehold.co/400x600/10101a/f4f4f8?text=Cover+Tidak+Tersedia',
      description: descriptionData,
      subjects: detailSubjects 
    };
  } catch (error) {
    console.error(`Gagal memuat detail entitas buku (ID: ${bookId}):`, error);
    return null;
  }
}