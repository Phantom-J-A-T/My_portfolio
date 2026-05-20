import { useState, useEffect, useRef } from "react";
import { usePortfolioTheme } from "./ThemeProvider";
import Logo from "./Logo";
import { DomainType } from "../data";
import { Menu, X, Globe, Shield, BarChart3, ChevronRight } from "lucide-react";

export default function Header() {
  const { activeDomain, setActiveDomain, theme, accentClass, borderClass, btnClass } = usePortfolioTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const navigationItems = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills Matrix" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Endpoint" }
  ];

  const domainsList: { id: DomainType; label: string; icon: any; color: string }[] = [
    { id: "web", label: "Web Dev", icon: Globe, color: "text-blue-600 border-blue-200 bg-blue-50/50" },
    { id: "cyber", label: "Cyber Security", icon: Shield, color: "text-red-500 border-red-950 bg-red-950/20" },
    { id: "data", label: "Data Analysis", icon: BarChart3, color: "text-green-600 border-green-200 bg-green-50/50" }
  ];

  return (
    <header
      id="header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        theme === "dark"
          ? "bg-cyber-midnight/90 backdrop-blur-md border-b border-red-950/40 py-3 shadow-[0_4px_30px_rgba(3,4,12,0.8)]"
          : "bg-white/90 backdrop-blur-md border-b border-slate-100 py-3 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Dynamic Shield Brand Logo & Name */}
        <a id="logo" href="#hero" className="flex items-center space-x-2.5 group">
          <Logo size={42} className="transform transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-display font-bold text-base sm:text-lg tracking-wider leading-none">
              {theme === "dark" ? (
                <span className="text-white group-hover:text-red-400 transition-colors font-mono">
                  PHANTOM<span className="text-red-500 font-sans">@</span>ROOT
                </span>
              ) : (
                <span className="text-slate-900 group-hover:text-blue-600 transition-colors">
                  PHANTOM<span className="text-blue-600 font-mono">.</span>DEV
                </span>
              )}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 mt-0.5">
              {activeDomain === "cyber" ? "Kali Linux Active" : activeDomain === "data" ? "Precision Engine" : "Vite + React Lab"}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav" className="hidden lg:flex items-center space-x-6 font-display text-sm font-medium">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`transition-colors relative py-1 group ${
                theme === "dark" ? "text-slate-300 hover:text-red-400" : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                  activeDomain === "cyber"
                    ? "bg-red-500"
                    : activeDomain === "data"
                    ? "bg-green-600"
                    : "bg-blue-600"
                }`}
              ></span>
            </a>
          ))}
        </nav>

        {/* Central 3-way Domain/Skills Switcher for Desktop */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-950 rounded-xl p-1 border dark:border-red-950/30">
          {domainsList.map((dom) => {
            const Icon = dom.icon;
            const isSelected = activeDomain === dom.id;
            return (
              <button
                key={dom.id}
                onClick={() => setActiveDomain(dom.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? dom.id === "cyber"
                      ? "bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                      : dom.id === "data"
                      ? "bg-green-600 text-white shadow-[0_4px_10px_rgba(22,163,74,0.3)]"
                      : "bg-blue-600 text-white shadow-[0_4px_10px_rgba(37,99,235,0.3)]"
                    : theme === "dark"
                    ? "text-slate-400 hover:text-slate-100"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{dom.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile controls & Drawer triggers (Minimum target 44px) */}
        <div className="flex items-center space-x-2 lg:hidden">
          {/* Fast dynamic switcher button */}
          <button
            onClick={() => {
              const currentIdx = domainsList.findIndex((d) => d.id === activeDomain);
              const nextIdx = (currentIdx + 1) % domainsList.length;
              setActiveDomain(domainsList[nextIdx].id);
            }}
            className={`p-2.5 rounded-lg border text-xs font-mono font-bold transition-all flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer ${
              theme === "dark"
                ? "bg-slate-900 border-red-950/50 text-red-400"
                : "bg-slate-100 border-slate-200 text-slate-700"
            }`}
          >
            {activeDomain === "web" ? "WEB" : activeDomain === "cyber" ? "SEC" : "DATA"}
          </button>

          {/* Hamburger Menu button */}
          <button
            ref={buttonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2.5 rounded-lg border flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer ${
              theme === "dark"
                ? "bg-slate-900 border-red-950/50 text-slate-200"
                : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Navigation Dropdown Card */}
      <div
        ref={menuRef}
        className={`absolute top-[100%] right-4 sm:right-6 mt-2 w-64 h-auto z-40 rounded-2xl border transition-all duration-300 ease-out lg:hidden ${
          theme === "dark"
            ? "bg-cyber-midnight/80 backdrop-blur-md border-red-950/40 shadow-[0_10px_30px_rgba(3,4,12,0.5)]"
            : "bg-white/80 backdrop-blur-md border-slate-200 shadow-lg"
        } ${
          mobileMenuOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="p-4 space-y-4">
          {/* Navigation Links List */}
          <div className="space-y-2">
            <h4 className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block font-bold px-1 select-none">
              Menu Navigation
            </h4>
            <div className="flex flex-col space-y-1">
              {navigationItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all min-h-[44px] ${
                    theme === "dark"
                      ? "bg-slate-900/30 border-red-950/20 text-slate-300 hover:text-white"
                      : "bg-slate-50 border-slate-100 text-slate-705 text-slate-700 hover:text-slate-900"
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </a>
              ))}
            </div>
          </div>

          {/* Diagnostic Stats for aesthetic feedback in mobile footer */}
          <div className="border-t pt-3 border-slate-200 dark:border-red-950/40 text-center font-mono text-[9px] text-slate-400 select-none">
            <p>PHANTOM SECURE LINKED</p>
            <p className={`mt-0.5 font-bold ${accentClass}`}>PORT: 3000 // STATUS: ONLINE</p>
          </div>
        </div>
      </div>
    </header>
  );
}
