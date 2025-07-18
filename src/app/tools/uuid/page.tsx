'use client';

import { useState } from 'react';

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState<'v4' | 'v1'>('v4');

  // Simple UUID v4 generator
  const generateUUIDv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Simple UUID v1 generator (timestamp-based)
  const generateUUIDv1 = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(16).substring(2, 8);
    const clockSeq = Math.random().toString(16).substring(2, 6);
    const node = Math.random().toString(16).substring(2, 14);
    
    const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, '0');
    const timeMid = ((timestamp >>> 32) & 0xffff).toString(16).padStart(4, '0');
    const timeHigh = (((timestamp >>> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0');
    
    return `${timeLow}-${timeMid}-${timeHigh}-${clockSeq}-${node}`;
  };

  const generateUUIDs = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      if (version === 'v4') {
        newUuids.push(generateUUIDv4());
      } else {
        newUuids.push(generateUUIDv1());
      }
    }
    setUuids(newUuids);
  };

  const copyUUID = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
  };

  const copyAllUUIDs = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
  };

  const clearUUIDs = () => {
    setUuids([]);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          UUID Generator
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Generate unique identifiers (UUIDs) for your applications
        </p>
      </div>

      <div className="space-y-6">
        {/* Generation Options */}
        <div 
          className="rounded-lg shadow-lg p-6 border"
          style={{ 
            backgroundColor: 'var(--card-background)', 
            borderColor: 'var(--border-color)'
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Generation Options
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                UUID Version
              </label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value as 'v4' | 'v1')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--foreground)'
                }}
              >
                <option value="v4">UUID v4 (Random)</option>
                <option value="v1">UUID v1 (Timestamp)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Count
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
            
            <div>
              <button
                onClick={generateUUIDs}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Generate UUIDs
              </button>
            </div>
          </div>
        </div>

        {/* Generated UUIDs */}
        {uuids.length > 0 && (
          <div 
            className="rounded-lg shadow-lg p-6 border"
            style={{ 
              backgroundColor: 'var(--card-background)', 
              borderColor: 'var(--border-color)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                Generated UUIDs ({uuids.length})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyAllUUIDs}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Copy All
                </button>
                <button
                  onClick={clearUUIDs}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-muted)'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {uuids.map((uuid, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'var(--background)'
                  }}
                >
                  <code className="font-mono text-sm flex-1" style={{ color: 'var(--foreground)' }}>
                    {uuid}
                  </code>
                  <button
                    onClick={() => copyUUID(uuid)}
                    className="ml-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UUID Information */}
        <div 
          className="rounded-lg shadow-lg p-6 border"
          style={{ 
            backgroundColor: 'var(--card-background)', 
            borderColor: 'var(--border-color)'
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            About UUIDs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2" style={{ color: 'var(--foreground)' }}>UUID v4 (Random)</h3>
              <ul className="text-sm space-y-1" style={{ color: 'var(--text-muted)' }}>
                <li>• Generated using random numbers</li>
                <li>• 122 bits of entropy</li>
                <li>• Most commonly used version</li>
                <li>• Extremely low collision probability</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2" style={{ color: 'var(--foreground)' }}>UUID v1 (Timestamp)</h3>
              <ul className="text-sm space-y-1" style={{ color: 'var(--text-muted)' }}>
                <li>• Based on timestamp and MAC address</li>
                <li>• Can be used to extract creation time</li>
                <li>• Sequential ordering</li>
                <li>• May reveal system information</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Format:</strong> UUIDs follow the pattern: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-4-12 hexadecimal digits)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}