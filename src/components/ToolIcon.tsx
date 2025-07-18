import { CalculatorIcon, TextCounterIcon, ColorPickerIcon, ConverterIcon, UUIDIcon, JSONIcon } from './Icons';

interface ToolIconProps {
  icon: string;
  className?: string;
  size?: number;
}

export default function ToolIcon({ icon, className = "", size = 20 }: ToolIconProps) {
  const iconMap = {
    'calculator': CalculatorIcon,
    'text-counter': TextCounterIcon,
    'color-picker': ColorPickerIcon,
    'converter': ConverterIcon,
    'uuid': UUIDIcon,
    'json': JSONIcon,
  };

  const IconComponent = iconMap[icon as keyof typeof iconMap];
  
  if (!IconComponent) {
    return <div className={`w-${size/4} h-${size/4}`} />;
  }

  return <IconComponent className={className} size={size} />;
}