import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function Layout({ children, favoritesCount, theme, onToggleTheme, search, onSearchChange, onSearchSubmit }) {
  return (
    <div className="min-h-screen text-[var(--app-text)]">
      <header className="sticky top-0 z-40 border-b border-[var(--app-border)] bg-[color:var(--app-bg-soft)] backdrop-blur-2xl">
        <div className="mx-auto grid max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:px-8">
          
          {/* Logo BookTrack */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#a855f7_0%,#e11d7a_100%)] shadow-[0_0_28px_rgba(168,85,247,0.26)]">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 12H22C24.5 12 26 13.5 26 16C26 18.5 24.5 20 22 20H14V12Z" fill="white"/>
                <path d="M14 20H24C26.5 20 28 21.5 28 24C28 26.5 26.5 28 24 28H14V20Z" fill="white"/>
              </svg>
            </div>
            <div>
              <p className="font-display text-xl font-semibold tracking-tight text-[var(--app-text)]">BookTrack</p>
            </div>
          </Link>

          {/* Navigasi Utama */}
          <div className="flex items-center gap-2 justify-center">
            <NavLink to="/" className={({ isActive }) => `rounded-full border px-5 py-2 text-sm transition ${isActive ? 'border-[var(--app-border)] bg-[var(--app-surface-strong)] text-[var(--app-text)]' : 'border-[var(--app-border)] bg-[var(--app-surface)] hover:bg-[var(--app-surface-strong)]'}`}>
              Beranda
            </NavLink>
            {/* NavLink Favorit digabung dengan jumlah */}
            <NavLink to="/favorites" className={({ isActive }) => `flex items-center gap-2 rounded-full border px-5 py-2 text-sm transition ${isActive ? 'border-[var(--app-border)] bg-[var(--app-surface-strong)] text-[var(--app-text)]' : 'border-[var(--app-border)] bg-[var(--app-surface)] hover:bg-[var(--app-surface-strong)]'}`}>
              <span>Favorit</span>
              <span className="flex items-center gap-1 opacity-70">
                <span>♡</span>
                <span>{favoritesCount}</span>
              </span>
            </NavLink>
          </div>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-3">
            <div className="w-full max-w-sm">
              <SearchBar value={search} onChange={onSearchChange} onSubmit={onSearchSubmit} placeholder="Cari..." />
            </div>
            
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-lg transition hover:bg-[var(--app-surface-strong)]"
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