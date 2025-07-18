'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ColorPicker() {
  const [color, setColor] = useState('#3b82f6');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const presetColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#6b7280',
    '#374151', '#1f2937', '#111827', '#000000', '#ffffff', '#f3f4f6'
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          Color Picker
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Pick colors and get hex, RGB, HSL values
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Picker */}
        <div 
          className="rounded-lg shadow-lg p-6 border"
          style={{ 
            backgroundColor: 'var(--card-background)', 
            borderColor: 'var(--border-color)'
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Pick a Color</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Color Picker
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-20 rounded-lg border-2 cursor-pointer"
                style={{ borderColor: 'var(--border-color)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Hex Value
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--foreground)'
                }}
                placeholder="#000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Color Preview
              </label>
              <div
                className="w-full h-20 rounded-lg border-2"
                style={{ backgroundColor: color, borderColor: 'var(--border-color)' }}
              />
            </div>
          </div>
        </div>

        {/* Color Values */}
        <div 
          className="rounded-lg shadow-lg p-6 border"
          style={{ 
            backgroundColor: 'var(--card-background)', 
            borderColor: 'var(--border-color)'
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Color Values</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>HEX</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={color.toUpperCase()}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--card-background)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--foreground)'
                  }}
                />
                <button
                  onClick={() => copyToClipboard(color.toUpperCase())}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>RGB</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--card-background)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--foreground)'
                  }}
                />
                <button
                  onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>HSL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--card-background)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--foreground)'
                  }}
                />
                <button
                  onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>R</label>
                <input
                  type="text"
                  value={rgb.r}
                  readOnly
                  className="w-full px-2 py-1 border rounded text-center"
                  style={{ 
                    backgroundColor: 'var(--card-background)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>G</label>
                <input
                  type="text"
                  value={rgb.g}
                  readOnly
                  className="w-full px-2 py-1 border rounded text-center"
                  style={{ 
                    backgroundColor: 'var(--card-background)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>B</label>
                <input
                  type="text"
                  value={rgb.b}
                  readOnly
                  className="w-full px-2 py-1 border rounded text-center"
                  style={{ 
                    backgroundColor: 'var(--card-background)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Colors */}
      <div 
        className="mt-6 rounded-lg shadow-lg p-6 border"
        style={{ 
          backgroundColor: 'var(--card-background)', 
          borderColor: 'var(--border-color)'
        }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Preset Colors</h2>
        <div className="grid grid-cols-12 gap-2">
          {presetColors.map((presetColor, index) => (
            <button
              key={index}
              onClick={() => setColor(presetColor)}
              className="w-full h-12 rounded-lg border-2 hover:border-blue-400 transition-colors"
              style={{ backgroundColor: presetColor, borderColor: 'var(--border-color)' }}
              title={presetColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}