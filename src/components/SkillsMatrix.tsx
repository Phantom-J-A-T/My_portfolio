import { usePortfolioTheme } from "./ThemeProvider";
import { DOMAINS, DomainType } from "../data";
import { Globe, Shield, BarChart3, ChevronRight, Binary, Fingerprint, LineChart } from "lucide-react";

export default function SkillsMatrix() {
  const { activeDomain, setActiveDomain, theme, accentClass, borderClass } = usePortfolioTheme();

  // Helper to map active domain to dedicated aesthetic icons
  const getDomainIcon = (id: DomainType) => {
    switch (id) {
      case "cyber":
        return <Shield className="w-5 h-5" />;
      case "data":
        return <BarChart3 className="w-5 h-5" />;
      case "web":
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  // Helper to draw modern high-contrast segmented status bars
  const renderStatusSegments = (level: number, id: DomainType) => {
    const segmentsCount = 10;
    const filledCount = Math.round((level / 100) * segmentsCount);
    
    return (
      <div className="flex items-center space-x-1 font-mono text-[10px] sm:text-xs">
        <div className="flex space-x-0.5">
          {Array.from({ length: segmentsCount }).map((_, idx) => {
            const isFilled = idx < filledCount;
            let barColor = "bg-blue-600";
            if (id === "cyber") {
              barColor = "bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.7)]";
            } else if (id === "data") {
              barColor = "bg-green-600";
            }

            return (
              <span
                key={idx}
                className={`w-3.5 h-2 rounded-sm transition-all duration-350 ${
                  isFilled
                    ? barColor
                    : theme === "dark"
                    ? "bg-red-950/20 border border-red-950/40"
                    : "bg-slate-100 border border-slate-200/50"
                }`}
              />
            );
          })}
        </div>
        <span className="ml-2.5 font-bold text-slate-400 font-mono text-[10px]">{level}%</span>
      </div>
    );
  };

  return (
    <section
      id="skills"
      className="py-24 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className={`font-mono text-xs sm:text-sm uppercase tracking-widest ${accentClass}`}>
            [ 02 // Capability Matrix ]
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mt-2 tracking-tight">
            The Multi-Theme Skills Hub
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-3 max-w-md mx-auto">
            Toggle below to completely morph the site's palette & highlight active skillsets.
          </p>
          <div className="h-1.5 w-24 rounded mx-auto mt-4 bg-gradient-to-r from-blue-605 via-red-500 to-green-600" />
        </div>

        {/* Central Master Switch Navigation List (High-Touch targets >= 44px) */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-3.5 mb-14 w-full max-w-4xl mx-auto">
          {DOMAINS.map((domain) => {
            const isSelected = activeDomain === domain.id;
            const DomainIcon = getDomainIcon(domain.id);
            
            // Custom highlight bounds matching design principles
            let activeStyles = "";
            let hoverStyles = "";

            if (domain.id === "cyber") {
              activeStyles = "bg-red-950/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.12)]";
              hoverStyles = "hover:border-red-500/40 hover:bg-slate-900/40";
            } else if (domain.id === "data") {
              activeStyles = "bg-green-50 border-green-600 text-green-700 shadow-sm";
              hoverStyles = "hover:border-green-400 hover:bg-green-50/20";
            } else {
              activeStyles = "bg-blue-50 border-blue-600 text-blue-700 shadow-sm";
              hoverStyles = "hover:border-blue-400 hover:bg-blue-50/20";
            }

            return (
              <button
                key={domain.id}
                onClick={() => setActiveDomain(domain.id)}
                className={`w-full md:w-1/3 flex items-center justify-between p-4 rounded-xl border-2 text-sm font-semibold transition-all duration-350 min-h-[48px] cursor-pointer text-left ${
                  isSelected
                    ? activeStyles
                    : theme === "dark"
                    ? "bg-slate-950/30 border-red-950/20 text-slate-400 " + hoverStyles
                    : "bg-white border-slate-200 text-slate-600 " + hoverStyles
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`p-1.5 rounded-lg border ${
                    isSelected
                      ? domain.id === "cyber" ? "border-red-500/20 text-red-500" : domain.id === "data" ? "border-green-600/20 text-green-600" : "border-blue-600/20 text-blue-600"
                      : "border-transparent"
                  }`}>
                    {DomainIcon}
                  </span>
                  <div>
                    <span className="font-display font-bold block leading-none">{domain.title}</span>
                    <span className="text-[9px] font-mono tracking-widest text-slate-400 mt-1 uppercase block">
                      {domain.mode === "dark" ? "Dark Mode Terminal" : "Light Mode Lab"}
                    </span>
                  </div>
                </div>
                {isSelected && <ChevronRight className="w-4 h-4" />}
              </button>
            );
          })}
        </div>

        {/* Selected Active Domain Skills Showcase */}
        {DOMAINS.map((domain) => {
          if (domain.id !== activeDomain) return null;
          return (
            <div
              key={domain.id}
              className={`rounded-2xl border p-6 sm:p-8 transition-all duration-500 relative ${
                theme === "dark"
                  ? "bg-slate-950/65 border-red-950/40 shadow-xl"
                  : "bg-white border-slate-200 shadow-md"
              }`}
            >
              {/* Layout Decorative Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-5 mb-8 border-slate-800/10 gap-4">
                <div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl">
                    Active Arsenal: {domain.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 uppercase mt-1 tracking-widest">
                    AESTHETIC STYLE: {domain.aesthetic}
                  </p>
                </div>
                
                <div className={`px-4 py-2 rounded-xl text-xs font-mono border font-bold ${
                  domain.id === "cyber"
                    ? "bg-red-950/20 border-red-950/60 text-red-500"
                    : domain.id === "data"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-blue-50 border-blue-200 text-blue-700"
                }`}>
                  [ MODE: {domain.mode.toUpperCase()} ]
                </div>
              </div>

              {/* Grid of skill stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {domain.skills.map((skill, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
                      theme === "dark"
                        ? "bg-slate-900/20 border-red-950/30 hover:border-red-500/30"
                        : "bg-slate-50 border-slate-100 hover:border-slate-350"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className={`h-2.5 w-1 rounded-full ${
                          domain.id === "cyber" ? "bg-red-500" : domain.id === "data" ? "bg-green-600" : "bg-blue-600"
                        }`} />
                        <span className={`text-xs sm:text-sm font-bold font-mono ${accentClass}`}>
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">CLASS-C{index + 1}</span>
                    </div>

                    {/* Progress render bar */}
                    {renderStatusSegments(skill.level, domain.id)}
                  </div>
                ))}
              </div>

              {/* Section Footer tagline */}
              <div className="mt-8 pt-5 border-t border-slate-800/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>SYSTEM INTEGRITY: 100% NOMINAL</span>
                <span>METRICS ACTIVE</span>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
