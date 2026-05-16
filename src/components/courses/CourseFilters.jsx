const CourseFilters = ({ searchTerm, category, sortBy, onSearchChange, onCategoryChange, onSortChange }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <div className="flex-1 min-w-[200px]">
        <label className="block mb-2 font-medium text-cream">Search Courses</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Type to search..."
          className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block mb-2 font-medium text-cream">Filter by Category</label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">All Categories</option>
          <option value="fintech">FinTech</option>
          <option value="ai">AI & ML</option>
          <option value="cloud">Cloud</option>
          <option value="data">Data Science</option>
          <option value="security">Security</option>
          <option value="web">Web Development</option>
          <option value="mobile">Mobile Development</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block mb-2 font-medium text-cream">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>
    </div>
  )
}

export default CourseFilters
