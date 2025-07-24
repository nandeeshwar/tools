'use client';

import { useState } from 'react';

export default function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  const formatJSON = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
    } catch (err) {
      setError('Invalid JSON: Please check your input for syntax errors.');
      setOutput('');
    }
  };

  const minifyJSON = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (err) {
      setError('Invalid JSON: Please check your input for syntax errors.');
      setOutput('');
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(input);
      setError('');
      return true;
    } catch (err) {
      setError('Invalid JSON: Please check your input for syntax errors.');
      return false;
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const handleLoadSample = () => {
    const sampleJSON = {
      "name": "John Doe",
      "age": 30,
      "city": "New York",
      "hobbies": ["reading", "swimming", "coding"],
      "address": {
        "street": "123 Main St",
        "zipcode": "10001",
        "country": "USA"
      },
      "active": true,
      "metadata": null
    };
    setInput(JSON.stringify(sampleJSON));
    setError('');
  };

  const getJSONStats = () => {
    if (!input) return null;
    
    try {
      const parsed = JSON.parse(input);
      const stats = {
        characters: input.length,
        size: new Blob([input]).size,
        keys: 0,
        values: 0,
        objects: 0,
        arrays: 0
      };

      const countElements = (obj: unknown) => {
        if (Array.isArray(obj)) {
          stats.arrays++;
          obj.forEach(item => countElements(item));
        } else if (obj && typeof obj === 'object') {
          stats.objects++;
          Object.keys(obj).forEach(key => {
            stats.keys++;
            stats.values++;
            countElements((obj as Record<string, unknown>)[key]);
          });
        } else {
          stats.values++;
        }
      };

      countElements(parsed);
      return stats;
    } catch {
      return null;
    }
  };

  const stats = getJSONStats();

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          JSON Formatter
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Format, validate, and minify JSON data with syntax highlighting
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            className="rounded-lg shadow-lg p-6 border"
            style={{ 
              backgroundColor: 'var(--card-background)', 
              borderColor: 'var(--border-color)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                JSON Input
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleLoadSample}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                >
                  Load Sample
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 py-1 rounded border hover:bg-gray-50 transition-colors text-sm"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-muted)'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
              className="w-full h-80 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              style={{ 
                backgroundColor: 'var(--background)', 
                borderColor: 'var(--border-color)',
                color: 'var(--foreground)'
              }}
            />
          </div>

          {/* Controls */}
          <div 
            className="rounded-lg shadow-lg p-6 border"
            style={{ 
              backgroundColor: 'var(--card-background)', 
              borderColor: 'var(--border-color)'
            }}
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  Indent Size:
                </label>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(parseInt(e.target.value))}
                  className="px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--foreground)'
                  }}
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={8}>8 spaces</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={formatJSON}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  disabled={!input.trim()}
                >
                  Format
                </button>
                <button
                  onClick={minifyJSON}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  disabled={!input.trim()}
                >
                  Minify
                </button>
                <button
                  onClick={validateJSON}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  disabled={!input.trim()}
                >
                  Validate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          {stats && (
            <div 
              className="rounded-lg shadow-lg p-6 border"
              style={{ 
                backgroundColor: 'var(--card-background)', 
                borderColor: 'var(--border-color)'
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Statistics
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Characters:</span>
                  <span style={{ color: 'var(--foreground)' }}>{stats.characters.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Size:</span>
                  <span style={{ color: 'var(--foreground)' }}>{stats.size} bytes</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Objects:</span>
                  <span style={{ color: 'var(--foreground)' }}>{stats.objects}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Arrays:</span>
                  <span style={{ color: 'var(--foreground)' }}>{stats.arrays}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Keys:</span>
                  <span style={{ color: 'var(--foreground)' }}>{stats.keys}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Values:</span>
                  <span style={{ color: 'var(--foreground)' }}>{stats.values}</span>
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div 
            className="rounded-lg shadow-lg p-6 border"
            style={{ 
              backgroundColor: 'var(--card-background)', 
              borderColor: 'var(--border-color)'
            }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              Status
            </h2>
            {error ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            ) : input ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">✓ Valid JSON</p>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-600 text-sm">Enter JSON to validate</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Output Section */}
      {output && (
        <div className="mt-6">
          <div 
            className="rounded-lg shadow-lg p-6 border"
            style={{ 
              backgroundColor: 'var(--card-background)', 
              borderColor: 'var(--border-color)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                Formatted Output
              </h2>
              <button
                onClick={handleCopyOutput}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Copy Output
              </button>
            </div>
            
            <textarea
              value={output}
              readOnly
              className="w-full h-80 p-4 border rounded-lg resize-none font-mono text-sm"
              style={{ 
                backgroundColor: 'var(--background)', 
                borderColor: 'var(--border-color)',
                color: 'var(--foreground)'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}