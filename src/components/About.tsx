import { useState } from "react";
import { usePortfolioTheme } from "./ThemeProvider";
import { Laptop, Database, Shield, BrainCircuit, CheckCircle2, ChevronRight, Terminal } from "lucide-react";

export default function About() {
  const { activeDomain, theme, accentClass, bgClass, borderClass } = usePortfolioTheme();
  const [activeOS, setActiveOS] = useState<"kali" | "windows" | "analytics">("kali");

  return (
    <section
      id="about"
      className={`py-24 relative overflow-hidden transition-colors duration-500 ${
        theme === "dark" ? "bg-slate-950/70" : "bg-slate-50/75"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className={`font-mono text-xs sm:text-sm uppercase tracking-widest ${accentClass}`}>
            [ 01 // Identity Module ]
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mt-2 tracking-tight">
            Background & Mindset
          </h2>
          <div className="h-1.5 w-24 rounded mx-auto mt-4 bg-gradient-to-r from-blue-600 via-red-500 to-green-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Narrative details */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Bridging Secure Design, Full-Stack Execution, & Analytical Intel.
            </h3>
            
            <p className={`text-sm sm:text-base leading-relaxed ${
              theme === "dark" ? "text-slate-300" : "text-slate-650 text-slate-600"
            }`}>
              I am a disciplined developer, systems student, and data researcher. My comfort zone spans multiple environments: compiling high-concurrency API structures in standard dev nodes, performing rigorous network penetration audits in live terminal clusters, and mapping complex relational analytics schemas.
            </p>

            <p className={`text-sm sm:text-base leading-relaxed ${
              theme === "dark" ? "text-slate-300" : "text-slate-650 text-slate-600"
            }`}>
              Navigating dual-boot setups (Windows for full-stack build workflows / Kali Linux for defensive scripting and networking) has refined my secure development lifecycle mindset. I treat data not just as static records, but as an engine to query performance leaks and optimize interfaces.
            </p>

            {/* Tri-Sector Mindset Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className={`p-4 rounded-xl border ${
                theme === "dark" ? "bg-slate-900/30 border-red-950/40" : "bg-white border-slate-200"
              }`}>
                <Shield className={`w-5 h-5 mb-2.5 ${accentClass}`} />
                <span className="font-display font-semibold text-xs block mb-1">Defense-First</span>
                <p className="text-[11px] text-slate-400">Auditing configurations and hardening code borders.</p>
              </div>

              <div className={`p-4 rounded-xl border ${
                theme === "dark" ? "bg-slate-900/30 border-red-950/40" : "bg-white border-slate-200"
              }`}>
                <Database className={`w-5 h-5 mb-2.5 ${accentClass}`} />
                <span className="font-display font-semibold text-xs block mb-1">Full-Stack Scale</span>
                <p className="text-[11px] text-slate-400">Deploying optimized databases with robust routes.</p>
              </div>

              <div className={`p-4 rounded-xl border ${
                theme === "dark" ? "bg-slate-900/30 border-red-950/40" : "bg-white border-slate-200"
              }`}>
                <BrainCircuit className={`w-5 h-5 mb-2.5 ${accentClass}`} />
                <span className="font-display font-semibold text-xs block mb-1">Data Modeling</span>
                <p className="text-[11px] text-slate-400">Transforming metrics into actionable charts.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dual-Boot OS workspace simulator */}
          <div className="lg:col-span-6">
            <div className={`rounded-xl border p-4 sm:p-6 font-mono ${
              theme === "dark"
                ? "bg-slate-950/80 border-red-950/40 shadow-lg"
                : "bg-white border-slate-200 shadow-md"
            }`}>
              
              {/* Simulator Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800/10 mb-5 gap-3">
                <div className="flex items-center space-x-2.5">
                  <Laptop className={`w-4 h-4 ${accentClass}`} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Core Lab Workstation
                  </span>
                </div>

                {/* OS System selection keys */}
                <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-0.5 border dark:border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
                  <button
                    onClick={() => setActiveOS("kali")}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                      activeOS === "kali"
                        ? "bg-red-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    Kali Sec
                  </button>
                  <button
                    onClick={() => setActiveOS("windows")}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                      activeOS === "windows"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    Win WSL2
                  </button>
                  <button
                    onClick={() => setActiveOS("analytics")}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                      activeOS === "analytics"
                        ? "bg-green-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    Data Lake
                  </button>
                </div>
              </div>

              {/* OS Environment Outputs */}
              {activeOS === "kali" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-150 p-2 dark:bg-slate-900/40 rounded border dark:border-red-950/20">
                    <div>PARTITION: <span className="text-red-500 font-bold">/dev/nvme0n1p3</span></div>
                    <div>KERNEL: <span className="text-slate-200 dark:text-slate-200 font-bold">6.6-kali-amd64</span></div>
                    <div>CLASS: <span className="text-red-400 font-bold">Defensive Pentest</span></div>
                    <div>TOOLS: <span className="text-slate-200 dark:text-slate-200 font-bold">Nmap, Burp Suite, Shell</span></div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-red-950/60 font-mono text-[11px] text-slate-300 space-y-2 select-none overflow-x-auto">
                    <p className="text-red-500/80"># nmap -sV -p 80,443,3000 skoolconnect.ng</p>
                    <p className="text-slate-400">Scanning skoolconnect.ng on secure ports...</p>
                    <p className="text-green-500">✓ Port 3000/TCP open (http-node-server JWT)</p>
                    <p className="text-green-500">✓ Port 443/TCP open (HTTPS TLSv1.3)</p>
                    <p className="text-slate-400"># burp-suite --headless --audit-scan</p>
                    <p className="text-emerald-400">✓ Threat Audit complete - 0 vulnerabilities found.</p>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                    <span>Analyzing configurations and testing IoT scripts for integrity.</span>
                  </div>
                </div>
              )}

              {activeOS === "windows" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-150 p-2 dark:bg-slate-900/40 rounded border dark:border-blue-950/20">
                    <div>DRIVE_PATH: <span className="text-blue-500 font-bold">C:\Users\Phantom</span></div>
                    <div>CORE_SYSTEM: <span className="text-slate-200 dark:text-slate-200 font-bold">Windows 11 WSL2</span></div>
                    <div>COMPILER: <span className="text-blue-400 font-bold">Vite TypeScript / Py</span></div>
                    <div>PROJECTS: <span className="text-slate-200 dark:text-slate-200 font-bold">React, Django DRF</span></div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-blue-950/40 font-mono text-[11px] text-slate-300 space-y-2 select-none overflow-x-auto">
                    <p className="text-blue-500/80">PS C:\&gt; wsl -d Ubuntu-22.04</p>
                    <p className="text-slate-400">$ python3 -m django --version</p>
                    <p className="text-green-400">✓ Django backend loaded: v5.0.4 [DRF Enabled]</p>
                    <p className="text-slate-400">$ npm run build-next-store</p>
                    <p className="text-green-400">✓ Pre-rendered SEO schemas static paths successfully mapped.</p>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Deploying production-grade full-stack code on bulletproof scripts.</span>
                  </div>
                </div>
              )}

              {activeOS === "analytics" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-150 p-2 dark:bg-slate-900/40 rounded border dark:border-green-950/20">
                    <div>LAKE_REGION: <span className="text-green-500 font-bold">Analytics Sandbox</span></div>
                    <div>ENGINE_ID: <span className="text-slate-200 dark:text-slate-200 font-bold">Precision Dash V3</span></div>
                    <div>DATABASE: <span className="text-green-400 font-bold">MySQL Relational</span></div>
                    <div>TECH_STACK: <span className="text-slate-200 dark:text-slate-200 font-bold">Excel, PowerBI, Pandas</span></div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-green-950/30 font-mono text-[11px] text-slate-300 space-y-2 select-none overflow-x-auto">
                    <p className="text-green-500/80"># mysql -u analyst -p corporate_intelligence</p>
                    <p className="text-slate-400">Enter password: *********</p>
                    <p className="text-green-450 text-green-500">Connected. Running query...</p>
                    <p className="text-slate-400">SELECT metric_id, COUNT(*) FROM log_events GROUP BY status;</p>
                    <p className="text-green-450 text-green-400">✓ Aggregate dataset converted to Pandas DataFrames (15,000 rows mapped)</p>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Uncovering performance blocks and designing intelligence panels.</span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
