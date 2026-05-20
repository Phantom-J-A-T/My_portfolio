import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { DomainType } from "../data";

interface ThemeContextType {
  activeDomain: DomainType;
  setActiveDomain: (domain: DomainType) => void;
  theme: "dark" | "light";
  accentColor: string;
  glowClass: string;
  accentClass: string;
  bgClass: string;
  btnClass: string;
  borderClass: string;
  ringClass: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activeDomain, setActiveDomain] = useState<DomainType>(() => {
    if (typeof window !== "undefined") {
      const persisted = localStorage.getItem("phantom-portfolio-domain") as DomainType;
      if (persisted && ["web", "cyber", "data"].includes(persisted)) {
        return persisted;
      }
    }
    return "web"; // Default is Web Development (Light Mode)
  });

  // Calculate theme mode based on activeDomain
  // Cyber security is exclusively dark mode.
  // Web development and Data Analysis are light mode.
  const theme = activeDomain === "cyber" ? "dark" : "light";

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("phantom-portfolio-domain", activeDomain);
  }, [activeDomain, theme]);

  // Design tokens parameterized at runtime
  const designDetails = (() => {
    switch (activeDomain) {
      case "cyber":
        return {
          theme: "dark" as const,
          accentColor: "#DC2626", // Blood Red
          glowClass: "shadow-[0_0_25px_rgba(220,38,38,0.25)] border-red-500/30",
          accentClass: "text-red-500",
          bgClass: "bg-cyber-midnight text-slate-100",
          btnClass: "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] focus:ring-red-500",
          borderClass: "border-red-950/40",
          ringClass: "focus:ring-red-500 focus:border-red-500"
        };
      case "data":
        return {
          theme: "light" as const,
          accentColor: "#16A34A", // Premium green
          glowClass: "shadow-[0_0_20px_rgba(22,163,74,0.12)] border-green-500/25",
          accentClass: "text-green-600",
          bgClass: "bg-slate-50 text-slate-800",
          btnClass: "bg-green-600 hover:bg-green-500 text-white shadow-[0_4px_12px_rgba(22,163,74,0.22)] hover:shadow-[0_0_20px_rgba(22,163,74,0.42)] focus:ring-green-500",
          borderClass: "border-green-200",
          ringClass: "focus:ring-green-500 focus:border-green-500"
        };
      case "web":
      default:
        return {
          theme: "light" as const,
          accentColor: "#2563EB", // Electric Blue
          glowClass: "shadow-[0_0_20px_rgba(37,99,235,0.12)] border-blue-500/20",
          accentClass: "text-blue-600",
          bgClass: "bg-white text-slate-800",
          btnClass: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_12px_rgba(37,99,235,0.22)] hover:shadow-[0_0_20px_rgba(37,99,235,0.42)] focus:ring-blue-500",
          borderClass: "border-blue-100",
          ringClass: "focus:ring-blue-500 focus:border-blue-500"
        };
    }
  })();

  const contextValue = {
    activeDomain,
    setActiveDomain,
    ...designDetails
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function usePortfolioTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("usePortfolioTheme must be used within a ThemeProvider");
  }
  return context;
}
