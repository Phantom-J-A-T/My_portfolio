import { usePortfolioTheme } from "./ThemeProvider";
import { Terminal, Shield, ShieldCheck } from "lucide-react";

export default function Footer() {
  const { theme, activeDomain, accentClass } = usePortfolioTheme();
  
  return (
    <footer
      id="footer"
      className={`py-12 border-t transition-colors duration-500 ${
        theme === "dark" 
          ? "bg-slate-950 border-red-950/30 text-slate-400" 
          : "bg-white border-slate-100 text-slate-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-2.5">
          <Terminal className={`w-4 h-4 ${accentClass}`} />
          <span className="font-mono text-xs font-semibold tracking-wider uppercase">
            {activeDomain === "cyber" 
              ? "PHANTOM.SECURE // ALL PORTS SECURITY HARDENED" 
              : activeDomain === "data" 
              ? "PHANTOM.ANALYTICS // ALL RECORDS AUDITED" 
              : "PHANTOM.DEV // VITE + REACT FRAMEWORKS NOMINAL"}
          </span>
        </div>
        
        {/* Visual Indicator of System Integrity */}
        <div className="flex items-center space-x-2 text-[10px] font-mono">
          {theme === "dark" ? (
            <>
              <Shield className="w-4 h-4 text-red-500" />
              <span className="text-slate-400">CIPHER METRICS: AES-GCM-256</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-slate-500">INTEGRITY COMPLIANCE: 100%</span>
            </>
          )}
        </div>

        <div className="text-[10px] font-mono">
          &copy; {new Date().getFullYear()} Phantom. Engineered in secure runtime.
        </div>
      </div>
    </footer>
  );
}
