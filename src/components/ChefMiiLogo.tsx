import { Link } from "react-router-dom";

interface ChefMiiLogoProps {
  className?: string;
}

const ChefMiiLogo = ({ className = "" }: ChefMiiLogoProps) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <span className="text-2xl font-bold bg-gradient-to-r from-terracotta via-terracotta-dark to-terracotta bg-clip-text text-transparent hover:opacity-80 transition-opacity">
        ChefMii
      </span>
    </Link>
  );
};

export default ChefMiiLogo;
