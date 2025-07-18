'use client';

import { useSearch } from './SearchProvider';
import { SearchIcon } from './Icons';

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <div className="relative max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search tools..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        style={{ 
          backgroundColor: 'var(--card-background)', 
          borderColor: 'var(--border-color)',
          color: 'var(--foreground)'
        }}
      />
      <div className="absolute right-3 top-2.5" style={{ color: 'var(--text-muted)' }}>
        <SearchIcon size={16} />
      </div>
    </div>
  );
}