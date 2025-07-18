import { Tool } from '@/types/tool';

export const tools: Tool[] = [
  {
    id: 'text-counter',
    name: 'Text Counter',
    description: 'Count characters, words, and lines in text',
    category: 'text',
    icon: 'text-counter',
    path: '/tools/text-counter'
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Pick colors and get hex, RGB, HSL values',
    category: 'color',
    icon: 'color-picker',
    path: '/tools/color-picker'
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    category: 'converter',
    icon: 'converter',
    path: '/tools/base64'
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUIDs',
    category: 'utility',
    icon: 'uuid',
    path: '/tools/uuid'
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and validate JSON data',
    category: 'utility',
    icon: 'json',
    path: '/tools/json-formatter'
  },
  {
    id: 'apr-calculator',
    name: 'APR Calculator',
    description: 'Calculate Annual Percentage Rate for loans and investments',
    category: 'math',
    icon: 'calculator',
    path: '/tools/apr-calculator'
  },
  {
    id: 'fixed-fee-calculator',
    name: 'Fixed Fee Calculator',
    description: 'Calculate fixed fees, commissions, and service charges',
    category: 'math',
    icon: 'calculator',
    path: '/tools/fixed-fee-calculator'
  }
];

export const categories = [
  { id: 'all', name: 'All', count: tools.length },
  { id: 'math', name: 'Math', count: tools.filter(t => t.category === 'math').length },
  { id: 'text', name: 'Text', count: tools.filter(t => t.category === 'text').length },
  { id: 'color', name: 'Color', count: tools.filter(t => t.category === 'color').length },
  { id: 'converter', name: 'Converter', count: tools.filter(t => t.category === 'converter').length },
  { id: 'utility', name: 'Utility', count: tools.filter(t => t.category === 'utility').length }
];