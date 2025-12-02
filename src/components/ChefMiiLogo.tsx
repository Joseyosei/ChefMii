import { Link } from "react-router-dom";
import chefMiiIcon from "@/assets/chefmii-icon.png";

interface ChefMiiLogoProps {
  className?: string;
  showIcon?: boolean;
  iconSize?: "sm" | "md" | "lg";
}

const ChefMiiLogo = ({ className = "", showIcon = true, iconSize = "md" }: ChefMiiLogoProps) => {
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  };

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <img 
          src={chefMiiIcon} 
          alt="ChefMii Icon" 
          className={`${iconSizes[iconSize]} object-contain`}
        />
      )}
      <span className="text-2xl font-bold bg-gradient-to-r from-terracotta via-terracotta-dark to-terracotta bg-clip-text text-transparent hover:opacity-80 transition-opacity">
        ChefMii
      </span>
    </Link>
  );
};

export default ChefMiiLogo;
