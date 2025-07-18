'use client';

import { useState } from 'react';
import { Tool } from '@/types/tool';
import { tools, categories } from '@/lib/tools';
import ToolCard from './ToolCard';

export default function ToolGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            style={{ 
              backgroundColor: 'var(--card-background)', 
              borderColor: 'var(--border-color)',
              color: 'var(--foreground)'
            }}
          />
          <div className="absolute right-3 top-2.5" style={{ color: 'var(--text-muted)' }}>
            🔍
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-red-500 text-white'
                  : 'hover:bg-red-500 hover:text-white'
              }`}
              style={selectedCategory === category.id ? {} : { 
                backgroundColor: 'var(--card-background)', 
                color: 'var(--text-muted)',
                borderColor: 'var(--border-color)'
              }}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Showing {filteredTools.length} of {tools.length} tools
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {/* No results */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4" style={{ color: 'var(--text-muted)' }}>🔍</div>
          <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--foreground)' }}>No tools found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
}