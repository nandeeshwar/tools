export default function Home() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
          Welcome to Mini Tools
        </h1>
        <p className="text-lg mb-6" style={{ color: 'var(--text-muted)' }}>
          A collection of useful mini tools designed to make your daily tasks easier and more efficient.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="p-6 rounded-lg border"
          style={{ 
            backgroundColor: 'var(--card-background)', 
            borderColor: 'var(--border-color)'
          }}
        >
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
            🚀 Getting Started
          </h2>
          <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
            Browse through our collection of tools in the sidebar. Each tool is designed to solve specific tasks quickly and efficiently.
          </p>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li>• Use the search bar to find specific tools</li>
            <li>• Filter by category to narrow down options</li>
            <li>• Click on any tool to start using it</li>
          </ul>
        </div>

        <div 
          className="p-6 rounded-lg border"
          style={{ 
            backgroundColor: 'var(--card-background)', 
            borderColor: 'var(--border-color)'
          }}
        >
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
            📊 Available Categories
          </h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🧮</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Math - Calculators and number tools</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">📝</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Text - Text manipulation utilities</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎨</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Color - Color picking and conversion</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔄</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Converter - Data format converters</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🛠️</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Utility - General purpose tools</span>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="mt-8 p-6 rounded-lg border"
        style={{ 
          backgroundColor: 'var(--card-background)', 
          borderColor: 'var(--border-color)'
        }}
      >
        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
          💡 Pro Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          <div>
            <strong style={{ color: 'var(--foreground)' }}>Keyboard Shortcuts:</strong><br />
            Use Ctrl+K (or Cmd+K) to quickly focus the search bar
          </div>
          <div>
            <strong style={{ color: 'var(--foreground)' }}>Bookmarks:</strong><br />
            Bookmark frequently used tools for quick access
          </div>
          <div>
            <strong style={{ color: 'var(--foreground)' }}>Mobile Friendly:</strong><br />
            All tools work perfectly on mobile devices
          </div>
        </div>
      </div>
    </div>
  );
}
