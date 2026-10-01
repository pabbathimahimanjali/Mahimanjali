export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="search"
      type="search"
      placeholder="Search by name, phone or email"
      aria-label="Search contacts"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
