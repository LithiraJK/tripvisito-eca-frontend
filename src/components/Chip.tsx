import { cn } from "../lib/utils";

type ChipVariant = "primary" | "purple" | "success" | "warning" | "danger" | "pink" | "default";

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  className?: string;    
}

const Chip = ({ label, variant = "default", className }: ChipProps) => {
  
  const variants = {
    primary: "bg-blue-100 text-blue-700 border-blue-200",  
    success: "bg-green-100 text-green-700 border-green-200",
    purple:  "bg-purple-100 text-purple-700 border-purple-200",
    warning: "bg-orange-100 text-orange-700 border-orange-200",
    danger:  "bg-red-100 text-red-700 border-red-200",
    pink:    "bg-pink-100 text-pink-700 border-pink-200",
    default: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
        variants[variant],
        className
      )}
    >
      {label}
    </span>
  );
};

export default Chip;