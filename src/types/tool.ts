export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'math' | 'text' | 'color' | 'converter' | 'utility';
  icon: string;
  path: string;
}

export interface ToolCardProps {
  tool: Tool;
  onClick: (tool: Tool) => void;
}