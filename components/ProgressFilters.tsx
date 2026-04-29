export function ProgressFilters({ setFilter }: any) {
  return (
    <div className="flex gap-3">
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All Skills</option>
        <option value="react">React</option>
      </select>

      <select>
        <option>Last 7 days</option>
        <option>Last 30 days</option>
      </select>
    </div>
  );
}