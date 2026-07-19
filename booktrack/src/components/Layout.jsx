import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function Layout({ children, favoritesCount, theme, onToggleTheme, search, onSearchChange, onSearchSubmit }) {
  return (
    <div className="min-h-screen text-[var(--app-text)]">
      {/* BAGIAN YANG DIUBAH PADA CLASSNAME HEADER DI BAWAH INI */}
      <header className="sticky top-0 z-40 border-b border-[var(--app-border)] bg-[color:var(--app-bg-soft)] backdrop-blur-2xl">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:px-8">
          <Link to="/" className="flex items-center gap-3 self-start">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#a855f7_0%,#e11d7a_100%)] text-lg font-bold text-white shadow-[0_0_28px_rgba(168,85,247,0.26)]">
              B
            </div>
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight text-[var(--app-text)]">BookTrack</p>
              <p className="font-mono-label text-[10px] uppercase tracking-[0.3em] text-[var(--app-muted)]">Cinematic Library</p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--app-muted)] lg:justify-center">
            <NavLink to="/" className={({ isActive }) => `rounded-full border px-3 py-2 transition ${isActive ? 'border-[var(--app-border)] bg-[var(--app-surface-strong)] text-[var(--app-text)]' : 'border-[var(--app-border)] bg-[var(--app-surface)] hover:bg-[var(--app-surface-strong)]'}`}>
              Beranda
            </NavLink>
            <NavLink to="/favorites" className={({ isActive }) => `rounded-full border px-3 py-2 transition ${isActive ? 'border-[var(--app-border)] bg-[var(--app-surface-strong)] text-[var(--app-text)]' : 'border-[var(--app-border)] bg-[var(--app-surface)] hover:bg-[var(--app-surface-strong)]'}`}>
              Favorit
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => `rounded-full border px-3 py-2 transition ${isActive ? 'border-[var(--app-border)] bg-[var(--app-surface-strong)] text-[var(--app-text)]' : 'border-[var(--app-border)] bg-[var(--app-surface)] hover:bg-[var(--app-surface-strong)]'}`}>
              Cari
            </NavLink>
          </div>

          <div className="w-full lg:px-8">
            <SearchBar value={search} onChange={onSearchChange} onSubmit={onSearchSubmit} placeholder="Cari judul, penulis, atau subjek..." />
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 text-sm text-[var(--app-text)] backdrop-blur-xl">
              <span>♡</span>
              <span>{favoritesCount}</span>
            </div>
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-lg text-[var(--app-text)] transition hover:bg-[var(--app-surface-strong)]"
              aria-label={theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}