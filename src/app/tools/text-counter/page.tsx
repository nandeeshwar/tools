'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TextCounter() {
  const [text, setText] = useState('');

  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text.split('\n').length,
    paragraphs: text.trim() ? text.split(/\n\s*\n/).length : 0,
    sentences: text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0
  };

  const handleClear = () => {
    setText('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          Text Counter
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Count characters, words, lines, and analyze your text
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Input */}
        <div className="lg:col-span-2">
          <div 
            className="rounded-lg shadow-lg p-6 border"
            style={{ 
              backgroundColor: 'var(--card-background)', 
              borderColor: 'var(--border-color)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Enter Your Text</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  disabled={!text}
                >
                  Copy
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 py-1 text-sm rounded hover:bg-red-500 hover:text-white transition-colors"
                  style={{ 
                    backgroundColor: 'var(--background)', 
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-color)'
                  }}
                  disabled={!text}
                >
                  Clear
                </button>
              </div>
            </div>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full h-96 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ 
                backgroundColor: 'var(--background)', 
                borderColor: 'var(--border-color)',
                color: 'var(--foreground)'
              }}
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <div 
            className="rounded-lg shadow-lg p-6 border"
            style={{ 
              backgroundColor: 'var(--card-background)', 
              borderColor: 'var(--border-color)'
            }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Statistics</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Characters:</span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{stats.characters.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Characters (no spaces):</span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{stats.charactersNoSpaces.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Words:</span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{stats.words.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Lines:</span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{stats.lines.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Paragraphs:</span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{stats.paragraphs.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span style={{ color: 'var(--text-muted)' }}>Sentences:</span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{stats.sentences.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Reading Time Estimate */}
          <div 
            className="rounded-lg shadow-lg p-6 border"
            style={{ 
              backgroundColor: 'var(--card-background)', 
              borderColor: 'var(--border-color)'
            }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Reading Time</h2>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {Math.ceil(stats.words / 200)} min
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Based on 200 words per minute
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}