import { useState } from "react";
import { usePortfolioTheme } from "./ThemeProvider";
import { PROJECTS, Project } from "../data";
import { Terminal, Shield, Github, Sparkles, Code2, Hourglass, Cpu, ArrowUpRight } from "lucide-react";

export default function Projects() {
  const { theme, activeDomain, accentClass, borderClass, btnClass } = usePortfolioTheme();
  const [selectedProject, setSelectedProject] = useState<Project | null>(PROJECTS[0]);

  // Map icons based on project categories or domains
  const getProjectIcon = (type: string) => {
    switch (type) {
      case "cyber":
        return <Shield className="w-5 h-5" />;
      case "data":
        return <Cpu className="w-5 h-5" />;
      case "web":
      default:
        return <Code2 className="w-5 h-5" />;
    }
  };

  return (
    <section
      id="projects"
      className={`py-24 relative overflow-hidden transition-colors duration-500 ${
        theme === "dark" ? "bg-slate-950/40" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className={`font-mono text-xs sm:text-sm uppercase tracking-widest ${accentClass}`}>
            [ 03 // Production Repositories ]
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mt-2 tracking-tight">
            Featured Projects
          </h2>
          <div className="h-1.5 w-24 rounded mx-auto mt-4 bg-gradient-to-r from-blue-600 via-red-500 to-green-600" />
        </div>

        {/* Projects Responsive Grid & Terminal Debug Inspector layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive lists of Projects mapped to responsive grids */}
          <div className="lg:col-span-7 space-y-6">
            <p className="font-mono text-[10px] sm:text-xs text-slate-400">
              {theme === "dark" 
                ? "root@phantom-kali:~$ cat fetch_projects_list.json" 
                : "console.log(window.phantomProjectStore);"}
            </p>

            <div className="grid grid-cols-1 gap-5">
              {PROJECTS.map((project, idx) => {
                const isSelected = selectedProject?.title === project.title;
                
                // Active highlight states matching colors (Blue, Red, or Green)
                let selectedBorder = "";
                let selectedGlow = "";
                if (isSelected) {
                  if (activeDomain === "cyber") {
                    selectedBorder = "border-red-500";
                    selectedGlow = "shadow-[0_0_20px_rgba(220,38,38,0.12)] bg-slate-900/40";
                  } else if (activeDomain === "data") {
                    selectedBorder = "border-green-600";
                    selectedGlow = "shadow-[0_4px_15px_rgba(22,163,74,0.1)] bg-green-50/10";
                  } else {
                    selectedBorder = "border-blue-600";
                    selectedGlow = "shadow-[0_4px_15px_rgba(37,99,235,0.1)] bg-blue-50/10";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedProject(project)}
                    className={`text-left w-full p-5 sm:p-6 rounded-xl border transition-all duration-300 relative group cursor-pointer ${
                      isSelected
                        ? `${selectedBorder} ${selectedGlow}`
                        : theme === "dark"
                        ? "bg-slate-950/40 border-slate-900 hover:border-slate-850"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* Left glowing border slider */}
                    <span className={`absolute top-0 left-0 w-1.5 h-full rounded-l-xl transition-all ${
                      isSelected
                        ? activeDomain === "cyber" ? "bg-red-500" : activeDomain === "data" ? "bg-green-600" : "bg-blue-600"
                        : "bg-transparent group-hover:bg-slate-300/40"
                    }`} />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pl-2">
                      <div className="flex items-center space-x-2.5">
                        <h3 className={`font-display font-bold text-base sm:text-lg ${
                          isSelected 
                            ? theme === "dark" ? "text-white" : "text-slate-900 font-bold"
                            : "text-slate-800 dark:text-slate-300"
                        }`}>
                          {project.title}
                        </h3>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                          project.type === "cyber"
                            ? "bg-red-950/20 border-red-900/30 text-red-500"
                            : project.type === "data"
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-blue-50 border-blue-200 text-blue-700"
                        }`}>
                          {project.type.toUpperCase()}_ENV
                        </span>
                      </div>

                      {project.metrics && (
                        <span className="text-[10px] font-mono font-bold text-slate-400 self-start sm:self-auto">
                          [ {project.metrics} ]
                        </span>
                      )}
                    </div>

                    <p className={`text-xs sm:text-sm mt-3.5 leading-relaxed pl-2 ${
                      theme === "dark" ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {project.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 pl-2">
                      {project.tech.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className={`text-[9.5px] font-mono px-2 py-0.5 rounded border ${
                            theme === "dark"
                              ? "bg-slate-900 border-slate-800 text-slate-400"
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Holographic Detail Inspector */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            {selectedProject ? (
              <div className={`rounded-2xl border p-5 sm:p-6 font-mono text-xs relative ${
                theme === "dark"
                  ? "bg-slate-950/80 border-red-950/40 shadow-lg text-slate-300"
                  : "bg-slate-50 border-slate-200 shadow-sm text-slate-700"
              }`}>
                
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-800/10">
                  <div className="flex items-center space-x-2">
                    <Terminal className={`w-4 h-4 ${accentClass}`} />
                    <span className="font-bold text-[10px] uppercase tracking-wider">
                      BUILD_INTEGRITY_LOG.SH
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 uppercase">
                    SYS-A14
                  </span>
                </div>

                {/* Narrative Details */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-1">
                      // SUMMARY ARCHITECTURE REPORT
                    </span>
                    <p className={`text-xs leading-relaxed leading-6 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-600"
                    }`}>
                      {selectedProject.longDescription}
                    </p>
                  </div>

                  {/* Bulleted Core Audits details */}
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-2">
                      // AUDITED FEATURES & PARAMETERS
                    </span>
                    <ul className="space-y-2">
                      {selectedProject.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start space-x-2 text-[11px] leading-relaxed">
                          <span className={`font-bold shrink-0 ${accentClass}`}>↳</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* External Repository connections */}
                  <div className="pt-4 border-t border-slate-200 dark:border-red-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <a
                      href={selectedProject.githubUrl || "#"}
                      className={`inline-flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-colors min-h-[44px] shrink-0 ${
                        theme === "dark"
                          ? "bg-slate-900 border-red-950/65 hover:border-red-500 hover:text-red-400 text-slate-300"
                          : "bg-white border-slate-200 hover:border-slate-400 hover:text-slate-900 text-slate-705 shadow-sm"
                      }`}
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>EXPLORE REPO</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                    
                    <span className="text-[8px] sm:text-[9.5px] text-slate-400 uppercase block font-mono">
                      [ SHA-256 CHECK: OK ]
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-48 rounded-2xl border border-dashed flex items-center justify-center text-slate-400">
                &lt; Select a project for inspection &gt;
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
