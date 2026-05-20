import { useEffect, useState } from "react";
import { usePortfolioTheme } from "./ThemeProvider";
import Logo from "./Logo";
import { Terminal, Shield, ArrowRight, User, Cpu, Database, Network, Percent, Sliders } from "lucide-react";

export default function Hero() {
  const { activeDomain, theme, accentColor, glowClass, accentClass, bgClass, btnClass } = usePortfolioTheme();
  
  // Custom diagnostic counts that vary based on active theme choice
  const getDiagnosticStats = () => {
    switch (activeDomain) {
      case "cyber":
        return [
          { label: "Port Audits", val: "482 ports scanned" },
          { label: "Kali System Kern", labelAccent: "v6.6.9" },
          { label: "Burp Intercept Mode", val: "Armed / Secure" }
        ];
      case "data":
        return [
          { label: "Engines Tracked", val: "MySQL / CSV logs" },
          { label: "Data Quality Score", labelAccent: "99.85%" },
          { label: "Visualization Tech", val: "PowerBI Engine" }
        ];
      case "web":
      default:
        return [
          { label: "Static Render", val: "Next.js 14+ / SEO" },
          { label: "API Handshake speed", labelAccent: "0.1s" },
          { label: "CSS Layout", val: "Dynamic Tailwind" }
        ];
    }
  };

  const currentStats = getDiagnosticStats();

  return (
    <section
      id="hero"
      className={`min-h-screen relative flex items-center justify-center overflow-hidden pt-24 sm:pt-28 pb-16 ${
        theme === "dark" 
          ? "cyber-grid bg-cyber-midnight" 
          : "cyber-grid bg-slate-50/50"
      } transition-colors duration-500`}
    >
      {/* Decorative Blur Spheres - morph colors based on active domain */}
      <div
        className="absolute top-1/4 left-1/4 w-80 h-80 sm:w-96 sm:h-96 rounded-full mix-blend-screen filter blur-[120px] opacity-10 transition-all duration-1000"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 sm:w-80 sm:h-80 rounded-full mix-blend-screen filter blur-[100px] opacity-10 transition-all duration-1000"
        style={{ backgroundColor: activeDomain === "cyber" ? "#7F1D1D" : activeDomain === "data" ? "#22C55E" : "#93C5FD" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Narrative intro */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-center lg:text-left order-2 lg:order-1">
            
            {/* Tag indicator */}
            <div className="inline-flex items-center justify-center lg:justify-start space-x-2.5">
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide border uppercase transition-colors duration-500 ${
                  activeDomain === "cyber"
                    ? "bg-red-950/20 border-red-800/40 text-red-500"
                    : activeDomain === "data"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-blue-50 border-blue-200 text-blue-700"
                }`}
              >
                🛰️ ACTIVE CORE: {activeDomain === "cyber" ? "Cyber Security" : activeDomain === "data" ? "Precision Analytics" : "Web Development"}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Prompt style title */}
            <p className="font-mono text-xs sm:text-sm text-slate-400 leading-relaxed mx-auto lg:mx-0 max-w-lg">
              {activeDomain === "cyber" ? (
                <span className="text-red-500/80">root@phantom-kali:~#</span>
              ) : activeDomain === "data" ? (
                <span className="text-green-600/80">analyst@analytics-engine:~#</span>
              ) : (
                <span className="text-blue-600/80">developer@react-workplace:~#</span>
              )}{" "}
              whoami --profile-report
            </p>

            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
              I am{" "}
              <span className={`transition-colors duration-500 ${accentClass}`}>
                Phantom
              </span>
            </h1>

            {/* Core Roles Subtitle block - dynamically reflecting domain selection */}
            <div className="py-1">
              <p className="font-mono text-xl sm:text-2xl font-semibold tracking-tight">
                {activeDomain === "web" && (
                  <span className="text-blue-600 dark:text-blue-400">Full-Stack Web Developer</span>
                )}
                {activeDomain === "cyber" && (
                  <span className="text-red-500 cyber-glow-text">Cyber Security Enthusiast</span>
                )}
                {activeDomain === "data" && (
                  <span className="text-green-650 text-green-600">Precision Data Analyst</span>
                )}
              </p>
            </div>

            <p className={`text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 ${
              theme === "dark" ? "text-slate-300" : "text-slate-600"
            }`}>
              {activeDomain === "web" && (
                "Building enterprise-grade web and mobile portals with clean architectural state management. Specialize in Next.js Server Components, secured Django REST endpoints, and lightning-fast database indices."
              )}
              {activeDomain === "cyber" && (
                "Auditing live systems, mapping configurations with Nmap, scanning applications using Burp Suite, and constructing defensive firewalls. Passionate about system sandboxing and zero-trust engineering."
              )}
              {activeDomain === "data" && (
                "Transforming dirty relational databases and raw datasets into high-fidelity dashboards. Leveraging heavy MySQL pipelines and PowerBI engines to map business performance anomalies."
              )}
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <a
                id="cta-work"
                href="#projects"
                className={`flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all cursor-pointer ${btnClass}`}
              >
                <span>View My Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                id="cta-contact"
                href="#contact"
                className={`flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-semibold text-sm border transition-all ${
                  theme === "dark"
                    ? "bg-slate-900/50 border-slate-800 hover:border-red-500 hover:text-red-400 text-slate-300"
                    : "bg-white border-slate-200 hover:border-slate-400 hover:text-slate-900 text-slate-700 shadow-sm"
                }`}
              >
                <span>Connect with Endpoint</span>
              </a>
            </div>
          </div>

          {/* Right Column: Prominent, well-framed Profile Picture Frame with overlay */}
          <div className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2">
            <div className="relative group">
              {/* Outer double glowing boundary lines */}
              <div
                className={`absolute -inset-2 rounded-2xl opacity-70 blur-lg transition duration-1000 group-hover:opacity-100 animate-pulse`}
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${activeDomain === "cyber" ? "#F43F5E" : activeDomain === "data" ? "#4ADE80" : "#60A5FA"})`
                }}
              />
              
              {/* Frame Box */}
              <div
                className={`relative rounded-2xl border-2 p-3 transition-colors duration-500 w-64 h-64 sm:w-80 sm:h-80 flex flex-col items-center justify-center ${
                  theme === "dark"
                    ? "bg-slate-950/90 border-red-500/40"
                    : "bg-white border-slate-200 shadow-lg"
                }`}
              >
                {/* Visual Avatar container placeholder representing Phantom */}
                <div
                  className={`w-full h-full rounded-xl flex flex-col items-center justify-center overflow-hidden relative border ${
                    theme === "dark" ? "bg-slate-900/50 border-red-950/50" : "bg-slate-50 border-slate-100"
                  }`}
                >
                  {/* Subtle inner circular line rings representing radar metrics */}
                  <div className="absolute inset-4 rounded-full border border-dashed border-slate-400/10 animate-spin" style={{ animationDuration: "30s" }} />
                  <div className="absolute inset-10 rounded-full border border-dashed border-slate-400/10 animate-spin" style={{ animationDuration: "15s" }} />

                  {/* Huge sleek Lucide User/Avatar Icon */}
                  <User
                    className={`w-28 h-28 sm:w-36 sm:h-36 transition-colors duration-500 ${
                      activeDomain === "cyber"
                        ? "text-red-950/25"
                        : activeDomain === "data"
                        ? "text-green-950/15"
                        : "text-blue-950/10"
                    }`}
                  />

                  {/* High quality mini logo badges floating at the center bottom representing active state */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Logo className="w-24 h-24 transform transition-all duration-300 hover:scale-105" />
                    <span className="font-mono text-[9px] font-bold text-slate-400 tracking-wider mt-2.5">
                      PHANTOM IDENTITY SECURED
                    </span>
                  </div>
                </div>

                {/* Micro tech indicators inside frame margin */}
                <div className="absolute top-5 left-5 text-[9px] font-mono opacity-40">
                  REF: IDX_9
                </div>
                <div className="absolute bottom-5 right-5 text-[9px] font-mono opacity-40">
                  CORE_P: 3000
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Interactive Stats Drawer along bottom */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentStats.map((stat, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-center transition-all duration-500 ${
                theme === "dark"
                  ? "bg-slate-950/75 border-red-950/25 shadow-sm"
                  : "bg-white border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.02)]"
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div className={`text-sm font-mono font-bold ${accentClass}`}>
                {stat.labelAccent || stat.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
