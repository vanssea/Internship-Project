export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Cari judul, penulis, atau subjek...' }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value ?? '');
      }}
      className="flex w-full items-center gap-3 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-xl transition focus-within:border-[var(--app-border)] focus-within:bg-[var(--app-surface-strong)]"
    >
      <svg className="h-5 w-5 text-[var(--app-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
        <circle cx="11" cy="11" r="7" />
      </svg>
      <input
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm text-[var(--app-text)] outline-none placeholder:text-[var(--app-muted)]"
        placeholder={placeholder}
      />
      <button
        type="submit"
        // bg diubah menjadi bg-[image:var(--app-accent)] agar gradasinya muncul
        className="rounded-full bg-[image:var(--app-accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-[0_0_30px_rgba(168,85,247,0.35)] transition-all hover:shadow-[0_0_40px_rgba(225,29,122,0.5)]"
      >
        Cari
      </button>
    </form>
  );
}