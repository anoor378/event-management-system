export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="search-input"
      type="text"
      placeholder="Search events, artists, teams..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}