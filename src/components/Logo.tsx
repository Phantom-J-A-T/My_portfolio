import { usePortfolioTheme } from "./ThemeProvider";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 48 }: LogoProps) {
  const { activeDomain } = usePortfolioTheme();

  // Morphing colors and glow variables depending on active skillset
  const getLogoColors = () => {
    switch (activeDomain) {
      case "cyber":
        return {
          primary: "#EF4444", // Neon Blood Red
          dark: "#7F1D1D",
          highlight: "#FCA5A5",
          glowingFilter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))"
        };
      case "data":
        return {
          primary: "#22C55E", // Crisp Data Green
          dark: "#14532D",
          highlight: "#86EFAC",
          glowingFilter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))"
        };
      case "web":
      default:
        return {
          primary: "#3B82F6", // Electric Blue
          dark: "#1E3A8A",
          highlight: "#93C5FD",
          glowingFilter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
        };
    }
  };

  const colors = getLogoColors();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`transition-all duration-500 ${className}`}
      style={{ filter: colors.glowingFilter }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Definable masks and gradients */}
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.dark} />
        </linearGradient>
        <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={colors.dark} />
          <stop offset="50%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.highlight} />
        </linearGradient>
      </defs>

      {/* Main Outer Fiery Shield Background */}
      <path
        d="M 100,10 L 175,45 C 175,115 140,165 100,190 C 60,165 25,115 25,45 Z"
        fill="none"
        stroke="url(#shieldGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Internal Shield Double Border */}
      <path
        d="M 100,22 L 163,50 C 163,108 134,151 100,172 C 66,151 37,108 37,50 Z"
        fill="#04060E"
        stroke={colors.primary}
        strokeOpacity="0.3"
        strokeWidth="3"
      />

      {/* Flame Ornaments and Hood Silhouette */}
      {/* Outer Cloaked Hood Vector */}
      <path
        d="M 100,45 
           C 130,55 145,85 140,115 
           C 138,125 125,140 100,150 
           C 75,140 62,125 60,115 
           C 55,85 70,55 100,45 Z"
         fill="url(#flameGrad)"
         opacity="0.9"
      />

      {/* Internal dark space within the Hood */}
      <path
        d="M 100,58 
           C 118,66 128,88 124,110 
           C 120,120 110,132 100,138 
           C 90,138 80,120 76,110 
           C 72,88 82,66 100,58 Z"
         fill="#04060E"
      />

      {/* Glowing Phantom Eyes (Vicious Triangular Accents) */}
      <polygon
        points="83,92 97,94 88,101"
        fill={colors.primary}
      />
      <polygon
        points="117,92 103,94 112,101"
        fill={colors.primary}
      />

      {/* Subtitle Tech-Line Decorators inside logo */}
      <circle cx="100" cy="172" r="4" fill={colors.highlight} />
      <path d="M 80,172 L 92,172" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
      <path d="M 120,172 L 108,172" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
