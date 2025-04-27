
export default function Select() {
  return (
    <select
      name="engine"
      defaultValue="pirate"
      className="p-2 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="yoda">Yoda</option>
      <option value="pirate">Pirate</option>
    </select>
  );
}