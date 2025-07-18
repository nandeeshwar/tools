import { Tool } from '@/types/tool';
import Link from 'next/link';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.path} className="block">
      <div 
        className="rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border hover:border-red-500"
        style={{ 
          backgroundColor: 'var(--card-background)', 
          borderColor: 'var(--border-color)',
          color: 'var(--foreground)'
        }}
      >
        <div className="flex items-start space-x-4">
          <div className="text-3xl">{tool.icon}</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              {tool.name}
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
              {tool.description}
            </p>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: 'var(--border-color)', 
                color: 'var(--text-muted)' 
              }}
            >
              {tool.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}