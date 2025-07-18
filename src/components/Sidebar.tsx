'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { tools, categories } from '@/lib/tools';
import { useSearch } from './SearchProvider';
import ToolIcon from './ToolIcon';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { searchTerm } = useSearch();

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Group tools by category
  const toolsByCategory = categories.reduce((acc, category) => {
    if (category.id !== 'all') {
      acc[category.id] = filteredTools.filter(tool => tool.category === category.id);
    }
    return acc;
  }, {} as Record<string, typeof tools>);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg md:hidden"
        style={{ 
          backgroundColor: 'var(--card-background)', 
          color: 'var(--foreground)',
          border: '1px solid var(--border-color)'
        }}
      >
        ☰
      </button>

      <aside 
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] border-r transition-all duration-300 z-50 flex flex-col ${
          isCollapsed ? 'w-12' : 'w-80'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        style={{ 
          backgroundColor: 'var(--card-background)', 
          borderColor: 'var(--border-color)'
        }}
      >
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full border flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
          style={{ 
            backgroundColor: 'var(--card-background)', 
            borderColor: 'var(--border-color)',
            color: 'var(--text-muted)'
          }}
        >
          {isCollapsed ? '→' : '←'}
        </button>

      {!isCollapsed && (
        <>
          {/* Tools List organized by category */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {Object.entries(toolsByCategory).map(([categoryId, categoryTools]) => {
                const category = categories.find(cat => cat.id === categoryId);
                if (!category || categoryTools.length === 0) return null;
                
                return (
                  <div key={categoryId} className="mb-6">
                    <h3 className="text-sm font-semibold mb-3 px-2" style={{ color: 'var(--foreground)' }}>
                      {category.name.toUpperCase()}
                    </h3>
                    <div className="space-y-2">
                      {categoryTools.map(tool => (
                        <Link
                          key={tool.id}
                          href={tool.path}
                          className={`block px-3 py-2 rounded-lg transition-colors ${
                            pathname === tool.path
                              ? 'text-blue-600 bg-blue-50'
                              : 'hover:text-blue-600 hover:bg-gray-50'
                          }`}
                          style={pathname === tool.path ? {} : { 
                            color: 'var(--text-muted)'
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <ToolIcon icon={tool.icon} size={18} className="flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {tool.name}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* No results */}
              {filteredTools.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2" style={{ color: 'var(--text-muted)' }}>🔍</div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    No tools found
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
    </>
  );
}