export default function Filters({ categories, filters, onChange, onReset }) {
  const handle = (e) => onChange({ [e.target.name]: e.target.value });

  return (
    <div className="filters">
      <select name="category" value={filters.category} onChange={handle}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        name="city"
        type="text"
        placeholder="City"
        value={filters.city}
        onChange={handle}
      />

      <input name="date" type="date" value={filters.date} onChange={handle} />

      <button type="button" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}