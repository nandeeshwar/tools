'use client';

import { useState } from 'react';

export default function Base64Encoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const handleEncode = () => {
    try {
      setError('');
      const encoded = btoa(input);
      setOutput(encoded);
    } catch (err) {
      setError('Failed to encode. Please check your input.');
      setOutput('');
    }
  };

  const handleDecode = () => {
    try {
      setError('');
      const decoded = atob(input);
      setOutput(decoded);
    } catch (err) {
      setError('Failed to decode. Please check your Base64 input.');
      setOutput('');
    }
  };

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError('');
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
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

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          Base64 Encoder/Decoder
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Encode and decode Base64 strings for data transmission and storage
        </p>
      </div>

      <div className="space-y-6">
        {/* Mode Selection */}
        <div 
          className="rounded-lg shadow-lg p-6 border"
          style={{ 
            backgroundColor: 'var(--card-background)', 
            borderColor: 'var(--border-color)'
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Mode</h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleModeChange('encode')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'encode'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => handleModeChange('decode')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'decode'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Decode
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div 
          className="rounded-lg shadow-lg p-6 border"
          style={{ 
            backgroundColor: 'var(--card-background)', 
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleProcess}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={!input.trim()}
              >
                {mode === 'encode' ? 'Encode' : 'Decode'}
              </button>
              <button
                onClick={handleClear}
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
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
            className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            style={{ 
              backgroundColor: 'var(--background)', 
              borderColor: 'var(--border-color)',
              color: 'var(--foreground)'
            }}
          />
        </div>

        {/* Output Section */}
        <div 
          className="rounded-lg shadow-lg p-6 border"
          style={{ 
            backgroundColor: 'var(--card-background)', 
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              {mode === 'encode' ? 'Encoded Base64' : 'Decoded Text'}
            </h2>
            {output && (
              <button
                onClick={handleCopyOutput}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Copy Result
              </button>
            )}
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <textarea
            value={output}
            readOnly
            placeholder={`${mode === 'encode' ? 'Encoded' : 'Decoded'} result will appear here...`}
            className="w-full h-32 p-4 border rounded-lg resize-none"
            style={{ 
              backgroundColor: 'var(--background)', 
              borderColor: 'var(--border-color)',
              color: 'var(--foreground)'
            }}
          />
        </div>

        {/* Info Section */}
        <div 
          className="rounded-lg shadow-lg p-6 border"
          style={{ 
            backgroundColor: 'var(--card-background)', 
            borderColor: 'var(--border-color)'
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            About Base64
          </h2>
          <div className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            <p>
              <strong style={{ color: 'var(--foreground)' }}>Base64 Encoding:</strong> Converts binary data into text format using 64 characters (A-Z, a-z, 0-9, +, /).
            </p>
            <p>
              <strong style={{ color: 'var(--foreground)' }}>Common Uses:</strong> Email attachments, embedding images in HTML/CSS, API data transmission, storing binary data in text-based formats.
            </p>
            <p>
              <strong style={{ color: 'var(--foreground)' }}>Note:</strong> Base64 encoding increases data size by approximately 33% but ensures safe transmission through text-based protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}