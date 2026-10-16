const icons = {
  Music: '🎵',
  Sports: '⚽',
  'Arts & Theatre': '🎭',
  Film: '🎬',
  Miscellaneous: '✨',
};

export default function Filters({ categories, filters, onChange, onReset }) {
  const handle = (e) => onChange({ [e.target.name]: e.target.value });
  const today = new Date().toLocaleDateString('en-CA');
  const visible = categories.filter((c) => c.name && c.name !== 'Undefined');

  return (
    <div className="filter-panel">
      <div className="chips">
        <button
          type="button"
          className={!filters.category ? 'chip active' : 'chip'}
          onClick={() => onChange({ category: '' })}
        >
          🌟 All
        </button>
        {visible.map((c) => (
          <button
            type="button"
            key={c.id}
            className={filters.category === c.name ? 'chip active' : 'chip'}
            onClick={() => onChange({ category: c.name })}
          >
            {icons[c.name] || '🎟️'} {c.name}
          </button>
        ))}
      </div>

      <div className="filter-row">
        <input
          name="city"
          type="text"
          placeholder="📍 City (e.g. Chicago)"
          value={filters.city}
          onChange={handle}
        />
        <input name="date" type="date" min={today} value={filters.date} onChange={handle} />
        <button type="button" onClick={() => onChange({ date: today })}>
          Today
        </button>
        <button type="button" className="btn-reset" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}