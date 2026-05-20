import { useState, FormEvent, ChangeEvent } from "react";
import { usePortfolioTheme } from "./ThemeProvider";
import { Send, Terminal, Shield, CheckCircle, Mail, ArrowUpRight } from "lucide-react";

export default function Contact() {
  const { theme, activeDomain, accentClass, borderClass, btnClass } = usePortfolioTheme();
  
  // Form State managers
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  // Handshake transition simulation states
  const [status, setStatus] = useState<"idle" | "handshaking" | "packet_sent" | "success">("idle");
  const [handshakeLog, setHandshakeLog] = useState<string[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const executeTransmission = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("handshaking");
    setHandshakeLog([]);

    const logSteps = [
      "⚡ Initializing secure channel to ROOT@PHANTOSMED...",
      "◌ Resolving public certificate parameters...",
      "🔒 Establishing AES-GCM-256 session handshake...",
      "✓ Handshake verified: Session ID matches SHA-256 digest.",
      "🚀 Splitting payloads into dynamic transport frames...",
      "◌ Port: 3000 connected. Sending data packet...",
      "✓ Sync success. Transmitting payload..."
    ];

    for (let i = 0; i < logSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setHandshakeLog((prev) => [...prev, logSteps[i]]);
    }

    setStatus("success");
    // Clear inputs
    setFormData({ name: "", email: "", message: "" });
  };

  const getLogColorClass = (log: string) => {
    if (log.startsWith("✓")) return "text-green-500 font-bold";
    if (log.startsWith("🔒") || log.startsWith("⚡")) {
      if (activeDomain === "cyber") return "text-red-500 font-bold";
      if (activeDomain === "data") return "text-green-600 font-bold";
      return "text-blue-605 text-blue-600 font-bold";
    }
    return "text-slate-400";
  };

  const getBorderColorStyle = () => {
    if (activeDomain === "cyber") return "focus:border-red-500 focus:ring-1 focus:ring-red-500/50";
    if (activeDomain === "data") return "focus:border-green-600 focus:ring-1 focus:ring-green-650 focus:ring-green-600/50";
    return "focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50";
  };

  return (
    <section
      id="contact"
      className={`py-24 relative overflow-hidden transition-colors duration-500 ${
        theme === "dark" ? "bg-slate-950/60" : "bg-slate-50/70"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className={`font-mono text-xs sm:text-sm uppercase tracking-widest ${accentClass}`}>
            [ 04 // Secured Endpoint ]
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mt-2 tracking-tight">
            Transmit Connection
          </h2>
          <div className="h-1.5 w-24 rounded mx-auto mt-4 bg-gradient-to-r from-blue-600 via-red-500 to-green-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full max-w-5xl mx-auto">
          {/* Left Side: Technical Info Details */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6 flex flex-col justify-center">
            <h3 className="font-display text-2xl font-bold tracking-tight">
              Establish System Protocol
            </h3>
            <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-650 text-slate-600"}`}>
              Do you have a project requiring bulletproof Full-Stack execution, code audits, or structural penetration planning? Broadcast your parameters through this secure sandbox.
            </p>

            {/* Quick Metadata parameters list */}
            <div className={`p-5 rounded-xl border leading-relaxed ${
              theme === "dark" ? "bg-slate-900/30 border-red-950/20" : "bg-white border-slate-200"
            }`}>
              <div className="text-xs font-mono space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-slate-400 font-bold">EMAIL_TUNNEL:</span>
                  <a href="mailto:phantomphantasm06@gmail.com" className={`hover:underline flex items-center space-x-1 font-bold ${accentClass}`}>
                    <span>phantomphantasm06@gmail.com</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">WORK_LOCATION:</span>
                  <span className={theme === "dark" ? "text-slate-250 text-slate-200" : "text-slate-800"}>Nigeria / Remotely</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">AVAILABILITY:</span>
                  <span className="text-emerald-500 font-bold uppercase tracking-wider">Active / Accepting Projects</span>
                </div>
              </div>
            </div>

            <div className="flex justify-start items-center space-x-4 pt-2">
              <a
                href="#"
                className={`flex items-center space-x-1.5 text-xs font-mono font-semibold transition-colors hover:underline ${accentClass}`}
              >
                <span>GitHub profile</span>
                <Mail className="w-4 h-4" />
              </a>
              <span className="text-slate-400 font-mono">/</span>
              <a
                href="#"
                className={`flex items-center space-x-1.5 text-xs font-mono font-semibold transition-colors hover:underline ${accentClass}`}
              >
                <span>Full CV / resume</span>
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Side: Futuristic Terminal Form */}
          <div className="lg:col-span-12 xl:col-span-7">
            <div
              className={`rounded-xl border p-6 font-mono relative transition-all duration-500 ${
                theme === "dark"
                  ? "bg-slate-950/80 border-red-950/40 shadow-[0_10px_35px_rgba(239,68,68,0.04)]"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              {/* Device Frame Window Controls */}
              <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-100 dark:border-red-950/10">
                <div className="flex items-center space-x-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    activeDomain === "cyber" ? "bg-red-500" : activeDomain === "data" ? "bg-green-500" : "bg-blue-600"
                  }`} />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200/50 dark:bg-slate-800" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200/50 dark:bg-slate-800" />
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center space-x-1">
                  <Terminal className="w-3 h-3 text-slate-400" />
                  <span>TRANSMIT_CLIENT.EXE</span>
                </span>
              </div>

              {status === "idle" && (
                <form id="transmission-form" onSubmit={executeTransmission} className="space-y-4">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                      [01] client_identity_name
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      placeholder="e.g. Agent Williams"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full text-xs font-mono border rounded p-3 transition-all outline-none ${
                        theme === "dark"
                          ? "bg-slate-900/40 border-slate-800 text-slate-205 text-slate-200"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      } ${getBorderColorStyle()}`}
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                      [02] encryption_email
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="e.g. williams@shield.corp"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full text-xs font-mono border rounded p-3 transition-all outline-none ${
                        theme === "dark"
                          ? "bg-slate-900/40 border-slate-800 text-slate-205 text-slate-200"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      } ${getBorderColorStyle()}`}
                    />
                  </div>

                  {/* Message field */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                      [03] connection_payload_bytes
                    </label>
                    <textarea
                      required
                      rows={4}
                      name="message"
                      placeholder="Describe target specs or query details here..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full text-xs font-mono border rounded p-3 transition-all resize-none outline-none ${
                        theme === "dark"
                          ? "bg-slate-900/40 border-slate-800 text-slate-205 text-slate-200"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      } ${getBorderColorStyle()}`}
                    />
                  </div>

                  <button
                    id="submit-transmission-btn"
                    type="submit"
                    className={`w-full py-3.5 px-4 rounded font-display font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer ${btnClass}`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>BROADCAST TRANSMISSION</span>
                  </button>
                </form>
              )}

              {/* Secure Handshake Logs */}
              {status === "handshaking" && (
                <div className="space-y-4 py-4 min-h-[300px] flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-2 text-xs">
                      <Terminal className="w-4 h-4 text-slate-400 animate-spin" />
                      <span className="font-bold text-slate-400 dark:text-slate-300">ESTABLISHING SESSION HANDSHAKE:</span>
                    </div>
                    <div className="space-y-1.5 text-[11px] font-mono select-none">
                      {handshakeLog.map((log, index) => (
                        <p
                          key={index}
                          className={getLogColorClass(log)}
                        >
                          {log}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 text-center uppercase tracking-widest animate-pulse">
                    ◌ Connecting packet network port...
                  </div>
                </div>
              )}

              {/* Handshake Success View */}
              {status === "success" && (
                <div className="py-12 text-center space-y-5 min-h-[300px] flex flex-col justify-center items-center">
                  <div className={`p-4 rounded-full border ${
                    activeDomain === "cyber" ? "bg-red-950/20 border-red-500" : activeDomain === "data" ? "bg-green-50/50 border-green-600" : "bg-blue-50/50 border-blue-600"
                  }`}>
                    <CheckCircle className={`w-12 h-12 ${accentClass} animate-bounce`} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display font-bold text-lg">Transmission broadcast complete!</h4>
                    <p className={`text-xs max-w-sm mx-auto leading-relaxed ${
                      theme === "dark" ? "text-slate-400" : "text-slate-600"
                    }`}>
                      Payload encrypted and verified. I will reply to you as soon as the signal connects.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className={`px-5 py-2.5 rounded text-[10px] font-bold uppercase border cursor-pointer ${
                      activeDomain === "cyber"
                        ? "bg-slate-900 border-red-950 hover:border-red-500 hover:bg-slate-900/80 text-red-500"
                        : activeDomain === "data"
                        ? "bg-white border-green-200 hover:border-green-600 hover:text-green-650 text-slate-700 shadow-sm"
                        : "bg-white border-slate-200 hover:border-blue-600 hover:text-blue-605 text-slate-705 text-slate-700 shadow-sm"
                    }`}
                  >
                    Transmit another packet
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
